"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";
import { WINNERS_DATA, type Winner } from "@/lib/winnersData";

export default function LeaderboardPage() {
  const top3 = WINNERS_DATA.slice(0, 3);
  const remainingWinners = WINNERS_DATA.slice(3);

  return (
    <div className="min-h-screen bg-[#111014] text-white selection:bg-club selection:text-white">
      {/* Subtle Ambient Background */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
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
              className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition sm:text-sm"
            >
              Leaderboard
            </Link>
            <Link
              href="/certificates"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/14 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-club-light hover:bg-white/[0.08] sm:text-sm"
            >
              <Award className="size-4 text-club-light" />
              <span>Verify Certificate</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold tracking-wider text-white/80">
            <Sparkles className="size-3.5 text-club-light" />
            Official Contest Standings
          </div>
          <h1 className="mt-5 text-balance font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl">
            YPWC 2026 Leaderboard
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed text-white/65 sm:text-base">
            Recognizing Egypt&apos;s premier high school physics writers. The editorial committee has selected
            the Top 10 finalists for feature publication in the <strong className="text-white">Physics Club Magazine</strong>.
          </p>
        </div>

        {/* Podium: Top 3 Laureates */}
        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-[#f4d27a]" />
              <h2 className="text-base font-bold tracking-wide text-white sm:text-lg">
                The Top 3 Laureates
              </h2>
            </div>
            <span className="text-xs text-white/50">
              Gold &bull; Silver &bull; Bronze
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {top3.map((winner) => (
              <PodiumCard key={winner.rank} winner={winner} />
            ))}
          </div>
        </div>

        {/* Positions 4 to 10: Editorial Honorees */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-club-light" />
              <h2 className="text-base font-bold tracking-wide text-white sm:text-lg">
                Top 10 Finalists (Magazine Publication)
              </h2>
            </div>
            <span className="text-xs text-white/50">
              Rankings #4 through #10
            </span>
          </div>

          <div className="space-y-3">
            {remainingWinners.map((winner) => (
              <FinalistRow key={winner.rank} winner={winner} />
            ))}
          </div>
        </div>

        {/* Publication Summary Box */}
        <div className="mt-16 rounded-xl border border-white/10 bg-[#15161d] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <BookOpen className="size-6 text-club-light" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">
                  Physics Club Magazine Publication
                </h3>
                <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/60 sm:text-sm">
                  All 10 finalist manuscripts will be published in a special print and digital issue
                  dedicated to student science journalism and theoretical physics exploration.
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex shrink-0 items-center justify-center rounded-md border border-white/16 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Return to Overview
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-10 text-center text-xs text-white/50">
        <p>&copy; 2026 Youth Physics Writing Contest &bull; Physics Club Magazine. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-white/35">
          October STEM High School for Boys &bull; octphysicsclub.org
        </p>
      </footer>
    </div>
  );
}

function PodiumCard({ winner }: { winner: Winner }) {
  const isGold = winner.rank === 1;
  const isSilver = winner.rank === 2;

  const accentColor = isGold
    ? "text-[#c9a84c]"
    : isSilver
    ? "text-zinc-400"
    : "text-[#a0643a]";

  const rankLabel = isGold ? "Gold" : isSilver ? "Silver" : "Bronze";

  return (
    <div className="relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#15161d] p-6 transition hover:-translate-y-0.5">
      <div>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-widest ${accentColor}`}>
            #{winner.rank} &mdash; {rankLabel}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/35">
            {winner.track}
          </span>
        </div>

        <h3 className="mt-4 font-serif text-xl font-bold text-white leading-snug">
          {winner.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/50">
          <GraduationCap className="size-3.5 shrink-0" />
          <span>{winner.school}</span>
        </div>

        <div className="mt-5 border-t border-white/8 pt-4">
          <p className="font-serif text-sm italic text-white/75 leading-relaxed">
            &ldquo;{winner.title}&rdquo;
          </p>
          {winner.summary && (
            <p className="mt-2 text-xs leading-relaxed text-white/45">
              {winner.summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FinalistRow({ winner }: { winner: Winner }) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.04] sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/5 font-mono text-sm font-bold text-white/80">
          #{winner.rank}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-serif text-lg font-bold text-white">
              {winner.name}
            </h4>
          </div>
          <p className="mt-0.5 text-xs text-white/50">{winner.school}</p>
          <p className="mt-2 font-serif text-sm italic text-white/80">
            &ldquo;{winner.title}&rdquo;
          </p>
        </div>
      </div>

      <div className="shrink-0 self-start sm:self-center">
        <span className="rounded bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 border border-white/10">
          {winner.track}
        </span>
      </div>
    </div>
  );
}
