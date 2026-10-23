"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";
import { WINNERS_DATA, type Winner } from "@/lib/winnersData";

export default function LeaderboardPage() {
  const top3 = WINNERS_DATA.slice(0, 3);
  const remainingWinners = WINNERS_DATA.slice(3);

  return (
    <div className="min-h-screen bg-[#070d18] text-[#d3dce8] selection:bg-club selection:text-white">
      {/* Background Glows */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
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
              className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition sm:text-sm"
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

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-club-light/30 bg-club/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-club-light">
            <Sparkles className="size-3.5" />
            Official Contest Results
          </div>
          <h1 className="mt-4 text-balance font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Youth Physics Writing Contest Leaderboard
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed text-[#9fb2cc] sm:text-base">
            Honoring the premier student science writers nationwide. The top 10 finalists
            have been formally selected by the editorial committee for feature publication
            in the <strong className="text-white">Physics Club Magazine</strong> at October STEM School.
          </p>
        </div>

        {/* Top 3 Podium Section */}
        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-[#f4d27a]" />
              <h2 className="text-lg font-bold tracking-wide text-white">
                Top 3 Laureates &amp; Special Prizes
              </h2>
            </div>
            <span className="text-xs font-medium text-club-light">
              Gold &bull; Silver &bull; Bronze
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {top3.map((winner) => (
              <PodiumCard key={winner.rank} winner={winner} />
            ))}
          </div>
        </div>

        {/* Full Top 10 Finalists Table / Grid */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-club-light" />
              <h2 className="text-lg font-bold tracking-wide text-white">
                Top 10 Finalists (Magazine Publication)
              </h2>
            </div>
            <span className="text-xs text-[#8f9eb2]">
              Rankings #4 to #10
            </span>
          </div>

          <div className="space-y-3.5">
            {remainingWinners.map((winner) => (
              <FinalistRow key={winner.rank} winner={winner} />
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 rounded-2xl border border-white/12 bg-gradient-to-r from-[#0b1626] via-[#0e1d33] to-[#0b1626] p-6 text-center shadow-2xl sm:p-10">
          <FileCheck className="mx-auto size-10 text-club-light" />
          <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
            Looking for Official Certificates?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-xs text-[#9fb2cc] sm:text-sm">
            All 10 winning certificates are digitally authenticated with unique certificate IDs and QR codes.
            You can verify any certificate or download high-resolution printable PDFs.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/certificates"
              className="inline-flex items-center gap-2 rounded-lg bg-club px-6 py-2.5 text-sm font-semibold text-white shadow-blue transition hover:bg-[#2e8cff]"
            >
              <Award className="size-4" />
              Go to Certificates Portal
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-white/14 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contest Overview
            </Link>
          </div>
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

function PodiumCard({ winner }: { winner: Winner }) {
  const isGold = winner.rank === 1;
  const isSilver = winner.rank === 2;
  const isBronze = winner.rank === 3;

  const medalBorder = isGold
    ? "border-[#d8b65f]/50 bg-gradient-to-b from-[#d8b65f]/15 to-[#0b1626]"
    : isSilver
    ? "border-[#c7cbd3]/50 bg-gradient-to-b from-[#c7cbd3]/12 to-[#0b1626]"
    : "border-[#cd7f32]/50 bg-gradient-to-b from-[#cd7f32]/12 to-[#0b1626]";

  const badgeColor = isGold
    ? "bg-[#d8b65f]/20 text-[#f4d27a] border-[#d8b65f]/40"
    : isSilver
    ? "bg-[#c7cbd3]/20 text-[#e2e6ee] border-[#c7cbd3]/40"
    : "bg-[#cd7f32]/20 text-[#e69b5c] border-[#cd7f32]/40";

  return (
    <div
      className={`relative flex flex-col justify-between rounded-xl border p-6 shadow-xl transition hover:-translate-y-1 ${medalBorder}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${badgeColor}`}
          >
            <span>Rank #{winner.rank}</span>
            <span>&bull;</span>
            <span>{winner.medal}</span>
          </span>
          <span className="font-mono text-xs font-semibold text-[#8f9eb2]">
            {winner.certId}
          </span>
        </div>

        <h3 className="mt-5 font-serif text-2xl font-bold text-white">
          {winner.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-club-light">
          <GraduationCap className="size-4 shrink-0" />
          <span>{winner.school}</span>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="font-serif text-sm font-semibold italic text-[#e6edf8]">
            &ldquo;{winner.title}&rdquo;
          </p>
          {winner.summary && (
            <p className="mt-2 text-xs leading-relaxed text-[#9fb2cc]">
              {winner.summary}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="rounded bg-[#070d18] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9fb2cc] border border-white/10">
          {winner.track}
        </span>
        <Link
          href={`/certificates?id=${winner.certId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-club-light transition hover:text-white"
        >
          <span>View Certificate</span>
          <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

function FinalistRow({ winner }: { winner: Winner }) {
  return (
    <div className="group flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-[#0b1626]/70 p-4.5 transition hover:border-club-light/40 hover:bg-[#0b1626] sm:flex-row sm:items-center">
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 font-mono text-base font-bold text-white">
          #{winner.rank}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-serif text-lg font-bold text-white group-hover:text-club-light transition">
              {winner.name}
            </h4>
            <span className="font-mono text-xs text-[#8f9eb2] border border-white/10 px-1.5 py-0.5 rounded">
              {winner.certId}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[#8f9eb2]">{winner.school}</p>
          <p className="mt-1.5 font-serif text-sm italic text-[#d3dce8]">
            &ldquo;{winner.title}&rdquo;
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <span className="rounded bg-[#070d18] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#9fb2cc] border border-white/10">
          {winner.track}
        </span>
        <Link
          href={`/certificates?id=${winner.certId}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-club-light hover:bg-club/15 hover:text-club-light"
        >
          <Award className="size-3.5" />
          <span>Certificate</span>
        </Link>
      </div>
    </div>
  );
}
