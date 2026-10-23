"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useMemo, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  GraduationCap,
  Printer,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { WINNERS_DATA, findWinnerByIdOrRank, type Winner } from "@/lib/winnersData";

export default function CertificatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#070d18] text-white">
          <div className="flex items-center gap-3">
            <div className="size-5 animate-spin rounded-full border-2 border-club-light border-t-transparent" />
            <span className="font-mono text-sm text-[#8f9eb2]">Loading Certificates...</span>
          </div>
        </div>
      }
    >
      <CertificatesContent />
    </Suspense>
  );
}

function CertificatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get("id");

  const [searchQuery, setSearchQuery] = useState(idParam || "");
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-select winner if id param is provided in URL
  useEffect(() => {
    if (idParam) {
      const match = findWinnerByIdOrRank(idParam);
      if (match) {
        setSelectedWinner(match);
        setSearchQuery(match.certId);
      }
    }
  }, [idParam]);

  const handleSelectWinner = (winner: Winner) => {
    setSelectedWinner(winner);
    setSearchQuery(winner.certId);
    router.replace(`/certificates?id=${winner.certId}`, { scroll: false });
  };

  const handleClearSelection = () => {
    setSelectedWinner(null);
    setSearchQuery("");
    router.replace("/certificates", { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = findWinnerByIdOrRank(searchQuery);
    if (match) {
      setSelectedWinner(match);
      router.replace(`/certificates?id=${match.certId}`, { scroll: false });
    } else {
      setSelectedWinner(null);
    }
  };

  const handleCopyLink = (certId: string) => {
    const url = `${window.location.origin}/certificates?id=${certId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered winners for grid
  const filteredWinners = useMemo(() => {
    if (!searchQuery.trim() || selectedWinner) return WINNERS_DATA;
    const q = searchQuery.toLowerCase().trim();
    return WINNERS_DATA.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.certId.toLowerCase().includes(q) ||
        w.school.toLowerCase().includes(q) ||
        w.title.toLowerCase().includes(q)
    );
  }, [searchQuery, selectedWinner]);

  return (
    <div className="min-h-screen bg-[#070d18] text-[#d3dce8] selection:bg-club selection:text-white">
      {/* Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-48 top-0 h-96 w-96 rounded-full bg-[#1b427b]/20 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-[420px] w-[420px] rounded-full bg-[#5c9eff]/10 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-[#0e3f8d]/25 blur-3xl" />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070d18]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
            <div className="relative size-9">
              <Image
                src="/assets/club-shield-transparent.png"
                alt="Physics Club Shield"
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
            <div className="h-5 w-px bg-white/20" />
            <div className="relative size-9">
              <Image
                src="/assets/ypwc-logo-360.png"
                alt="YPWC Logo"
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                YPWC 2026
              </p>
              <p className="text-[11px] text-[#8f9eb2]">Physics Club Magazine</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#8f9eb2] transition hover:bg-white/5 hover:text-white sm:text-sm"
            >
              Overview
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#8f9eb2] transition hover:bg-white/5 hover:text-white sm:text-sm"
            >
              Leaderboard
            </Link>
            <Link
              href="/certificates"
              className="inline-flex items-center gap-1.5 rounded-md bg-club/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-blue transition hover:bg-club sm:text-sm"
            >
              <Award className="size-4" />
              <span>Certificates</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Title & Intro */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-club-light/30 bg-club/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-club-light">
            <ShieldCheck className="size-3.5" />
            Official Certificate Verification Portal
          </div>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            YPWC Merit Certificates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed text-[#9fb2cc] sm:text-base">
            Verify, view, and download authenticated academic certificates awarded to the
            Top 10 Finalists of the Youth Physics Writing Contest.
          </p>
        </div>

        {/* Search & Lookup Bar */}
        <div className="mx-auto mt-8 max-w-2xl">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="pointer-events-none absolute left-4 size-5 text-[#8f9eb2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Certificate ID (e.g. YPWC-2026-01) or Participant Name..."
              className="h-13 w-full rounded-xl border border-white/15 bg-[#0b1626] pl-12 pr-28 text-sm text-white placeholder-[#6c7d93] shadow-lg transition focus:border-club-light focus:outline-none focus:ring-1 focus:ring-club-light"
            />
            <button
              type="submit"
              className="absolute right-2 rounded-lg bg-club px-4 py-2 text-xs font-semibold text-white shadow-blue transition hover:bg-[#2e8cff]"
            >
              Verify
            </button>
          </form>

          {/* Quick Select Winner Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-[#6c7d93] mr-1">Quick select:</span>
            {WINNERS_DATA.map((w) => (
              <button
                key={w.certId}
                onClick={() => handleSelectWinner(w)}
                className={`rounded-full px-2.5 py-1 transition border ${
                  selectedWinner?.certId === w.certId
                    ? "bg-club text-white border-club font-bold"
                    : "bg-white/5 border-white/10 text-[#8f9eb2] hover:bg-white/10 hover:text-white"
                }`}
              >
                #{w.rank} {w.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Verified Certificate Viewer Modal / Feature Section */}
        {selectedWinner && (
          <div className="mt-12 overflow-hidden rounded-2xl border border-[#5c9eff]/40 bg-gradient-to-b from-[#0b1626] to-[#070d18] p-6 shadow-2xl sm:p-10">
            {/* Verification Header */}
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Digitally Verified Authentic
                    </span>
                    <span className="h-3 w-px bg-white/20" />
                    <span className="font-mono text-xs font-semibold text-white">
                      {selectedWinner.certId}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                    {selectedWinner.name}
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`/certificates/pdf/${selectedWinner.pdfFilename}`}
                  download={selectedWinner.pdfFilename}
                  className="inline-flex items-center gap-2 rounded-lg bg-club px-4 py-2.5 text-xs font-bold text-white shadow-blue transition hover:bg-[#2e8cff]"
                >
                  <Download className="size-4" />
                  <span>Download PDF</span>
                </a>
                <a
                  href={`/certificates/html/${selectedWinner.htmlFilename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
                >
                  <Printer className="size-4" />
                  <span>Print / View HTML</span>
                </a>
                <button
                  onClick={() => handleCopyLink(selectedWinner.certId)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-semibold text-[#9fb2cc] transition hover:bg-white/10 hover:text-white"
                  title="Copy verification link"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="size-4" />
                      <span>Share</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleClearSelection}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-[#8f9eb2] transition hover:bg-white/10 hover:text-white"
                  title="Close certificate details"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Certificate Metadata Grid */}
            <div className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-[#070d18]/60 p-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div>
                <p className="text-[#8f9eb2]">Academic Standing</p>
                <p className="mt-1 font-bold text-white text-sm">
                  Rank #{selectedWinner.rank} {selectedWinner.medal !== "Finalist" ? `(${selectedWinner.medal} Medal)` : "(Top 10 Finalist)"}
                </p>
              </div>
              <div>
                <p className="text-[#8f9eb2]">School Affiliation</p>
                <p className="mt-1 font-semibold text-club-light">
                  {selectedWinner.school}
                </p>
              </div>
              <div>
                <p className="text-[#8f9eb2]">Scientific Desk</p>
                <p className="mt-1 font-semibold text-white uppercase tracking-wider">
                  {selectedWinner.track}
                </p>
              </div>
              <div>
                <p className="text-[#8f9eb2]">Issuing Authority</p>
                <p className="mt-1 font-semibold text-[#9fb2cc]">
                  Physics Club Magazine &bull; October STEM
                </p>
              </div>
            </div>

            {/* Feature Article Title */}
            <div className="mt-4 rounded-xl border border-white/10 bg-[#070d18]/60 p-4">
              <p className="text-xs text-[#8f9eb2]">Selected Feature Article</p>
              <p className="mt-1 font-serif text-lg font-bold italic text-white">
                &ldquo;{selectedWinner.title}&rdquo;
              </p>
            </div>

            {/* Embedded Live Certificate Preview */}
            <div className="mt-6 overflow-hidden rounded-xl border border-white/15 bg-[#03060b] shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 bg-[#070d18] px-4 py-2 text-xs text-[#8f9eb2]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span>A4 Landscape Live Certificate Preview</span>
                </div>
                <a
                  href={`/certificates/html/${selectedWinner.htmlFilename}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-club-light hover:underline"
                >
                  <span>Open Fullscreen</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
              <div className="relative aspect-[1122/793] w-full overflow-hidden">
                <iframe
                  src={`/certificates/html/${selectedWinner.htmlFilename}`}
                  title={`${selectedWinner.name} Certificate`}
                  className="h-full w-full border-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* All Top 10 Certificates Catalog */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-club-light" />
              <h2 className="text-lg font-bold tracking-wide text-white">
                All 10 Official Certificates
              </h2>
            </div>
            <span className="text-xs text-[#8f9eb2]">
              Showing {filteredWinners.length} certificate(s)
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWinners.map((winner) => (
              <div
                key={winner.certId}
                className={`group flex flex-col justify-between rounded-xl border p-5 shadow-lg transition hover:-translate-y-1 ${
                  selectedWinner?.certId === winner.certId
                    ? "border-club-light bg-club/10 ring-1 ring-club-light"
                    : "border-white/10 bg-[#0b1626]/70 hover:border-white/20 hover:bg-[#0b1626]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-mono font-bold text-club-light">
                      <span>#{winner.rank}</span>
                      <span>&bull;</span>
                      <span className="text-white">{winner.medal}</span>
                    </span>
                    <span className="font-mono text-[#8f9eb2]">{winner.certId}</span>
                  </div>

                  <h3 className="mt-3 font-serif text-xl font-bold text-white group-hover:text-club-light transition">
                    {winner.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#8f9eb2]">{winner.school}</p>

                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="font-serif text-sm italic text-[#d3dce8] line-clamp-2">
                      &ldquo;{winner.title}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
                  <button
                    onClick={() => handleSelectWinner(winner)}
                    className="flex-1 rounded-lg bg-white/10 py-2 text-center text-xs font-semibold text-white transition hover:bg-club"
                  >
                    View &amp; Verify
                  </button>
                  <a
                    href={`/certificates/pdf/${winner.pdfFilename}`}
                    download={winner.pdfFilename}
                    className="rounded-lg border border-white/15 bg-white/5 p-2 text-[#8f9eb2] transition hover:bg-white/10 hover:text-white"
                    title="Download PDF"
                  >
                    <Download className="size-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification FAQ / Explainer */}
        <div className="mt-16 rounded-xl border border-white/10 bg-[#0b1626]/40 p-6 sm:p-8">
          <h3 className="font-serif text-lg font-bold text-white">
            About Certificate Verification &amp; Security
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[#9fb2cc] sm:text-sm">
            Each certificate issued for the Youth Physics Writing Contest (YPWC) is uniquely numbered
            (e.g. <code className="font-mono text-white">YPWC-2026-01</code>) and equipped with an authenticated
            QR code leading directly to this verification page. Certificates are granted strictly to the Top 10
            participants whose articles have been accepted by the editorial board for publication in the
            Physics Club Magazine at October STEM School.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-8 text-center text-xs text-[#8f9eb2]">
        <p>&copy; 2026 Physics Club &bull; October STEM School. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-[#6c7d93]">
          Youth Physics Writing Contest (YPWC) &bull; Physics Club Magazine
        </p>
      </footer>
    </div>
  );
}
