from __future__ import annotations

import argparse
import json
from pathlib import Path

import pandas as pd


RUBRIC = [
    {
        "key": "scientific_accuracy",
        "label": "Scientific accuracy and conceptual understanding",
        "max": 30,
        "description": "Facts, concepts, assumptions and limits are handled correctly.",
    },
    {
        "key": "physical_reasoning",
        "label": "Physical reasoning and analysis",
        "max": 20,
        "description": "Claims follow logically and numbers or examples are used honestly.",
    },
    {
        "key": "clarity_structure",
        "label": "Clarity, structure and communication",
        "max": 20,
        "description": "The article is organized, readable and precise for a curious nonspecialist.",
    },
    {
        "key": "creativity",
        "label": "Creativity and intellectual contribution",
        "max": 15,
        "description": "The piece has an original angle and clear independent thinking.",
    },
    {
        "key": "real_world_connection",
        "label": "Real-world connection",
        "max": 10,
        "description": "The physics is applied correctly to a real situation outside the classroom.",
    },
    {
        "key": "research_references",
        "label": "Research and references",
        "max": 5,
        "description": "Sources are reliable, useful and traceable.",
    },
]


def clean(value: object) -> str | None:
    if pd.isna(value):
        return None
    text = str(value).strip()
    return text or None


def load_entries(path: Path) -> list[dict[str, str | None]]:
    df = pd.read_excel(path, sheet_name="Registrations 2026")
    entries = []
    for index, row in df.iterrows():
        entries.append(
            {
                "id": f"ypwc-{index + 1:03d}",
                "timestamp": clean(row.get("Timestamp")),
                "fullName": clean(row.get("Full Name")),
                "school": clean(row.get("School")),
                "email": clean(row.get("Email")),
                "grade": clean(row.get("Grade")),
                "topic": clean(row.get("Chosen Topic")),
                "title": clean(row.get("Article Title")),
                "pitch": clean(row.get("Article Pitch")),
                "sourceFileLink": clean(row.get("Source File Link")),
                "publicationRights": clean(row.get("Publication Rights")),
                "articleFile": clean(row.get("Article File")),
                "articleImage": clean(row.get("Article Image")),
            }
        )
    return entries


