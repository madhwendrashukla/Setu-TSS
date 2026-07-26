import fitz
import re
import psycopg2

print("Parsing PDF...")
doc = fitz.open("../grants and scheme/77a5d438-b239-4ec1-a539-d08804635b0b.pdf")
text = ""
for page in doc:
    text += page.get_text()

splits = re.split(r"\n\d+\.\s+", text)
splits.pop(0)

print(f"Found {len(splits)} schemes.")

# Update this with your DB connection string
DATABASE_URL = "postgres://postgres:postgres@localhost:5432/db"

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("DELETE FROM grants")
    
    for chunk in splits:
        title = chunk.split("\n")[0].strip()
        ministry = re.search(r"Ministry:\s*(.+)", chunk)
        sectors = re.search(r"Sectors:\s*(.+)", chunk)
        brief = re.search(r"Brief:\s*([\s\S]+?)(?:Eligibility Criteria:|Benefits:|Benefit Tags:)", chunk)
        eligibility = re.search(r"Eligibility Criteria:\s*([\s\S]+?)(?:Benefits:|Benefit Tags:|Quantum/Size)", chunk)
        benefits = re.search(r"Benefits:\s*([\s\S]+?)(?:Benefit Tags:|Quantum/Size|Tenure:|Notes:|Apply:)", chunk)
        benefitTags = re.search(r"Benefit Tags:\s*(.+)", chunk)
        quantum = re.search(r"Quantum/Size of Fund:\s*([\s\S]+?)(?:Tenure:|Notes:|Apply:)", chunk)
        tenure = re.search(r"Tenure:\s*(.+)", chunk)
        link = re.search(r"Apply:\s*(.+)", chunk)
        
        cur.execute("""
            INSERT INTO grants (id, title, ministry, sectors, description, eligibility, benefits, "benefitTags", amount, tenure, link, is_active, created_at)
            VALUES (gen_random_uuid(), %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, true, NOW())
        """, (
            title,
            ministry.group(1).strip() if ministry else "",
            sectors.group(1).strip() if sectors else "",
            brief.group(1).strip().replace("\n", " ") if brief else "",
            eligibility.group(1).strip().replace("\n", " ") if eligibility else "",
            benefits.group(1).strip().replace("\n", " ") if benefits else "",
            benefitTags.group(1).strip() if benefitTags else "",
            quantum.group(1).strip().replace("\n", " ") if quantum else "",
            tenure.group(1).strip() if tenure else "",
            link.group(1).strip() if link else ""
        ))
        
    conn.commit()
    print("Database seeded successfully!")
except Exception as e:
    print("Error:", e)
finally:
    if 'conn' in locals():
        conn.close()

