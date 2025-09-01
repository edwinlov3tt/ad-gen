import { NextRequest, NextResponse } from 'next/server';
import archiver from 'archiver';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  try {
    const { adSpec } = await request.json();

    if (!adSpec) {
      return NextResponse.json({ error: 'AdSpec is required' }, { status: 400 });
    }

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    // Create readable stream for the response
    const stream = new ReadableStream({
      start(controller) {
        archive.on('data', (chunk) => {
          controller.enqueue(new Uint8Array(chunk));
        });

        archive.on('end', () => {
          controller.close();
        });

        archive.on('error', (err) => {
          controller.error(err);
        });

        // Add AdSpec JSON to archive
        const adSpecJson = JSON.stringify(adSpec, null, 2);
        archive.append(adSpecJson, { name: 'ad-spec.json' });

        // Add a README with generation details
        const readme = `# Ad Generator Export

Campaign: ${adSpec.brief.objective} campaign
Target Audience: ${adSpec.brief.audience}
Generated: ${new Date().toISOString()}

## Sizes Generated
${adSpec.sizes.map((size: string) => `- ${size}`).join('\n')}

## Assets Included
- ad-spec.json: Complete specification for regeneration
- README.md: This file

## Copy Variants

### Headlines
${adSpec.copy.headlines?.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n') || 'None'}

### Subheads  
${adSpec.copy.subheads?.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n') || 'None'}

### CTAs
${adSpec.copy.ctas?.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n') || 'None'}

## Brand Colors
${adSpec.branding.colors?.join(', ') || 'None specified'}

## Fonts
${adSpec.branding.fonts?.join(', ') || 'None specified'}
`;
        
        archive.append(readme, { name: 'README.md' });

        // For each size, we would typically generate and add the actual image files
        // For now, we'll add placeholder information
        adSpec.sizes.forEach((size: string) => {
          const placeholder = `This would contain the ${size} ad asset. Use the ad-spec.json to regenerate actual images.`;
          archive.append(placeholder, { name: `assets/${size}.txt` });
        });

        // Finalize the archive
        archive.finalize();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="ad-assets.zip"',
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export assets' },
      { status: 500 }
    );
  }
}