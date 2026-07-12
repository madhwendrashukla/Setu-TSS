const fs = require('fs');
const file = 'web/app/admin/events/[id]/builder/page.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\(([a-zA-Z0-9_\.\?]+)\s*\|\|\s*\[\]\)\.map/g, '(Array.isArray($1) ? $1 : []).map');
content = content.replace(/\[\.\.\.\(([a-zA-Z0-9_\.\?]+)\s*\|\|\s*\[\]\)\]/g, '[...(Array.isArray($1) ? $1 : [])]');
content = content.replace(/\[\.\.\.\(([a-zA-Z0-9_\.\?]+)\s*\|\|\s*\[\]\),/g, '[...(Array.isArray($1) ? $1 : []),');
fs.writeFileSync(file, content);
console.log('Fixed array handling in ' + file);
