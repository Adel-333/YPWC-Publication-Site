// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  HelpCircle,
  PenLine,
  Plus,
  Send,
  Sparkles,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import { WINNERS_DATA } from "@/lib/winnersData";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useMotionValue,
  animate,
} from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Brief", href: "#brief" },
  { label: "Timeline", href: "#timeline" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Certificates", href: "/certificates" },
  { label: "FAQ", href: "#faq" },
];

const briefCards = [
  {
    label: "Format",
    value: "600-1500",
    caption: "words, Word or PDF",
    icon: PenLine,
  },
  {
    label: "Evaluation",
    value: "100",
    caption: "total rubric points",
    icon: ClipboardCheck,
  },
  {
    label: "Selection",
    value: "1",
    caption: "single round",
    icon: Trophy,
  },
];

const overviewCards = [
  {
    title: "Main Idea",
    body: "Participants select a physics topic and develop it into an accessible article. Submissions may use illustrations, diagrams, examples, and other forms of visual explanation to communicate the subject effectively.",
    icon: Sparkles,
  },
  {
    title: "Who It Is For",
    body: "YPWC is open to Egyptian students interested in physics and scientific writing, including those who want to explain physics to readers without a specialized background.",
    icon: Users,
  },
  {
    title: "What Makes It Unique",
    body: "YPWC combines competition with editorial review and publication. Selected submissions receive feedback and may be published through the Young Physics Writing Contest, giving students the opportunity to develop their work beyond the competition.",
    icon: BookOpen,
  },
];

const awards = [
  "Gold medals for the top 30% in a 3 : 2 : 1 ratio",
  "Silver medals alongside Gold for strong entries",
  "Bronze medals completing the top performers",
  "Special prizes for the top 3 on the leaderboard",
  "Certificates for all participants",
];

const medalStyles = {
  Gold: {
    surface: "border-[#d8b65f]/42 bg-[#d8b65f]/10",
    number: "border-[#d8b65f]/45 bg-[#d8b65f]/14 text-[#f4d27a] shadow-[0_0_22px_rgba(216,182,95,0.16)]",
    label: "text-[#f4d27a]",
    accent: "via-[#d8b65f]/75",
  },
  Silver: {
    surface: "border-[#c7cbd3]/42 bg-[#c7cbd3]/9",
    number: "border-[#c7cbd3]/45 bg-[#c7cbd3]/14 text-[#e2e6ee] shadow-[0_0_22px_rgba(199,203,211,0.14)]",
    label: "text-[#e2e6ee]",
    accent: "via-[#c7cbd3]/72",
  },
  Bronze: {
    surface: "border-[#b8784b]/45 bg-[#b8784b]/10",
    number: "border-[#b8784b]/45 bg-[#b8784b]/14 text-[#d99a68] shadow-[0_0_22px_rgba(184,120,75,0.15)]",
    label: "text-[#d99a68]",
    accent: "via-[#b8784b]/75",
  },
} as const;

