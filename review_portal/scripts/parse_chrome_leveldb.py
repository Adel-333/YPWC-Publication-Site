from __future__ import annotations

import json
import struct
from pathlib import Path


MAGIC = 0xDB4775248B80FB57


def read_varint(data: bytes, offset: int) -> tuple[int, int]:
    result = 0
    shift = 0
    while True:
        byte = data[offset]
        offset += 1
        result |= (byte & 0x7F) << shift
        if byte < 0x80:
            return result, offset
        shift += 7


def read_block_handle(data: bytes, offset: int) -> tuple[tuple[int, int], int]:
    block_offset, offset = read_varint(data, offset)
    size, offset = read_varint(data, offset)
    return (block_offset, size), offset


def parse_block(block: bytes) -> list[tuple[bytes, bytes]]:
    if len(block) < 4:
        return []
    restart_count = struct.unpack_from("<I", block, len(block) - 4)[0]
    restart_offset = len(block) - 4 - restart_count * 4
    if restart_offset < 0:
        return []
    entries = []
    offset = 0
    last_key = b""
    while offset < restart_offset:
        shared, offset = read_varint(block, offset)
        non_shared, offset = read_varint(block, offset)
        value_len, offset = read_varint(block, offset)
        key_delta = block[offset : offset + non_shared]
        offset += non_shared
        value = block[offset : offset + value_len]
        offset += value_len
        key = last_key[:shared] + key_delta
        entries.append((key, value))
        last_key = key
    return entries


def snappy_decompress(data: bytes) -> bytes:
    expected, offset = read_varint(data, 0)
    out = bytearray()
    while offset < len(data):
        tag = data[offset]
        offset += 1
        kind = tag & 0x03
        if kind == 0:
            length = tag >> 2
            if length < 60:
                length += 1
            else:
                extra = length - 59
                length = int.from_bytes(data[offset : offset + extra], "little") + 1
                offset += extra
            out.extend(data[offset : offset + length])
            offset += length
        elif kind == 1:
            length = ((tag >> 2) & 0x7) + 4
            copy_offset = ((tag & 0xE0) << 3) | data[offset]
            offset += 1
            for _ in range(length):
                out.append(out[-copy_offset])
        elif kind == 2:
            length = (tag >> 2) + 1
            copy_offset = int.from_bytes(data[offset : offset + 2], "little")
            offset += 2
            for _ in range(length):
                out.append(out[-copy_offset])
        else:
            length = (tag >> 2) + 1
            copy_offset = int.from_bytes(data[offset : offset + 4], "little")
            offset += 4
            for _ in range(length):
                out.append(out[-copy_offset])
    if len(out) != expected:
        raise ValueError(f"snappy length mismatch: expected {expected}, got {len(out)}")
    return bytes(out)


def read_table(path: Path) -> list[tuple[bytes, bytes]]:
    data = path.read_bytes()
    if len(data) < 48:
        return []
    magic = struct.unpack_from("<Q", data, len(data) - 8)[0]
    if magic != MAGIC:
        print("unexpected magic", hex(magic))
    footer = data[-48:-8]
    meta_handle, pos = read_block_handle(footer, 0)
    index_handle, _ = read_block_handle(footer, pos)

    def block_with_trailer(handle: tuple[int, int]) -> bytes:
        offset, size = handle
        trailer = data[offset + size : offset + size + 5]
        compression = trailer[0] if trailer else 0
        raw = data[offset : offset + size]
        if compression == 1:
            return snappy_decompress(raw)
        if compression != 0:
            print("compressed block unsupported", compression, path)
            return b""
        return raw

    entries = []
    index_entries = parse_block(block_with_trailer(index_handle))
    for _, handle_value in index_entries:
        try:
            handle, _ = read_block_handle(handle_value, 0)
        except Exception:
            continue
        entries.extend(parse_block(block_with_trailer(handle)))
    return entries


def main() -> None:
    root = Path(r"C:\Users\wasfy\AppData\Local\Google\Chrome\User Data\Profile 1\Local Storage\leveldb")
    all_entries = []
    for path in sorted(root.glob("*.ldb")):
        try:
            entries = read_table(path)
        except Exception as exc:
            print("ERR", path, exc)
            continue
        for key, value in entries:
            if b"ypwc" in key or b"ypwc" in value or b"scientific_accuracy" in value:
                all_entries.append((path, key, value))

    print("MATCHES", len(all_entries))
    best = None
    best_score = -1
    for path, key, value in all_entries:
        print("---", path)
        print("KEY", key.decode("utf-8", "replace"))
        text = value.decode("utf-8", "replace").lstrip("\x00\x01")
        print("VALUE", text[:3000])
        if text.startswith("{"):
            try:
                parsed = json.loads(text)
            except Exception:
                continue
            score = sum(len(v or {}) for v in parsed.get("scores", {}).values())
            if score > best_score:
                best = (path, parsed)
                best_score = score

    if best:
        out = Path("recovered-ypwc-review-backup.json")
        out.write_text(json.dumps({"store": best[1], "source": str(best[0])}, ensure_ascii=False, indent=2), encoding="utf-8")
        print("WROTE", out.resolve(), "score_cells", best_score)


if __name__ == "__main__":
    main()
