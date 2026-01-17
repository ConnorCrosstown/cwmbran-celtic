/**
 * Image Scraper for Cwmbran Celtic AFC
 *
 * This script downloads placeholder images and can be extended
 * to scrape images from club social media.
 *
 * Usage: node scripts/scrape-images.mjs
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Download a file from URL
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          file.close();
          downloadFile(redirectUrl, dest).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        file.close();
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete partial file
      reject(err);
    });
  });
}

// Generate OG image placeholder
async function generateOGImage() {
  const ogUrl = 'https://placehold.co/1200x630/1e3a8a/facc15?text=Cwmbran+Celtic+AFC%0AEst.+1924';
  const dest = path.join(PUBLIC_DIR, 'og-image.jpg');

  console.log('Generating OG image...');
  try {
    await downloadFile(ogUrl, dest);
    console.log('✓ OG image saved');
  } catch (err) {
    console.error('✗ Failed to generate OG image:', err.message);
  }
}

// Generate favicon placeholder
async function generateFavicon() {
  const faviconUrl = 'https://placehold.co/32x32/1e3a8a/facc15?text=CC';
  const dest = path.join(PUBLIC_DIR, 'favicon.ico');

  console.log('Generating favicon...');
  try {
    await downloadFile(faviconUrl, dest);
    console.log('✓ Favicon saved');
  } catch (err) {
    console.error('✗ Failed to generate favicon:', err.message);
  }
}

// Generate apple touch icon
async function generateAppleTouchIcon() {
  const iconUrl = 'https://placehold.co/180x180/1e3a8a/facc15?text=CC';
  const dest = path.join(PUBLIC_DIR, 'apple-touch-icon.png');

  console.log('Generating Apple touch icon...');
  try {
    await downloadFile(iconUrl, dest);
    console.log('✓ Apple touch icon saved');
  } catch (err) {
    console.error('✗ Failed to generate Apple touch icon:', err.message);
  }
}

// Generate PWA icons
async function generatePWAIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    const iconUrl = `https://placehold.co/${size}x${size}/1e3a8a/facc15?text=CC`;
    const dest = path.join(PUBLIC_DIR, `icon-${size}.png`);

    console.log(`Generating ${size}x${size} PWA icon...`);
    try {
      await downloadFile(iconUrl, dest);
      console.log(`✓ icon-${size}.png saved`);
    } catch (err) {
      console.error(`✗ Failed to generate icon-${size}.png:`, err.message);
    }
  }
}

// Generate placeholder gallery images
async function generateGalleryPlaceholders() {
  const galleryDir = path.join(IMAGES_DIR, 'gallery');
  ensureDir(galleryDir);

  const categories = [
    { name: 'match', count: 4, label: 'Match' },
    { name: 'ground', count: 4, label: 'The+Park' },
    { name: 'event', count: 2, label: 'Event' },
    { name: 'history', count: 3, label: 'Historic' },
    { name: 'ladies', count: 3, label: 'Ladies' },
  ];

  const colors = {
    match: { bg: '1e3a8a', fg: 'facc15' },
    ground: { bg: '006633', fg: 'ffffff' },
    event: { bg: 'facc15', fg: '1e3a8a' },
    history: { bg: '333333', fg: 'ffffff' },
    ladies: { bg: 'facc15', fg: '1e3a8a' },
  };

  for (const cat of categories) {
    for (let i = 1; i <= cat.count; i++) {
      const color = colors[cat.name] || { bg: '1e3a8a', fg: 'ffffff' };
      const url = `https://placehold.co/800x600/${color.bg}/${color.fg}?text=${cat.label}+${i}`;
      const dest = path.join(galleryDir, `${cat.name}-${i}.jpg`);

      console.log(`Generating gallery/${cat.name}-${i}.jpg...`);
      try {
        await downloadFile(url, dest);
        console.log(`✓ ${cat.name}-${i}.jpg saved`);
      } catch (err) {
        console.error(`✗ Failed to generate ${cat.name}-${i}.jpg:`, err.message);
      }
    }
  }
}

// Generate sponsor placeholders
async function generateSponsorPlaceholders() {
  const sponsorsDir = path.join(IMAGES_DIR, 'sponsors');
  ensureDir(sponsorsDir);

  const sponsors = [
    { name: 'main-sponsor', label: 'Main+Sponsor' },
    { name: 'partner-1', label: 'Partner+1' },
    { name: 'partner-2', label: 'Partner+2' },
    { name: 'partner-3', label: 'Partner+3' },
    { name: 'partner-4', label: 'Partner+4' },
  ];

  for (const sponsor of sponsors) {
    const url = `https://placehold.co/300x150/f5f5f5/333333?text=${sponsor.label}`;
    const dest = path.join(sponsorsDir, `${sponsor.name}.png`);

    console.log(`Generating sponsors/${sponsor.name}.png...`);
    try {
      await downloadFile(url, dest);
      console.log(`✓ ${sponsor.name}.png saved`);
    } catch (err) {
      console.error(`✗ Failed to generate ${sponsor.name}.png:`, err.message);
    }
  }
}

// Generate team/player placeholders
async function generatePlayerPlaceholders() {
  const playersDir = path.join(IMAGES_DIR, 'players');
  ensureDir(playersDir);

  const positions = [
    { name: 'goalkeeper', label: 'GK' },
    { name: 'defender', label: 'DEF' },
    { name: 'midfielder', label: 'MID' },
    { name: 'forward', label: 'FWD' },
  ];

  for (const pos of positions) {
    const url = `https://placehold.co/400x500/1e3a8a/facc15?text=${pos.label}`;
    const dest = path.join(playersDir, `${pos.name}-placeholder.jpg`);

    console.log(`Generating players/${pos.name}-placeholder.jpg...`);
    try {
      await downloadFile(url, dest);
      console.log(`✓ ${pos.name}-placeholder.jpg saved`);
    } catch (err) {
      console.error(`✗ Failed to generate ${pos.name}-placeholder.jpg:`, err.message);
    }
  }
}

// Generate hero/banner images
async function generateHeroImages() {
  const heroDir = path.join(IMAGES_DIR, 'hero');
  ensureDir(heroDir);

  const heroes = [
    { name: 'home-hero', width: 1920, height: 800, bg: '1e3a8a', fg: 'facc15', text: 'Cwmbran+Celtic+AFC' },
    { name: 'stadium', width: 1920, height: 600, bg: '006633', fg: 'ffffff', text: 'The+Park' },
    { name: 'team-mens', width: 1200, height: 600, bg: '1e3a8a', fg: 'facc15', text: 'Mens+Team' },
    { name: 'team-ladies', width: 1200, height: 600, bg: 'facc15', fg: '1e3a8a', text: 'Ladies+Team' },
  ];

  for (const hero of heroes) {
    const url = `https://placehold.co/${hero.width}x${hero.height}/${hero.bg}/${hero.fg}?text=${hero.text}`;
    const dest = path.join(heroDir, `${hero.name}.jpg`);

    console.log(`Generating hero/${hero.name}.jpg...`);
    try {
      await downloadFile(url, dest);
      console.log(`✓ ${hero.name}.jpg saved`);
    } catch (err) {
      console.error(`✗ Failed to generate ${hero.name}.jpg:`, err.message);
    }
  }
}

// Main function
async function main() {
  console.log('='.repeat(50));
  console.log('Cwmbran Celtic AFC Image Generator');
  console.log('='.repeat(50));
  console.log('');

  // Ensure directories
  ensureDir(PUBLIC_DIR);
  ensureDir(IMAGES_DIR);

  // Generate all images
  await generateOGImage();
  await generateFavicon();
  await generateAppleTouchIcon();
  await generatePWAIcons();
  await generateHeroImages();
  await generateGalleryPlaceholders();
  await generateSponsorPlaceholders();
  await generatePlayerPlaceholders();

  console.log('');
  console.log('='.repeat(50));
  console.log('Image generation complete!');
  console.log('='.repeat(50));
  console.log('');
  console.log('Generated images in:');
  console.log(`  ${PUBLIC_DIR}`);
  console.log(`  ${IMAGES_DIR}`);
  console.log('');
  console.log('Note: These are placeholder images.');
  console.log('Replace them with actual club photos for production.');
}

main().catch(console.error);
