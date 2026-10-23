from __future__ import annotations

import json
import os
import re
from pathlib import Path


DIRS = [
    r"%APPDATA%\Codex\web\Codex\codex-browser-app\Local Storage\leveldb",
    r"%APPDATA%\Codex\web\Codex\Default\Local Storage\leveldb",
    r"%APPDATA%\Codex\web\Codex\Default\Partitions\codex-browser-app\Local Storage\leveldb",
    r"%APPDATA%\Code\Local Storage\leveldb",
    r"%APPDATA%\Code\Partitions\vscode-browser\Local Storage\leveldb",
    r"%APPDATA%\Antigravity\Local Storage\leveldb",
    r"%APPDATA%\Antigravity IDE\Local Storage\leveldb",
]

EXTRA_ROOTS = [
    r"C:\Users\wasfy\AppData\Local\Google\Chrome\User Data",
    r"C:\Users\wasfy\AppData\Local\Microsoft\Edge\User Data",
    r"C:\Users\wasfy\AppData\Local\BraveSoftware\Brave-Browser\User Data",
]


def expand(path: str) -> Path:
    for key, value in os.environ.items():
        path = path.replace(f"%{key}%", value)
    return Path(path)


def extract_objects(text: str) -> list[str]:
    objects = []
    for match in re.finditer(r'\{"scores"', text):
        start = match.start()
        depth = 0
        in_string = False
        escape = False
        for i in range(start, min(len(text), start + 300_000)):
            ch = text[i]
            if in_string:
                if escape:
                    escape = False
                elif ch == "\\":
                    escape = True
                elif ch == '"':
                    in_string = False
            else:
                if ch == '"':
                    in_string = True
                elif ch == "{":
                    depth += 1
                elif ch == "}":
                    depth -= 1
                    if depth == 0:
                        raw = text[start : i + 1]
                        try:
                            json.loads(raw)
                        except Exception:
                            pass
                        else:
                            objects.append(raw)
                        break
    return objects


def main() -> None:
    found = []
    directories = [expand(d) for d in DIRS]
    for root in [Path(p) for p in EXTRA_ROOTS]:
        if root.exists():
            directories.extend(root.rglob("Local Storage/leveldb"))
    seen = set()
    for directory in directories:
        if str(directory) in seen:
            continue
        seen.add(str(directory))
        if not directory.exists():
            continue
        print("SCAN", directory)
        for path in directory.glob("*"):
            if not path.is_file() or path.suffix.lower() not in {".log", ".ldb"}:
                continue
            data = path.read_bytes()
            if b"ypwc" not in data and b"scientific_accuracy" not in data:
                continue
            text = data.decode("utf-8", "replace")
            print("---HIT", path, "size", len(data), "scientific_accuracy_count", text.count("scientific_accuracy"))
            idx = text.find("ypwc")
            print(text[max(0, idx - 120) : idx + 1200].replace("\x00", "␀") if idx >= 0 else "")
            for raw in extract_objects(text):
                parsed = json.loads(raw)
                score_cells = sum(len(v or {}) for v in parsed.get("scores", {}).values())
                note_cells = sum(1 for v in parsed.get("notes", {}).values() if str(v).strip())
                ai_cells = sum(1 for v in parsed.get("ai", {}).values() if v)
                found.append((score_cells, note_cells, ai_cells, len(raw), str(path), raw))

    found.sort(reverse=True)
    print("OBJECTS", len(found))
    for score_cells, note_cells, ai_cells, length, path, raw in found[:30]:
        print("---OBJECT", path)
        print("score_cells", score_cells, "note_cells", note_cells, "ai_cells", ai_cells, "length", length)
        print(raw[:2000])

    if found:
        best = found[0]
        out = Path("recovered-ypwc-review-backup.json")
        out.write_text(
            json.dumps({"store": json.loads(best[5]), "source": best[4]}, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print("WROTE", out.resolve())


if __name__ == "__main__":
    main()
