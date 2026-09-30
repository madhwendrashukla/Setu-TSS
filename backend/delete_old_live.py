import requests
import json

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDc2NzAyM30.IM5hJrs7S8ow0PjA602Sb71V_GUU_u3BpnqCM48MVts"

def clear_old_incubators():
    headers = {
        "Authorization": f"Bearer {TOKEN}"
    }

    # Fetch all
    response = requests.get("https://foundersschool.in/api/tools/incubators?all=true", headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"Found {len(data)} incubators. Deleting...")
        for item in data:
            del_resp = requests.delete(f"https://foundersschool.in/api/tools/incubators/{item['id']}", headers=headers)
            print(f"Deleted {item['name']}: {del_resp.status_code}")
    else:
        print("Failed to fetch.")

if __name__ == "__main__":
    clear_old_incubators()
