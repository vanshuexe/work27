import sharp from "sharp";
import fs from "fs";

// SVG WhatsApp Icon component with speech bubble shape, white border, and white handset
function makeWhatsAppIconSvg(x, y, size) {
  const scale = size / 24;
  return `
    <g transform="translate(${x}, ${y}) scale(${scale})">
      <!-- White outer outline / speech bubble shape -->
      <path fill="#ffffff" d="M12 0.5C5.649 0.5 0.5 5.649 0.5 12c0 2.14.593 4.14 1.624 5.85L0.5 23.5l5.85-1.624C8.01 22.907 9.96 23.5 12 23.5c6.351 0 11.5-5.149 11.5-11.5S18.351 0.5 12 0.5z" />
      <!-- Vibrant Green WhatsApp body -->
      <path fill="#25D366" d="M12 1.8C6.367 1.8 1.8 6.367 1.8 12c0 1.954.55 3.78 1.504 5.337L1.8 22.2l5.063-1.46A10.14 10.14 0 0 0 12 22.2c5.633 0 10.2-4.567 10.2-10.2S17.633 1.8 12 1.8z" />
      <!-- White Handset -->
      <path fill="#ffffff" d="M17.507 14.303c-.332-.166-1.966-.97-2.271-1.082-.305-.111-.527-.166-.749.166-.222.332-.861 1.082-1.055 1.304-.194.222-.388.249-.72.083-1.428-.71-2.73-1.603-3.83-2.651-.83-.789-1.503-1.697-2.002-2.678-.194-.332-.02-.513.146-.678.15-.149.332-.388.498-.582.166-.194.222-.332.332-.554.111-.222.055-.415-.028-.582-.083-.166-.749-1.802-1.026-2.467-.27-.648-.545-.56-.749-.57-.194-.01-.415-.01-.637-.01-.222 0-.582.083-.887.415-.305.332-1.164 1.137-1.164 2.773 0 1.636 1.192 3.218 1.358 3.44 1.25 1.67 2.89 3.03 4.8 3.99 1.15.58 2.06.92 2.77 1.15 1.16.37 2.22.32 3.06.19.93-.14 2.87-1.17 3.27-2.3.4-1.13.4-2.1.28-2.3-.12-.2-.33-.31-.66-.48z" />
    </g>
  `;
}

