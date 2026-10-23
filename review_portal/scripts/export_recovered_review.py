from __future__ import annotations

import csv
import json
import re
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "ypwc-review.html"
BACKUP_PATH = ROOT / "recovered-ypwc-review-backup.json"
CSV_PATH = ROOT / "recovered-ypwc-review-results.csv"
RECOVERED_HTML_PATH = ROOT / "ypwc-review-recovered.html"


def load_payload() -> dict:
    html = HTML_PATH.read_text(encoding="utf-8")
    match = re.search(
        r'<script id="ypwc-payload" type="application/json">(.*?)</script>',
        html,
        re.S,
    )
    if not match:
        raise RuntimeError("Could not find ypwc payload in ypwc-review.html")
    return json.loads(match.group(1))


def total_for(entry_id: str, store: dict, rubric: list[dict]) -> float:
    scores = store.get("scores", {}).get(entry_id, {})
    return sum(float(scores.get(item["key"], 0) or 0) for item in rubric)


def is_excluded(entry_id: str, store: dict) -> bool:
    ai = store.get("ai", {}).get(entry_id, {})
    return (
        store.get("statuses", {}).get(entry_id) == "Excluded"
        or bool(ai.get("used"))
        or float(ai.get("percentage", 0) or 0) > 0
    )


def medal_for(index: int, medal_count: int) -> str:
    if index >= medal_count:
        return ""
    gold = round(medal_count * 0.5)
    silver = round(medal_count * 0.3)
    if index < gold:
        return "Gold"
    if index < gold + silver:
        return "Silver"
    return "Bronze"


def ranked_rows(entries: list[dict], store: dict, rubric: list[dict]) -> list[dict]:
    rows = []
    for entry in entries:
        entry_id = entry["id"]
        ai = {"used": False, "percentage": 0, "note": ""}
        ai.update(store.get("ai", {}).get(entry_id, {}))
        rows.append(
            {
                "entry": entry,
                "total": total_for(entry_id, store, rubric),
                "status": store.get("statuses", {}).get(entry_id, "Not started"),
                "ai": ai,
                "excluded": is_excluded(entry_id, store),
            }
        )

    eligible = sorted(
        [row for row in rows if not row["excluded"]],
        key=lambda row: (-row["total"], row["entry"]["fullName"]),
    )
    excluded = sorted(
        [row for row in rows if row["excluded"]],
        key=lambda row: (-row["total"], row["entry"]["fullName"]),
    )
    medal_count = (len(entries) + 2) // 3
    for index, row in enumerate(eligible):
        row["rank"] = index + 1
        row["medal"] = medal_for(index, medal_count)
    for row in excluded:
        row["rank"] = "EX"
        row["medal"] = ""
    return eligible + excluded


def export_csv(payload: dict, store: dict) -> None:
    rubric = payload["rubric"]
    headers = [
        "Rank",
        "Medal",
        "Status",
        "Excluded",
        "AI Used",
        "AI Percent",
        "AI Notes",
        "Total",
        *[item["label"] for item in rubric],
        "Name",
        "School",
        "Grade",
        "Topic",
        "Title",
        "Email",
        "Article File",
        "Source File",
        "Notes",
    ]
    with CSV_PATH.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        for row in ranked_rows(payload["entries"], store, rubric):
            entry = row["entry"]
            entry_id = entry["id"]
            scores = store.get("scores", {}).get(entry_id, {})
            writer.writerow(
                [
                    row["rank"],
                    row["medal"],
                    row["status"],
                    "Yes" if row["excluded"] else "No",
                    "Yes" if row["ai"].get("used") else "No",
                    row["ai"].get("percentage", 0),
                    row["ai"].get("note", ""),
                    row["total"],
                    *[scores.get(item["key"], 0) or 0 for item in rubric],
                    entry.get("fullName", ""),
                    entry.get("school", ""),
                    entry.get("grade", ""),
                    entry.get("topic", ""),
                    entry.get("title", ""),
                    entry.get("email", ""),
                    entry.get("articleFile", ""),
                    entry.get("sourceFileLink", ""),
                    store.get("notes", {}).get(entry_id, ""),
                ]
            )


def export_recovered_html(store: dict) -> None:
    html = HTML_PATH.read_text(encoding="utf-8")
    preload = json.dumps(store, ensure_ascii=False)
    script = f"""
  <script>
    (function () {{
      const recoveredStore = {preload};
      try {{
        localStorage.setItem("ypwc-static-review-workbench-v1", JSON.stringify(recoveredStore));
      }} catch (error) {{
        console.warn("Could not preload recovered YPWC review data", error);
      }}
    }})();
  </script>
"""
    html = html.replace("</body>", script + "</body>")
    RECOVERED_HTML_PATH.write_text(html, encoding="utf-8")


def main() -> None:
    payload = load_payload()
    backup = json.loads(BACKUP_PATH.read_text(encoding="utf-8"))
    store = backup["store"]
    export_csv(payload, store)
    export_recovered_html(store)
    print("recovered_at", datetime.now(timezone.utc).isoformat())
    print("score_cells", sum(len(v or {}) for v in store.get("scores", {}).values()))
    print("statuses", len(store.get("statuses", {})))
    print("ai_flags", len(store.get("ai", {})))
    print("wrote", CSV_PATH)
    print("wrote", RECOVERED_HTML_PATH)


if __name__ == "__main__":
    main()
