import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { medicines as staticMedicines } from '@/lib/data/medicines';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  try {
    const { image, mimeType } = await req.json();

    if (!image || typeof image !== 'string' || !mimeType) {
      return NextResponse.json({ error: 'Missing image data or MIME type' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY || '';
    if (!geminiApiKey) {
      return NextResponse.json({
        suggestions: [],
        error: 'Gemini API key is not configured.'
      });
    }

    // Strip out the data URI prefix if it exists in the base64 string
    let base64Data = image;
    if (base64Data.includes(';base64,')) {
      base64Data = base64Data.split(';base64,')[1];
    }

    // Fetch catalog list to supply context for matching
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
        console.warn('Error fetching medicines for multimodal context fallback, using static list:', dbError);
      }
    }

    // Prompt for Gemini multimodal request
    const promptText = `
You are an expert pharmacist and search assistant at Meducil.
Analyze the uploaded image (which is a doctor's prescription or a medicine bottle label).
Identify the medicine name(s), active ingredients, or health symptoms written on it.
Cross-reference them with the list of available medicines below. Return a list of suggested medicine matches from our catalog, along with the reason you matched it (e.g. read from prescription, or matching active symptoms).

Here is our catalog of available medicines at Meducil:
${JSON.stringify(medicinesList.map(m => ({
  name: m.name,
  brand: m.brand,
  categories: m.categories || [m.category],
  mainUsage: m.mainUsage,
  description: m.description
})))}

Analyze the image text (including handwriting, printed labels, or packaging).
You MUST respond with a valid JSON object matching this schema:
{
  "suggestions": [
    {
      "name": "string (EXACT name of the medicine from the catalog list above)",
      "reason": "string (brief explanation, e.g. 'Found Arnica written on the prescription' or 'Recommended for cough symptoms read from label')"
    }
  ]
}

Rules:
- Match suggestions to the EXACT names listed in the catalog above. Never return names that do not exist in the catalog.
- If the image contains a misspelled version of a medicine name (e.g. 'allum cepa', 'arnka', 'belladona', 'nux vomka'), map it to the corresponding catalog name (e.g., "Allium Cepa Dilution", "Arnica Montana Dilution", "Belladonna Dilution", "Nux Vomica Dilution").
- If no matching medicines from our catalog are found or could be inferred, return an empty "suggestions" array.
- Do not wrap in markdown \`\`\`json. Return only the raw JSON.
`;

    // Fetch from Gemini REST API (Multimodal Request)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
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

    const parsedData = JSON.parse(textContent);

    return NextResponse.json({
      suggestions: parsedData.suggestions || []
    });

  } catch (error) {
    console.error('Error in Gemini prescription parser route:', error);
    return NextResponse.json({
      suggestions: [],
      error: 'Failed to process prescription image.'
    }, { status: 500 });
  }
}
