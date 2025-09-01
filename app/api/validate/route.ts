import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { adSpec } = await request.json();

    if (!adSpec) {
      return NextResponse.json({ error: 'AdSpec is required' }, { status: 400 });
    }

    const validation = {
      contrast: true,
      fileSize: true,
      copy: true,
      issues: [] as string[],
    };

    // Check for basic copy requirements
    if (!adSpec.copy.headlines || adSpec.copy.headlines.length === 0) {
      validation.copy = false;
      validation.issues.push('Missing headlines');
    }

    if (!adSpec.copy.ctas || adSpec.copy.ctas.length === 0) {
      validation.copy = false;
      validation.issues.push('Missing call-to-action');
    }

    // Check for phone/URL readability (basic validation)
    if (adSpec.copy.phone) {
      const phonePattern = /^[\d\s\-\(\)\.]+$/;
      if (!phonePattern.test(adSpec.copy.phone)) {
        validation.copy = false;
        validation.issues.push('Phone number format may not be readable');
      }
    }

    // Check brand colors for contrast (simplified)
    if (adSpec.branding.colors && adSpec.branding.colors.length >= 2) {
      const color1 = adSpec.branding.colors[0];
      const color2 = adSpec.branding.colors[1];
      
      // Basic contrast check - if both colors are similar lightness, flag it
      const isLight1 = isLightColor(color1);
      const isLight2 = isLightColor(color2);
      
      if (isLight1 === isLight2) {
        validation.contrast = false;
        validation.issues.push('Color contrast may be insufficient');
      }
    }

    // File size check (assume all pass for now - would need actual generation)
    validation.fileSize = true;

    return NextResponse.json(validation);

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate ad spec' },
      { status: 500 }
    );
  }
}

function isLightColor(hexColor: string): boolean {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
}