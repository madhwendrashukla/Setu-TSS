import requests
import json
import pandas as pd

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwMTQzNWZlLTc5ZWQtNDM2ZC04MTVjLTk4YTI5NGVkNGI4NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc5MDc2NzAyM30.IM5hJrs7S8ow0PjA602Sb71V_GUU_u3BpnqCM48MVts"

def test_upload():
    # We will just try to create a dummy record with the old and new schema fields combined
    # to see how the server responds.
    payload = {
        "name": "Test Incubator",
        "location": "Mumbai",
        "focus": ["Fintech"],
        "programLength": "6 Months",
        "equityTaken": "5%",
        "website": "https://test.com",
        # New fields
        "city": "Mumbai",
        "contact_person": "John Doe"
    }

    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }

    print("Sending POST request to live API...")
    response = requests.post("https://foundersschool.in/api/tools/incubators", json=payload, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_upload()
