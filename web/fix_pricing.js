const fs = require('fs');

let c = fs.readFileSync('components/sections/dynamic/DynamicPricing.tsx', 'utf-8');

// Replace the hardcoded CTA buttons
const ctaMatch = /\{\/\* CTA Button - direct, no reveal \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\)\)\}/;

c = c.replace(ctaMatch, `{/* CTA Button - direct, no reveal */}
 <div className="mt-auto w-full">
 {data.event_status && !data.event_status.is_past && plan.razorpayLink ? (
 plan.isFeatured ? (
 <div className="relative w-full group">
 <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
 <a
 href={plan.razorpayLink}
 target="_blank"
 rel="noopener noreferrer"
 className="relative w-full block text-center px-4 py-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold transition-all text-base shadow-xl"
 >
 Enroll Now
 </a>
 </div>
 ) : (
 <a
 href={plan.razorpayLink}
 target="_blank"
 rel="noopener noreferrer"
 className="w-full block text-center px-4 py-3.5 rounded-xl text-slate-900 font-bold transition-all text-sm border-2 border-[#8b5cf6] bg-white hover:bg-slate-50 shadow-md"
 >
 Enroll Now
 </a>
 )
 ) : (
 <>
 {plan.isFeatured ? (
 <div className="relative w-full">
 <span
 className="relative w-full block text-center px-4 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-900/50 font-bold transition-all text-base cursor-not-allowed"
 >
 Sold Out
 </span>
 </div>
 ) : (
 <span
 className="w-full block text-center px-4 py-3.5 rounded-xl text-slate-900/50 font-bold transition-all text-sm border border-slate-200 bg-slate-100 cursor-not-allowed"
 >
 Sold Out
 </span>
 )}
 <p className="text-[10px] text-slate-500 mt-2 text-center">Registrations Closed</p>
 </>
 )}
 </div>
 </div>
 ))}`);

// Replace the bottom footer text
c = c.replace(/<div className="text-center mt-8 text-xs md:text-sm text-slate-500 font-medium">\s*<i className="fa-solid fa-ban text-\[\#8b5cf6\]" \/> Registrations are now closed\s*<\/div>/, `{(!data.event_status || data.event_status.is_past) && (
 <div className="text-center mt-8 text-xs md:text-sm text-slate-500 font-medium">
 <i className="fa-solid fa-ban text-[#8b5cf6]" /> Registrations are now closed
 </div>
)}`);

fs.writeFileSync('components/sections/dynamic/DynamicPricing.tsx', c);
console.log('Fixed DynamicPricing');
