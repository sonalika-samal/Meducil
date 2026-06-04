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
You are an expert AI search assistant for "Meducil", a premium medicine and wellness store.
The user is searching for something, but they might have:
1. Spelled the name of a medicine or category wrong (e.g. "colld" instead of "cold", "arnka" instead of "Arnica", "homethty" instead of "Homeopathy").
2. Searched by a general symptom, condition, or concern (e.g., "headache", "muscle pain", "throat allergy").

Here is the list of actual categories available at Meducil:
${JSON.stringify(categoriesData.map(c => c.name))}

Here is the list of actual medicines available in our catalog:
${JSON.stringify(medicinesList.map(m => ({
  name: m.name,
  categories: m.categories || [m.category],
  mainUsage: m.mainUsage,
  brand: m.brand,
  description: m.description
})))}

Your task is to analyze the user's raw query: "${rawQuery}" and output a spelling-corrected version of their search, along with the exact names of medicines and categories from our catalog that are most relevant to their search.

You MUST respond with a valid JSON object matching this schema:
{
  "correctedQuery": "string (spelling-corrected and clean version of the search query, e.g. 'cold' if they searched 'colld')",
  "matchedMedicines": ["string (exact name(s) of matching medicines from the list above)"],
  "matchedCategories": ["string (exact name(s) of matching categories from the list above)"],
  "explanation": "string (brief explanation of the match, e.g., 'Corrected spelling of homethty to Homeopathy and matched Arnica Montana for pain.')"
}

Rules:
- If the search query contains a misspelled medicine name (e.g. "allum cepa", "arnka", "nux vomka"), identify the correct medicine from our catalog (e.g. "Allium Cepa", "Arnica Montana", "Nux Vomica").
- In such cases, you MUST set the 'correctedQuery' to be the exact name of that matched medicine from our catalog, and add that exact name to the 'matchedMedicines' array.
- If they searched for a symptom, list all medicines that treat that symptom (check mainUsage and description fields of the list above).
- Only return exact names and categories present in the lists provided above.
`;

    // Fetch from Gemini REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
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
