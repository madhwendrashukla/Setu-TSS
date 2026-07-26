const fs = require('fs');
const files = [
    'd:/setu tss ui ux/web/app/tools/pitch-decks/page.tsx',
    'd:/setu tss ui ux/web/app/tools/incubators-accelerators/page.tsx',
    'd:/setu tss ui ux/web/app/tools/incubator-search/investors/page.tsx',
    'd:/setu tss ui ux/web/app/tools/incubator-search/grants/page.tsx'
];
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /<div className="flex items-center gap-3 mb-4">[\s\S]*?<span[^>]*text-\[10px\][^>]*>.*?<\/span>[\s\S]*?<div className="h-px[^>]*><\/div>[\s\S]*?<\/div>\s*/g;
    const newContent = content.replace(regex, '');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Modified', file);
    }
});
