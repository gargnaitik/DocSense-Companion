import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

console.log('🚀 Building DocSense Companion Extension...\n');

// Step 1: Build popup with Vite (creates dist/ and cleans it)
console.log('📦 Step 1/4: Building popup (Vite + React)...');
execSync('npx vite build', { cwd: root, stdio: 'inherit' });

// Step 2: Build background service worker with esbuild
console.log('\n⚙️  Step 2/4: Building background service worker...');
execSync(
  'npx esbuild src/background/index.ts --bundle --outfile=dist/background.js --format=esm --target=esnext',
  { cwd: root, stdio: 'inherit' }
);

// Step 3: Build content script with esbuild
console.log('\n📝 Step 3/4: Building content script...');
execSync(
  'npx esbuild src/content/index.ts --bundle --outfile=dist/content.js --format=iife --target=esnext',
  { cwd: root, stdio: 'inherit' }
);

// Step 4: Copy static assets
console.log('\n📋 Step 4/4: Copying static assets...');

// Copy manifest.json
cpSync(resolve(root, 'manifest.json'), resolve(dist, 'manifest.json'));
console.log('  ✓ manifest.json');

// Copy icons
const iconsDir = resolve(root, 'public', 'icons');
const distIcons = resolve(dist, 'icons');
if (existsSync(iconsDir)) {
  mkdirSync(distIcons, { recursive: true });
  cpSync(iconsDir, distIcons, { recursive: true });
  console.log('  ✓ icons/');
} else {
  console.log('  ⚠ No icons found at public/icons/ — extension will use default icon');
}

console.log('\n✅ Build complete!');
console.log('📂 Output directory: dist/');
console.log('🔧 To load: chrome://extensions → Developer mode → Load unpacked → select dist/\n');
