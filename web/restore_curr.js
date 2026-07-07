const fs = require('fs');

let c = fs.readFileSync('app/AI-workshop-15may/AIWorkshopCurriculum.tsx', 'utf-8');

// 1. Rename export and inject data
c = c.replace(/export function AIWorkshopCurriculum\(\) \{/, 'export function DynamicCurriculum({ data }: { data: any }) {\n    if (!data) return null;\n    const workshops = data.workshops || [];');

// 2. Replace the outer button with a div
c = c.replace(/<button\n\s*className="w-full text-left px-6 md:px-10 py-6 md:py-8 flex items-start gap-4 md:gap-6 group"\n\s*onClick=\{([^}]+)\}\n\s*>/g, 
`<div
                                role="button"
                                tabIndex={0}
                                className="w-full text-left px-6 md:px-10 py-6 md:py-8 flex items-start gap-4 md:gap-6 group cursor-pointer focus:outline-none"
                                onClick={$1}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $1(); } }}
                            >`);

// 3. Change the closing tag for that button to a closing div
c = c.replace(/<\/button>\n\s*<div\n\s*className=\{`grid grid-rows-\[\$\{open === wi \? '1' : '0'\}\]/g, 
`</div>\n                            <div\n                                className={\`grid grid-rows-[\${open === wi ? '1' : '0'}]\``);

// 4. White Theme Colors fixes
c = c.replace(/text-slate-300/g, 'text-slate-600');
c = c.replace(/text-slate-50/g, 'text-slate-900');
c = c.replace(/bg-\[rgba\(15,23,42,0\.6\)\] backdrop-blur-\[16px\]/g, 'bg-white shadow-xl');
c = c.replace(/border-slate-700\/50/g, 'border-slate-200');

fs.writeFileSync('components/sections/dynamic/DynamicCurriculum.tsx', c);
console.log('Restored DynamicCurriculum properly');
