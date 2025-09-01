import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { name, type, style } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Subject name is required' }, { status: 400 });
    }

    // Build prompt for subject generation
    let prompt = `Create a ${name} as a subject for advertising. `;
    
    if (style && style.length > 0) {
      prompt += `Style: ${style.join(', ')}. `;
    }

    prompt += 'Transparent background. High quality. Clean edges. No text or logos. Professional advertising asset.';

    // Generate the subject
    const response = await openai.images.generate({
      model: "dall-e-3", 
      prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image generated');
    }

    return NextResponse.json({
      imageUrl,
      name,
      type: 'generated',
    });

  } catch (error) {
    console.error('Subject generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate subject' },
      { status: 500 }
    );
  }
}