const revealVariants = {
  fadeUp: { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  scaleIn: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  blurIn: { hidden: { opacity: 0, filter: "blur(12px)" }, visible: { opacity: 1, filter: "blur(0px)" } },
  slideLeft: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
};

type RevealVariant = keyof typeof revealVariants;

function Reveal({
  children,
  className,
  delay = 0,
  variant = "fadeUp",
  duration = 0.62,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  duration?: number;
}) {
  const reduced = useReducedMotion();
  const v = revealVariants[variant];

  return (
    <motion.div
      className={className}
      initial={reduced ? false : v.hidden}
      whileInView={reduced ? undefined : v.visible}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-40 -top-40 size-[32rem] rounded-full bg-club/14 blur-[120px] animate-drift-slow" />
      <div className="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-[#2e8cff]/10 blur-[120px] animate-drift-slow" style={{ animationDelay: "4s" }} />
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-club/8"
          style={{
            width: 60 + i * 55,
            height: 60 + i * 55,
            left: `${12 + i * 19}%`,
            top: `${8 + i * 17}%`,
          }}
          animate={{
            y: [0, -40 - i * 12, 0],
            x: [0, i % 2 === 0 ? 26 : -26, 0],
            scale: [1, 1.12, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 7 + i * 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}
    </div>
  );
}

function OrbitingParticles() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const radius = 120 + ((i * 13) % 90);
        const size = 2 + (i % 4);
        const radial = i % 3 === 0;
        return (
          <motion.div
            key={i}
            className={radial ? "absolute rounded-full bg-club-light" : "absolute rounded-full bg-club-light/50"}
            style={{
              width: size,
              height: size,
              left: "50%",
              top: "50%",
              boxShadow: radial ? "0 0 14px rgba(92,158,255,0.9)" : "none",
              filter: radial ? "blur(0.3px)" : "none",
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
            }}
            animate={
              radial
                ? {
                    x: [
                      Math.cos(angle) * radius,
                      Math.cos(angle + Math.PI) * radius,
                      Math.cos(angle) * radius,
                    ],
                    y: [
                      Math.sin(angle) * radius,
                      Math.sin(angle + Math.PI) * radius,
                      Math.sin(angle) * radius,
                    ],
                    opacity: [0.35, 1, 0.35],
                    scale: [1, 2.2, 1],
                  }
                : {
                    x: [
                      Math.cos(angle) * radius,
                      Math.cos(angle + Math.PI) * radius,
                      Math.cos(angle) * radius,
                    ],
                    y: [
                      Math.sin(angle) * radius,
                      Math.sin(angle + Math.PI) * radius,
                      Math.sin(angle) * radius,
                    ],
                    opacity: [0.18, 0.75, 0.18],
                    scale: [1, 1.6, 1],
                  }
            }
            transition={{
              duration: 6 + i * 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        );
      })}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-club-light">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight text-white md:text-6xl">
        {title}
      </h2>
      {text ? (
        <p className="mt-5 text-base leading-8 text-white/68 md:text-lg">{text}</p>
      ) : null}
    </Reveal>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#111014]/82 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-1" aria-label="YPWC home">
          <Image
            src="/assets/club-shield-transparent.webp"
            alt="Physics Club logo"
            width={40}
            height={40}
            className="relative z-10 size-9 object-contain sm:size-10"
          />
          <span className="relative z-20 mx-0.5 h-8 w-px bg-white/55 shadow-[0_0_10px_rgba(255,255,255,0.2)]" aria-hidden="true" />
          <Image
            src="/assets/ypwc-logo-360.webp"
            alt=""
            width={40}
            height={40}
            className="relative z-10 size-9 object-contain sm:size-10"
          />
        </a>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-white/58 transition hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/leaderboard"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/16 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-club-light hover:bg-white/[0.07]"
          >
            <Trophy className="size-4" aria-hidden="true" />
            Leaderboard
          </Link>
          <Link
            href="/certificates"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-club px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2e8cff]"
          >
            <Award className="size-4" aria-hidden="true" />
            Certificates
          </Link>
        </div>
      </div>
    </header>
  );
}

