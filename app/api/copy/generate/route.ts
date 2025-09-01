import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { brief } = await request.json();

    if (!brief) {
      return NextResponse.json({ error: 'Brief is required' }, { status: 400 });
    }

    const prompt = `You are an expert copywriter. Generate advertising copy for a ${brief.objective} campaign targeting ${brief.audience}.

Campaign Details:
- Theme: ${brief.theme?.length ? brief.theme.join(', ') : 'General'}
- Style: ${brief.style?.length ? brief.style.join(', ') : 'Professional'}
- Objective: ${brief.objective}
- Target Audience: ${brief.audience}

Generate relevant, compelling copy that matches the theme and style. 

IMPORTANT: Return ONLY a valid JSON object with exactly this structure:
{
  "headlines": ["headline 1", "headline 2", "headline 3"],
  "subheads": ["subhead 1", "subhead 2", "subhead 3"], 
  "ctas": ["cta 1", "cta 2", "cta 3"]
}

Requirements:
- Headlines: max 8 words, compelling and relevant to the campaign
- Subheads: max 15 words, supporting the headlines
- CTAs: max 3 words, action-oriented`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch {
      // Fallback if not valid JSON
      parsedResponse = {
        headlines: ['Discover Something New', 'Transform Your Life', 'Join the Revolution'],
        subheads: ['Experience the difference today', 'Unlock your potential now', 'Be part of something bigger'],
        ctas: ['Learn More', 'Get Started', 'Join Now'],
      };
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Copy generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate copy' },
      { status: 500 }
    );
  }
}