import json
import os
import ssl
import sys
import time
import urllib.request
from datetime import date

import pandas as pd

# URL of the Excel file
url = "https://cdn.bancentral.gov.do/documents/entorno-internacional/documents/Serie_Historica_Spread_del_EMBI.xlsx"
file_name = "Serie_Historica_Spread_del_EMBI.xlsx"
output_file = "data.json"
required_columns = ["Fecha", "Ecuador"]
max_attempts = 4
# Días hábiles sin datos nuevos antes de marcar la serie como desactualizada
stale_business_days = 3


def download(target):
    # Create an unverified context to avoid SSL errors if certificates are missing
    context = ssl._create_unverified_context()
    for attempt in range(1, max_attempts + 1):
        try:
            download_url = f"{url}?v={int(time.time())}"
            request = urllib.request.Request(download_url, headers={"Cache-Control": "no-cache"})
            with urllib.request.urlopen(request, context=context, timeout=60) as response:
                data = response.read()
            if len(data) < 1000:
                raise ValueError(f"Downloaded file is too small ({len(data)} bytes)")
            with open(target, "wb") as out_file:
                out_file.write(data)
            print(f"Download successful ({len(data)} bytes).")
            return
        except Exception as e:
            print(f"Attempt {attempt}/{max_attempts} failed: {e}")
            if attempt == max_attempts:
                raise
            time.sleep(2 ** attempt)


def load_existing():
    if not os.path.exists(output_file):
        return []
    with open(output_file) as f:
        return json.load(f)


def write_summary(lines):
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        with open(summary_path, "a") as f:
            f.write("\n".join(lines) + "\n")


print(f"Downloading latest data from {url}...")

try:
    download(file_name)

    print(f"Reading from {file_name}...")
    # Read with header=1
    df = pd.read_excel(file_name, header=1)

    missing = [c for c in required_columns if c not in df.columns]
    if missing:
        raise ValueError(f"Missing expected columns in source: {missing}. Columns found: {list(df.columns)}")

    # Convert 'Fecha' to string (YYYY-MM-DD) and drop rows without a date
    df["Fecha"] = pd.to_datetime(df["Fecha"], errors="coerce").dt.strftime("%Y-%m-%d")
    df = df.dropna(subset=["Fecha"])
    if df.empty:
        raise ValueError("Source file has no dated rows")

    # Transform numeric columns: Multiply by 100 and round to 0 decimals
    for col in [c for c in df.columns if c != "Fecha"]:
        df[col] = (pd.to_numeric(df[col], errors="coerce") * 100).round(0)

    latest_source = df["Fecha"].max()
    print(f"Latest source date: {latest_source}")

    # Guardas: no reemplazar data.json por una versión más corta o más antigua
    existing = load_existing()
    if existing:
        latest_existing = max(r["Fecha"] for r in existing)
        print(f"Latest date in {output_file}: {latest_existing}")
        if latest_source < latest_existing:
            raise ValueError(f"Source latest date {latest_source} is older than current data {latest_existing}")
        if len(df) < len(existing) * 0.95:
            raise ValueError(f"Source has {len(df)} rows vs {len(existing)} currently; refusing to shrink the series")

    with open(output_file, "w") as f:
        f.write(df.to_json(orient="records", date_format="iso"))
    print(f"Successfully updated {output_file}")

    last_row = df.loc[df["Fecha"] == latest_source].iloc[-1]
    lag = len(pd.bdate_range(latest_source, date.today())) - 1
    summary = [
        "### EMBI data",
        f"- Último dato en la fuente: **{latest_source}**",
        f"- Ecuador: **{last_row['Ecuador']:.0f} pb**",
        f"- Días hábiles de rezago: {lag}",
    ]
    if lag > stale_business_days:
        # Anotación visible en Actions sin marcar el job como fallido
        print(f"::warning::Source data is stale: latest date {latest_source} ({lag} business days old)")
        summary.append(f"- ⚠️ La fuente lleva {lag} días hábiles sin datos nuevos")
    write_summary(summary)

except Exception as e:
    print(f"::error::EMBI update failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("Done.")
