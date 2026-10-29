import sharp from "sharp";
import fs from "fs";

function makeSlideSvg(width, height, textX, textY, fontSize) {
  return `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="slideBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#460303" />
      <stop offset="30%" stop-color="#380202" />
      <stop offset="70%" stop-color="#240101" />
      <stop offset="100%" stop-color="#120000" />
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff8a6" />
      <stop offset="25%" stop-color="#ffd54f" />
      <stop offset="65%" stop-color="#f5a818" />
      <stop offset="90%" stop-color="#d47c05" />
      <stop offset="100%" stop-color="#9a5201" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#slideBg)" />
  <text x="${textX + 2}" y="${textY + 3}" font-family="Impact, 'Arial Black', sans-serif" font-size="${fontSize}" font-weight="900" fill="rgba(0,0,0,0.85)" text-anchor="middle" letter-spacing="1">+91 96493 31806</text>
  <text x="${textX}" y="${textY}" font-family="Impact, 'Arial Black', sans-serif" font-size="${fontSize}" font-weight="900" fill="url(#gold)" text-anchor="middle" letter-spacing="1">+91 96493 31806</text>
</svg>
`;
}

async function run() {
  console.log("Starting image number updates...");

  // 1. About Kali Charan image
  const aboutPath = "public/assets/img/about-kali-charan.jpg";
  if (!fs.existsSync(aboutPath + ".orig")) {
    fs.copyFileSync(aboutPath, aboutPath + ".orig");
  }
  const aboutSvg = `
  <svg width="970" height="125" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aboutBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3c0202" />
        <stop offset="30%" stop-color="#2a0101" />
        <stop offset="70%" stop-color="#200000" />
        <stop offset="100%" stop-color="#140000" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#aboutBg)" />
    <text x="487" y="93" font-family="Arial, 'Helvetica Neue', sans-serif" font-size="95" font-weight="900" fill="rgba(0,0,0,0.7)" text-anchor="middle" letter-spacing="2">+91 96493 31806</text>
    <text x="485" y="90" font-family="Arial, 'Helvetica Neue', sans-serif" font-size="95" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">+91 96493 31806</text>
  </svg>
  `;
  const aboutBuf = await sharp(aboutPath + ".orig")
    .composite([{ input: Buffer.from(aboutSvg), top: 975, left: 195 }])
    .jpeg({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(aboutPath, aboutBuf);
  console.log("Updated about-kali-charan.jpg");

  // 2. Slide 1 (Love Back)
  const s1Path = "public/assets/img/slide/hero-love-back.jpg";
  if (!fs.existsSync(s1Path + ".orig")) {
    fs.copyFileSync(s1Path, s1Path + ".orig");
  }
  const s1Svg = makeSlideSvg(790, 84, 395, 68, 80);
  const s1Buf = await sharp(s1Path + ".orig")
    .composite([{ input: Buffer.from(s1Svg), top: 692, left: 760 }])
    .jpeg({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(s1Path, s1Buf);
  console.log("Updated hero-love-back.jpg");

  // 3. Slide 2 (Love Marriage)
  const s2Path = "public/assets/img/slide/hero-love-marriage.jpg";
  if (!fs.existsSync(s2Path + ".orig")) {
    fs.copyFileSync(s2Path, s2Path + ".orig");
  }
  const s2Svg = makeSlideSvg(850, 102, 425, 82, 94);
  const s2Buf = await sharp(s2Path + ".orig")
    .composite([{ input: Buffer.from(s2Svg), top: 670, left: 730 }])
    .jpeg({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(s2Path, s2Buf);
  console.log("Updated hero-love-marriage.jpg");

  // 4. Slide 3 (Husband Wife)
  const s3Path = "public/assets/img/slide/hero-husband-wife.jpg";
  if (!fs.existsSync(s3Path + ".orig")) {
    fs.copyFileSync(s3Path, s3Path + ".orig");
  }
  const s3Svg = makeSlideSvg(860, 116, 430, 92, 96);
  const s3Buf = await sharp(s3Path + ".orig")
    .composite([{ input: Buffer.from(s3Svg), top: 649, left: 410 }])
    .jpeg({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(s3Path, s3Buf);
  console.log("Updated hero-husband-wife.jpg");

  // 5. Contact strip
  const stripPath = "public/assets/img/contact-strip.png";
  if (!fs.existsSync(stripPath + ".orig")) {
    fs.copyFileSync(stripPath, stripPath + ".orig");
  }
  const stripSvg = `
  <svg width="1030" height="210" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="3" dy="5" stdDeviation="4" flood-color="#888888" flood-opacity="0.5" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="#ffffff" />
    <text x="495" y="150" font-family="Arial, 'Helvetica Neue', sans-serif" font-size="110" font-weight="900" fill="#ffffff" filter="url(#shadow)" text-anchor="middle" letter-spacing="1">+91 96493 31806</text>
    <text x="495" y="150" font-family="Arial, 'Helvetica Neue', sans-serif" font-size="110" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">+91 96493 31806</text>
  </svg>
  `;
  const stripBuf = await sharp(stripPath + ".orig")
    .composite([{ input: Buffer.from(stripSvg), top: 140, left: 385 }])
    .png()
    .toBuffer();
  fs.writeFileSync(stripPath, stripBuf);
  console.log("Updated contact-strip.png");

  console.log("All image numbers updated to +91 96493 31806 successfully!");
}

run().catch(console.error);

