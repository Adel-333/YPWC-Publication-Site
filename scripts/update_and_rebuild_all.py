import os
import json
import shutil
import subprocess
import fitz

assets_dir = r"c:\Users\wasfy\Downloads\YPWC Assets"
asset_data_dir = os.path.join(assets_dir, "scripts", "assets")

with open(os.path.join(asset_data_dir, "logos_b64.json"), "r") as f:
    logos = json.load(f)

club_b64 = "data:image/png;base64," + logos["club"]
ypwc_b64 = "data:image/png;base64," + logos["ypwc"]

# 1. Generate updated certificate-template.html
template_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YPWC Certificate</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Herr+Von+Muellerhoff&family=Allura&display=swap" rel="stylesheet">
  <style>
    @page {{
      size: A4 landscape;
      margin: 0;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      background-color: #03060B;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }}
    @media print {{
      body {{
        background: #070D18 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }}
      .cert-frame {{
        box-shadow: none !important;
        border: none !important;
      }}
    }}

    .font-palatino {{
      font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif;
    }}
    .font-helvetica {{
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }}
    
    .font-sig-adel {{
      font-family: 'Alex Brush', cursive;
    }}
    .font-sig-seddik {{
      font-family: 'Herr Von Muellerhoff', cursive;
    }}
    .font-sig-ammar {{
      font-family: 'Allura', cursive;
    }}

    .cert-frame {{
      width: 1122px;
      height: 793px;
      background: linear-gradient(180deg, #0B1626 0%, #070D18 100%);
      color: #D3DCE8;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }}
  </style>
</head>
<body>

  <div class="cert-frame">
    
    <!-- 1. Enlarged 620px Watermark YPWC Logo in Center Background -->
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:620px;height:620px;pointer-events:none;opacity:0.045;z-index:1;">
      <img src="{ypwc_b64}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;" />
    </div>

    <!-- 2. Prominent White Physical Wave Contours (Left & Right) -->
    <svg style="position:absolute;top:0;left:0;width:340px;height:100%;pointer-events:none;opacity:0.18;z-index:2;" viewBox="0 0 340 793" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-80 0 C 140 160, 50 340, 200 490 C 270 580, 160 680, 240 793" stroke="#FFFFFF" stroke-width="2.2" />
      <path d="M-60 0 C 160 180, 70 360, 220 510 C 290 600, 180 700, 260 793" stroke="#FFFFFF" stroke-width="1.8" />
      <path d="M-40 0 C 180 200, 90 380, 240 530 C 310 620, 200 720, 280 793" stroke="#FFFFFF" stroke-width="1.5" />
      <path d="M-20 0 C 200 220, 110 400, 260 550 C 330 640, 220 740, 300 793" stroke="#FFFFFF" stroke-width="1.2" />
      <path d="M0 0 C 220 240, 130 420, 280 570 C 350 660, 240 760, 320 793" stroke="#FFFFFF" stroke-width="0.9" />
      <path d="M20 0 C 240 260, 150 440, 300 590 C 370 680, 260 780, 340 793" stroke="#FFFFFF" stroke-width="0.7" />
    </svg>

    <svg style="position:absolute;top:0;right:0;width:340px;height:100%;pointer-events:none;opacity:0.18;z-index:2;" viewBox="0 0 340 793" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M420 0 C 200 160, 290 340, 140 490 C 70 580, 180 680, 100 793" stroke="#FFFFFF" stroke-width="2.2" />
      <path d="M400 0 C 180 180, 270 360, 120 510 C 50 600, 160 700, 80 793" stroke="#FFFFFF" stroke-width="1.8" />
      <path d="M380 0 C 160 200, 250 380, 100 530 C 30 620, 140 720, 60 793" stroke="#FFFFFF" stroke-width="1.5" />
      <path d="M360 0 C 140 220, 230 400, 80 550 C 10 640, 120 740, 40 793" stroke="#FFFFFF" stroke-width="1.2" />
      <path d="M340 0 C 120 240, 210 420, 60 570 C -10 660, 100 760, 20 793" stroke="#FFFFFF" stroke-width="0.9" />
      <path d="M320 0 C 100 260, 190 440, 40 590 C -30 680, 80 780, 0 793" stroke="#FFFFFF" stroke-width="0.7" />
    </svg>

    <!-- Classical Borders -->
    <div style="position:absolute;inset:14px;border:1px solid #22334A;pointer-events:none;z-index:3;"></div>
    <div style="position:absolute;inset:18px;border:2px solid #2F4462;pointer-events:none;z-index:3;"></div>
    <div style="position:absolute;inset:22px;border:1px solid #22334A;pointer-events:none;z-index:3;"></div>

    <!-- Classical Corner Accents -->
    <div style="position:absolute;top:26px;left:26px;width:14px;height:14px;border-top:2px solid #9FB2CC;border-left:2px solid #9FB2CC;pointer-events:none;z-index:3;"></div>
    <div style="position:absolute;top:26px;right:26px;width:14px;height:14px;border-top:2px solid #9FB2CC;border-right:2px solid #9FB2CC;pointer-events:none;z-index:3;"></div>
    <div style="position:absolute;bottom:26px;left:26px;width:14px;height:14px;border-bottom:2px solid #9FB2CC;border-left:2px solid #9FB2CC;pointer-events:none;z-index:3;"></div>
    <div style="position:absolute;bottom:26px;right:26px;width:14px;height:14px;border-bottom:2px solid #9FB2CC;border-right:2px solid #9FB2CC;pointer-events:none;z-index:3;"></div>

    <!-- Layout Container -->
    <div style="position:relative;z-index:10;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:26px 64px 22px;">
      
      <!-- ━━━ 1. HEADER ━━━ -->
      <div style="text-align:center;">
        
        <!-- Logopair with Silver Line -->
        <div style="display:inline-flex;align-items:center;justify-content:center;gap:16px;margin-bottom:4px;">
          <img src="{club_b64}" alt="Physics Club Shield" style="width:42px;height:42px;object-fit:contain;display:block;" />
          <div style="width:1.5px;height:28px;background-color:#9FB2CC;"></div>
          <img src="{ypwc_b64}" alt="YPWC Logo" style="width:42px;height:42px;object-fit:contain;display:block;" />
        </div>

        <!-- Top HRule -->
        <div style="width:100%;height:1px;background-color:#5C9EFF;margin:2px 0 5px;"></div>

        <!-- Title -->
        <h1 class="font-helvetica" style="font-size:20.5px;font-weight:700;color:#FFFFFF;letter-spacing:1px;text-transform:uppercase;margin:0 0 1px;">
          Youth Physics Writing Contest
        </h1>

        <!-- Subtitle -->
        <div class="font-helvetica" style="font-size:10.5px;color:#9FB2CC;letter-spacing:2px;text-transform:uppercase;">
          Physics Club Magazine | October STEM School
        </div>

        <!-- Bottom HRule -->
        <div style="width:100%;height:1px;background-color:#5C9EFF;margin:5px 0 7px;"></div>

        <!-- Designation -->
        <div class="font-helvetica" style="font-size:10px;font-weight:700;letter-spacing:3.5px;text-transform:uppercase;color:#5C9EFF;">
          Official Academic Certificate of Merit | Top 10 Finalist
        </div>
      </div>

      <!-- ━━━ 2. MAIN BODY (RECIPIENT 62px, CITATION 20.5px) ━━━ -->
      <div style="text-align:center;margin:0 0 1px;">
        
        <div class="font-palatino" style="font-style:italic;font-size:14.5px;color:#9FB2CC;margin-bottom:1px;">
          This is to officially certify that
        </div>

        <!-- Recipient Name (62px as calibrated) -->
        <div class="font-palatino" style="font-size:62px;font-weight:700;color:#FFFFFF;line-height:1.08;letter-spacing:0.5px;text-shadow:0 2px 10px rgba(0,0,0,0.7);margin:0 0 1px;">
          {{{{PARTICIPANT_NAME}}}}
        </div>

        <!-- School -->
        <div class="font-helvetica" style="font-size:12.5px;font-weight:600;color:#5C9EFF;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">
          {{{{SCHOOL_NAME}}}}
        </div>

        <!-- Award Statement (20.5px as calibrated) -->
        <div class="font-palatino" style="font-size:20.5px;color:#D3DCE8;max-width:960px;margin:0 auto;line-height:1.62;">
          has achieved <span style="color:#FFFFFF;font-weight:700;letter-spacing:0.5px;">Rank #{{{{RANK}}}}</span> among the premier entries nationwide in the Youth Physics Writing Contest. In recognition of exceptional physical reasoning, rigorous conceptual mastery, and engaging scientific exposition, the submission has been formally selected by the editorial committee for publication in the Physics Club Magazine for the feature article:
        </div>

        <!-- Article Title -->
        <div class="font-palatino" style="font-style:italic;font-size:22px;font-weight:700;color:#FFFFFF;max-width:940px;margin:6px auto;line-height:1.3;text-shadow:0 1px 4px rgba(0,0,0,0.5);">
          &ldquo;{{{{ARTICLE_TITLE}}}}&rdquo;
        </div>

        <!-- Track -->
        <div style="margin-top:6px;">
          <span class="font-helvetica" style="font-size:10px;letter-spacing:2px;color:#9FB2CC;border:1px solid #22334A;background-color:#070D18;padding:2px 15px;border-radius:4px;display:inline-block;text-transform:uppercase;">
            <strong style="color:#FFFFFF;font-weight:700;">{{{{TRACK}}}}</strong>
          </span>
        </div>

      </div>

      <!-- ━━━ 3. BALANCED 3-COLUMN HORIZON (QR LEFT | ID CENTER | MEDAL RIGHT) ━━━ -->
      <div style="padding:3px 0 5px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <!-- LEFT: Direct Link & QR Code to the Certificate Verification Tab -->
            <td style="width:33.33%;vertical-align:middle;text-align:left;padding-left:10px;">
              <div style="display:inline-flex;align-items:center;gap:12px;">
                <a href="https://ypwc.octphysicsclub.org/certificates?id={{{{CERT_ID}}}}" target="_blank" style="text-decoration:none;display:block;">
                  <img src="{{{{QR_CODE_B64}}}}" alt="Certificate Verification QR" style="width:70px;height:70px;border:2px solid #2A3D5A;border-radius:5px;display:block;box-shadow:0 4px 12px rgba(0,0,0,0.6);" />
                </a>
                <div class="font-helvetica" style="text-align:left;">
                  <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#8F9EB2;">Online Verification</div>
                  <div style="font-size:10.5px;font-weight:700;letter-spacing:0.5px;color:#5C9EFF;margin-top:2px;">Scan to Verify</div>
                </div>
              </div>
            </td>

            <!-- CENTER: Official Certificate ID & Citation Badge -->
            <td style="width:33.33%;vertical-align:middle;text-align:center;">
              <div style="display:inline-flex;flex-direction:column;align-items:center;background-color:#0B1524;border:1px solid #22334A;padding:7px 20px;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.5);">
                <span class="font-helvetica" style="font-size:8px;letter-spacing:2px;color:#8F9EB2;text-transform:uppercase;margin-bottom:2px;">
                  Official Certificate ID
                </span>
                <span class="font-helvetica" style="font-size:13.5px;font-weight:800;letter-spacing:2px;color:#FFFFFF;text-transform:uppercase;">
                  {{{{CERT_ID}}}}
                </span>
              </div>
            </td>

            <!-- RIGHT: Hollow-Core Medal (#Rank inside, 70px) at the exact same horizontal level -->
            <td style="width:33.33%;vertical-align:middle;text-align:right;padding-right:10px;">
              <div style="display:inline-flex;align-items:center;justify-content:flex-end;gap:12px;">
                <div class="font-helvetica" style="text-align:right;">
                  <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#8F9EB2;">Leaderboard Status</div>
                  <div style="font-size:11.5px;font-weight:800;letter-spacing:1px;color:#FFFFFF;margin-top:2px;">TOP 10 FINALIST</div>
                </div>
                <!-- The Medal (70px, Double Rim: Blue & Grey, Hollow Core) -->
                <div style="position:relative;width:70px;height:70px;display:inline-block;">
                  <svg style="position:absolute;top:50px;left:50%;transform:translateX(-50%);width:42px;height:24px;pointer-events:none;" viewBox="0 0 44 26">
                    <path d="M11 0 L0 26 L18 19 L18 0 Z" fill="#22334A" opacity="0.9" />
                    <path d="M33 0 L44 26 L26 19 L26 0 Z" fill="#182536" opacity="0.9" />
                  </svg>
                  <div style="position:absolute;inset:0;border-radius:50%;background:transparent;border:2.5px solid #9FB2CC;box-shadow:0 0 0 2px #5C9EFF, 0 4px 14px rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;">
                    <div style="width:54px;height:54px;border-radius:50%;border:1px dashed #5C9EFF;display:flex;align-items:center;justify-content:center;background:transparent;">
                      <span class="font-helvetica" style="font-size:25px;font-weight:900;color:#FFFFFF;line-height:1;text-shadow:0 2px 8px rgba(0,0,0,0.9);letter-spacing:-1px;">#{{{{RANK}}}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- ━━━ 4. THE 3 INDIVIDUAL SIGNATURES ━━━ -->
      <div style="padding-top:5px;border-top:1px solid #22334A;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <!-- 1. Magazine Manager, Founder -->
            <td style="width:33.33%;vertical-align:bottom;text-align:center;">
              <div style="display:inline-block;text-align:center;">
                <div class="font-sig-adel" style="font-size:35px;color:#FFFFFF;line-height:1;margin-bottom:-4px;transform:rotate(-2deg);filter:drop-shadow(0 1px 3px rgba(0,0,0,0.6));">
                  Adel Wasfy
                </div>
                <div style="width:175px;border-bottom:1px solid #9FB2CC;margin:0 auto 4px;"></div>
                <div class="font-palatino" style="font-size:12.5px;font-weight:700;color:#FFFFFF;letter-spacing:0.5px;">
                  Adel Wasfy
                </div>
                <div class="font-helvetica" style="font-size:9px;text-transform:uppercase;letter-spacing:1.2px;color:#8F9EB2;margin-top:1px;">
                  Magazine Manager, Founder
                </div>
              </div>
            </td>

            <!-- 2. President -->
            <td style="width:33.33%;vertical-align:bottom;text-align:center;">
              <div style="display:inline-block;text-align:center;">
                <div class="font-sig-seddik" style="font-size:45px;color:#FFFFFF;line-height:0.85;margin-bottom:-2px;transform:rotate(-1deg);filter:drop-shadow(0 1px 3px rgba(0,0,0,0.6));">
                  Ahmed Seddik
                </div>
                <div style="width:175px;border-bottom:1px solid #9FB2CC;margin:0 auto 4px;"></div>
                <div class="font-palatino" style="font-size:12.5px;font-weight:700;color:#FFFFFF;letter-spacing:0.5px;">
                  Ahmed Seddik
                </div>
                <div class="font-helvetica" style="font-size:9px;text-transform:uppercase;letter-spacing:1.2px;color:#8F9EB2;margin-top:1px;">
                  President
                </div>
              </div>
            </td>

            <!-- 3. Vice President -->
            <td style="width:33.33%;vertical-align:bottom;text-align:center;">
              <div style="display:inline-block;text-align:center;">
                <div class="font-sig-ammar" style="font-size:37px;color:#FFFFFF;line-height:0.95;margin-bottom:-4px;transform:rotate(-2.5deg);filter:drop-shadow(0 1px 3px rgba(0,0,0,0.6));">
                  Ammar Hesham
                </div>
                <div style="width:175px;border-bottom:1px solid #9FB2CC;margin:0 auto 4px;"></div>
                <div class="font-palatino" style="font-size:12.5px;font-weight:700;color:#FFFFFF;letter-spacing:0.5px;">
                  Ammar Hesham
                </div>
                <div class="font-helvetica" style="font-size:9px;text-transform:uppercase;letter-spacing:1.2px;color:#8F9EB2;margin-top:1px;">
                  Vice President
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>

    </div>

  </div>

</body>
</html>
"""

template_path = os.path.join(assets_dir, "certificates", "certificate-template.html")
with open(template_path, "w", encoding="utf-8") as f:
    f.write(template_content)

print("1. certificate-template.html updated with unique QR code placeholders.")

# 2. Re-generate all 10 HTML certificates with unique QR codes
with open(os.path.join(assets_dir, "scripts", "generate_all_certificates.py"), "r", encoding="utf-8") as f:
    exec(f.read(), {"__name__": "__main__"})

print("2. All 10 HTML certificates re-generated with unique QR codes.")

# 3. Update certificate-calibrator.html defaults
calibrator_path = os.path.join(assets_dir, "certificates", "certificate-calibrator.html")
if os.path.exists(calibrator_path):
    with open(calibrator_path, "r", encoding="utf-8") as f:
        cal_content = f.read()

    cal_content = cal_content.replace('id="nameVal">52px</span>', 'id="nameVal">62px</span>')
    cal_content = cal_content.replace('value="52" id="nameSlider"', 'value="62" id="nameSlider"')
    cal_content = cal_content.replace('id="citeVal">17.5px</span>', 'id="citeVal">20.5px</span>')
    cal_content = cal_content.replace('value="17.5" id="citeSlider"', 'value="20.5" id="citeSlider"')

    with open(calibrator_path, "w", encoding="utf-8") as f:
        f.write(cal_content)
    print("3. certificate-calibrator.html updated.")

# 4. Batch convert to PDF
with open(os.path.join(assets_dir, "scripts", "generate_all_pdfs.py"), "r", encoding="utf-8") as f:
    exec(f.read(), {"__name__": "__main__"})

print("4. All 10 certificates converted to PDF.")

# 5. Sync both PDF and HTML to public/certificates/
pub_cert_dir = os.path.join(assets_dir, "public", "certificates")
pub_pdf_dir = os.path.join(pub_cert_dir, "pdf")
pub_html_dir = os.path.join(pub_cert_dir, "html")

os.makedirs(pub_pdf_dir, exist_ok=True)
os.makedirs(pub_html_dir, exist_ok=True)

src_pdf_dir = os.path.join(assets_dir, "certificates_pdf")
src_html_dir = os.path.join(assets_dir, "certificates")

for i in range(1, 11):
    prefix = f"certificate_rank_{i:02d}_"
    # PDF
    for f in os.listdir(src_pdf_dir):
        if f.startswith(prefix) and f.endswith(".pdf"):
            src = os.path.join(src_pdf_dir, f)
            shutil.copy2(src, os.path.join(pub_pdf_dir, f))
            shutil.copy2(src, os.path.join(pub_pdf_dir, f"YPWC-2026-{i:02d}.pdf"))
    # HTML
    for f in os.listdir(src_html_dir):
        if f.startswith(prefix) and f.endswith(".html"):
            src = os.path.join(src_html_dir, f)
            shutil.copy2(src, os.path.join(pub_html_dir, f))
            shutil.copy2(src, os.path.join(pub_html_dir, f"YPWC-2026-{i:02d}.html"))

print("5. Certificates successfully synced to public/certificates/")
