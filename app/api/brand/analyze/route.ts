import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Call the website analysis API
    const response = await fetch('https://gtm.edwinlovett.com/api/analyze-website', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        url,
        includeTracking: false 
      }),
    });

    if (!response.ok) {
      throw new Error(`Website analysis API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response to match our expected format
    return NextResponse.json({
      colors: data.colors?.palette || [],
      fonts: data.fonts?.all?.map(font => font.family) || [],
      logo: data.logos?.[0]?.src || '',
      logoUrl: data.logos?.[0]?.src || '',
      logoConfidence: data.logos?.[0]?.confidence || 0,
      screenshot: data.screenshot || '',
      name: data.context?.title || '',
      ogImage: data.meta?.ogImage || '',
      favicon: data.meta?.favicon || '',
      social: data.social || {},
      context: data.context || {},
      allLogos: data.logos || []
    });

  } catch (error) {
    console.error('Brand analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze brand' },
      { status: 500 }
    );
  }
}