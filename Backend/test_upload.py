from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking files inside resources bucket...")

try:
    files = (
        supabase.storage
        .from_("resources")
        .list("test")
    )

    print("\nFiles found:")

    if not files:
        print("NO FILES FOUND")
    else:
        for file in files:
            print(file)

except Exception as e:
    print("\nERROR:")
    print(e)