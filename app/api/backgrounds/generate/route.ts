import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { base, textures, brandBlend, brandColors } = await request.json();

    if (!base) {
      return NextResponse.json({ error: 'Base type is required' }, { status: 400 });
    }

    // Build prompt based on settings
    let prompt = `Create a clean, ad-friendly ${base} background suitable for advertising. `;
    
    switch (base) {
      case 'clean':
        prompt += 'Solid color or minimal gradient, very clean and simple. ';
        break;
      case 'gradient':
        prompt += 'Smooth color gradient, professional and modern. ';
        break;
      case 'pattern':
        prompt += 'Subtle repeating pattern, not overwhelming. ';
        break;
      case 'photo':
        prompt += 'Photographic style background, blurred or abstract. ';
        break;
      case 'illustrated':
        prompt += 'Illustrated style background, artistic but not busy. ';
        break;
    }

    // Add texture descriptions
    if (textures.length > 0) {
      prompt += `Add subtle ${textures.join(' and ')} texture effects. `;
    }

    // Add brand color guidance
    if (brandBlend && brandColors.length > 0) {
      prompt += `Use color palette: ${brandColors.join(', ')}. `;
    }

    prompt += 'Leave space for text overlay. No text or logos in the image. High quality, professional advertising background.';

    // Generate 6 background variants
    const promises = Array.from({ length: 6 }, async (_, i) => {
      try {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt + ` Variant ${i + 1}.`,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        });

        return response.data[0]?.url || null;
      } catch (error) {
        console.error(`Error generating background variant ${i + 1}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    const validPreviews = results.filter(Boolean);

    return NextResponse.json({
      previews: validPreviews,
    });

  } catch (error) {
    console.error('Background generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate backgrounds' },
      { status: 500 }
    );
  }
}