def render_html(entries: list[dict[str, str | None]], source_path: Path) -> str:
    payload = {
        "sourceFile": str(source_path),
        "generatedFrom": source_path.name,
        "entries": entries,
        "rubric": RUBRIC,
    }

    data_json = (
        json.dumps(payload, ensure_ascii=False)
        .replace("&", "\\u0026")
        .replace("<", "\\u003c")
        .replace(">", "\\u003e")
    )

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>YPWC Review Workbench</title>
  <style>
    :root {{
      color-scheme: dark;
      --bg: #0c1118;
      --panel: #121a25;
      --panel-2: #0f1620;
      --line: rgba(255, 255, 255, 0.1);
      --line-2: rgba(255, 255, 255, 0.16);
      --text: #f8fbff;
      --muted: rgba(248, 251, 255, 0.62);
      --soft: rgba(248, 251, 255, 0.42);
      --blue: #1473e6;
      --sky: #8dd3ff;
      --green: #86efac;
      --teal: #2dd4bf;
      --gold: #fbbf24;
      --rose: #fda4af;
      --radius: 8px;
    }}
    * {{ box-sizing: border-box; }}
    html {{ scroll-behavior: smooth; }}
    body {{
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 18% -8%, rgba(20, 115, 230, 0.22), transparent 30rem),
        radial-gradient(circle at 96% 12%, rgba(45, 212, 191, 0.12), transparent 26rem),
        var(--bg);
      color: var(--text);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }}
    button, input, select, textarea {{ font: inherit; }}
    button {{ cursor: pointer; }}
    a {{ color: inherit; text-decoration: none; }}
    .shell {{ max-width: 1540px; margin: 0 auto; padding: 20px; }}
    .topbar {{
      position: sticky;
      top: 0;
      z-index: 20;
      border-bottom: 1px solid var(--line);
      background: rgba(12, 17, 24, 0.9);
      backdrop-filter: blur(18px);
    }}
    .topbar-inner {{
      max-width: 1540px;
      margin: 0 auto;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }}
    .brand {{ min-width: 0; display: flex; align-items: center; gap: 12px; }}
    .logo {{
      width: 46px;
      height: 46px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: linear-gradient(145deg, rgba(20, 115, 230, 0.28), rgba(255, 255, 255, 0.05));
      display: grid;
      place-items: center;
      font-weight: 800;
      color: var(--sky);
    }}
    .eyebrow {{ margin: 0; color: var(--sky); font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; }}
    h1 {{ margin: 2px 0 0; font-size: clamp(22px, 3vw, 34px); line-height: 1.1; }}
    .actions {{ display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }}
    .btn {{
      min-height: 40px;
      border: 1px solid var(--line-2);
      border-radius: 7px;
      background: rgba(255, 255, 255, 0.045);
      color: var(--text);
      padding: 9px 12px;
      font-weight: 750;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
    }}
    .btn:hover {{ transform: translateY(-1px); background: rgba(255, 255, 255, 0.075); border-color: rgba(141, 211, 255, 0.45); }}
    .btn.primary {{ border-color: transparent; background: var(--blue); }}
    .btn.primary:hover {{ background: #2e8cff; }}
    .metrics {{ display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin: 18px 0; }}
    .metric {{ border: 1px solid var(--line); border-radius: var(--radius); background: rgba(255,255,255,0.04); padding: 14px; }}
    .metric span {{ color: var(--muted); font-size: 13px; }}
    .metric strong {{ display: block; margin-top: 4px; font-size: 28px; }}
    .metric small {{ display: block; margin-top: 4px; color: var(--soft); }}
    .grid {{ display: grid; grid-template-columns: minmax(360px, 0.9fr) minmax(0, 1.35fr); gap: 16px; align-items: start; }}
    .panel {{ border: 1px solid var(--line); border-radius: var(--radius); background: rgba(18, 26, 37, 0.96); overflow: hidden; }}
    .filters {{ padding: 14px; border-bottom: 1px solid var(--line); }}
    .filter-row {{ display: grid; grid-template-columns: 1fr 145px; gap: 10px; }}
    .filter-row + .filter-row {{ grid-template-columns: 1fr 1fr 135px; margin-top: 10px; }}
    input, select, textarea {{
      width: 100%;
      border: 1px solid var(--line-2);
      border-radius: 7px;
      background: rgba(255,255,255,0.045);
      color: var(--text);
      outline: none;
    }}
    input, select {{ min-height: 42px; padding: 0 11px; }}
    textarea {{ min-height: 116px; padding: 11px; resize: vertical; line-height: 1.55; }}
    input:focus, select:focus, textarea:focus {{ border-color: rgba(141, 211, 255, 0.75); box-shadow: 0 0 0 3px rgba(20,115,230,0.16); }}
    option {{ background: #111827; }}
    .checkbox {{ display: flex; align-items: center; gap: 8px; min-height: 42px; border: 1px solid var(--line-2); border-radius: 7px; padding: 0 11px; color: var(--muted); }}
    .checkbox input {{ width: 16px; min-height: auto; accent-color: var(--blue); }}
    .list-head, .row {{
      min-width: 760px;
      display: grid;
      grid-template-columns: 66px 1.25fr 0.8fr 82px 104px;
      gap: 10px;
      align-items: center;
    }}
    .list-head {{ padding: 10px 14px; color: var(--soft); font-size: 11px; font-weight: 850; letter-spacing: 0.13em; text-transform: uppercase; border-bottom: 1px solid var(--line); }}
    .list {{ max-height: calc(100vh - 256px); overflow: auto; }}
    .row {{
      width: 100%;
      border: 0;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      background: transparent;
      color: var(--text);
      padding: 12px 14px;
      text-align: left;
    }}
    .row:hover, .row.active {{ background: rgba(20,115,230,0.12); }}
    .truncate {{ min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }}
    .subtle {{ color: var(--muted); font-size: 13px; }}
    .scorebar {{ height: 6px; margin-top: 5px; border-radius: 999px; overflow: hidden; background: rgba(255,255,255,0.1); }}
    .scorebar i {{ display: block; height: 100%; border-radius: inherit; background: var(--teal); }}
    .status {{ display: inline-block; border-radius: 6px; padding: 5px 7px; font-size: 12px; font-weight: 800; text-align: center; }}
    .status.not {{ background: rgba(255,255,255,0.055); color: rgba(255,255,255,0.48); }}
    .status.review {{ background: rgba(20,115,230,0.18); color: var(--sky); }}
    .status.done {{ background: rgba(34,197,94,0.14); color: var(--green); }}
    .status.short {{ background: rgba(245,158,11,0.14); color: var(--gold); }}
    .status.excluded {{ background: rgba(248,113,113,0.15); color: #fca5a5; }}
    .detail-head {{ padding: 18px; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 1fr 132px; gap: 16px; }}
    .meta {{ color: var(--muted); font-size: 13px; }}
    .title-input {{ margin-top: 8px; min-height: auto; padding: 5px 7px; border-color: transparent; background: transparent; font-size: clamp(24px, 3vw, 34px); font-weight: 800; line-height: 1.12; }}
    .edit-grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }}
    .mini-label {{ display: block; margin-bottom: 5px; color: var(--soft); font-size: 11px; font-weight: 850; letter-spacing: 0.12em; text-transform: uppercase; }}
    .rankbox {{ border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel-2); padding: 13px; text-align: center; }}
    .rankbox strong {{ display: block; font-size: 34px; }}
    .detail-body {{ display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 16px; padding: 16px; }}
    .card {{ border: 1px solid var(--line); border-radius: var(--radius); background: var(--panel-2); padding: 14px; }}
    .card h2 {{ margin: 0 0 12px; font-size: 18px; display: flex; align-items: center; gap: 8px; }}
    .rubric-head {{ display: flex; justify-content: space-between; gap: 10px; align-items: center; margin-bottom: 12px; }}
    .rubric-head h2 {{ margin: 0; }}
    .criterion {{ border: 1px solid var(--line); border-radius: 7px; background: rgba(255,255,255,0.035); padding: 12px; margin-top: 10px; }}
    .criterion-top {{ display: grid; grid-template-columns: 1fr 98px; gap: 10px; }}
    .criterion strong {{ display: block; }}
    .criterion p {{ margin: 5px 0 0; color: var(--muted); font-size: 13px; line-height: 1.55; }}
    .criterion input {{ text-align: right; font-size: 18px; font-weight: 850; }}
    .data-line {{ margin-top: 12px; }}
    .pitch {{ margin-top: 12px; border: 1px solid var(--line); border-radius: 7px; background: rgba(255,255,255,0.035); padding: 12px; color: rgba(255,255,255,0.76); line-height: 1.65; }}
    .link-grid {{ display: grid; gap: 8px; margin-top: 12px; }}
    .link {{ min-height: 38px; border: 1px solid var(--line-2); border-radius: 7px; padding: 9px 10px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; }}
    .link.disabled {{ opacity: 0.35; pointer-events: none; }}
    .ai-grid {{ display: grid; grid-template-columns: 1fr 120px; gap: 10px; align-items: end; }}
    .ai-check {{ min-height: 42px; display: flex; align-items: center; gap: 9px; border: 1px solid var(--line-2); border-radius: 7px; background: rgba(255,255,255,0.04); padding: 0 11px; font-weight: 800; }}
    .ai-check input {{ width: 16px; min-height: auto; accent-color: #ef4444; }}
    .top-five {{ display: grid; gap: 8px; }}
    .top-five button {{ display: grid; grid-template-columns: 42px 1fr 42px; gap: 10px; align-items: center; border: 1px solid var(--line); border-radius: 7px; background: rgba(255,255,255,0.035); color: var(--text); padding: 10px; text-align: left; }}
    .top-five button:hover {{ background: rgba(255,255,255,0.07); }}
    .pill {{ border-radius: 7px; background: rgba(20,115,230,0.18); color: var(--sky); padding: 9px 0; text-align: center; font-weight: 850; }}
    .checks {{ display: grid; gap: 10px; color: var(--muted); font-size: 14px; }}
    .check.done {{ color: rgba(255,255,255,0.8); }}
    .toast {{ position: fixed; right: 18px; bottom: 18px; z-index: 50; display: none; border: 1px solid rgba(141,211,255,0.35); border-radius: 8px; background: #101722; padding: 12px 14px; box-shadow: 0 20px 70px rgba(0,0,0,0.4); }}
    .toast.show {{ display: block; }}
    @media (max-width: 1100px) {{
      .grid, .detail-body {{ grid-template-columns: 1fr; }}
      .list {{ max-height: 520px; }}
    }}
    @media (max-width: 760px) {{
      .topbar-inner {{ align-items: stretch; flex-direction: column; }}
      .actions {{ justify-content: flex-start; }}
      .metrics, .filter-row, .filter-row + .filter-row, .detail-head, .edit-grid {{ grid-template-columns: 1fr; }}
      .shell {{ padding: 12px; }}
    }}
  </style>
</head>
<body>
  <script id="ypwc-payload" type="application/json">{data_json}</script>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand">
        <div class="logo">Y</div>
        <div>
          <p class="eyebrow">Review workbench</p>
          <h1>Young Physics Writing Contest</h1>
        </div>
      </div>
      <div class="actions">
        <button class="btn" id="exportCsv">Export CSV</button>
        <button class="btn" id="exportBackup">Backup JSON</button>
        <button class="btn primary" id="importBackup">Import Backup</button>
        <input id="backupInput" type="file" accept="application/json,.json" hidden />
      </div>
    </div>
  </header>

  <main class="shell">
    <section class="metrics" id="metrics"></section>
    <section class="grid">
      <aside class="panel">
        <div class="filters">
          <div class="filter-row">
            <input id="query" placeholder="Search name, school, topic, article..." />
            <select id="sortMode">
              <option value="rank">Rank</option>
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="topic">Topic</option>
            </select>
          </div>
          <div class="filter-row">
            <select id="topicFilter"></select>
            <select id="statusFilter">
              <option>All statuses</option>
              <option>Not started</option>
              <option>In review</option>
              <option>Done</option>
              <option>Shortlisted</option>
            </select>
            <label class="checkbox"><input id="missingOnly" type="checkbox" /> Missing file</label>
          </div>
        </div>
        <div class="list-head">
          <span>Rank</span><span>Article</span><span>Topic</span><span>Score</span><span>Status</span>
        </div>
        <div class="list" id="entryList"></div>
      </aside>
      <section class="panel" id="detail"></section>
    </section>
  </main>
  <div class="toast" id="toast"></div>

  <script>
    const payload = JSON.parse(document.getElementById("ypwc-payload").textContent);
    const entries = payload.entries;
    const rubric = payload.rubric;
    const storageKey = "ypwc-static-review-workbench-v1";
    const statuses = ["Not started", "In review", "Done", "Shortlisted", "Excluded"];
    let selectedId = entries[0]?.id || "";
    let store = loadStore();

    const $ = (id) => document.getElementById(id);
    const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({{ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }}[char]));
    const totalScore = (scores = {{}}) => rubric.reduce((sum, item) => sum + Number(scores[item.key] || 0), 0);
    const wordCount = (value) => value && value.trim() ? value.trim().split(/\\s+/).length : 0;

    function loadStore() {{
      try {{
        return Object.assign({{ scores: {{}}, notes: {{}}, statuses: {{}}, edits: {{}}, ai: {{}} }}, JSON.parse(localStorage.getItem(storageKey) || "{{}}"));
      }} catch {{
        return {{ scores: {{}}, notes: {{}}, statuses: {{}}, edits: {{}}, ai: {{}} }};
      }}
    }}

    function saveStore() {{
      localStorage.setItem(storageKey, JSON.stringify(store));
    }}

    function mergedEntries() {{
      return entries.map((entry) => Object.assign({{}}, entry, store.edits[entry.id] || {{}}));
    }}

    function medalForRank(rank, total) {{
      if (total <= 0) return "";
      const medalCount = Math.ceil(entries.length * 0.3);
      const gold = Math.round((medalCount * 3) / 6);
      const silver = Math.round((medalCount * 2) / 6);
      if (rank <= gold) return "Gold";
      if (rank <= gold + silver) return "Silver";
      if (rank <= medalCount) return "Bronze";
      return "";
    }}

    function aiReview(id) {{
      const item = store.ai[id] || {{}};
      const percentage = Math.max(0, Math.min(100, Number(item.percentage || 0)));
      return {{
        used: Boolean(item.used) || percentage > 0,
        percentage,
        note: item.note || "",
      }};
    }}

    function rankedRows() {{
      const rows = mergedEntries().map((entry) => {{
        const ai = aiReview(entry.id);
        const excluded = ai.used || store.statuses[entry.id] === "Excluded";
        return {{
          entry,
          ai,
          excluded,
          total: totalScore(store.scores[entry.id]),
          status: excluded ? "Excluded" : (store.statuses[entry.id] || "Not started"),
        }};
      }});
      const eligible = rows
        .filter((row) => !row.excluded)
        .sort((a, b) => b.total - a.total || String(a.entry.timestamp || "").localeCompare(String(b.entry.timestamp || "")))
        .map((row, index) => Object.assign(row, {{ rank: index + 1, medal: medalForRank(index + 1, row.total) }}));
      const excluded = rows
        .filter((row) => row.excluded)
        .sort((a, b) => String(a.entry.fullName || "").localeCompare(String(b.entry.fullName || "")))
        .map((row) => Object.assign(row, {{ rank: null, medal: "" }}));
      return [...eligible, ...excluded];
    }}

    function visibleRows() {{
      const query = $("query").value.trim().toLowerCase();
      const topic = $("topicFilter").value;
      const status = $("statusFilter").value;
      const missingOnly = $("missingOnly").checked;
      const sortMode = $("sortMode").value;
      const rows = rankedRows().filter((row) => {{
        const entry = row.entry;
        const blob = [entry.fullName, entry.school, entry.email, entry.topic, entry.title, entry.pitch].filter(Boolean).join(" ").toLowerCase();
        return (!query || blob.includes(query))
          && (topic === "All topics" || entry.topic === topic)
          && (status === "All statuses" || row.status === status)
          && (!missingOnly || !entry.articleFile);
      }});
      return rows.sort((a, b) => {{
        if (sortMode === "name") return String(a.entry.fullName || "").localeCompare(String(b.entry.fullName || ""));
        if (sortMode === "topic") return String(a.entry.topic || "").localeCompare(String(b.entry.topic || ""));
        if (sortMode === "recent") return String(b.entry.timestamp || "").localeCompare(String(a.entry.timestamp || ""));
        return a.rank - b.rank;
      }});
    }}

    function statusClass(status) {{
      if (status === "Done") return "done";
      if (status === "Shortlisted") return "short";
      if (status === "In review") return "review";
      if (status === "Excluded") return "excluded";
      return "not";
    }}

    function formatDate(value) {{
      if (!value) return "No timestamp";
      return new Intl.DateTimeFormat("en", {{ month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }}).format(new Date(value));
    }}

    function renderMetrics() {{
      const rows = rankedRows();
      const reviewed = rows.filter((row) => row.status === "Done" || row.status === "Shortlisted").length;
      const eligible = rows.filter((row) => !row.excluded);
      const excluded = rows.length - eligible.length;
      const avg = eligible.length ? eligible.reduce((sum, row) => sum + row.total, 0) / eligible.length : 0;
      const metricData = [
        ["Submissions", entries.length, "from " + payload.generatedFrom, "var(--sky)"],
        ["Reviewed", reviewed + "/" + entries.length, "done or shortlisted", "var(--green)"],
        ["Average score", avg.toFixed(1), "live from eligible entries", "var(--gold)"],
        ["Excluded", excluded, "AI flagged entries", "#fca5a5"],
        ["Medal pool", Math.ceil(entries.length * 0.3), "top 30% using 3:2:1", "var(--rose)"],
      ];
      $("metrics").innerHTML = metricData.map(([label, value, detail, color]) => `
        <div class="metric"><span>${{label}}</span><strong style="color:${{color}}">${{value}}</strong><small>${{detail}}</small></div>
      `).join("");
    }}

    function renderTopics() {{
      const topics = ["All topics", ...new Set(mergedEntries().map((entry) => entry.topic || "Untitled topic"))].sort((a, b) => a === "All topics" ? -1 : b === "All topics" ? 1 : a.localeCompare(b));
      $("topicFilter").innerHTML = topics.map((topic) => `<option>${{escapeHtml(topic)}}</option>`).join("");
    }}

    function renderList() {{
      const rows = visibleRows();
      $("entryList").innerHTML = rows.map((row) => {{
        const entry = row.entry;
        return `
          <button class="row ${{entry.id === selectedId ? "active" : ""}}" data-id="${{entry.id}}">
            <span><strong>${{row.excluded ? "EX" : "#" + row.rank}}</strong>${{row.medal ? `<br><span class="subtle" style="color:var(--gold)">${{row.medal}}</span>` : ""}}</span>
            <span class="truncate"><strong>${{escapeHtml(entry.title || "Untitled article")}}</strong><br><span class="subtle">${{escapeHtml(entry.fullName || "Unknown writer")}} · ${{escapeHtml(entry.school || "No school")}}</span></span>
            <span class="truncate subtle">${{escapeHtml(entry.topic || "No topic")}}</span>
            <span><strong>${{row.total}}</strong><span class="scorebar"><i style="width:${{row.total}}%"></i></span></span>
            <span class="status ${{statusClass(row.status)}}">${{row.status}}</span>
          </button>
        `;
      }}).join("");
      document.querySelectorAll(".row").forEach((button) => button.addEventListener("click", () => {{
        selectedId = button.dataset.id;
        render();
      }}));
    }}

    function renderDetail() {{
      const selected = rankedRows().find((row) => row.entry.id === selectedId) || rankedRows()[0];
      if (!selected) return;
      const entry = selected.entry;
      const scores = store.scores[entry.id] || {{}};
      const notes = store.notes[entry.id] || "";
      const ai = aiReview(entry.id);
      $("detail").innerHTML = `
        <div class="detail-head">
          <div>
            <div class="meta">${{entry.id.toUpperCase()}} · ${{formatDate(entry.timestamp)}}${{selected.medal ? " · " + selected.medal + " band" : ""}}${{selected.excluded ? " · Excluded by AI screen" : ""}}</div>
            <input class="title-input" data-edit="title" value="${{escapeHtml(entry.title || "")}}" />
            <div class="edit-grid">
              ${{editField("Writer", "fullName", entry.fullName)}}
              ${{editField("School", "school", entry.school)}}
              ${{editField("Topic", "topic", entry.topic)}}
              <div><span class="mini-label">Grade</span><div class="subtle">${{escapeHtml(entry.grade || "No grade")}}</div></div>
            </div>
          </div>
          <div class="rankbox"><span class="subtle">${{selected.excluded ? "Review status" : "Live rank"}}</span><strong>${{selected.excluded ? "EX" : "#" + selected.rank}}</strong><span class="subtle">${{selected.total}}/100 points</span></div>
        </div>
        <div class="detail-body">
          <div>
            <div class="card">
              <div class="rubric-head">
                <h2>Rubric scoring</h2>
                <select id="selectedStatus">${{statuses.map((status) => `<option ${{status === selected.status ? "selected" : ""}}>${{status}}</option>`).join("")}}</select>
              </div>
              ${{rubric.map((item) => criterionHtml(item, scores[item.key] || 0)).join("")}}
            </div>
            <div class="card" style="margin-top:16px">
              <h2>Editorial notes</h2>
              <textarea id="notes" placeholder="Strengths, issues, publication edits, or judge comments...">${{escapeHtml(notes)}}</textarea>
              <button class="btn" id="resetEntry" style="margin-top:10px">Reset this entry</button>
            </div>
          </div>
          <aside>
            <div class="card">
              <h2>AI screening</h2>
              <div class="ai-grid">
                <label class="ai-check"><input id="aiUsed" type="checkbox" ${{ai.used ? "checked" : ""}} /> AI used</label>
                <label><span class="mini-label">AI %</span><input id="aiPercent" type="number" min="0" max="100" step="0.1" value="${{ai.percentage}}" /></label>
              </div>
              <textarea id="aiNote" style="margin-top:10px; min-height:76px" placeholder="AI detector, copied section, reviewer evidence...">${{escapeHtml(ai.note)}}</textarea>
              <div class="subtle" style="margin-top:8px">Any AI flag or percentage above 0 marks this entry as Excluded.</div>
            </div>
            <div class="card" style="margin-top:16px">
              <h2>Article data</h2>
              ${{dataLine("Email", entry.email)}}
              ${{dataLine("Publication rights", entry.publicationRights || "Missing")}}
              ${{dataLine("Pitch words", String(wordCount(entry.pitch)))}}
              <div class="pitch">${{escapeHtml(entry.pitch || "No pitch provided.")}}</div>
              <div class="link-grid">
                ${{linkButton(entry.articleFile, "Open article file")}}
                ${{linkButton(entry.sourceFileLink, "Open source file")}}
                ${{linkButton(entry.articleImage, "Open article image")}}
              </div>
            </div>
            <div class="card" style="margin-top:16px">
              <h2>Current top 5</h2>
              <div class="top-five">
                ${{rankedRows().filter((row) => !row.excluded).slice(0, 5).map((row) => `<button data-top="${{row.entry.id}}"><span class="pill">#${{row.rank}}</span><span class="truncate"><strong>${{escapeHtml(row.entry.fullName || "Unknown")}}</strong><br><span class="subtle">${{escapeHtml(row.entry.title || "Untitled")}}</span></span><strong>${{row.total}}</strong></button>`).join("")}}
              </div>
            </div>
            <div class="card" style="margin-top:16px">
              <h2>Workflow checks</h2>
              <div class="checks">
                ${{checkLine(Boolean(entry.articleFile), "Article file link")}}
                ${{checkLine(!selected.excluded, "Eligible for ranking")}}
                ${{checkLine(selected.total > 0, "Any score entered")}}
                ${{checkLine(rubric.every((item) => scores[item.key] !== undefined), "All rubric categories scored")}}
                ${{checkLine(notes.trim().length > 0, "Editorial note added")}}
              </div>
            </div>
          </aside>
        </div>
      `;

      document.querySelectorAll("[data-edit]").forEach((input) => input.addEventListener("input", () => {{
        updateEdit(entry.id, input.dataset.edit, input.value);
      }}));
      document.querySelectorAll("[data-score]").forEach((input) => input.addEventListener("input", () => {{
        const key = input.dataset.score;
        const max = Number(input.dataset.max);
        const value = Math.max(0, Math.min(max, Number(input.value || 0)));
        input.value = value;
        store.scores[entry.id] = Object.assign({{}}, store.scores[entry.id], {{ [key]: value }});
        saveStore();
        render();
      }}));
      $("selectedStatus").addEventListener("change", (event) => {{
        store.statuses[entry.id] = event.target.value;
        saveStore();
        render();
      }});
      $("notes").addEventListener("input", (event) => {{
        store.notes[entry.id] = event.target.value;
        saveStore();
        renderMetrics();
      }});
      $("aiUsed").addEventListener("change", (event) => updateAi(entry.id, {{ used: event.target.checked }}));
      $("aiPercent").addEventListener("input", (event) => updateAi(entry.id, {{ percentage: Math.max(0, Math.min(100, Number(event.target.value || 0))) }}));
      $("aiNote").addEventListener("input", (event) => updateAi(entry.id, {{ note: event.target.value }}));
      $("resetEntry").addEventListener("click", () => {{
        delete store.scores[entry.id];
        delete store.notes[entry.id];
        delete store.statuses[entry.id];
        delete store.edits[entry.id];
        delete store.ai[entry.id];
        saveStore();
        render();
      }});
      document.querySelectorAll("[data-top]").forEach((button) => button.addEventListener("click", () => {{
        selectedId = button.dataset.top;
        render();
      }}));
    }}

    function editField(label, key, value) {{
      return `<label><span class="mini-label">${{label}}</span><input data-edit="${{key}}" value="${{escapeHtml(value || "")}}" /></label>`;
    }}

    function criterionHtml(item, score) {{
      return `
        <div class="criterion">
          <div class="criterion-top">
            <div><strong>${{escapeHtml(item.label)}} <span class="subtle">/${{item.max}}</span></strong><p>${{escapeHtml(item.description)}}</p></div>
            <input type="number" min="0" max="${{item.max}}" step="0.5" data-score="${{item.key}}" data-max="${{item.max}}" value="${{score}}" />
          </div>
          <span class="scorebar"><i style="width:${{(Number(score) / item.max) * 100}}%"></i></span>
        </div>
      `;
    }}

    function dataLine(label, value) {{
      return `<div class="data-line"><span class="mini-label">${{label}}</span><div class="subtle">${{escapeHtml(value || "Missing")}}</div></div>`;
    }}

    function linkButton(href, label) {{
      return `<a class="link ${{href ? "" : "disabled"}}" href="${{escapeHtml(href || "#")}}" target="_blank" rel="noreferrer"><span>${{label}}</span><span>↗</span></a>`;
    }}

    function checkLine(done, label) {{
      return `<div class="check ${{done ? "done" : ""}}">${{done ? "✓" : "○"}} ${{label}}</div>`;
    }}

    function updateEdit(id, key, value) {{
      store.edits[id] = Object.assign({{}}, store.edits[id], {{ [key]: value }});
      saveStore();
      renderList();
    }}

    function updateAi(id, patch) {{
      store.ai[id] = Object.assign({{ used: false, percentage: 0, note: "" }}, store.ai[id] || {{}}, patch);
      if (store.ai[id].used || Number(store.ai[id].percentage || 0) > 0) {{
        store.statuses[id] = "Excluded";
      }} else if (store.statuses[id] === "Excluded") {{
        store.statuses[id] = "Not started";
      }}
      saveStore();
      render();
    }}

    function render() {{
      renderMetrics();
      renderList();
      renderDetail();
    }}

    function csvEscape(value) {{
      return `"${{String(value ?? "").replace(/"/g, '""')}}"`;
    }}

    function exportCsv() {{
      const headers = ["Rank", "Medal", "Status", "Excluded", "AI Used", "AI Percent", "AI Notes", "Total", ...rubric.map((item) => item.label), "Name", "School", "Grade", "Topic", "Title", "Email", "Article File", "Source File", "Notes"];
      const lines = rankedRows().map((row) => [
        row.excluded ? "EX" : row.rank,
        row.medal,
        row.status,
        row.excluded ? "Yes" : "No",
        row.ai.used ? "Yes" : "No",
        row.ai.percentage,
        row.ai.note,
        row.total,
        ...rubric.map((item) => (store.scores[row.entry.id] || {{}})[item.key] || 0),
        row.entry.fullName,
        row.entry.school,
        row.entry.grade,
        row.entry.topic,
        row.entry.title,
        row.entry.email,
        row.entry.articleFile,
        row.entry.sourceFileLink,
        store.notes[row.entry.id] || "",
      ]);
      download("ypwc-review-results.csv", [headers, ...lines].map((line) => line.map(csvEscape).join(",")).join("\\n"), "text/csv");
    }}

    function exportBackup() {{
      download("ypwc-review-backup.json", JSON.stringify({{ exportedAt: new Date().toISOString(), store }}, null, 2), "application/json");
    }}

    function download(filename, content, type) {{
      const blob = new Blob([content], {{ type }});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      toast("Downloaded " + filename);
    }}

    function toast(message) {{
      $("toast").textContent = message;
      $("toast").classList.add("show");
      setTimeout(() => $("toast").classList.remove("show"), 2400);
    }}

    $("query").addEventListener("input", renderList);
    $("topicFilter").addEventListener("change", renderList);
    $("statusFilter").addEventListener("change", renderList);
    $("missingOnly").addEventListener("change", renderList);
    $("sortMode").addEventListener("change", renderList);
    $("exportCsv").addEventListener("click", exportCsv);
    $("exportBackup").addEventListener("click", exportBackup);
    $("importBackup").addEventListener("click", () => $("backupInput").click());
    $("backupInput").addEventListener("change", async (event) => {{
      const file = event.target.files[0];
      if (!file) return;
      const parsed = JSON.parse(await file.text());
      store = Object.assign({{ scores: {{}}, notes: {{}}, statuses: {{}}, edits: {{}}, ai: {{}} }}, parsed.store || parsed);
      saveStore();
      render();
      toast("Backup imported");
    }});

    renderTopics();
    render();
  </script>
</body>
</html>
"""


def main() -> None:
    parser = argparse.ArgumentParser(description="Build a standalone YPWC review HTML file from the registration workbook.")
    parser.add_argument("--input", default=r"C:\Users\wasfy\Downloads\_YPWC registration (2).xlsx")
    parser.add_argument("--output", default="ypwc-review.html")
    args = parser.parse_args()

    source_path = Path(args.input)
    output_path = Path(args.output)
    entries = load_entries(source_path)
    output_path.write_text(render_html(entries, source_path), encoding="utf-8")
    print(f"Wrote {output_path.resolve()} with {len(entries)} entries")


if __name__ == "__main__":
    main()
