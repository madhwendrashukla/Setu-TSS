const fs = require('fs');

const file = 'd:/setu tss ui ux/web/app/tools/incubator-search/investors/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// Fix API URL
content = content.replace(
    /fetch\(`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| ''\}\/api\/tools\/investors`\)/,
    "fetch(`http://localhost:5000/api/tools/investors`)"
);

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
  { from: /bg-bg-surface(\/\d+)?/g, to: 'bg-white' },
  { from: /bg-bg-main/g, to: 'bg-gray-50' },
  { from: /bg-\[\#0A0A0B\]/g, to: 'bg-white' },

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
  { from: /text-text-secondary/g, to: 'text-gray-600' },
  { from: /text-text-tertiary/g, to: 'text-gray-500' },
  { from: /glass-card/g, to: 'shadow-sm' }
];

// Safe replacements for text-white
content = content.replace(/text-white(?!(\/\d+|[a-zA-Z0-9-]))/g, (match, p1, offset, str) => {
    const lineStart = str.lastIndexOf('\n', offset);
    const lineEnd = str.indexOf('\n', offset) === -1 ? str.length : str.indexOf('\n', offset);
    const line = str.substring(lineStart, lineEnd);
    if (line.includes('bg-accent-blue') || line.includes('bg-[#0077b5]')) {
        return 'text-white';
    }
    return 'text-gray-900';
});

replacements.forEach(r => {
  content = content.replace(r.from, r.to);
});

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed investors page theme and fetch URL!');
