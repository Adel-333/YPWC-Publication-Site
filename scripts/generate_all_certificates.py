import os
import json
import io
import base64
import qrcode

assets_dir = r"c:\Users\wasfy\Downloads\YPWC Assets"
output_dir = os.path.join(assets_dir, "certificates")
os.makedirs(output_dir, exist_ok=True)

with open(os.path.join(assets_dir, "certificates", "certificate-template.html"), "r", encoding="utf-8") as f:
    template = f.read()

winners = [
    {
        "rank": 1,
        "name": "Abdullah Shaker Abdullah",
        "school": "STEM 6-October for Boys",
        "title": "The Arrow in the Coffee Cup: How Entropy Gives Time Its Direction",
        "track": "Thermodynamics",
        "certId": "YPWC-2026-01"
    },
    {
        "rank": 2,
        "name": "Adham Mohamed Khairy",
        "school": "STEM High School for Boys - 6th of October",
        "title": "From Ketchup to Oobleck: Non-Newtonian Fluids and Their Behavior",
        "track": "Fluid Mechanics",
        "certId": "YPWC-2026-02"
    },
    {
        "rank": 3,
        "name": "Kenzy Raafat Eltablawy",
        "school": "Menofia STEM School",
        "title": "GPS & Relativity",
        "track": "Physics in Daily Life",
        "certId": "YPWC-2026-03"
    },
    {
        "rank": 4,
        "name": "Somaya Yasser ElSawaf",
        "school": "STEM Gharbiya",
        "title": "The Physics of Microwaves: Why Metal Sparks and Water Dances Inside Your Kitchen",
        "track": "Physics in Daily Life",
        "certId": "YPWC-2026-04"
    },
    {
        "rank": 5,
        "name": "Malak",
        "school": "Alexandria STEM School",
        "title": "Can Sound Become Electricity? Turning Everyday Vibrations into Energy",
        "track": "Waves and Sound",
        "certId": "YPWC-2026-05"
    },
    {
        "rank": 6,
        "name": "Abdelrahman Ehab Abdelrahman",
        "school": "STEM October High-School for Boys",
        "title": "Entropy and time reverse",
        "track": "Thermodynamics",
        "certId": "YPWC-2026-06"
    },
    {
        "rank": 7,
        "name": "Lina Eslam Reda Elanbary",
        "school": "Ismailia STEM High School",
        "title": "Heatwaves and urban heat island",
        "track": "Thermodynamics",
        "certId": "YPWC-2026-07"
    },
    {
        "rank": 8,
        "name": "Saber Hussein Zahran",
        "school": "STEM Alex",
        "title": "Why Does Sound Travel Differently Through Different Materials?",
        "track": "Waves and Sound",
        "certId": "YPWC-2026-08"
    },
    {
        "rank": 9,
        "name": "Omnia Emad",
        "school": "Temai Elamdid Language School",
        "title": "How can MRI and Magnet see inside the body And the physics behind MRI?",
        "track": "Electricity and Magnetism",
        "certId": "YPWC-2026-09"
    },
    {
        "rank": 10,
        "name": "Hager Yahia Zakaria Elsayed",
        "school": "الرسمية المتميزة بالعاصمة الإدارية",
        "title": "The concept of relative velocity",
        "track": "Mechanics",
        "certId": "YPWC-2026-10"
    }
]

def make_qr_b64(cert_id):
    url = f"https://ypwc.octphysicsclub.org/certificates?id={cert_id}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="white", back_color="#070D18")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

def generate():
    for w in winners:
        c = template
        c = c.replace("{{PARTICIPANT_NAME}}", w["name"])
        c = c.replace("{{SCHOOL_NAME}}", w["school"])
        c = c.replace("{{RANK}}", str(w["rank"]))
        c = c.replace("{{ARTICLE_TITLE}}", w["title"])
        c = c.replace("{{TRACK}}", w["track"])
        c = c.replace("{{CERT_ID}}", w["certId"])
        c = c.replace("{{QR_CODE_B64}}", make_qr_b64(w["certId"]))
        
        filename = f"certificate_rank_{w['rank']:02d}_{w['name'].replace(' ', '_')}.html"
        filepath = os.path.join(output_dir, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(c)
        print(f"Generated {filename}")

if __name__ == "__main__":
    generate()
    print("All 10 certificates generated successfully in certificates/ folder.")
