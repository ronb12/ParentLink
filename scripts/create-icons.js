#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Education-themed icon SVG template
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="book" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#bg)"/>
  
  <!-- Book icon -->
  <rect x="${size*0.25}" y="${size*0.3}" width="${size*0.5}" height="${size*0.4}" rx="2" fill="url(#book)" stroke="#e2e8f0" stroke-width="1"/>
  
  <!-- Book pages -->
  <line x1="${size*0.35}" y1="${size*0.35}" x2="${size*0.35}" y2="${size*0.65}" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="${size*0.4}" y1="${size*0.35}" x2="${size*0.4}" y2="${size*0.65}" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="${size*0.45}" y1="${size*0.35}" x2="${size*0.45}" y2="${size*0.65}" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="${size*0.5}" y1="${size*0.35}" x2="${size*0.5}" y2="${size*0.65}" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="${size*0.55}" y1="${size*0.35}" x2="${size*0.55}" y2="${size*0.65}" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="${size*0.6}" y1="${size*0.35}" x2="${size*0.6}" y2="${size*0.65}" stroke="#cbd5e1" stroke-width="1"/>
  <line x1="${size*0.65}" y1="${size*0.35}" x2="${size*0.65}" y2="${size*0.65}" stroke="#cbd5e1" stroke-width="1"/>
  
  <!-- Graduation cap -->
  <path d="M${size*0.2} ${size*0.5} Q${size*0.3} ${size*0.4} ${size*0.4} ${size*0.5} L${size*0.6} ${size*0.5} Q${size*0.7} ${size*0.4} ${size*0.8} ${size*0.5} L${size*0.8} ${size*0.55} L${size*0.2} ${size*0.55} Z" fill="#fbbf24"/>
  
  <!-- Tassel -->
  <line x1="${size*0.8}" y1="${size*0.5}" x2="${size*0.85}" y2="${size*0.6}" stroke="#f59e0b" stroke-width="2"/>
  <circle cx="${size*0.85}" cy="${size*0.6}" r="2" fill="#f59e0b"/>
  
  <!-- Communication lines -->
  <path d="M${size*0.15} ${size*0.75} Q${size*0.2} ${size*0.7} ${size*0.25} ${size*0.75}" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.8"/>
  <path d="M${size*0.75} ${size*0.75} Q${size*0.8} ${size*0.7} ${size*0.85} ${size*0.75}" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.8"/>
  
  <!-- Small dots for communication -->
  <circle cx="${size*0.2}" cy="${size*0.75}" r="1.5" fill="#ffffff" opacity="0.8"/>
  <circle cx="${size*0.8}" cy="${size*0.75}" r="1.5" fill="#ffffff" opacity="0.8"/>
</svg>`;

// Icon sizes to generate
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Creating education-themed app icons...');

iconSizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✅ Created ${filename}`);
});

// Create a simple favicon
const faviconSVG = createIconSVG(32);
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), faviconSVG);
console.log('✅ Created favicon.svg');

// Create a simple apple-touch-icon
const appleIconSVG = createIconSVG(180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), appleIconSVG);
console.log('✅ Created apple-touch-icon.svg');

console.log('\n🎉 All education-themed icons created successfully!');
console.log('📁 Icons saved to: public/icons/');
console.log('📚 Theme: Education with book, graduation cap, and communication elements');
console.log('🎨 Colors: Blue gradient background with white/gold accents');
