/**
 * Image Scraper for Cwmbran Celtic AFC
 *
 * This script scrapes images from the club's social media and official sources
 * to populate the website gallery and other image needs.
 *
 * Usage: npx ts-node scripts/scrape-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Ensure directories exist
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Download a file from URL
function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadFile(redirectUrl, dest).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
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

// Known club image sources
const IMAGE_SOURCES = {
  // Club crest/logo - from FAW
  crest: 'https://comet.faw.cymru/clubs/cwmbran-celtic-afc/logo',

  // Placeholder images for different categories
  placeholders: {
    match: 'https://placehold.co/800x600/1e3a8a/facc15?text=Match+Day',
    ground: 'https://placehold.co/800x600/006633/ffffff?text=The+Park',
    team: 'https://placehold.co/800x600/1e3a8a/ffffff?text=Team+Photo',
    player: 'https://placehold.co/400x500/1e3a8a/facc15?text=Player',
    event: 'https://placehold.co/800x600/facc15/1e3a8a?text=Club+Event',
    history: 'https://placehold.co/800x600/333333/ffffff?text=Historic',
  }
};

// Generate OG image placeholder
async function generateOGImage() {
  const ogUrl = 'https://placehold.co/1200x630/1e3a8a/facc15?text=Cwmbran+Celtic+AFC%0AEst.+1924';
  const dest = path.join(PUBLIC_DIR, 'og-image.jpg');

  console.log('Generating OG image...');
  try {
    await downloadFile(ogUrl, dest);
    console.log('✓ OG image saved');
  } catch (err) {
    console.error('✗ Failed to generate OG image:', err);
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
    console.error('✗ Failed to generate favicon:', err);
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
    console.error('✗ Failed to generate Apple touch icon:', err);
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
      console.error(`✗ Failed to generate icon-${size}.png:`, err);
    }
  }
}

// Generate placeholder gallery images
async function generateGalleryPlaceholders() {
  const galleryDir = path.join(IMAGES_DIR, 'gallery');
  ensureDir(galleryDir);

  const categories = [
    { name: 'match', count: 4 },
    { name: 'ground', count: 4 },
    { name: 'event', count: 2 },
    { name: 'history', count: 3 },
    { name: 'ladies', count: 3 },
  ];

  for (const cat of categories) {
    for (let i = 1; i <= cat.count; i++) {
      const colors = {
        match: { bg: '1e3a8a', fg: 'facc15' },
        ground: { bg: '006633', fg: 'ffffff' },
        event: { bg: 'facc15', fg: '1e3a8a' },
        history: { bg: '333333', fg: 'ffffff' },
        ladies: { bg: 'facc15', fg: '1e3a8a' },
      };
      const color = colors[cat.name as keyof typeof colors] || { bg: '1e3a8a', fg: 'ffffff' };

      const url = `https://placehold.co/800x600/${color.bg}/${color.fg}?text=${cat.name}+${i}`;
      const dest = path.join(galleryDir, `${cat.name}-${i}.jpg`);

      console.log(`Generating gallery/${cat.name}-${i}.jpg...`);
      try {
        await downloadFile(url, dest);
        console.log(`✓ ${cat.name}-${i}.jpg saved`);
      } catch (err) {
        console.error(`✗ Failed to generate ${cat.name}-${i}.jpg:`, err);
      }
    }
  }
}

// Generate sponsor placeholders
async function generateSponsorPlaceholders() {
  const sponsorsDir = path.join(IMAGES_DIR, 'sponsors');
  ensureDir(sponsorsDir);

  const sponsors = [
    'main-sponsor',
    'partner-1',
    'partner-2',
    'partner-3',
    'partner-4',
  ];

  for (const sponsor of sponsors) {
    const url = `https://placehold.co/300x150/f5f5f5/333333?text=${sponsor.replace('-', '+')}`;
    const dest = path.join(sponsorsDir, `${sponsor}.png`);

    console.log(`Generating sponsors/${sponsor}.png...`);
    try {
      await downloadFile(url, dest);
      console.log(`✓ ${sponsor}.png saved`);
    } catch (err) {
      console.error(`✗ Failed to generate ${sponsor}.png:`, err);
    }
  }
}

// Generate team/player placeholders
async function generatePlayerPlaceholders() {
  const playersDir = path.join(IMAGES_DIR, 'players');
  ensureDir(playersDir);

  // Generate placeholder for each position type
  const positions = ['goalkeeper', 'defender', 'midfielder', 'forward'];

  for (const pos of positions) {
    const url = `https://placehold.co/400x500/1e3a8a/facc15?text=${pos}`;
    const dest = path.join(playersDir, `${pos}-placeholder.jpg`);

    console.log(`Generating players/${pos}-placeholder.jpg...`);
    try {
      await downloadFile(url, dest);
      console.log(`✓ ${pos}-placeholder.jpg saved`);
    } catch (err) {
      console.error(`✗ Failed to generate ${pos}-placeholder.jpg:`, err);
    }
  }
}

// Main function
async function main() {
  console.log('='.repeat(50));
  console.log('Cwmbran Celtic AFC Image Scraper');
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
  await generateGalleryPlaceholders();
  await generateSponsorPlaceholders();
  await generatePlayerPlaceholders();

  console.log('');
  console.log('='.repeat(50));
  console.log('Image generation complete!');
  console.log('='.repeat(50));
  console.log('');
  console.log('Note: These are placeholder images.');
  console.log('Replace them with actual club photos for production.');
}

main().catch(console.error);
