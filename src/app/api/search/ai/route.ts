import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { medicines as staticMedicines, categoriesData } from '@/lib/data/medicines';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  let rawQuery = '';
  try {
    const body = await req.json();
    rawQuery = body.query || '';

    if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
      return NextResponse.json({
        correctedQuery: '',
        matchedMedicines: [],
        matchedCategories: [],
        explanation: 'Empty search query.'
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || '';

    // Fetch the latest list of medicines to feed as context to Gemini
    let medicinesList = staticMedicines;
    if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder-url.supabase.co') {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data, error } = await supabase.from('medicines').select('*');
        if (data && data.length > 0) {
          medicinesList = data.map((row: any) => {
            let categories: string[] = [];
            if (Array.isArray(row.categories)) {
              categories = row.categories;
            } else if (row.categories && typeof row.categories === 'string') {
              try {
                const parsed = JSON.parse(row.categories);
                categories = Array.isArray(parsed) ? parsed : [row.categories];
              } catch {
                categories = row.categories.split(',').map((c: string) => c.trim()).filter(Boolean);
              }
            } else if (row.category) {
              categories = [row.category];
            }
            return {
              id: row.id,
              name: row.name,
              category: categories[0] || row.category || '',
              categories: categories.length > 0 ? categories : [row.category || ''],
              mainUsage: row.main_usage || '',
              brand: row.brand || '',
              description: row.description || ''
            } as any;
          });
        }
      } catch (dbError) {
        console.warn('Error fetching medicines from Supabase for AI search context, using static medicines:', dbError);
      }
    }

    if (!geminiApiKey) {
      console.warn('GEMINI_API_KEY is not configured. Falling back to keyword search.');
      return NextResponse.json({
        correctedQuery: rawQuery,
        matchedMedicines: [],
        matchedCategories: [],
        explanation: 'Fuzzy search fallback (Gemini API key not configured).'
      });
    }

    // Build context-aware prompt for Gemini
    const systemPrompt = `
You are an expert AI search assistant and pharmacist for "Meducil", a premium medicine and wellness store.
Your goal is to act like a knowledgeable, friendly pharmacist, explaining your matches naturally while ensuring you ONLY recommend products that exist in our catalog.

The user is searching for products in our catalog. They might search using:
1. Exact or partial medicine names (e.g., "Allium Cepa", "arnica").
2. Misspelled medicine names (e.g., "allum cepa" for "Allium Cepa", "arnka" for "Arnica Montana", "belladona" for "Belladonna", "nux vomka" for "Nux Vomica").
3. Categories or symptoms (e.g., "cough", "fever", "allergy", "skin care", "digestion", "immunity").
4. Natural language queries (e.g., "medicine for cough", "medicine for cold and sneezing", "remedy for acidity", "medicine for hair fall", "medicine for child fever").

Here is the list of actual categories available at Meducil:
${JSON.stringify(categoriesData.map(c => c.name))}

Here is the list of actual medicines available in our catalog:
${JSON.stringify(medicinesList.map(m => ({
  name: m.name,
  brand: m.brand,
  categories: m.categories || [m.category],
  mainUsage: m.mainUsage,
  description: m.description
})))}

Your task is to analyze the user's raw query: "${rawQuery}" and output:
- A spelling-corrected, cleaned version of their search term (e.g., "cold" if they searched "colld", or "Allium Cepa" if they searched "allum cepa").
- The exact names of medicines from our catalog that are most relevant.
- The exact names of categories from our catalog that are most relevant.
- A friendly, pharmacist-like explanation of your suggestions.

You MUST respond with a valid JSON object matching this schema:
{
  "correctedQuery": "string (spelling-corrected and clean version of the search query)",
  "matchedMedicines": ["string (exact name(s) of matching medicines from our catalog list above)"],
  "matchedCategories": ["string (exact name(s) of matching categories from our catalog list above)"],
  "explanation": "string (warm, friendly pharmacist advice explaining the recommendation, e.g. 'I noticed you searched for allum cepa. I found Allium Cepa Dilution, which is traditionally used for allergic cold and sneezing support.' or 'Acidity is best addressed with Gastrolex or Nux Vomica Dilution in our catalog. Showing these targeted remedies.')"
}

Critical Rules:
1. **Catalog Matching**: You MUST ONLY return medicine names and categories that are EXACTLY listed in our catalog above. NEVER invent, suggest, or list medicines or categories that do not exist in our catalog.
2. **Spelling Correction Mappings**:
   - "allum cepa" -> set correctedQuery to "Allium Cepa Dilution" and add "Allium Cepa Dilution" to matchedMedicines.
   - "arnka" -> set correctedQuery to "Arnica Montana Dilution" and add "Arnica Montana Dilution" to matchedMedicines.
   - "belladona" -> set correctedQuery to "Belladonna Dilution" and add "Belladonna Dilution" to matchedMedicines.
   - "nux vomka" -> set correctedQuery to "Nux Vomica Dilution" and add "Nux Vomica Dilution" to matchedMedicines.
   - For other typos, correct them to their closest matching catalog names and add those to matchedMedicines.
3. **Natural Language & Symptoms**: If the user searches using natural language (e.g., 'medicine for child fever') or lists symptoms, analyze the main usages/descriptions in the catalog to find matching medicines that treat those issues, and list them in 'matchedMedicines'.
4. **Smart Suggestions & Alternatives**: If the user searches for a medicine we do NOT have (e.g., "aspirin", "paracetamol", "synthroid"), do NOT return an empty result or invent the medicine. Instead, recommend natural homeopathic alternatives from our catalog (e.g., suggest Aconite Dilution or Ferrum Phos 6X for fever/pain) and explain this clearly in the explanation: "Aspirin is not in our catalog. Showing Aconite Dilution as a traditional natural alternative for acute pain/fever support."
5. **No Questions or Follow-up Requests**: This is a search bar interface, NOT an interactive chat. The 'explanation' MUST NOT ask the user questions, request details, or prompt them to reply (do NOT say 'please let me know your symptoms' or 'what are you looking to address?'). Focus purely on introducing the matched or related items.
6. **Suggest Similar Catalog Items**: If the search query is broad, a prefix, or a single letter (e.g. 'R'), identify and list the names of matching or related catalog products directly in the advice (e.g. 'R49 Drops, R43 Drops, R14 Drops, and other Reckeweg remedies are available in our catalog.').
7. Do not include markdown code block formatting like \`\`\`json or \`\`\`. Output only raw JSON.
`;

    // Fetch from Gemini REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error Response:', errText);
      throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
    }

    const result = await response.json();
    const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error('Gemini API returned an empty response.');
    }

    const aiData = JSON.parse(textContent);

    return NextResponse.json({
      correctedQuery: aiData.correctedQuery || rawQuery,
      matchedMedicines: aiData.matchedMedicines || [],
      matchedCategories: aiData.matchedCategories || [],
      explanation: aiData.explanation || 'Matches found by Gemini.'
    });

  } catch (error) {
    console.error('Error in Gemini AI search API:', error);
    return NextResponse.json({
      correctedQuery: rawQuery,
      matchedMedicines: [],
      matchedCategories: [],
      explanation: ''
    });
  }
}
