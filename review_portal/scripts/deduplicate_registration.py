from __future__ import annotations

import argparse
import shutil
from pathlib import Path

import pandas as pd
from openpyxl import load_workbook


def normalize_text(value: object) -> str:
    if pd.isna(value):
        return ""
    return " ".join(str(value).strip().lower().split())


def main() -> None:
    parser = argparse.ArgumentParser(description="Keep only the latest YPWC registration per participant.")
    parser.add_argument("--input", default=r"C:\Users\wasfy\Downloads\_YPWC registration (2).xlsx")
    parser.add_argument("--sheet", default="Registrations 2026")
    parser.add_argument("--backup", default=r"C:\Users\wasfy\Downloads\_YPWC registration (2).backup-before-dedup.xlsx")
    parser.add_argument("--copy", default="YPWC registration deduped.xlsx")
    args = parser.parse_args()

    input_path = Path(args.input)
    backup_path = Path(args.backup)
    copy_path = Path(args.copy)

    df = pd.read_excel(input_path, sheet_name=args.sheet)
    timestamps = pd.to_datetime(df["Timestamp"], errors="coerce")
    keys = []
    for _, row in df.iterrows():
        email = normalize_text(row.get("Email"))
        name = normalize_text(row.get("Full Name"))
        keys.append(email or name)

    working = df.copy()
    working["_key"] = keys
    working["_timestamp"] = timestamps

    latest_indices = set(
        working.sort_values(["_key", "_timestamp", "Timestamp"])
        .groupby("_key", dropna=False)
        .tail(1)
        .index
    )
    delete_indices = [index for index in working.index if index not in latest_indices]

    if not backup_path.exists():
        shutil.copy2(input_path, backup_path)

    workbook = load_workbook(input_path)
    sheet = workbook[args.sheet]
    for index in sorted(delete_indices, reverse=True):
        sheet.delete_rows(index + 2)
    workbook.save(input_path)
    shutil.copy2(input_path, copy_path)

    print(f"Original rows: {len(df)}")
    print(f"Deleted older duplicate rows: {len(delete_indices)}")
    print(f"Remaining rows: {len(df) - len(delete_indices)}")
    print(f"Backup: {backup_path}")
    print(f"Clean copy: {copy_path.resolve()}")


if __name__ == "__main__":
    main()
