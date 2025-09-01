import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { adSpec, size } = await request.json();

    if (!adSpec || !size) {
      return NextResponse.json({ error: 'AdSpec and size are required' }, { status: 400 });
    }

    // Parse size (e.g., "1080x1080")
    const [widthStr, heightStr] = size.split('x');
    const width = parseInt(widthStr);
    const height = parseInt(heightStr);

    if (!width || !height) {
      return NextResponse.json({ error: 'Invalid size format' }, { status: 400 });
    }

    // Create canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill background color (fallback)
    ctx.fillStyle = adSpec.branding.colors[0] || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Load and draw background if available
    if (adSpec.background.variants && adSpec.background.variants[0]) {
      try {
        const bgImage = await loadImage(adSpec.background.variants[0]);
        ctx.drawImage(bgImage, 0, 0, width, height);
      } catch (err) {
        console.warn('Failed to load background image:', err);
      }
    }

    // Safe area margins
    const margin = Math.max(width * 0.05, 24);

    // Draw text elements based on layout
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    let textX = margin;
    let textY = margin;
    const textWidth = width - (margin * 2);

    // Adjust positioning based on layout
    switch (adSpec.layout) {
      case 'text-left':
        textX = margin;
        textY = height * 0.3;
        break;
      case 'text-top':
        textX = margin;
        textY = margin;
        break;
      case 'centered':
        textX = width * 0.5;
        textY = height * 0.5;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        break;
      case 'poster':
        textX = margin;
        textY = height * 0.7;
        break;
    }

    // Draw headline
    if (adSpec.copy.headlines && adSpec.copy.headlines[0]) {
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = '#000000';
      ctx.fillText(adSpec.copy.headlines[0], textX, textY);
      textY += 60;
    }

    // Draw subhead
    if (adSpec.copy.subheads && adSpec.copy.subheads[0]) {
      ctx.font = '28px Arial';
      ctx.fillStyle = '#333333';
      ctx.fillText(adSpec.copy.subheads[0], textX, textY);
      textY += 40;
    }

    // Draw CTA button
    if (adSpec.copy.ctas && adSpec.copy.ctas[0]) {
      const cta = adSpec.copy.ctas[0];
      const buttonPadding = 20;
      const buttonHeight = 50;
      
      ctx.font = 'bold 24px Arial';
      const textMetrics = ctx.measureText(cta);
      const buttonWidth = textMetrics.width + (buttonPadding * 2);
      
      // Button background
      ctx.fillStyle = adSpec.branding.colors[2] || '#007BFF';
      ctx.fillRect(textX, textY + 20, buttonWidth, buttonHeight);
      
      // Button text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(cta, textX + buttonPadding, textY + 35);
      textY += 80;
    }

    // Draw contact info
    if (adSpec.copy.phone) {
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#000000';
      ctx.fillText(adSpec.copy.phone, textX, textY);
      textY += 30;
    }

    if (adSpec.copy.url) {
      ctx.font = '18px Arial';
      ctx.fillStyle = '#666666';
      ctx.fillText(adSpec.copy.url, textX, textY);
    }

    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');

    // Save temporary file
    const tempDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filename = `ad_${size}_${Date.now()}.png`;
    const filepath = path.join(tempDir, filename);
    fs.writeFileSync(filepath, buffer);

    return NextResponse.json({
      previewUrl: `/tmp/${filename}`,
      size,
    });

  } catch (error) {
    console.error('Composition error:', error);
    return NextResponse.json(
      { error: 'Failed to compose ad' },
      { status: 500 }
    );
  }
}