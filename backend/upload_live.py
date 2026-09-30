import pandas as pd
import requests
import json
import math

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDc2NzAyM30.IM5hJrs7S8ow0PjA602Sb71V_GUU_u3BpnqCM48MVts"
API_URL = "https://foundersschool.in/api/tools/incubators/bulk"

def clean_val(val):
    if pd.isna(val) or val == 'nan':
        return ""
    if isinstance(val, float):
        if val.is_integer():
            return str(int(val))
    return str(val).strip()

def upload_live():
    file_path = r"D:\setu tss ui ux\Startup_India_All_Incubators_v2.xlsx"
    print(f"Reading Excel file: {file_path}")
    
    # Read raw without header
    df_raw = pd.read_excel(file_path, header=None)
    
    # Find the header row
    header_idx = 0
    for i, row in df_raw.iterrows():
        if 'Name' in row.values or 'S.No' in row.values:
            header_idx = i
            break
            
    print(f"Found headers at row {header_idx}")
    
    # Re-read with correct header
    df = pd.read_excel(file_path, header=header_idx)
    
    # Map exact column names from your Excel file
    column_mapping = {
        'Name': 'name',
        'Logo URL': 'logo_url',
        'Description': 'description',
        'Country': 'country',
        'State': 'state',
        'City': 'city',
        'Full Address': 'full_address',
        'Pincode': 'pincode',
        'Website': 'website',
        'Contact Person': 'contact_person',
        'Contact Designation': 'contact_designation',
        'Contact Email': 'contact_email',
        'Contact Mobile': 'contact_mobile',
        'Date of Establishment': 'date_of_establishment',
        'Program Duration (months)': 'program_duration_months',
        'No. of Current Incubatees': 'no_of_current_incubatees',
        'No. of Graduated Incubatees': 'no_of_graduated_incubatees',
        'Portfolio Companies': 'portfolio_companies',
        'Industries': 'industries',
        'Sectors': 'sectors',
        'Industries (Detailed)': 'industries_detailed',
        'Sectors (Detailed)': 'sectors_detailed',
        'Stages': 'stages',
        'Preferred Stages': 'preferred_stages'
    }
    
    items = []
    
    for _, row in df.iterrows():
        item = {}
        for excel_col, db_col in column_mapping.items():
            if excel_col in df.columns:
                item[db_col] = clean_val(row[excel_col])
        
        # Ensure 'name' is not empty
        if not item.get('name'):
            continue
            
        items.append(item)
    
    print(f"Prepared {len(items)} records. Sending to live server...")
    
    # Bulk insert might fail if payload is too large, chunking it
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
    
    chunk_size = 100
    total_uploaded = 0
    for i in range(0, len(items), chunk_size):
        chunk = items[i:i+chunk_size]
        response = requests.post(API_URL, json={"items": chunk}, headers=headers)
        if response.status_code == 200:
            total_uploaded += len(chunk)
            print(f"Uploaded {total_uploaded}/{len(items)}")
        else:
            print(f"Failed chunk: {response.status_code}")
            print(response.text)

if __name__ == "__main__":
    upload_live()
