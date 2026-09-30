import pandas as pd
from prisma import Prisma
import asyncio
import math

def clean_val(val):
    if pd.isna(val) or val == 'nan':
        return None
    return str(val).strip()

async def main():
    db = Prisma()
    await db.connect()
    print("Connected to database")

    # Delete old records
    deleted = await db.incubator.delete_many()
    print(f"Deleted {deleted} old incubators")

    # Read excel file (skip the title row)
    df = pd.read_excel('../Startup_India_All_Incubators_v2.xlsx', skiprows=2)
    
    # Process rows
    records = []
    for _, row in df.iterrows():
        name = clean_val(row.get('Name'))
        if not name:
            continue
            
        records.append({
            'name': name,
            'logo_url': clean_val(row.get('Logo URL')),
            'description': clean_val(row.get('Description')),
            'country': clean_val(row.get('Country')),
            'state': clean_val(row.get('State')),
            'city': clean_val(row.get('City')),
            'full_address': clean_val(row.get('Full Address')),
            'pincode': clean_val(row.get('Pincode')),
            'website': clean_val(row.get('Website')),
            'contact_person': clean_val(row.get('Contact Person')),
            'contact_designation': clean_val(row.get('Contact Designation')),
            'contact_email': clean_val(row.get('Contact Email')),
            'contact_mobile': clean_val(row.get('Contact Mobile')),
            'date_of_establishment': clean_val(row.get('Date of Establishment')),
            'program_duration_months': clean_val(row.get('Program Duration (months)')),
            'no_of_current_incubatees': clean_val(row.get('No. of Current Incubatees')),
            'no_of_graduated_incubatees': clean_val(row.get('No. of Graduated Incubatees')),
            'portfolio_companies': clean_val(row.get('Portfolio Companies')),
            'industries': clean_val(row.get('Industries')),
            'sectors': clean_val(row.get('Sectors')),
            'industries_detailed': clean_val(row.get('Industries (Detailed)')),
            'sectors_detailed': clean_val(row.get('Sectors (Detailed)')),
            'stages': clean_val(row.get('Stages')),
            'preferred_stages': clean_val(row.get('Preferred Stages')),
            'is_active': True
        })

    # Insert new records in batches
    batch_size = 50
    for i in range(0, len(records), batch_size):
        batch = records[i:i+batch_size]
        await db.incubator.create_many(data=batch)
        print(f"Inserted {i+len(batch)}/{len(records)} records")

    await db.disconnect()
    print("Done!")

if __name__ == '__main__':
    asyncio.run(main())