function EditorialCardStack() {
  const reduced = useReducedMotion();

  return (
    <>
      <div className="relative mx-auto h-72 w-52 overflow-hidden rounded-md border border-club-light/38 bg-[#0e3f8d] shadow-[0_34px_90px_rgba(0,0,0,0.42)] sm:hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18),transparent_42%,rgba(255,255,255,0.08))]" />
        <Image
          src="/assets/ypwc-logo-360.webp"
          alt=""
          width={180}
          height={180}
          className="absolute left-1/2 top-8 w-24 -translate-x-1/2 object-contain"
        />
        <div className="absolute inset-x-6 bottom-6">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/60">
            Physics Club Magazine
          </p>
          <div className="mt-3 h-3 w-full bg-white/85" />
          <div className="mt-2 h-3 w-2/3 bg-white/65" />
        </div>
      </div>

      <div className="relative hidden h-[24rem] overflow-hidden rounded-md border border-white/10 bg-black/18 sm:block" aria-hidden="true">
        <motion.div
          className="absolute left-[8%] top-[18%] h-56 w-40 rotate-[-10deg] border border-white/16 bg-white/[0.08] shadow-blue-soft"
          animate={reduced ? {} : { y: [0, -10, 0], rotate: [-10, -7, -10] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(92,158,255,0.16),transparent_54%)]" />
          <Image
            src="/assets/club-shield-transparent.webp"
            alt=""
            width={130}
            height={130}
            className="absolute left-1/2 top-9 w-24 -translate-x-1/2 object-contain opacity-90"
          />
          <p className="absolute inset-x-4 top-36 text-center text-[0.62rem] font-semibold uppercase leading-4 tracking-[0.12em] text-white/70">
            Once a member, Always a member
          </p>
          <div className="absolute inset-x-5 bottom-7 space-y-3">
            <div className="h-2 w-24 bg-club-light/45" />
            <div className="h-2 w-28 bg-white/32" />
            <div className="h-2 w-20 bg-white/20" />
          </div>
        </motion.div>

        <motion.div
          className="absolute left-[28%] top-[7%] h-72 w-52 rotate-[4deg] overflow-hidden border border-club-light/38 bg-[#0e3f8d] shadow-[0_34px_90px_rgba(0,0,0,0.42)]"
          animate={reduced ? {} : { y: [0, 12, 0], rotate: [4, 2, 4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18),transparent_42%,rgba(255,255,255,0.08))]" />
          <Image
            src="/assets/ypwc-logo-360.webp"
            alt=""
            width={180}
            height={180}
            className="absolute left-1/2 top-10 w-32 -translate-x-1/2 object-contain"
          />
          <div className="absolute inset-x-6 bottom-7">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/60">
              Physics Club Magazine
            </p>
            <div className="mt-4 h-3 w-full bg-white/85" />
            <div className="mt-3 h-3 w-2/3 bg-white/65" />
          </div>
        </motion.div>

        <motion.div
          className="absolute right-[6%] top-[20%] h-60 w-40 rotate-[13deg] border border-white/14 bg-[#f4f7fb] text-[#111014] shadow-blue-soft"
          animate={reduced ? {} : { y: [0, -14, 0], rotate: [13, 16, 13] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mx-5 mt-6 flex items-center gap-3">
            <BookOpen className="size-5 text-[#0e3f8d]" />
            <span className="h-px flex-1 bg-[#0e3f8d]/30" />
          </div>
          <div className="mx-5 mt-10 text-4xl font-semibold">100</div>
          <div className="mx-5 mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#0e3f8d]">
            rubric points
          </div>
          <div className="mx-5 mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-[#0e3f8d]">
            Results Live!
          </div>
        </motion.div>
      </div>
    </>
  );
}

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    let intervalId: number | undefined;
    const timerId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) window.clearInterval(intervalId);
      }, 26);
    }, 650);
    return () => {
      window.clearTimeout(timerId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [text, reduced]);

  return (
    <span className={className}>
      {reduced ? text : text.slice(0, count)}
      <span
        className="ml-0.5 inline-block h-[1.05em] w-0.5 translate-y-[0.18em] bg-club-light align-baseline"
        aria-hidden="true"
      />
    </span>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const logoScale = useTransform(scrollY, [0, 600], [1, 0.85]);

  return (
    <section id="hero" className="hero-lines relative isolate overflow-hidden px-4 pt-28 sm:px-6 lg:px-8">
      <FloatingOrbs />
      <motion.div style={{ y: reduced ? 0 : heroY, opacity: reduced ? 1 : heroOpacity }}>
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 pb-20 min-[880px]:grid-cols-[1.03fr_0.97fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-club-light"
            >
              A Physics Club Magazine competition
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-5xl text-balance text-5xl font-semibold leading-[1.02] text-white md:text-7xl lg:text-8xl"
            >
              Young Physics Writing Contest
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-2xl min-h-24 text-lg leading-8 text-white/72 md:text-xl md:min-h-16"
            >
              <TypewriterText text="A national writing competition for high school students to transform a physics idea into a creative and publication-ready article." />
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/leaderboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-club px-6 text-sm font-semibold text-white shadow-blue transition hover:-translate-y-0.5 hover:bg-[#2e8cff]"
              >
                <Trophy className="size-4" aria-hidden="true" />
                View Leaderboard
              </Link>
              <Link
                href="/certificates"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/16 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-club-light hover:bg-white/[0.07]"
              >
                <Award className="size-4 text-club-light" aria-hidden="true" />
                View Certificates
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ scale: reduced ? 1 : logoScale }}
            className="relative z-10 mx-auto w-full max-w-[560px]"
          >
            <div className="relative aspect-square">
              <OrbitingParticles />
              <div className="absolute inset-10 rounded-full bg-club/20 blur-[100px] animate-pulse-glow" aria-hidden="true" />
              <motion.div
                className="absolute inset-8 rounded-full border border-club-light/24"
                animate={reduced ? {} : { rotate: 360 }}
                transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
              />
              <motion.div
                className="absolute inset-3 rounded-full border border-dashed border-white/12"
                animate={reduced ? {} : { rotate: -360 }}
                transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
              />
              <motion.div
                className="absolute inset-4 rounded-full bg-club/6 blur-3xl"
                animate={reduced ? {} : { scale: [1, 1.18, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              <Image
                src="/assets/ypwc-logo-360.webp"
                alt="Young Physics Writing Contest logo"
                fill
                priority
                className="relative z-10 object-contain drop-shadow-[0_30px_90px_rgba(0,120,255,0.28)]"
                sizes="(max-width: 1024px) 88vw, 42vw"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-club" aria-hidden="true" />
    </section>
  );
}

function Overview() {
  return (
    <section id="overview" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-lg border border-white/12 bg-[#15161d] p-8 shadow-blue-soft">
              <div className="absolute -right-24 -top-24 size-72 rounded-full border border-club-light/20" aria-hidden="true" />
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <Image
                  src="/assets/ypwc-logo-360.webp"
                  alt="Young Physics Writing Contest logo"
                  width={120}
                  height={120}
                  className="size-20 shrink-0 object-contain sm:size-24"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-club-light">
                    Main home
                  </p>
                  <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
                    A publication-first physics competition.
                  </h2>
                </div>
              </div>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/68">
                YPWC is a physics writing competition that challenges students
                to communicate physics clearly and accurately through original
                articles.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {overviewCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title} delay={index * 0.05}>
                  <motion.article
                    whileHover={{ y: -10, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 280, damping: 16 }}
                    className="group relative overflow-hidden rounded-md border border-white/12 bg-white/[0.045] p-6"
                  >
                    <div className="absolute -right-12 -top-12 size-36 rounded-full bg-club/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: -8 }}
                      transition={{ type: "spring", stiffness: 260, damping: 12 }}
                      className="inline-flex"
                    >
                      <Icon className="size-6 text-club-light" aria-hidden="true" />
                    </motion.span>
                    <h3 className="mt-5 text-xl font-semibold text-white">{card.title}</h3>
                    <p className="mt-3 leading-7 text-white/64">{card.body}</p>
                  </motion.article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Brief() {
  return (
    <section id="brief" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Competition brief"
          title="Physics writing for publication."
          text="YPWC is a national competition that asks students to communicate physics through accurate, well-structured articles. Submissions are evaluated as pieces of scientific writing, with emphasis on clarity, accuracy, and effective communication."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {briefCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.label} delay={index * 0.05}>
                <motion.article
                  whileHover={{ y: -8, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="group relative h-full overflow-hidden rounded-md border border-white/12 bg-white/[0.045] p-6"
                >
                  <div className="conic-ring" aria-hidden="true" />
                  <motion.span
                    whileHover={{ rotate: -8, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 260, damping: 12 }}
                    className="inline-flex"
                  >
                    <Icon className="size-7 text-club-light" aria-hidden="true" />
                  </motion.span>
                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-white/44">
                    {card.label}
                  </p>
                  <p className="mt-2 text-5xl font-semibold text-white">{card.value}</p>
                  <p className="mt-3 text-sm leading-6 text-white/62">{card.caption}</p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <div id="format" className="mt-10 rounded-lg border border-club-light/24 bg-club/8 p-6 text-center md:p-8">
            <Download className="mx-auto size-8 text-club-light" />
            <h3 className="mt-4 text-2xl font-semibold text-white">Download the full contest format</h3>
            <p className="mt-2 text-white/64">Everything you need to know about structure, rules, and submission guidelines.</p>
            <a
              href="/assets/YPWC Plan.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-12 items-center gap-2 rounded-md bg-club px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2e8cff]"
            >
              <Download className="size-4" />
              YPWC Plan (PDF)
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Organizer() {
  return (
    <section id="organizer" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal>
            <div className="flex min-h-[16rem] items-center justify-center overflow-hidden rounded-lg border border-white/12 bg-[#15161d] p-3 shadow-blue-soft sm:p-5">
              <Image
                src="/assets/physics-club-brand-960.webp"
                alt="Physics Club logo"
                width={960}
                height={345}
                className="w-full max-w-[640px] object-contain"
                sizes="(max-width: 1024px) 90vw, 48vw"
              />
            </div>
          </Reveal>
          <SectionHeader
            align="left"
            eyebrow="Organized by"
            title="A Physics Club Magazine competition."
            text="YPWC is built inside the Physics Club Magazine ecosystem, so it carries the club's identity while keeping its own editorial mark."
          />
        </div>
      </div>
    </section>
  );
}

function AwardsAndPublication() {
  return (
    <section id="awards" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <div className="h-full rounded-lg border border-white/12 bg-white/[0.045] p-7 md:p-9">
            <Award className="size-7 text-club-light" aria-hidden="true" />
            <h2 className="mt-7 text-4xl font-semibold leading-tight text-white md:text-5xl">
              Awards that reflect different kinds of excellence.
            </h2>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {awards.map((award, index) => (
                <motion.div
                  key={award}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "rounded-md border border-white/10 bg-[#101116] p-5 text-white/78",
                    index === 0 && "sm:col-span-2 text-white",
                  )}
                >
                  <Trophy className="mb-4 size-5 text-club-light" aria-hidden="true" />
                  <p className="font-semibold">{award}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="relative h-full overflow-hidden rounded-lg border border-club-light/24 bg-club/10 p-7 md:p-9">
            <div className="absolute -right-24 -top-24 size-72 rounded-full border border-club-light/20" aria-hidden="true" />
            <BookOpen className="size-7 text-club-light" aria-hidden="true" />
            <h2 className="mt-7 text-4xl font-semibold leading-tight text-white md:text-5xl">
              Selected articles become a Physics Club Magazine issue.
            </h2>
            <p className="mt-6 max-w-xl leading-8 text-white/68">
              The contest ends with a polished publication, not only a ranking.
              Strong student writing is collected into a digital magazine for
              the wider school community to read.
            </p>
            <a
              href="https://www.octphysicsclub.org/magazine"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-club px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2e8cff]"
            >
              <BookOpen className="size-4" aria-hidden="true" />
              Read the magazine
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const timelineSteps = [
  {
    step: "01",
    title: "Registration opens",
    description: "Submit your intent with topic, draft direction, and your article. No separate rounds.",
    date: "September 7 - October 5",
  },
  {
    step: "02",
    title: "Registration closes",
    description: "All submissions are locked on October 5. No further changes accepted.",
    date: "October 5",
  },
  {
    step: "03",
    title: "Judging",
    description: "Every article is scored once against the 100-point rubric by club mentors and editors.",
    date: "October 5 - October 10",
  },
  {
    step: "04",
    title: "Results & medals",
    description: "The top 30% of participants receive medals in a 3:2:1 Gold-Silver-Bronze ratio. The top 3 earn special prizes.",
    date: "October 10",
  },
  {
    step: "05",
    title: "Publication",
    description: "Selected articles are published in a dedicated Physics Club Magazine issue.",
    date: "After results",
  },
];

function Timeline() {
  return (
    <section id="timeline" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Competition timeline"
          title="One round, from registration to results."
          text="Registration runs from September 7 to October 5. Judging follows from October 5 to October 10, and results are announced on October 10."
        />
        <div className="relative mt-16">
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-club-light/60 via-club/30 to-transparent md:block" aria-hidden="true" />
          <div className="space-y-12">
            {timelineSteps.map((step, index) => (
              <Reveal key={step.step} delay={index * 0.08} variant={index % 2 === 0 ? "slideLeft" : "slideRight"}>
                <div className="relative md:flex md:items-start md:gap-8">
                  <div className="hidden md:flex md:w-16 md:shrink-0 md:items-center md:justify-center">
                    <motion.div
                      className="flex size-10 items-center justify-center rounded-full border border-club-light/40 bg-[#111014] text-sm font-bold text-club-light"
                      whileHover={{ scale: 1.15, borderColor: "rgba(92,158,255,0.8)" }}
                    >
                      {step.step}
                    </motion.div>
                  </div>
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01, borderColor: "rgba(92,158,255,0.6)" }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="group rounded-lg border border-white/12 bg-white/[0.045] p-6 md:flex-1"
                  >
                    <motion.div
                      className="mb-3 inline-flex size-8 items-center justify-center rounded-full border border-club-light/40 bg-[#111014] text-xs font-bold text-club-light md:hidden"
                      whileHover={{ scale: 1.1 }}
                    >
                      {step.step}
                    </motion.div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-club-light">{step.date}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-club-light">{step.title}</h3>
                    <p className="mt-2 leading-7 text-white/64">{step.description}</p>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Leaderboard() {
  const top3 = WINNERS_DATA.slice(0, 3);

  return (
    <section id="leaderboard" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Official Leaderboard"
          title="Congratulations to Egypt's Young Physics Authors"
          text="Results have been finalized by the editorial committee. The top 10 finalists have been selected for publication in the Physics Club Magazine, with special honors awarded to the top three laureates."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {top3.map((entry, index) => {
            const medalKey = entry.medal as "Gold" | "Silver" | "Bronze";
            return (
              <Reveal key={entry.rank} delay={index * 0.08}>
                <motion.article
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl p-8 text-center border shadow-xl",
                    medalStyles[medalKey]?.surface || "border-white/10 bg-white/5",
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-100",
                      medalStyles[medalKey]?.accent,
                    )}
                  />
                  <div>
                    <div className="flex justify-center">
                      <span
                        className={cn(
                          "flex size-14 items-center justify-center rounded-full border text-2xl font-bold font-mono",
                          medalStyles[medalKey]?.number,
                        )}
                      >
                        #{entry.rank}
                      </span>
                    </div>
                    <p className={cn("mt-4 text-xs font-semibold uppercase tracking-[0.18em]", medalStyles[medalKey]?.label)}>
                      {entry.medal} Medal
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-white font-serif">{entry.name}</h3>
                    <p className="mt-1 text-xs text-club-light">{entry.school}</p>
                    <p className="mt-4 font-serif text-sm italic text-white/80 line-clamp-2">
                      &ldquo;{entry.title}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center">
                    <span className="rounded bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/60 border border-white/10">
                      {entry.track}
                    </span>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-club-light/20 bg-club/8 p-6">
            <div>
              <h4 className="text-base font-bold text-white">Full Top 10 Leaderboard &amp; Desk Honorees</h4>
              <p className="text-sm text-white/64 mt-1">
                Explore all 10 published finalists, their schools, article titles, and editorial rankings.
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-club px-5 py-2.5 text-sm font-semibold text-white shadow-blue transition hover:bg-[#2e8cff]"
            >
              <Trophy className="size-4" />
              <span>View Full Leaderboard Page</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const faqItems = [
  {
    question: "Who can participate in YPWC?",
    answer: "Any student from grades 9 to 12 who is interested in physics and writing. There is no prerequisite other than curiosity and a willingness to explain science clearly.",
  },
  {
    question: "What should I write about?",
    answer: "Choose a scientific desk, then find the human story inside it. Space and astronomy, electricity and magnetism, waves and sound, modern and quantum physics, thermodynamics, and physics in daily life are all open desks to write from.",
  },
  {
    question: "What is the required article length?",
    answer: "Articles should be between 600 and 1500 words. Submissions can be in Word or PDF format, and you may also upload an image or GIF to accompany your article.",
  },
  {
    question: "When can I register?",
    answer: "Registration opens on September 7 and closes on October 5. Judging runs from October 5 to October 10, and results are announced on October 10.",
  },
  {
    question: "Can I use AI tools to write my article?",
    answer: "AI-generated writing is not allowed in the final submission. The article must be your own original work. AI may be used for research or brainstorming ideas.",
  },
  {
    question: "How are articles evaluated?",
    answer: "The judging values are clear before writers begin. Every article is scored against 100 points split across six categories: scientific accuracy and conceptual understanding (30), physical reasoning and analysis (20), clarity and structure (20), creativity and intellectual contribution (15), real-world connection (10), and research and references (5).",
  },
  {
    question: "How are winners and medals decided?",
    answer: "There is a single round. The top 30% of participants receive medals in a 3:2:1 Gold-Silver-Bronze ratio, and the top 3 on the leaderboard earn special prizes.",
  },
  {
    question: "Will my article be published?",
    answer: "Selected articles are published in a dedicated Physics Club Magazine issue, giving participants a real publication credit.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="Frequently asked questions"
          title="Common questions about the contest."
          text="Everything you need to know before registering."
        />
        <div className="mt-14 space-y-3">
          {faqItems.map((item, index) => (
            <Reveal key={index} delay={index * 0.04} variant="fadeUp">
              <div className="overflow-hidden rounded-lg border border-white/12 bg-white/[0.045]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/[0.03]"
                  aria-expanded={openIndex === index}
                >
                  <span className="pr-4 font-medium text-white">{item.question}</span>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-club-light"
                  >
                    <Plus className="size-5" />
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 px-6 py-4 text-sm leading-7 text-white/64">
                    {item.answer}
                  </div>
                </motion.div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, target, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [isInView, count, target]);

  return (
    <div ref={ref} className="text-center">
      <motion.p className="text-5xl font-bold text-white md:text-6xl">
        <motion.span>{useTransform(count, Math.round)}</motion.span>
        {suffix}
      </motion.p>
      <p className="mt-2 text-sm text-white/52">{label}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="border-y border-white/10 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <AnimatedCounter target={600} label="Minimum word count" suffix="+" />
          <AnimatedCounter target={30} label="Top % receive medals" suffix="%" />
          <AnimatedCounter target={100} label="Total rubric points" />
          <AnimatedCounter target={3} label="Top leaderboard prizes" />
        </div>
      </div>
    </section>
  );
}

function RegistrationClosedSection() {
  return (
    <section id="register" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/14 bg-gradient-to-b from-[#15161d] to-[#0c0d12] p-8 shadow-blue-soft md:p-14 text-center">
            <div className="absolute -right-20 -top-20 size-64 rounded-full border border-club-light/18" aria-hidden="true" />
            <div className="absolute -left-20 -bottom-20 size-64 rounded-full border border-club/10" aria-hidden="true" />

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
              <span className="size-2 rounded-full bg-zinc-300 animate-pulse" />
              Submissions Closed
            </div>

            <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl font-serif">
              Contest Submissions Are Officially Closed
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              The submission and judging periods for the Youth Physics Writing Contest (YPWC) have concluded.
              The editorial committee has finalized evaluation, and the official Leaderboard is now live.
            </p>

            <div className="mt-10 flex items-center justify-center">
              <Link
                href="/leaderboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/30 bg-gradient-to-b from-zinc-100 via-zinc-200 to-zinc-300 px-8 text-sm font-semibold text-zinc-950 shadow-lg transition hover:-translate-y-0.5 hover:from-white hover:to-zinc-200"
              >
                <Trophy className="size-4 text-zinc-800" aria-hidden="true" />
                View Leaderboard
              </Link>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/44">
              Thank you to all high school physics writers who participated from schools across Egypt.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-1">
          <Image
            src="/assets/club-shield-transparent.webp"
            alt="Physics Club logo"
            width={48}
            height={48}
            className="relative z-10 size-12 object-contain"
          />
          <span className="relative z-20 mx-0.5 h-8 w-px bg-white/55 shadow-[0_0_10px_rgba(255,255,255,0.2)]" aria-hidden="true" />
          <div className="flex items-center gap-3">
            <Image
              src="/assets/ypwc-logo-360.webp"
              alt=""
              width={44}
              height={44}
              className="relative z-10 size-11 object-contain"
            />
            <div>
              <p className="font-semibold text-white">Youth Physics Writing Contest</p>
              <p className="text-sm text-white/52">Physics Club Magazine</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/52">
          <a href="https://www.octphysicsclub.org/" className="hover:text-club-light">
            Club
          </a>
          <a href="https://www.octphysicsclub.org/magazine/" className="hover:text-club-light">
            Magazine
          </a>
          <a href="#timeline" className="hover:text-club-light">
            Timeline
          </a>
          <a href="#faq" className="hover:text-club-light">
            FAQ
          </a>
          <Link href="/leaderboard" className="hover:text-club-light">
            Leaderboard
          </Link>
          <Link href="/certificates" className="hover:text-club-light">
            Certificates
          </Link>
          <a href="#top" className="hover:text-club-light">
            Back to top
          </a>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl space-y-2 border-t border-white/10 pt-6 text-center text-sm text-white/40">
        <p>© {new Date().getFullYear()} Youth Physics Writing Contest · Physics Club Magazine. All rights reserved.</p>
        <p>Organized by the Physics Club Magazine · <a href="https://www.octphysicsclub.org/" className="hover:text-club-light">octphysicsclub.org</a></p>
      </div>
    </footer>
  );
}

export function YpwcLanding() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <main className="min-h-screen bg-[#111014] text-white">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-club"
        style={{ scaleX }}
        aria-hidden="true"
      />
      <Header />
      <Hero />
      <Overview />
      <Brief />
      <Organizer />
      <Stats />
      <Timeline />
      <Leaderboard />
      <AwardsAndPublication />
      <FAQ />
      <RegistrationClosedSection />
      <Footer />
    </main>
  );
}
