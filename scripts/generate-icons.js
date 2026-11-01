const sharp = require('sharp');
const fs = require('fs');

async function generateIcons() {
  // 1. Extract emblem from public/logo.png
  // Bounds from analysis: left: 80, top: 60, width: 432, height: 200
  const emblem = await sharp('public/logo.png')
    .extract({ left: 80, top: 60, width: 432, height: 200 })
    .toBuffer();

  // Resize emblem to fit nicely inside 512x512
  const resizedEmblem = await sharp(emblem)
    .resize(460, null, { fit: 'inside' })
    .toBuffer();

  const meta = await sharp(resizedEmblem).metadata();
  const top = Math.round((512 - meta.height) / 2);
  const left = Math.round((512 - meta.width) / 2);

  // 1. Standard transparent square icon: public/icon.png & src/app/icon.png
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{
    input: resizedEmblem,
    top: top,
    left: left
  }])
  .png()
  .toFile('public/icon.png');

  // Copy to src/app/icon.png
  fs.copyFileSync('public/icon.png', 'src/app/icon.png');
  fs.copyFileSync('public/icon.png', 'src/app/apple-icon.png');

  // 2. Circular badge version (perfect circle with dark green #121614 background and #2E6B47 border)
  // This makes the logo pop vividly in light or dark browser tabs!
  const circleSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" r="250" fill="#121614" stroke="#2E6B47" stroke-width="12" />
  </svg>`;

  const badgeEmblem = await sharp(emblem)
    .resize(410, null, { fit: 'inside' })
    .toBuffer();
  const badgeMeta = await sharp(badgeEmblem).metadata();

  await sharp(Buffer.from(circleSvg))
    .composite([{
      input: badgeEmblem,
      top: Math.round((512 - badgeMeta.height) / 2),
      left: Math.round((512 - badgeMeta.width) / 2)
    }])
    .png()
    .toFile('public/icon-circle.png');

  // 3. Generate favicon sizes for browsers
  await sharp('public/icon-circle.png')
    .resize(32, 32)
    .toFile('public/favicon-32x32.png');

  await sharp('public/icon-circle.png')
    .resize(16, 16)
    .toFile('public/favicon-16x16.png');

  await sharp('public/icon-circle.png')
    .resize(192, 192)
    .toFile('public/icon-192.png');

  await sharp('public/icon-circle.png')
    .resize(512, 512)
    .toFile('public/icon-512.png');

  // Also create public/favicon.ico
  // A 32x32 PNG renamed to favicon.ico works across modern browsers
  await sharp('public/icon-circle.png')
    .resize(32, 32)
    .toFile('public/favicon.ico');

  fs.copyFileSync('public/favicon.ico', 'src/app/favicon.ico');

  console.log('Successfully generated all icon assets!');
}

generateIcons().catch(console.error);
