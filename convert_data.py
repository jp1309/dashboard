import pandas as pd
import json
import os
import urllib.request
import ssl

# URL of the Excel file
url = "https://cdn.bancentral.gov.do/documents/entorno-internacional/documents/Serie_Historica_Spread_del_EMBI.xlsx"
file_name = "Serie_Historica_Spread_del_EMBI.xlsx"

print(f"Downloading latest data from {url}...")

try:
    # Create an unverified context to avoid SSL errors if certificates are missing
    context = ssl._create_unverified_context()
    
    # Download the file
    with urllib.request.urlopen(url, context=context) as response, open(file_name, 'wb') as out_file:
        data = response.read()
        out_file.write(data)
    print("Download successful.")
    
    file_path = file_name

    print(f"Reading from {file_path}...")

    # Read with header=1
    df = pd.read_excel(file_path, header=1)
    
    # Convert 'Fecha' to string (YYYY-MM-DD)
    if 'Fecha' in df.columns:
        df['Fecha'] = pd.to_datetime(df['Fecha'], errors='coerce').dt.strftime('%Y-%m-%d')
    
    # Drop rows where Fecha is NaT
    df = df.dropna(subset=['Fecha'])
    
    # Transform numeric columns: Multiply by 100 and round to 0 decimals
    cols_to_transform = [c for c in df.columns if c != 'Fecha']
    for col in cols_to_transform:
        # Ensure column is numeric
        df[col] = pd.to_numeric(df[col], errors='coerce')
        # Multiply by 100 and round
        df[col] = (df[col] * 100).round(0)
    
    # Save to JSON
    json_data = df.to_json(orient='records', date_format='iso')
    
    with open('data.json', 'w') as f:
        f.write(json_data)
        
    print("Successfully updated data.json")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

print("Done.")
