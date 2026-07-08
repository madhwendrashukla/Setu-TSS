const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'app', 'fundraising-workshop-15apr');

const replacements = [
  // Card backgrounds
  { regex: /bg-\[rgba\(15,23,42,0\.6\)\]/g, replacement: "bg-white shadow-xl" },
  { regex: /backdrop-blur-\[16px\]/g, replacement: "" }, 
  
  // Section Backgrounds
  { regex: /bg-\[\#0A0F1C\]/g, replacement: "bg-slate-50" },

  // Text colors
  { regex: /text-text-primary/g, replacement: "text-slate-900" },
  { regex: /text-text-secondary/g, replacement: "text-slate-600" },

  // Borders
  { regex: /border-functional-border/g, replacement: "border-slate-200" },

  // Divides
  { regex: /divide-white\/5/g, replacement: "divide-slate-200" },

  // Form inputs specific to Contact form
  { regex: /bg-\[\#161e31\]/g, replacement: "bg-white" },
  { regex: /placeholder:text-slate-600/g, replacement: "placeholder:text-slate-400" },

  // Hovers & subtle bg
  { regex: /hover:border-white\/25/g, replacement: "hover:border-slate-300" },
  { regex: /hover:border-white\/30/g, replacement: "hover:border-slate-300" },
  { regex: /hover:bg-white\/10/g, replacement: "hover:bg-slate-100" },
  { regex: /hover:bg-white\/3/g, replacement: "hover:bg-slate-50" },
  { regex: /bg-white\/5/g, replacement: "bg-slate-50" },
  { regex: /bg-white\/10/g, replacement: "bg-slate-100" },
  { regex: /border-white\/25/g, replacement: "border-slate-200" },

  // Specific shadows
  { regex: /shadow-\[0_10px_30px_-10px_rgba\(139,92,246,0\.25\)\]/g, replacement: "shadow-xl" },
  { regex: /bg-\[\#1e293b\]/g, replacement: "bg-slate-100" }, 
  { regex: /text-\[\#94a3b8\]/g, replacement: "text-slate-400" }, 
];

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 

  files.forEach((file) => {
    if (file.endsWith('.tsx')) {
      const filePath = path.join(directoryPath, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      let newContent = content;
      replacements.forEach(rep => {
        newContent = newContent.replace(rep.regex, rep.replacement);
      });

      // Cleanup double spaces
      newContent = newContent.replace(/  +/g, ' ');

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  });
});
