"use client";

import Image from "next/image";
import {
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  Filter,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ypwcEntries, ypwcRubric, type YpwcEntry } from "@/lib/ypwcData";
import { cn } from "@/lib/utils";

type ScoreKey = (typeof ypwcRubric)[number]["key"];
type Status = "Not started" | "In review" | "Done" | "Shortlisted" | "Excluded";
type SortMode = "rank" | "name" | "topic" | "recent";
type AiReview = { used?: boolean; percentage?: number; note?: string };

type ReviewStore = {
  scores: Record<string, Partial<Record<ScoreKey, number>>>;
  notes: Record<string, string>;
  statuses: Record<string, Status>;
  edits: Record<string, Partial<Pick<YpwcEntry, "fullName" | "school" | "topic" | "title">>>;
  ai: Record<string, AiReview>;
};

const storageKey = "ypwc-review-workbench-v1";
const statuses: Status[] = ["Not started", "In review", "Done", "Shortlisted", "Excluded"];

const emptyStore: ReviewStore = {
  scores: {},
  notes: {},
  statuses: {},
  edits: {},
  ai: {},
};

function clampScore(value: string, max: number) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(max, parsed));
}

function totalScore(scores?: Partial<Record<ScoreKey, number>>) {
  return ypwcRubric.reduce((sum, item) => sum + (scores?.[item.key] ?? 0), 0);
}

function wordCount(value: string | null) {
  return value?.trim() ? value.trim().split(/\s+/).length : 0;
}

function csvEscape(value: string | number | null | undefined) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function medalForRank(rank: number, total: number) {
  if (total <= 0) return "";

  const medalCount = Math.ceil(ypwcEntries.length * 0.3);
  const gold = Math.round((medalCount * 3) / 6);
  const silver = Math.round((medalCount * 2) / 6);

  if (rank <= gold) return "Gold";
  if (rank <= gold + silver) return "Silver";
  if (rank <= medalCount) return "Bronze";
  return "";
}

function normalizeAiReview(item?: AiReview) {
  const percentage = Math.max(0, Math.min(100, Number(item?.percentage ?? 0)));
  return {
    used: Boolean(item?.used) || percentage > 0,
    percentage,
    note: item?.note ?? "",
  };
}

