const fs = require('fs');
let c = fs.readFileSync('components/layout/PromoBar.tsx', 'utf-8');

c = c.replace(/bg-\[\#0B0F19\]\/80 backdrop-blur-2xl border border-white\/10 shadow-\[0_0_40px_rgba\(99,102,241,0\.2\)\]/g, 'bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.1)]');
c = c.replace(/text-white/g, 'text-slate-900');
c = c.replace(/bg-white text-black/g, 'bg-slate-900 text-white');
c = c.replace(/bg-white\/10/g, 'bg-slate-100');
c = c.replace(/text-gray-400/g, 'text-slate-500');

fs.writeFileSync('components/layout/PromoBar.tsx', c);
console.log('Fixed PromoBar theme colors');