async function fixAllBanners() {
  console.log("Applying complete banner fix for WhatsApp icon and phone numbers...");

  // -------------------------------------------------------------
  // 1. About Kali Charan banner (/assets/img/about-kali-charan.jpg)
  // -------------------------------------------------------------
  const aboutPath = "public/assets/img/about-kali-charan.jpg";
  if (!fs.existsSync(aboutPath + ".orig")) {
    fs.copyFileSync(aboutPath, aboutPath + ".orig");
  }

  // Bar is width 1222px, height 200px, positioned at left: 23, top: 960
  // Group: Icon (104px) + Gap (28px) + Number at 94px font (~735px) = ~867px
  // Left margin = (1222 - 867) / 2 = 177px
  const aboutWidth = 1222;
  const aboutHeight = 200;
  const aboutIconSize = 104;
  const aboutIconY = Math.round((aboutHeight - aboutIconSize) / 2); // 48
  const aboutGroupLeft = 177;
  const aboutTextX = aboutGroupLeft + aboutIconSize + 28; // 309
  const aboutTextY = 128;

  const aboutSvg = `
  <svg width="${aboutWidth}" height="${aboutHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="aboutBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#460303" />
        <stop offset="30%" stop-color="#380202" />
        <stop offset="70%" stop-color="#240101" />
        <stop offset="100%" stop-color="#120000" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#aboutBg)" />
    <!-- WhatsApp Icon -->
    ${makeWhatsAppIconSvg(aboutGroupLeft, aboutIconY, aboutIconSize)}
    <!-- Phone Number with 3D drop shadow -->
    <text x="${aboutTextX + 3}" y="${aboutTextY + 3}" font-family="Arial, 'Helvetica Neue', 'Segoe UI', sans-serif" font-size="94" font-weight="900" fill="rgba(0,0,0,0.85)" letter-spacing="2">+91 96493 31806</text>
    <text x="${aboutTextX}" y="${aboutTextY}" font-family="Arial, 'Helvetica Neue', 'Segoe UI', sans-serif" font-size="94" font-weight="900" fill="#ffffff" letter-spacing="2">+91 96493 31806</text>
  </svg>
  `;

  const aboutBuf = await sharp(aboutPath + ".orig")
    .composite([{ input: Buffer.from(aboutSvg), top: 960, left: 23 }])
    .jpeg({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(aboutPath, aboutBuf);
  console.log("Fixed about-kali-charan.jpg (WhatsApp + number centered with 177px margins)");

  // -------------------------------------------------------------
  // 2. Slide 1 (Love Back)
  // -------------------------------------------------------------
  const s1Path = "public/assets/img/slide/hero-love-back.jpg";
  if (!fs.existsSync(s1Path + ".orig")) {
    fs.copyFileSync(s1Path, s1Path + ".orig");
  }
  const s1Width = 920;
  const s1Height = 96;
  const s1IconSize = 64;
  const s1IconY = Math.round((s1Height - s1IconSize) / 2); // 16
  // Group: 64 + 20 + ~640 = ~724px -> margin = (920 - 724) / 2 = 98px
  const s1GroupLeft = 98;
  const s1TextX = s1GroupLeft + s1IconSize + 20;
  const s1TextY = 74;

  const s1Svg = `
  <svg width="${s1Width}" height="${s1Height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="slideBg1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#460303" />
        <stop offset="30%" stop-color="#380202" />
        <stop offset="70%" stop-color="#240101" />
        <stop offset="100%" stop-color="#120000" />
      </linearGradient>
      <linearGradient id="gold1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff8a6" />
        <stop offset="25%" stop-color="#ffd54f" />
        <stop offset="65%" stop-color="#f5a818" />
        <stop offset="90%" stop-color="#d47c05" />
        <stop offset="100%" stop-color="#9a5201" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#slideBg1)" />
    ${makeWhatsAppIconSvg(s1GroupLeft, s1IconY, s1IconSize)}
    <text x="${s1TextX + 2}" y="${s1TextY + 3}" font-family="Impact, 'Arial Black', sans-serif" font-size="78" font-weight="900" fill="rgba(0,0,0,0.85)" letter-spacing="1">+91 96493 31806</text>
    <text x="${s1TextX}" y="${s1TextY}" font-family="Impact, 'Arial Black', sans-serif" font-size="78" font-weight="900" fill="url(#gold1)" letter-spacing="1">+91 96493 31806</text>
  </svg>
  `;

  const s1Buf = await sharp(s1Path + ".orig")
    .composite([{ input: Buffer.from(s1Svg), top: 686, left: 700 }])
    .jpeg({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(s1Path, s1Buf);
  console.log("Fixed hero-love-back.jpg (WhatsApp + gold number)");

  // -------------------------------------------------------------
  // 3. Slide 2 (Love Marriage)
  // -------------------------------------------------------------
  const s2Path = "public/assets/img/slide/hero-love-marriage.jpg";
  if (!fs.existsSync(s2Path + ".orig")) {
    fs.copyFileSync(s2Path, s2Path + ".orig");
  }
  const s2Width = 950;
  const s2Height = 110;
  const s2IconSize = 72;
  const s2IconY = Math.round((s2Height - s2IconSize) / 2); // 19
  // Group: 72 + 20 + ~710 = ~802px -> margin = (950 - 802) / 2 = 74px
  const s2GroupLeft = 74;
  const s2TextX = s2GroupLeft + s2IconSize + 22;
  const s2TextY = 85;

  const s2Svg = `
  <svg width="${s2Width}" height="${s2Height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="slideBg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#460303" />
        <stop offset="30%" stop-color="#380202" />
        <stop offset="70%" stop-color="#240101" />
        <stop offset="100%" stop-color="#120000" />
      </linearGradient>
      <linearGradient id="gold2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff8a6" />
        <stop offset="25%" stop-color="#ffd54f" />
        <stop offset="65%" stop-color="#f5a818" />
        <stop offset="90%" stop-color="#d47c05" />
        <stop offset="100%" stop-color="#9a5201" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#slideBg2)" />
    ${makeWhatsAppIconSvg(s2GroupLeft, s2IconY, s2IconSize)}
    <text x="${s2TextX + 2}" y="${s2TextY + 3}" font-family="Impact, 'Arial Black', sans-serif" font-size="88" font-weight="900" fill="rgba(0,0,0,0.85)" letter-spacing="1">+91 96493 31806</text>
    <text x="${s2TextX}" y="${s2TextY}" font-family="Impact, 'Arial Black', sans-serif" font-size="88" font-weight="900" fill="url(#gold2)" letter-spacing="1">+91 96493 31806</text>
  </svg>
  `;

  const s2Buf = await sharp(s2Path + ".orig")
    .composite([{ input: Buffer.from(s2Svg), top: 665, left: 680 }])
    .jpeg({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(s2Path, s2Buf);
  console.log("Fixed hero-love-marriage.jpg (WhatsApp + gold number)");

  // -------------------------------------------------------------
  // 4. Slide 3 (Husband Wife)
  // -------------------------------------------------------------
  const s3Path = "public/assets/img/slide/hero-husband-wife.jpg";
  if (!fs.existsSync(s3Path + ".orig")) {
    fs.copyFileSync(s3Path, s3Path + ".orig");
  }
  const s3Width = 980;
  const s3Height = 120;
  const s3IconSize = 78;
  const s3IconY = Math.round((s3Height - s3IconSize) / 2); // 21
  // Group: 78 + 22 + ~750 = ~850px -> margin = (980 - 850) / 2 = 65px
  const s3GroupLeft = 65;
  const s3TextX = s3GroupLeft + s3IconSize + 24;
  const s3TextY = 92;

  const s3Svg = `
  <svg width="${s3Width}" height="${s3Height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="slideBg3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#460303" />
        <stop offset="30%" stop-color="#380202" />
        <stop offset="70%" stop-color="#240101" />
        <stop offset="100%" stop-color="#120000" />
      </linearGradient>
      <linearGradient id="gold3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff8a6" />
        <stop offset="25%" stop-color="#ffd54f" />
        <stop offset="65%" stop-color="#f5a818" />
        <stop offset="90%" stop-color="#d47c05" />
        <stop offset="100%" stop-color="#9a5201" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#slideBg3)" />
    ${makeWhatsAppIconSvg(s3GroupLeft, s3IconY, s3IconSize)}
    <text x="${s3TextX + 2}" y="${s3TextY + 3}" font-family="Impact, 'Arial Black', sans-serif" font-size="92" font-weight="900" fill="rgba(0,0,0,0.85)" letter-spacing="1">+91 96493 31806</text>
    <text x="${s3TextX}" y="${s3TextY}" font-family="Impact, 'Arial Black', sans-serif" font-size="92" font-weight="900" fill="url(#gold3)" letter-spacing="1">+91 96493 31806</text>
  </svg>
  `;

  const s3Buf = await sharp(s3Path + ".orig")
    .composite([{ input: Buffer.from(s3Svg), top: 645, left: 350 }])
    .jpeg({ quality: 95 })
    .toBuffer();
  fs.writeFileSync(s3Path, s3Buf);
  console.log("Fixed hero-husband-wife.jpg (WhatsApp + gold number)");

  // -------------------------------------------------------------
  // 5. Contact Strip (/assets/img/contact-strip.png)
  // -------------------------------------------------------------
  const stripPath = "public/assets/img/contact-strip.png";
  if (!fs.existsSync(stripPath + ".orig")) {
    fs.copyFileSync(stripPath, stripPath + ".orig");
  }
  const stripWidth = 1040;
  const stripHeight = 220;
  const stripIconSize = 130;
  const stripIconY = Math.round((stripHeight - stripIconSize) / 2); // 45
  const stripGroupLeft = 40;
  const stripTextX = stripGroupLeft + stripIconSize + 30;
  const stripTextY = 152;

  const stripSvg = `
  <svg width="${stripWidth}" height="${stripHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="3" dy="5" stdDeviation="4" flood-color="#888888" flood-opacity="0.5" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="#ffffff" />
    ${makeWhatsAppIconSvg(stripGroupLeft, stripIconY, stripIconSize)}
    <text x="${stripTextX}" y="${stripTextY}" font-family="Arial, 'Helvetica Neue', sans-serif" font-size="115" font-weight="900" fill="#222222" letter-spacing="1">+91 96493 31806</text>
  </svg>
  `;

  const stripBuf = await sharp(stripPath + ".orig")
    .composite([{ input: Buffer.from(stripSvg), top: 130, left: 320 }])
    .png()
    .toBuffer();
  fs.writeFileSync(stripPath, stripBuf);
  console.log("Fixed contact-strip.png (WhatsApp + phone number)");

  console.log("All banners fixed successfully!");
}

fixAllBanners().catch(console.error);

