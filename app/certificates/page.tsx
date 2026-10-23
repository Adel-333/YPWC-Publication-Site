"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Copy,
  Download,
  GraduationCap,
  Printer,
  Search,
  Share2,
  ShieldCheck,
  Trophy,
  X,
} from "lucide-react";
import { findWinnerByIdOrRank, type Winner } from "@/lib/winnersData";

export default function CertificatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#111014] text-white">
          <div className="flex items-center gap-3">
            <div className="size-5 animate-spin rounded-full border-2 border-club-light border-t-transparent" />
            <span className="font-mono text-sm text-white/60">Loading Verification Portal...</span>
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

  const [inputCode, setInputCode] = useState(idParam || "");
  const [verifiedWinner, setVerifiedWinner] = useState<Winner | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-verify if id param is present in URL (e.g. from QR scan)
  useEffect(() => {
    if (idParam && idParam.trim()) {
      const match = findWinnerByIdOrRank(idParam.trim());
      if (match) {
        setVerifiedWinner(match);
        setInputCode(match.certId);
      } else {
        setVerifiedWinner(null);
      }
      setHasSearched(true);
    }
  }, [idParam]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inputCode.trim();
    if (!cleanCode) return;

    const match = findWinnerByIdOrRank(cleanCode);
    setHasSearched(true);
    if (match) {
      setVerifiedWinner(match);
      router.replace(`/certificates?id=${match.certId}`, { scroll: false });
    } else {
      setVerifiedWinner(null);
      router.replace(`/certificates?id=${encodeURIComponent(cleanCode)}`, { scroll: false });
    }
  };

  const handleReset = () => {
    setInputCode("");
    setVerifiedWinner(null);
    setHasSearched(false);
    router.replace("/certificates", { scroll: false });
  };

  const handleCopyLink = (certId: string) => {
    const url = `${window.location.origin}/certificates?id=${certId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#111014] text-white selection:bg-club selection:text-white">
      {/* Subtle Ambient Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-club/10 blur-[120px]" />
        <div className="absolute right-0 top-1/4 h-[380px] w-[380px] rounded-full bg-club-light/5 blur-[120px]" />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#111014]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
            <div className="relative size-9">
              <Image
                src="/assets/club-shield-transparent.webp"
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
                src="/assets/ypwc-logo-360.webp"
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
              <p className="text-[11px] text-white/50">Physics Club Magazine</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white sm:text-sm"
            >
              Overview
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:bg-white/5 hover:text-white sm:text-sm"
            >
              Leaderboard
            </Link>
            <Link
              href="/certificates"
              className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition sm:text-sm"
            >
              Verify Certificate
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold tracking-wider text-white/80">
            <ShieldCheck className="size-3.5 text-club-light" />
            Official Credential Verification
          </div>
          <h1 className="mt-5 text-balance font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Certificate Verification Portal
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-white/65 sm:text-base">
            Enter the unique Certificate ID printed on your physical award or scanned from your verification QR code.
          </p>
        </div>

        {/* Verification Form */}
        <div className="mx-auto mt-10 max-w-xl">
          <form onSubmit={handleVerify} className="flex items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Certificate ID, e.g. YPWC-2026-01"
                className="h-11 w-full rounded-lg border border-white/14 bg-[#15161d] pl-10 pr-4 text-sm text-white placeholder-white/35 transition focus:border-club-light focus:outline-none focus:ring-1 focus:ring-club-light"
              />
            </div>
            <button
              type="submit"
              className="h-11 rounded-lg bg-club px-5 text-sm font-semibold text-white shadow-blue transition hover:bg-[#2e8cff] shrink-0"
            >
              Verify
            </button>
          </form>
        </div>

        {/* State 1: Verified Certificate Display */}
        {verifiedWinner && (
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/14 bg-[#15161d] p-6 shadow-2xl sm:p-10">
            {/* Header / Status — close button top-right of card */}
            <div className="relative">
              <button
                onClick={handleReset}
                className="absolute right-0 top-0 inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white"
                title="Clear"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-3.5 pr-10">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Digitally Verified
                    </span>
                    <span className="h-3 w-px bg-white/20" />
                    <span className="font-mono text-xs font-semibold text-white/60">
                      {verifiedWinner.certId}
                    </span>
                  </div>
                  <h2 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">
                    {verifiedWinner.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Action Buttons row */}
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
              <a
                href={`/certificates/pdf/${verifiedWinner.pdfFilename}`}
                download={verifiedWinner.pdfFilename}
                className="inline-flex items-center gap-2 rounded-lg bg-club px-4 py-2.5 text-xs font-bold text-white shadow-blue transition hover:bg-[#2e8cff]"
              >
                <Download className="size-4" />
                <span>Download PDF</span>
              </a>
              <a
                href={`/certificates/html/${verifiedWinner.htmlFilename}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/14 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                <Printer className="size-4" />
                <span>Print / HTML</span>
              </a>
              <button
                onClick={() => handleCopyLink(verifiedWinner.certId)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/14 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
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
            </div>

            {/* Winner Details Grid */}
            <div className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div>
                <p className="text-white/50">Standing</p>
                <p className="mt-1 font-semibold text-white">
                  Rank #{verifiedWinner.rank} &bull; {verifiedWinner.medal}
                </p>
              </div>
              <div>
                <p className="text-white/50">School</p>
                <p className="mt-1 font-semibold text-white">
                  {verifiedWinner.school}
                </p>
              </div>
              <div>
                <p className="text-white/50">Subject Track</p>
                <p className="mt-1 font-semibold text-white">
                  {verifiedWinner.track}
                </p>
              </div>
              <div>
                <p className="text-white/50">Magazine Selection</p>
                <p className="mt-1 font-semibold text-emerald-400">
                  Approved for Publication
                </p>
              </div>
            </div>

            {/* Article Title */}
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs text-white/50">Published Article Title</p>
              <h3 className="mt-1 font-serif text-lg font-semibold italic text-white/90">
                &ldquo;{verifiedWinner.title}&rdquo;
              </h3>
            </div>

            {/* Embedded Live Certificate Preview */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="mb-3 flex items-center justify-between text-xs text-white/60">
                <span className="font-semibold uppercase tracking-wider text-white/70">
                  Official Certificate Preview
                </span>
                <span className="text-white/40">Authentic 2026 Edition</span>
              </div>
              <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-xl border border-white/15 bg-black shadow-inner">
                <iframe
                  src={`/certificates/html/${verifiedWinner.htmlFilename}`}
                  title={`${verifiedWinner.name} Certificate Preview`}
                  className="size-full border-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* State 2: Code Not Found */}
        {hasSearched && !verifiedWinner && (
          <div className="mx-auto mt-10 max-w-xl rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
            <AlertCircle className="mx-auto size-8 text-rose-400" />
            <h3 className="mt-3 text-base font-bold text-white">
              No Certificate Found
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-rose-200/80">
              We couldn&apos;t verify any certificate matching &ldquo;{inputCode}&rdquo;. Please verify the code printed
              beneath your certificate&apos;s QR code (format: <code className="font-mono text-white">YPWC-2026-XX</code>) and try again.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 rounded-md border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Try Another Code
            </button>
          </div>
        )}

        {/* State 3: Empty Default State (Instructions) */}
        {!hasSearched && (
          <div className="mx-auto mt-12 max-w-xl rounded-xl border border-white/10 bg-[#15161d] p-8 text-center">
            <ShieldCheck className="mx-auto size-10 text-club-light" />
            <h3 className="mt-4 text-base font-bold text-white">
              Official Academic Credential
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Each Merit Certificate issued for the Youth Physics Writing Contest contains an exclusive verification ID
              and high-resolution QR code linking directly to this portal.
            </p>
            <div className="mt-6 border-t border-white/10 pt-4 text-xs text-white/40">
              Physics Club Magazine &bull; STEM High School for Boys – 6th of October
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/10 py-10 text-center text-xs text-white/50">
        <p>&copy; 2026 Youth Physics Writing Contest &bull; Physics Club Magazine. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-white/35">
          Official Credential Verification System &bull; octphysicsclub.org
        </p>
      </footer>
    </div>
  );
}
