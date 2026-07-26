const fs = require('fs');
let c = fs.readFileSync('components/sections/dynamic/DynamicFAQ.tsx', 'utf-8');

// Replace card backgrounds
c = c.replace(/bg-\[rgba\(15,23,42,0\.6\)\] backdrop-blur-\[16px\]/g, 'bg-white shadow-xl');
c = c.replace(/border-slate-700\/50/g, 'border-slate-200');

// Replace text colors
c = c.replace(/text-slate-50/g, 'text-slate-900');
c = c.replace(/text-slate-300/g, 'text-slate-600');

// Input backgrounds
c = c.replace(/bg-\[\#161e31\]/g, 'bg-slate-50');

// Floating bar theme: wait, the floating bar might be in page.tsx or DynamicPricing?
// The screenshot shows "Special Offer: Setu AI Masterclass" which is usually the fixed CTA at bottom.
// Let's check page.tsx for the floating bar.
fs.writeFileSync('components/sections/dynamic/DynamicFAQ.tsx', c);
console.log('Fixed DynamicFAQ theme colors');
