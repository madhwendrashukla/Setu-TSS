const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '..', 'web', 'app', 'admin');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // 1. Replace const API = process.env.NEXT_PUBLIC_API_URL... with const API = "";
            content = content.replace(/const API = process\.env\.NEXT_PUBLIC_API_URL[^;]*;/g, 'const API = "";');
            
            // 2. Replace `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/ with `/api/
            content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*['"][^'"]+['"]\}\/api\//g, '/api/');
            
            // 3. Replace `${process.env.NEXT_PUBLIC_API_URL || ''}/api/ with `/api/
            content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*['"]['"]\}\/api\//g, '/api/');
            
            // 4. Replace `${process.env.NEXT_PUBLIC_API_URL}/api/ with `/api/
            content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\}\/api\//g, '/api/');

            // 5. Replace `process.env.NEXT_PUBLIC_API_URL || ''` with `''`
            content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*['"]['"]/g, "''");

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${path.relative(adminDir, fullPath)}`);
            }
        }
    }
}

processDir(adminDir);
console.log("Admin API cleanup completed.");
