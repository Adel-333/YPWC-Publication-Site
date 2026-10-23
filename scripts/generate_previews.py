import os
import base64

assets_dir = r"c:\Users\wasfy\Downloads\YPWC Assets"
emails_dir = os.path.join(assets_dir, "emails")
winner_template_path = os.path.join(emails_dir, "email-winner-top10.html")
participant_template_path = os.path.join(emails_dir, "email-participant.html")

club_logo_path = os.path.join(assets_dir, "public", "assets", "club-shield-transparent.png")
ypwc_logo_path = os.path.join(assets_dir, "public", "assets", "ypwc-logo-360.png")

with open(club_logo_path, "rb") as f:
    club_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

with open(ypwc_logo_path, "rb") as f:
    ypwc_b64 = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

with open(winner_template_path, "r", encoding="utf-8") as f:
    winner_html = f.read()

with open(participant_template_path, "r", encoding="utf-8") as f:
    participant_html = f.read()

winner_preview = winner_html.replace('src="cid:club-shield"', f'src="{club_b64}"').replace('src="cid:ypwc-logo"', f'src="{ypwc_b64}"')
participant_preview = participant_html.replace('src="cid:club-shield"', f'src="{club_b64}"').replace('src="cid:ypwc-logo"', f'src="{ypwc_b64}"')

# Top 10 sample
sample_winner = winner_preview
sample_winner = sample_winner.replace("{{PARTICIPANT_NAME}}", "Adham Mohamed Khairy")
sample_winner = sample_winner.replace("{{RANK}}", "1")
sample_winner = sample_winner.replace("{{MEDAL}}", "Gold")
sample_winner = sample_winner.replace("{{MEDAL_COLOR}}", "#FFD700")
sample_winner = sample_winner.replace("{{ARTICLE_TITLE}}", "From Ketchup to Oobleck: Non-Newtonian Fluids and Their Behavior")
sample_winner = sample_winner.replace("{{CERTIFICATE_URL}}", "https://ypwc.octoberstem.org/certificates/download?id=ypwc-002")
sample_winner = sample_winner.replace("{{LEADERBOARD_URL}}", "https://ypwc.octoberstem.org/leaderboard")

with open(os.path.join(emails_dir, "preview-winner-sample.html"), "w", encoding="utf-8") as f:
    f.write(sample_winner)

# Non-winner sample
sample_participant = participant_preview
sample_participant = sample_participant.replace("{{PARTICIPANT_NAME}}", "Mennatallah Mahmoud Khedr")
sample_participant = sample_participant.replace("{{ARTICLE_TITLE}}", "Should You Run in the Rain?")
sample_participant = sample_participant.replace("{{LEADERBOARD_URL}}", "https://ypwc.octoberstem.org/leaderboard")

with open(os.path.join(emails_dir, "preview-participant-sample.html"), "w", encoding="utf-8") as f:
    f.write(sample_participant)

print("Updated preview-winner-sample.html and preview-participant-sample.html in emails/")
