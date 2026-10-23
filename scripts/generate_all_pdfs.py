import os
import subprocess
import fitz

assets_dir = r"c:\Users\wasfy\Downloads\YPWC Assets"
html_dir = os.path.join(assets_dir, "certificates")
pdf_dir = os.path.join(assets_dir, "certificates_pdf")
os.makedirs(pdf_dir, exist_ok=True)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print(f"Using browser engine: {edge_path}")

html_files = sorted([f for f in os.listdir(html_dir) if f.endswith(".html") and f.startswith("certificate_rank_")])

print(f"Found {len(html_files)} HTML certificates to convert to PDF.")

results = []

for hfile in html_files:
    in_html = os.path.join(html_dir, hfile)
    pdf_filename = hfile.replace(".html", ".pdf")
    out_pdf = os.path.join(pdf_dir, pdf_filename)
    
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={out_pdf}",
        in_html
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    if os.path.exists(out_pdf):
        size = os.path.getsize(out_pdf)
        doc = fitz.open(out_pdf)
        page_count = len(doc)
        rect = doc[0].rect
        doc.close()
        
        is_perfect = (page_count == 1) and (size > 50000)
        results.append({
            "file": pdf_filename,
            "pages": page_count,
            "size_kb": round(size / 1024, 1),
            "rect": f"{round(rect.width, 1)}x{round(rect.height, 1)}",
            "status": "PASS" if is_perfect else "FAIL"
        })
        print(f"[OK] {pdf_filename} -> {page_count} page(s), {round(size/1024, 1)} KB")
    else:
        results.append({
            "file": pdf_filename,
            "status": "NOT_FOUND"
        })
        print(f"[ERR] Failed to create {pdf_filename}")

print("\n--- SUMMARY OF ALL 10 WINNER CERTIFICATES (PDF) ---")
all_passed = True
for r in results:
    print(r)
    if r.get("status") != "PASS":
        all_passed = False

if all_passed:
    print("\nSUCCESS: All 10 certificates were successfully converted to single-page, high-fidelity PDFs!")
else:
    print("\nWARNING: Some certificates did not pass validation.")
