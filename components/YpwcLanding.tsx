"use client";

import Image from "next/image";
import {
  ArrowRight,
  Award,
  BookOpen,
  ClipboardCheck,
  Download,
  HelpCircle,
  PenLine,
  Plus,
  Send,
  Sparkles,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
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
  { label: "FAQ", href: "#faq" },
  { label: "Register", href: "#register" },
  { label: "Format", href: "#format" },
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
    body: "YPWC combines competition with editorial review and publication. Selected submissions receive feedback and may be published through the Young Physics Writers Contest, giving students the opportunity to develop their work beyond the competition.",
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
          <a
            href="#leaderboard"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/16 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-club-light hover:bg-white/[0.07]"
          >
            <Trophy className="size-4" aria-hidden="true" />
            Leaderboard
          </a>
          <a
            href="#register"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-club px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2e8cff]"
          >
            Register
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
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
            Register Now!
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
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 pb-20 lg:grid-cols-[1.03fr_0.97fr]">
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
              Young Physics Writers Contest
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
              <a
                href="#register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-club px-6 text-sm font-semibold text-white shadow-blue transition hover:-translate-y-0.5 hover:bg-[#2e8cff]"
              >
                Register now
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#brief"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/16 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-club-light hover:bg-white/[0.07]"
              >
                Explore the brief
                <BookOpen className="size-4" aria-hidden="true" />
              </a>
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
                alt="Young Physics Writers Contest logo"
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
                  alt="Young Physics Writers Contest logo"
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
    date: "September 4 - September 30",
  },
  {
    step: "02",
    title: "Registration closes",
    description: "All submissions are locked at the end of September. No further changes accepted.",
    date: "September 30",
  },
  {
    step: "03",
    title: "Judging",
    description: "Every article is scored once against the 100-point rubric by club mentors and editors.",
    date: "October 1 - October 10",
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
          text="Registration runs from September 4 to September 30, with results announced on October 10."
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

const leaderboardEntries = [
  { rank: 1, name: "TBA", medal: "Gold", note: "Top prize" },
  { rank: 2, name: "TBA", medal: "Silver", note: "Runner-up" },
  { rank: 3, name: "TBA", medal: "Bronze", note: "Third place" },
] satisfies Array<{
  rank: number;
  name: string;
  medal: keyof typeof medalStyles;
  note: string;
}>;

function Leaderboard() {
  return (
    <section id="leaderboard" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Leaderboard"
          title="The top 3 earn special prizes."
          text="Results are announced on October 10. The top three participants on the leaderboard receive special prizes, and the wider top 30% receive medals."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {leaderboardEntries.map((entry, index) => (
            <Reveal key={entry.rank} delay={index * 0.08}>
              <motion.article
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "group relative flex h-full flex-col items-center overflow-hidden rounded-lg p-8 text-center",
                  medalStyles[entry.medal].surface,
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-100",
                    medalStyles[entry.medal].accent,
                  )}
                />
                <span
                  className={cn(
                    "relative flex size-14 items-center justify-center rounded-full border text-2xl font-bold",
                    medalStyles[entry.medal].number,
                  )}
                >
                  {entry.rank}
                </span>
                <p className={cn("mt-5 text-xs font-semibold uppercase tracking-[0.18em]", medalStyles[entry.medal].label)}>
                  {entry.medal} medal
                </p>
                <p className="mt-3 text-xl font-semibold text-white">{entry.name}</p>
                <p className="mt-1 text-sm text-white/52">{entry.note}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-8 rounded-lg border border-club-light/20 bg-club/6 p-6 text-center">
            <p className="text-sm leading-7 text-white/64">
              Results will appear here on <span className="font-semibold text-white">October 10</span>.
              The top 30% of all participants receive medals in a Gold : Silver : Bronze ratio of{" "}
              <span className="font-semibold text-white">3 : 2 : 1</span>.
            </p>
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
    answer: "Registration opens on September 4 and closes on September 30. Results are announced on October 10.",
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

function RegistrationForm() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [topicOther, setTopicOther] = useState(false);
  const [pitchWordCount, setPitchWordCount] = useState(0);
  const [titleWordCount, setTitleWordCount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const submitLock = useRef(false);

  const validate = useCallback((form: HTMLFormElement): boolean => {
    const fd = new FormData(form);
    const newErrors: Record<string, string> = {};

    const fullName = (fd.get("fullName") as string || "").trim();
    if (!fullName) newErrors.fullName = "Full name is required";
    else if (fullName.length < 3) newErrors.fullName = "Name must be at least 3 characters";

    const school = (fd.get("school") as string || "").trim();
    if (!school) newErrors.school = "School is required";
    else if (school.length < 2) newErrors.school = "School must be at least 2 characters";

    const email = (fd.get("email") as string || "").trim();
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email with @";

    const grade = fd.get("grade") as string;
    if (!grade) newErrors.grade = "Grade is required";

    const topic = fd.get("topic") as string;
    if (!topic) newErrors.topic = "Topic is required";
    if (topic === "Other") {
      const custom = (fd.get("topicOther") as string || "").trim();
      if (!custom) newErrors.topicOther = "Please type your topic";
    }

    const title = (fd.get("title") as string || "").trim();
    const titleWords = title ? title.split(/\s+/).filter(Boolean).length : 0;
    setTitleWordCount(titleWords);
    if (title && titleWords < 2) newErrors.title = "Title must be at least 2 words";
    else if (title && titleWords > 20) newErrors.title = "Title must be under 20 words";

    const pitch = (fd.get("pitch") as string || "").trim();
    const pitchWords = pitch ? pitch.split(/\s+/).filter(Boolean).length : 0;
    setPitchWordCount(pitchWords);
    if (!pitch) newErrors.pitch = "Pitch is required";
    else if (pitchWords < 10) newErrors.pitch = `Pitch must be at least 10 words (${pitchWords}/10)`;
    else if (pitchWords > 200) newErrors.pitch = `Pitch must be under 200 words (${pitchWords}/200)`;

    const file = fd.get("articleFile") as File;
    if (!file || file.size === 0) newErrors.articleFile = "Article file is required";
    else if (!file.name.match(/\.(pdf|doc|docx)$/i)) newErrors.articleFile = "Only PDF or Word files accepted";

    const images = fd.getAll("articleImage") as File[];
    const gifFiles = images.filter((f) => f && f.size > 0);
    if (gifFiles.some((f) => !/\.(gif)$/i.test(f.name)))
      newErrors.articleImage = "Only GIF files are accepted";

    const sourceLink = (fd.get("sourceLink") as string || "").trim();
    if (sourceLink && !/^https?:\/\/\S+$/i.test(sourceLink))
      newErrors.sourceLink = "Enter a valid link beginning with http:// or https://";

    if (!fd.get("publicationRights")) newErrors.publicationRights = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitLock.current || formState === "success") return;

    const form = event.currentTarget;
    if (!validate(form)) return;

    submitLock.current = true;
    setFormState("loading");

    const formData = new FormData(form);
    if (topicOther) {
      const custom = (formData.get("topicOther") as string || "").trim();
      formData.set("topic", custom || "Other");
    }
    formData.delete("topicOther");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Submission failed");

      setFormState("success");
      form.reset();
      setTopicOther(false);
      setPitchWordCount(0);
      setTitleWordCount(0);
      setErrors({});
    } catch {
      setFormState("error");
      submitLock.current = false;
    }
  }, [topicOther, formState, validate]);

  const fieldClass = (field: string) =>
    cn("field", errors[field] && "border-red-400/60");

  return (
    <section id="register" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <div className="sticky top-24 overflow-hidden rounded-lg border border-white/12 bg-[#15161d] p-8 shadow-blue-soft">
            <div className="absolute -right-20 -top-20 size-64 rounded-full border border-club-light/18" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-club-light">
              Registration
            </p>
            <h2 className="mt-4 text-balance text-4xl font-semibold leading-tight text-white md:text-6xl">
              Submit your intent to join YPWC.
            </h2>
            <p className="mt-5 text-base leading-8 text-white/68 md:text-lg">
              Fill in your details and upload your article plus optional
              GIFs. Your registration will be recorded with a timestamp.
            </p>
            <div className="mt-10">
              <EditorialCardStack />
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-white/58">
              <Timer className="size-5 text-club-light" aria-hidden="true" />
              Registration time is automatically recorded
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="rounded-lg border border-white/12 bg-[#15161d] p-5 shadow-blue-soft md:p-7"
            noValidate
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-white/72">Full name</span>
                <input name="fullName" className={fieldClass("fullName")} placeholder="Your name" defaultValue="" />
                {errors.fullName ? <p className="text-xs text-red-400">{errors.fullName}</p> : null}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-white/72">School</span>
                <input name="school" className={fieldClass("school")} placeholder="School name" defaultValue="" />
                {errors.school ? <p className="text-xs text-red-400">{errors.school}</p> : null}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-white/72">Email</span>
                <input name="email" type="email" className={fieldClass("email")} placeholder="name@example.com" defaultValue="" />
                {errors.email ? <p className="text-xs text-red-400">{errors.email}</p> : null}
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-white/72">Grade</span>
                <select name="grade" className={fieldClass("grade")} defaultValue="">
                  <option value="">Choose grade</option>
                  <option>Grade 9</option>
                  <option>Grade 10</option>
                  <option>Grade 11</option>
                  <option>Grade 12</option>
                </select>
                {errors.grade ? <p className="text-xs text-red-400">{errors.grade}</p> : null}
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-white/72">Chosen topic</span>
                <select
                  name="topic"
                  className={fieldClass("topic")}
                  defaultValue=""
                  onChange={(e) => setTopicOther(e.target.value === "Other")}
                >
                  <option value="">Choose a topic desk</option>
                  <option>Space and Astronomy</option>
                  <option>Electricity and Magnetism</option>
                  <option>Waves and Sound</option>
                  <option>Modern and Quantum Physics</option>
                  <option>Thermodynamics</option>
                  <option>Physics in Daily Life</option>
                  <option value="Other">Other</option>
                </select>
                {errors.topic ? <p className="text-xs text-red-400">{errors.topic}</p> : null}
                {topicOther ? (
                  <div className="mt-2">
                    <input name="topicOther" className={fieldClass("topicOther")} placeholder="Type your topic" defaultValue="" />
                    {errors.topicOther ? <p className="text-xs text-red-400">{errors.topicOther}</p> : null}
                  </div>
                ) : null}
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-white/72">Working article title</span>
                <input
                  name="title"
                  className={fieldClass("title")}
                  placeholder="A short title or idea"
                  defaultValue=""
                  onChange={(e) => {
                    const wc = e.target.value.trim() ? e.target.value.trim().split(/\s+/).filter(Boolean).length : 0;
                    setTitleWordCount(wc);
                  }}
                />
                <p className="text-xs text-white/44">{titleWordCount}/20 words</p>
                {errors.title ? <p className="text-xs text-red-400">{errors.title}</p> : null}
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-white/72">Article pitch</span>
                <textarea
                  name="pitch"
                  className={cn(fieldClass("pitch"), "min-h-28 resize-y")}
                  placeholder="In 2-3 sentences, explain what your article will help readers understand."
                  defaultValue=""
                  onChange={(e) => {
                    const wc = e.target.value.trim() ? e.target.value.trim().split(/\s+/).filter(Boolean).length : 0;
                    setPitchWordCount(wc);
                  }}
                />
                <p className="text-xs text-white/44">{pitchWordCount}/200 words (minimum 10)</p>
                {errors.pitch ? <p className="text-xs text-red-400">{errors.pitch}</p> : null}
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-white/72">Article file (PDF or Word)</span>
                <input
                  type="file"
                  name="articleFile"
                  accept=".pdf,.doc,.docx"
                  className="block w-full text-sm text-white/64 file:mr-4 file:rounded-md file:border-0 file:bg-club file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2e8cff]"
                />
                {errors.articleFile ? <p className="text-xs text-red-400 mt-1">{errors.articleFile}</p> : null}
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-white/72">Source file link (optional)</span>
                <input
                  name="sourceLink"
                  type="url"
                  inputMode="url"
                  className={fieldClass("sourceLink")}
                  placeholder="https://drive.google.com/... or https://github.com/..."
                />
                <p className="text-xs text-white/44">
                  Paste a link to your Word document, GitHub repository, or LaTeX project folder so the full source files stay with the magazine.
                </p>
                {errors.sourceLink ? <p className="text-xs text-red-400">{errors.sourceLink}</p> : null}
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-white/72">Article GIF(s)</span>
                <input
                  type="file"
                  name="articleImage"
                  accept=".gif"
                  multiple
                  className="block w-full text-sm text-white/64 file:mr-4 file:rounded-md file:border-0 file:bg-club file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#2e8cff]"
                />
                <p className="text-xs text-white/44">Optional GIFs to accompany your article. You can choose more than one.</p>
                {errors.articleImage ? <p className="text-xs text-red-400 mt-1">{errors.articleImage}</p> : null}
              </label>
              <div className="md:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 rounded-md border border-white/12 bg-white/[0.035] px-4 py-3.5">
                  <input
                    type="checkbox"
                    name="publicationRights"
                    value="yes"
                    className="mt-0.5 size-4 shrink-0 rounded border-white/30 bg-[#111014] accent-club"
                  />
                  <span className="text-sm leading-6 text-white/68">
                    By submitting, I grant the <span className="font-semibold text-white">Physics Club Magazine</span> full
                    editorial and publication rights: the club may edit, format, translate, and publish my article in the
                    magazine and online.
                  </span>
                </label>
                {errors.publicationRights ? (
                  <p className="mt-1 text-xs text-red-400">You must accept the publication rights to submit</p>
                ) : null}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-white/52">
                AI-generated writing is not allowed in the final submission.
              </p>
              <button
                type="submit"
                disabled={formState === "loading" || formState === "success"}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-club px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#2e8cff] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formState === "loading" ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block size-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Submitting...
                  </>
                ) : formState === "success" ? (
                  "Submitted"
                ) : (
                  <>
                    Submit registration
                    <Send className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
            {formState === "success" ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-md border border-club-light/30 bg-club/12 px-4 py-3 text-sm text-white"
              >
                Registration submitted successfully. Your article and image have been uploaded.
              </motion.p>
            ) : null}
            {formState === "error" ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-md border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
              >
                Something went wrong. Please try again or contact the organizer.
              </motion.p>
            ) : null}
          </form>
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
          <a href="#leaderboard" className="hover:text-club-light">
            Leaderboard
          </a>
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
      <RegistrationForm />
      <Footer />
    </main>
  );
}
