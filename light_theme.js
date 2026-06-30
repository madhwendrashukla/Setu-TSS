const fs = require('fs');
const path = require('path');

const dir = 'd:/setu tss ui ux/web/app/admin';

// Helper to recursively find all .tsx files
function getFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') && file !== 'layout.tsx' && !file.includes('events\\\\page.tsx') && !file.includes('events/page.tsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getFiles(dir);

const replacements = [
  // Backgrounds
  { from: /bg-zinc-900/g, to: 'bg-white' },
  { from: /bg-\[\#151515\]/g, to: 'bg-white' },
  { from: /bg-\[\#121626\]/g, to: 'bg-white' },
  { from: /bg-\[\#0F1322\](\/80)?/g, to: 'bg-white' },
  { from: /bg-black\/50/g, to: 'bg-gray-50' },
  { from: /bg-black\/40/g, to: 'bg-gray-50' },
  { from: /bg-black\/30/g, to: 'bg-gray-50' },
  { from: /bg-black\/20/g, to: 'bg-gray-100' },
  { from: /bg-black/g, to: 'bg-white' },
  { from: /bg-white\/5/g, to: 'bg-gray-50' },
  { from: /bg-white\/10/g, to: 'bg-gray-100' },
  { from: /bg-white\/\[0\.02\]/g, to: 'bg-gray-50' },

  // Borders
  { from: /border-white\/5/g, to: 'border-gray-100' },
  { from: /border-white\/10/g, to: 'border-gray-200' },
  { from: /border-white\/20/g, to: 'border-gray-300' },

  // Texts
  { from: /text-white\/30/g, to: 'text-gray-400' },
  { from: /text-white\/40/g, to: 'text-gray-400' },
  { from: /text-white\/50/g, to: 'text-gray-500' },
  { from: /text-white\/60/g, to: 'text-gray-500' },
  { from: /text-white\/70/g, to: 'text-gray-600' },
  { from: /text-white\/80/g, to: 'text-gray-700' },
  { from: /text-text-secondary/g, to: 'text-gray-500' },
  { from: /glass-card/g, to: 'shadow-sm' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Safe replacements for text-white
  content = content.replace(/text-white(?!(\/\d+|[a-zA-Z0-9-]))/g, (match, p1, offset, str) => {
     const lineStart = str.lastIndexOf('\n', offset);
     const lineEnd = str.indexOf('\n', offset) === -1 ? str.length : str.indexOf('\n', offset);
     const line = str.substring(lineStart, lineEnd);
     if (line.includes('bg-accent-blue') || line.includes('bg-red-500') || line.includes('bg-green-500') || line.includes('text-transparent')) {
         return 'text-white';
     }
     return 'text-gray-900';
  });

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