function formatDate(value: string | null) {
  if (!value) return "No timestamp";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function YpwcReviewApp() {
  const [store, setStore] = useState<ReviewStore>(emptyStore);
  const [selectedId, setSelectedId] = useState(ypwcEntries[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("All topics");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sortMode, setSortMode] = useState<SortMode>("rank");
  const [showOnlyMissingLinks, setShowOnlyMissingLinks] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setStore({ ...emptyStore, ...JSON.parse(saved) });
    } catch {
      setStore(emptyStore);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(store));
  }, [store]);

  const entries = useMemo(
    () =>
      ypwcEntries.map((entry) => ({
        ...entry,
        ...(store.edits[entry.id] ?? {}),
      })),
    [store.edits],
  );

  const ranked = useMemo(() => {
    const rows = entries.map((entry) => {
      const ai = normalizeAiReview(store.ai[entry.id]);
      const excluded = ai.used || store.statuses[entry.id] === "Excluded";
      return {
        entry,
        ai,
        excluded,
        total: totalScore(store.scores[entry.id]),
        status: excluded ? "Excluded" : (store.statuses[entry.id] ?? "Not started"),
      };
    });
    const eligible = rows
      .filter((row) => !row.excluded)
      .sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        return (a.entry.timestamp ?? "").localeCompare(b.entry.timestamp ?? "");
      })
      .map((row, index) => ({
        ...row,
        rank: index + 1,
        medal: medalForRank(index + 1, row.total),
      }));
    const excluded = rows
      .filter((row) => row.excluded)
      .sort((a, b) => (a.entry.fullName ?? "").localeCompare(b.entry.fullName ?? ""))
      .map((row) => ({ ...row, rank: null, medal: "" }));
    return [...eligible, ...excluded];
  }, [entries, store.ai, store.scores, store.statuses]);

  const topics = useMemo(
    () => ["All topics", ...Array.from(new Set(entries.map((entry) => entry.topic ?? "Untitled topic"))).sort()],
    [entries],
  );

  const visibleRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const rows = ranked.filter(({ entry, status }) => {
      const searchBlob = [entry.fullName, entry.school, entry.email, entry.topic, entry.title, entry.pitch]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalizedQuery || searchBlob.includes(normalizedQuery);
      const matchesTopic = topicFilter === "All topics" || entry.topic === topicFilter;
      const matchesStatus = statusFilter === "All statuses" || status === statusFilter;
      const matchesLink = !showOnlyMissingLinks || !entry.articleFile;
      return matchesQuery && matchesTopic && matchesStatus && matchesLink;
    });

    return rows.sort((a, b) => {
      if (sortMode === "name") return (a.entry.fullName ?? "").localeCompare(b.entry.fullName ?? "");
      if (sortMode === "topic") return (a.entry.topic ?? "").localeCompare(b.entry.topic ?? "");
      if (sortMode === "recent") return (b.entry.timestamp ?? "").localeCompare(a.entry.timestamp ?? "");
      return (a.rank ?? Number.MAX_SAFE_INTEGER) - (b.rank ?? Number.MAX_SAFE_INTEGER);
    });
  }, [query, ranked, showOnlyMissingLinks, sortMode, statusFilter, topicFilter]);

  const selected = ranked.find((row) => row.entry.id === selectedId) ?? ranked[0];
  const selectedScores = store.scores[selected.entry.id] ?? {};
  const selectedAi = selected.ai;
  const reviewedCount = ranked.filter((row) => row.status === "Done" || row.status === "Shortlisted").length;
  const eligibleRows = ranked.filter((row) => !row.excluded);
  const excludedCount = ranked.length - eligibleRows.length;
  const averageScore = eligibleRows.length
    ? eligibleRows.reduce((sum, row) => sum + row.total, 0) / eligibleRows.length
    : 0;

  function updateScore(key: ScoreKey, value: string) {
    const rubricItem = ypwcRubric.find((item) => item.key === key);
    if (!rubricItem) return;
    setStore((current) => ({
      ...current,
      scores: {
        ...current.scores,
        [selected.entry.id]: {
          ...current.scores[selected.entry.id],
          [key]: clampScore(value, rubricItem.max),
        },
      },
    }));
  }

  function updateStatus(status: Status) {
    setStore((current) => ({
      ...current,
      statuses: { ...current.statuses, [selected.entry.id]: status },
    }));
  }

  function updateAi(patch: AiReview) {
    setStore((current) => {
      const ai = normalizeAiReview({ ...current.ai[selected.entry.id], ...patch });
      const nextStatus =
        ai.used || ai.percentage > 0
          ? "Excluded"
          : current.statuses[selected.entry.id] === "Excluded"
            ? "Not started"
            : current.statuses[selected.entry.id];
      return {
        ...current,
        ai: { ...current.ai, [selected.entry.id]: ai },
        statuses: { ...current.statuses, [selected.entry.id]: nextStatus },
      };
    });
  }

  function updateNote(value: string) {
    setStore((current) => ({
      ...current,
      notes: { ...current.notes, [selected.entry.id]: value },
    }));
  }

  function updateEdit(field: keyof ReviewStore["edits"][string], value: string) {
    setStore((current) => ({
      ...current,
      edits: {
        ...current.edits,
        [selected.entry.id]: {
          ...current.edits[selected.entry.id],
          [field]: value,
        },
      },
    }));
  }

  function exportCsv() {
    const headers = [
      "Rank",
      "Medal",
      "Status",
      "Excluded",
      "AI Used",
      "AI Percent",
      "AI Notes",
      "Total",
      ...ypwcRubric.map((item) => item.label),
      "Name",
      "School",
      "Grade",
      "Topic",
      "Title",
      "Email",
      "Article File",
      "Source File",
      "Notes",
    ];
    const lines = ranked.map(({ entry, rank, medal, status, total, excluded, ai }) => [
      excluded ? "EX" : rank,
      medal,
      status,
      excluded ? "Yes" : "No",
      ai.used ? "Yes" : "No",
      ai.percentage,
      ai.note,
      total,
      ...ypwcRubric.map((item) => store.scores[entry.id]?.[item.key] ?? 0),
      entry.fullName,
      entry.school,
      entry.grade,
      entry.topic,
      entry.title,
      entry.email,
      entry.articleFile,
      entry.sourceFileLink,
      store.notes[entry.id] ?? "",
    ]);
    downloadFile("ypwc-review-results.csv", [headers, ...lines].map((line) => line.map(csvEscape).join(",")).join("\n"), "text/csv");
  }

  function exportJson() {
    downloadFile(
      "ypwc-review-backup.json",
      JSON.stringify({ exportedAt: new Date().toISOString(), store }, null, 2),
      "application/json",
    );
  }

  function downloadFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as { store?: ReviewStore };
    setStore({ ...emptyStore, ...(parsed.store ?? parsed) });
  }

  function resetSelected() {
    setStore((current) => {
      const { [selected.entry.id]: removedScores, ...scores } = current.scores;
      const { [selected.entry.id]: removedNotes, ...notes } = current.notes;
      const { [selected.entry.id]: removedStatuses, ...nextStatuses } = current.statuses;
      const { [selected.entry.id]: removedEdits, ...edits } = current.edits;
      const { [selected.entry.id]: removedAi, ...ai } = current.ai;
      return { scores, notes, statuses: nextStatuses, edits, ai };
    });
  }

  return (
    <main className="min-h-screen bg-[#0d1118] text-white">
      <div className="border-b border-white/10 bg-[#111827]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <Image src="/assets/club-shield-transparent.webp" alt="Physics Club logo" width={44} height={44} className="size-11 object-contain" />
              <span className="h-9 w-px bg-white/30" aria-hidden="true" />
              <Image src="/assets/ypwc-logo-360.webp" alt="YPWC logo" width={44} height={44} className="size-11 object-contain" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8dd3ff]">Review workbench</p>
                <h1 className="truncate text-2xl font-semibold text-white sm:text-3xl">Young Physics Writing Contest</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm font-semibold text-white hover:bg-white/[0.08]" onClick={exportCsv}>
                <Download className="size-4" aria-hidden="true" />
                CSV
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm font-semibold text-white hover:bg-white/[0.08]" onClick={exportJson}>
                <Download className="size-4" aria-hidden="true" />
                Backup
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-md bg-[#1473e6] px-3 text-sm font-semibold text-white hover:bg-[#2e8cff]" onClick={() => importRef.current?.click()}>
                <Upload className="size-4" aria-hidden="true" />
                Import
              </button>
              <input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => importJson(event.target.files?.[0])} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Submissions" value={String(ypwcEntries.length)} detail="from the registration sheet" tone="blue" />
            <Metric label="Reviewed" value={`${reviewedCount}/${ypwcEntries.length}`} detail="done or shortlisted" tone="green" />
            <Metric label="Average score" value={averageScore.toFixed(1)} detail="live from eligible entries" tone="amber" />
            <Metric label="Excluded" value={String(excludedCount)} detail="AI flagged entries" tone="red" />
            <Metric label="Medal pool" value={String(Math.ceil(ypwcEntries.length * 0.3))} detail="top 30% using 3:2:1" tone="rose" />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.35fr)] lg:px-8">
        <section className="min-h-0 rounded-lg border border-white/10 bg-[#121924]">
          <div className="border-b border-white/10 p-4">
            <div className="grid gap-3 xl:grid-cols-[1fr_160px]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-11 w-full rounded-md border border-white/12 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none transition focus:border-[#8dd3ff]"
                  placeholder="Search name, school, topic, article..."
                />
              </label>
              <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="h-11 rounded-md border border-white/12 bg-[#101722] px-3 text-sm text-white outline-none">
                <option value="rank">Rank</option>
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="topic">Topic</option>
              </select>
            </div>
            <div className="mt-3 grid gap-3 xl:grid-cols-3">
              <select value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)} className="h-10 rounded-md border border-white/12 bg-[#101722] px-3 text-sm text-white outline-none">
                {topics.map((topic) => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-md border border-white/12 bg-[#101722] px-3 text-sm text-white outline-none">
                <option>All statuses</option>
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <label className="flex h-10 items-center gap-2 rounded-md border border-white/12 bg-white/[0.035] px-3 text-sm text-white/70">
                <input type="checkbox" checked={showOnlyMissingLinks} onChange={(event) => setShowOnlyMissingLinks(event.target.checked)} className="size-4 accent-[#1473e6]" />
                Missing file
              </label>
            </div>
          </div>

          <div className="max-h-[calc(100vh-19rem)] overflow-auto">
            <div className="grid min-w-[720px] grid-cols-[64px_1.25fr_0.9fr_90px_92px] border-b border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-white/42">
              <span>Rank</span>
              <span>Article</span>
              <span>Topic</span>
              <span>Score</span>
              <span>Status</span>
            </div>
            {visibleRows.map((row) => (
              <button
                key={row.entry.id}
                onClick={() => setSelectedId(row.entry.id)}
                className={cn(
                  "grid min-w-[720px] grid-cols-[64px_1.25fr_0.9fr_90px_92px] items-center gap-3 border-b border-white/8 px-4 py-3 text-left transition hover:bg-white/[0.045]",
                  row.entry.id === selected.entry.id && "bg-[#1473e6]/12",
                )}
              >
                <div>
                  <p className="font-semibold text-white">{row.excluded ? "EX" : `#${row.rank}`}</p>
                  {row.medal ? <p className="text-xs text-[#ffd166]">{row.medal}</p> : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{row.entry.title || "Untitled article"}</p>
                  <p className="mt-1 truncate text-sm text-white/52">{row.entry.fullName || "Unknown writer"} · {row.entry.school || "No school"}</p>
                </div>
                <p className="truncate text-sm text-white/64">{row.entry.topic || "No topic"}</p>
                <div>
                  <p className="font-semibold text-white">{row.total}</p>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#2dd4bf]" style={{ width: `${row.total}%` }} />
                  </div>
                </div>
                <span className={cn("rounded-md px-2 py-1 text-center text-xs font-semibold", statusClass(row.status))}>{row.status}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="min-w-0 rounded-lg border border-white/10 bg-[#121924]">
          <div className="border-b border-white/10 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/52">
                  <span>{selected.entry.id.toUpperCase()}</span>
                  <span>·</span>
                  <span>{formatDate(selected.entry.timestamp)}</span>
                  {selected.medal ? (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-[#ffd166]">{selected.medal} band</span>
                    </>
                  ) : null}
                  {selected.excluded ? (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-[#fca5a5]">Excluded by AI screen</span>
                    </>
                  ) : null}
                </div>
                <input
                  value={selected.entry.title ?? ""}
                  onChange={(event) => updateEdit("title", event.target.value)}
                  className="mt-2 w-full rounded-md border border-transparent bg-transparent px-0 text-3xl font-semibold leading-tight text-white outline-none focus:border-white/14 focus:bg-white/[0.03] focus:px-3"
                />
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <EditableText label="Writer" value={selected.entry.fullName ?? ""} onChange={(value) => updateEdit("fullName", value)} />
                  <EditableText label="School" value={selected.entry.school ?? ""} onChange={(value) => updateEdit("school", value)} />
                  <EditableText label="Topic" value={selected.entry.topic ?? ""} onChange={(value) => updateEdit("topic", value)} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/42">Grade</p>
                    <p className="mt-1 text-sm text-white/80">{selected.entry.grade ?? "No grade"}</p>
                  </div>
                </div>
              </div>
              <div className="shrink-0 rounded-lg border border-white/10 bg-[#0d1118] p-4 text-center">
                <p className="text-sm text-white/52">{selected.excluded ? "Review status" : "Live rank"}</p>
                <p className="mt-1 text-4xl font-semibold text-white">{selected.excluded ? "EX" : `#${selected.rank}`}</p>
                <p className="mt-1 text-sm text-white/52">{selected.total}/100 points</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 xl:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <div className="rounded-lg border border-white/10 bg-[#0d1118] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <ClipboardCheck className="size-5 text-[#8dd3ff]" aria-hidden="true" />
                    Rubric scoring
                  </h2>
                  <select value={selected.status} onChange={(event) => updateStatus(event.target.value as Status)} className="h-10 rounded-md border border-white/12 bg-[#101722] px-3 text-sm text-white outline-none">
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  {ypwcRubric.map((item) => {
                    const score = selectedScores[item.key] ?? 0;
                    return (
                      <div key={item.key} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                        <div className="grid gap-3 sm:grid-cols-[1fr_104px] sm:items-start">
                          <div>
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium text-white">{item.label}</p>
                              <span className="text-sm text-white/52">/{item.max}</span>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-white/52">{item.description}</p>
                          </div>
                          <input
                            type="number"
                            min={0}
                            max={item.max}
                            step={0.5}
                            value={score}
                            onChange={(event) => updateScore(item.key, event.target.value)}
                            className="h-12 rounded-md border border-white/12 bg-[#101722] px-3 text-right text-lg font-semibold text-white outline-none focus:border-[#8dd3ff]"
                          />
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-[#2dd4bf]" style={{ width: `${(score / item.max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#0d1118] p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <FileText className="size-5 text-[#8dd3ff]" aria-hidden="true" />
                  Editorial notes
                </h2>
                <textarea
                  value={store.notes[selected.entry.id] ?? ""}
                  onChange={(event) => updateNote(event.target.value)}
                  className="mt-3 min-h-32 w-full resize-y rounded-md border border-white/12 bg-white/[0.04] p-3 text-sm leading-6 text-white outline-none focus:border-[#8dd3ff]"
                  placeholder="Strengths, issues, publication edits, or judge comments..."
                />
                <button onClick={resetSelected} className="mt-3 inline-flex h-10 items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm font-semibold text-white/80 hover:bg-white/[0.08]">
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Reset this entry
                </button>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-lg border border-white/10 bg-[#0d1118] p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Sparkles className="size-5 text-[#fca5a5]" aria-hidden="true" />
                  AI screening
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_112px]">
                  <label className="flex h-11 items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm font-semibold text-white/80">
                    <input
                      type="checkbox"
                      checked={selectedAi.used}
                      onChange={(event) => updateAi({ used: event.target.checked })}
                      className="size-4 accent-red-500"
                    />
                    AI used
                  </label>
                  <label>
                    <span className="text-xs font-semibold uppercase tracking-[0.13em] text-white/42">AI %</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={selectedAi.percentage}
                      onChange={(event) => updateAi({ percentage: Math.max(0, Math.min(100, Number(event.target.value || 0))) })}
                      className="mt-1 h-10 w-full rounded-md border border-white/12 bg-[#101722] px-3 text-right text-sm font-semibold text-white outline-none focus:border-[#8dd3ff]"
                    />
                  </label>
                </div>
                <textarea
                  value={selectedAi.note}
                  onChange={(event) => updateAi({ note: event.target.value })}
                  className="mt-3 min-h-20 w-full resize-y rounded-md border border-white/12 bg-white/[0.04] p-3 text-sm leading-6 text-white outline-none focus:border-[#8dd3ff]"
                  placeholder="AI detector, copied section, reviewer evidence..."
                />
                <p className="mt-2 text-xs leading-5 text-white/46">Any AI flag or percentage above 0 marks this entry as Excluded.</p>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#0d1118] p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Sparkles className="size-5 text-[#fbbf24]" aria-hidden="true" />
                  Article data
                </h2>
                <div className="mt-4 space-y-4">
                  <DataLine label="Email" value={selected.entry.email} />
                  <DataLine label="Publication rights" value={selected.entry.publicationRights ?? "Missing"} />
                  <DataLine label="Pitch words" value={String(wordCount(selected.entry.pitch))} />
                  <p className="rounded-md border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/70">{selected.entry.pitch || "No pitch provided."}</p>
                </div>
                <div className="mt-4 grid gap-2">
                  <LinkButton href={selected.entry.articleFile} label="Open article file" />
                  <LinkButton href={selected.entry.sourceFileLink} label="Open source file" />
                  <LinkButton href={selected.entry.articleImage} label="Open article image" />
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#0d1118] p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Trophy className="size-5 text-[#fbbf24]" aria-hidden="true" />
                  Current top 5
                </h2>
                <div className="mt-4 space-y-3">
                  {ranked.filter((row) => !row.excluded).slice(0, 5).map((row) => (
                    <button key={row.entry.id} onClick={() => setSelectedId(row.entry.id)} className="flex w-full items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-3 text-left hover:bg-white/[0.07]">
                      <span className="grid size-9 place-items-center rounded-md bg-[#1473e6]/18 text-sm font-semibold text-[#8dd3ff]">#{row.rank}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">{row.entry.fullName ?? "Unknown"}</span>
                        <span className="block truncate text-xs text-white/46">{row.entry.title ?? "Untitled"}</span>
                      </span>
                      <span className="font-semibold text-white">{row.total}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#0d1118] p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Filter className="size-5 text-[#8dd3ff]" aria-hidden="true" />
                  Workflow checks
                </h2>
                <div className="mt-4 space-y-3 text-sm text-white/66">
                  <CheckRow done={Boolean(selected.entry.articleFile)} label="Article file link" />
                  <CheckRow done={!selected.excluded} label="Eligible for ranking" />
                  <CheckRow done={selected.total > 0} label="Any score entered" />
                  <CheckRow done={ypwcRubric.every((item) => selectedScores[item.key] !== undefined)} label="All rubric categories scored" />
                  <CheckRow done={(store.notes[selected.entry.id] ?? "").trim().length > 0} label="Editorial note added" />
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "blue" | "green" | "amber" | "rose" | "red" }) {
  const toneClass = {
    blue: "text-[#8dd3ff]",
    green: "text-[#86efac]",
    amber: "text-[#fbbf24]",
    rose: "text-[#fda4af]",
    red: "text-[#fca5a5]",
  }[tone];

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-sm text-white/52">{label}</p>
      <p className={cn("mt-1 text-3xl font-semibold", toneClass)}>{value}</p>
      <p className="mt-1 text-sm text-white/42">{detail}</p>
    </div>
  );
}

function EditableText({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.13em] text-white/42">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none focus:border-[#8dd3ff]" />
    </label>
  );
}

function DataLine({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/42">{label}</p>
      <p className="mt-1 break-words text-sm text-white/78">{value || "Missing"}</p>
    </div>
  );
}

function LinkButton({ href, label }: { href: string | null; label: string }) {
  if (!href) {
    return (
      <button disabled className="inline-flex h-10 items-center justify-between rounded-md border border-white/8 bg-white/[0.025] px-3 text-sm text-white/32">
        {label}
        <ExternalLink className="size-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-between rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm font-semibold text-white hover:bg-white/[0.08]">
      {label}
      <ExternalLink className="size-4" aria-hidden="true" />
    </a>
  );
}

function CheckRow({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className={cn("size-4", done ? "text-[#86efac]" : "text-white/24")} aria-hidden="true" />
      <span className={done ? "text-white/76" : "text-white/42"}>{label}</span>
    </div>
  );
}

function statusClass(status: Status) {
  if (status === "Done") return "bg-[#22c55e]/14 text-[#86efac]";
  if (status === "Shortlisted") return "bg-[#f59e0b]/14 text-[#fbbf24]";
  if (status === "In review") return "bg-[#1473e6]/18 text-[#8dd3ff]";
  if (status === "Excluded") return "bg-red-400/15 text-red-200";
  return "bg-white/[0.055] text-white/46";
}
