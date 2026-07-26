const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'web', 'app', 'AI-workshop-15may');
const destDir = path.join(__dirname, 'web', 'components', 'sections', 'dynamic');

function migrate(srcFile, destFile, functionName, dataExtractStr) {
    console.log(`Migrating ${srcFile}...`);
    let content = fs.readFileSync(path.join(srcDir, srcFile), 'utf-8');
    
    // Remove all top-level const arrays or objects that are mock data
    // We basically strip everything between imports and the export function!
    content = content.replace(/(import .*?;[\r\n]+)+(const .*?= .*?[\r\n]+)?(?=export function)/s, (match) => {
        // keep imports
        const imports = match.match(/import .*?;/g) || [];
        return imports.join('\n') + '\n\n';
    });

    // Replace the function signature
    const originalFunc = srcFile.replace('.tsx', '');
    content = content.replace(`export function ${originalFunc}() {`, `export function ${functionName}({ data }: { data: any }) {\n    if (!data) return null;\n    ${dataExtractStr}`);

    fs.writeFileSync(path.join(destDir, destFile), content);
    console.log(`Saved ${destFile}`);
}

migrate('AIWorkshopCurriculum.tsx', 'DynamicCurriculum.tsx', 'DynamicCurriculum', 'const workshops = data.workshops || [];');
migrate('AIWorkshopSchedule.tsx', 'DynamicSchedule.tsx', 'DynamicSchedule', 'const tabs = data.tabs || [];');
migrate('AIWorkshopMentors.tsx', 'DynamicMentors.tsx', 'DynamicMentors', 'const mentors = data.mentors || [];');
migrate('AIWorkshopOutcomes.tsx', 'DynamicOutcomes.tsx', 'DynamicOutcomes', 'const toolkits = data.toolkits || []; const audience = data.audience || [];');
migrate('AIWorkshopTestimonials.tsx', 'DynamicTestimonials.tsx', 'DynamicTestimonials', 'const testimonials = data.testimonials || [];');
migrate('AIWorkshopStoryline.tsx', 'DynamicStoryline.tsx', 'DynamicStoryline', 'const stories = data.stories || [];');
migrate('AIWorkshopPricing.tsx', 'DynamicPricing.tsx', 'DynamicPricing', 'const tickets = data.tickets || []; const guarantee = data.guarantee || {};');
migrate('AIWorkshopFinal.tsx', 'DynamicFAQ.tsx', 'DynamicFAQ', 'const faqs = data.faqs || [];');

console.log("Migration complete!");
