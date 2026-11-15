// One-off generator for favicon PNGs and the OG image.
// Run: node scripts/generate-icons.mjs
// Sources: public/favicon.svg (icons) + the inline OG template below.
// Outputs are committed; re-run only when the source art changes.
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const faviconSvg = await readFile(new URL("../public/favicon.svg", import.meta.url));

await sharp(faviconSvg, { density: 300 })
  .resize(32, 32)
  .png()
  .toFile(new URL("../public/favicon-32.png", import.meta.url).pathname);

await sharp(faviconSvg, { density: 300 })
  .resize(180, 180)
  .png()
  .toFile(new URL("../public/apple-touch-icon.png", import.meta.url).pathname);

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#101214"/>
  <rect x="72" y="238" width="56" height="6" fill="#8cc084"/>
  <text x="72" y="330" font-family="monospace" font-weight="700" font-size="96" fill="#edefea">Abiram</text>
  <text x="72" y="398" font-family="monospace" font-size="34" fill="#8a918a">Frontend Engineer</text>
  <text x="72" y="452" font-family="monospace" font-size="28" fill="#8cc084">Angular · React · Micro Frontends</text>
  <text x="72" y="556" font-family="monospace" font-size="24" fill="#8a918a">www.abikb.xyz</text>
</svg>`;

await sharp(Buffer.from(og)).png().toFile(new URL("../public/og.png", import.meta.url).pathname);

console.log("icons + og.png generated");
