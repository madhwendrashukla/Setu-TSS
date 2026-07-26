const fs = require('fs');

let c = fs.readFileSync('components/sections/dynamic/DynamicFAQ.tsx', 'utf-8');

// 1. Fix the dark background on the section
c = c.replace(/bg-\[\#0A0F1C\]/g, 'bg-slate-50');

// 2. Fix the dark background inside the final CTA gradient
c = c.replace(/rgba\(15,23,42,0\.95\)/g, 'rgba(255,255,255,0.95)');
c = c.replace(/border-white\/8/g, 'border-slate-200');

// 3. Fix the "Registrations Closed" buttons (first one)
const button1Match = /<span className="inline-flex items-center gap-3 px-12 py-5 rounded-xl font-extrabold text-slate-900\/50 text-lg bg-slate-100 border border-slate-200 cursor-not-allowed">\s*Registrations Closed\s*<\/span>/g;
c = c.replace(button1Match, `{data.event_status && !data.event_status.is_past && data.event_status.url ? (
 <a href={data.event_status.url} className="inline-flex items-center gap-3 px-12 py-5 rounded-xl font-extrabold text-white text-lg bg-slate-900 border border-slate-700 shadow-xl hover:scale-105 transition-transform">
 Enroll Now
 </a>
 ) : (
 <span className="inline-flex items-center gap-3 px-12 py-5 rounded-xl font-extrabold text-slate-900/50 text-lg bg-slate-100 border border-slate-200 cursor-not-allowed">
 Registrations Closed
 </span>
 )}`);

// 4. Fix the "Registrations Closed" buttons (second one)
const button2Match = /<span\s*className="relative group w-full sm:w-auto inline-flex items-center justify-center gap-2\.5 px-10 py-4 md:px-12 md:py-5 rounded-2xl font-bold text-base md:text-lg text-slate-900\/50 bg-slate-100 border border-slate-200 cursor-not-allowed"\s*>\s*<span className="relative">Registrations Closed<\/span>\s*<\/span>/g;
c = c.replace(button2Match, `{data.event_status && !data.event_status.is_past && data.event_status.url ? (
 <a href={data.event_status.url} className="relative group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 md:px-12 md:py-5 rounded-2xl font-bold text-base md:text-lg text-white bg-slate-900 border border-slate-700 shadow-xl hover:scale-105 transition-transform">
 Enroll Now
 </a>
 ) : (
 <span className="relative group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 md:px-12 md:py-5 rounded-2xl font-bold text-base md:text-lg text-slate-900/50 bg-slate-100 border border-slate-200 cursor-not-allowed">
 <span className="relative">Registrations Closed</span>
 </span>
 )}`);

fs.writeFileSync('components/sections/dynamic/DynamicFAQ.tsx', c);
console.log('Fixed DynamicFAQ');
