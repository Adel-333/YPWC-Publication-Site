from __future__ import annotations

import json
import os
import re
from pathlib import Path


TERMS = [
    b"ypwc-review",
    b"ypwc-static-review",
    b"scientific_accuracy",
    b"ypwc-001",
]


def candidate_files(root: Path):
    for path in root.rglob("*"):
        try:
            if not path.is_file() or path.stat().st_size > 50_000_000:
                continue
        except OSError:
            continue
        if path.suffix.lower() in {".log", ".ldb", ".json", ".sqlite", ".db"}:
            yield path
        elif path.name in {"CURRENT", "LOG", "LOG.old", "Local State", "Preferences"}:
            yield path
        elif path.name.startswith("MANIFEST"):
            yield path


def extract_json_objects(text: str) -> list[str]:
    starts = [m.start() for m in re.finditer(r'\{"scores"', text)]
    objects: list[str] = []
    for start in starts:
        depth = 0
        in_string = False
        escape = False
        for index in range(start, min(len(text), start + 300_000)):
            char = text[index]
            if in_string:
                if escape:
                    escape = False
                elif char == "\\":
                    escape = True
                elif char == '"':
                    in_string = False
            else:
                if char == '"':
                    in_string = True
                elif char == "{":
                    depth += 1
                elif char == "}":
                    depth -= 1
                    if depth == 0:
                        raw = text[start : index + 1]
                        try:
                            json.loads(raw)
                        except Exception:
                            pass
                        else:
                            objects.append(raw)
                        break
    return objects


def main() -> None:
    roots = [Path(os.environ["LOCALAPPDATA"]), Path(os.environ["APPDATA"])]
    hits = []
    best_objects = []

    for root in roots:
        for path in candidate_files(root):
            try:
                data = path.read_bytes()
            except OSError:
                continue
            if not any(term in data for term in TERMS):
                continue
            text = data.decode("utf-8", "replace")
            objects = extract_json_objects(text)
            for raw in objects:
                parsed = json.loads(raw)
                score_cells = sum(len(v or {}) for v in parsed.get("scores", {}).values())
                note_cells = sum(1 for v in parsed.get("notes", {}).values() if str(v).strip())
                ai_cells = sum(1 for v in parsed.get("ai", {}).values() if v)
                best_objects.append(
                    {
                        "path": str(path),
                        "raw": raw,
                        "score_cells": score_cells,
                        "note_cells": note_cells,
                        "ai_cells": ai_cells,
                        "length": len(raw),
                    }
                )
            idx = text.find("ypwc")
            hits.append(
                {
                    "path": str(path),
                    "size": len(data),
                    "score_term_count": text.count("scientific_accuracy"),
                    "objects": len(objects),
                    "context": text[max(0, idx - 160) : idx + 1200] if idx >= 0 else "",
                }
            )

    best_objects.sort(
        key=lambda item: (item["score_cells"], item["note_cells"], item["ai_cells"], item["length"]),
        reverse=True,
    )

    print(f"HITS {len(hits)}")
    for hit in hits[:100]:
        print("---PATH", hit["path"])
        print("SIZE", hit["size"], "score_term_count", hit["score_term_count"], "objects", hit["objects"])
        print(hit["context"].replace("\x00", "␀")[:1600])

    print("BEST_OBJECTS", len(best_objects))
    for item in best_objects[:20]:
        print("---OBJECT", item["path"])
        print("score_cells", item["score_cells"], "note_cells", item["note_cells"], "ai_cells", item["ai_cells"], "length", item["length"])
        print(item["raw"][:2000])

    if best_objects:
        out = Path("recovered-ypwc-review-backup.json")
        out.write_text(
            json.dumps({"store": json.loads(best_objects[0]["raw"]), "source": best_objects[0]["path"]}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print("WROTE", out.resolve())


if __name__ == "__main__":
    main()
