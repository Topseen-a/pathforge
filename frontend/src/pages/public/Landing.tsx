import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  Menu,
  MessageSquare,
  Palette,
  PenTool,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { Card, StatCard, StatusBadge } from "@/components/ui/Misc";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-companies", label: "For companies" },
  { href: "#faq", label: "FAQ" },
];

const STATS: [string, string][] = [
  ["1,200+", "Talents"],
  ["300+", "Companies"],
  ["4,800+", "Projects run"],
  ["100%", "Free for talents"],
];

const STEPS = [
  {
    title: "Discover a project",
    description: "Browse short, structured projects from verified businesses filtered by skill, duration, and pay.",
  },
  {
    title: "Apply and get selected",
    description: "Tell the company why you're a fit. No CV gatekeeping, no months of silence.",
  },
  {
    title: "Do the real work",
    description: "Work in a dedicated workspace with tasks, deadlines, and a mentor who reviews what you submit.",
  },
  {
    title: "Get verified, build your Passport",
    description: "Once it's complete and evaluated, it becomes a verified entry on your Experience Passport.",
  },
];

const CATEGORIES = [
  { icon: Megaphone, label: "Marketing & Social Media", tone: "bg-accent-200 text-ink-0" },
  { icon: Palette, label: "UI/UX & Design", tone: "bg-forest-card text-forest-ink" },
  { icon: BarChart3, label: "Data & Analysis", tone: "bg-accent-500 text-ink-0" },
  { icon: PenTool, label: "Content & Documentation", tone: "bg-surface-3 text-ink-0" },
];

const TESTIMONIALS: {
  quote: string;
  name: string;
  role: string;
  avatar: { kind: "initials"; initials: string; bg: string; fg: string } | { kind: "logo" };
}[] = [
  {
    quote: "PathForge turned my first real project into proof employers actually trust.",
    name: "Chidinma A.",
    role: "Product Design Experience Record",
    avatar: { kind: "initials", initials: "CA", bg: "bg-accent-500/25", fg: "text-accent-200" },
  },
  {
    quote: "We needed a social media audit and got a genuinely sharp piece of work back plus a talent pipeline.",
    name: "BrightHub Digital",
    role: "Hiring company",
    avatar: { kind: "logo" },
  },
  {
    quote: "Three days, one mentor review, and suddenly I had something real to put on my portfolio.",
    name: "David O.",
    role: "Digital Marketing Experience Record",
    avatar: { kind: "initials", initials: "DO", bg: "bg-forest-ink/15", fg: "text-forest-ink" },
  },
];

function BrightHubMark() {
  return (
    <svg viewBox="0 0 36 36" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#f6f1e2" />
      <circle cx="18" cy="18" r="4.5" fill="#0f2419" />
      <g stroke="#0f2419" strokeWidth="2" strokeLinecap="round">
        <path d="M18 7v4" />
        <path d="M18 25v4" />
        <path d="M7 18h4" />
        <path d="M25 18h4" />
        <path d="M10.5 10.5l2.8 2.8" />
        <path d="M22.7 22.7l2.8 2.8" />
        <path d="M25.5 10.5l-2.8 2.8" />
        <path d="M13.3 22.7l-2.8 2.8" />
      </g>
    </svg>
  );
}

function TestimonialAvatar({ avatar }: { avatar: (typeof TESTIMONIALS)[number]["avatar"] }) {
  if (avatar.kind === "logo") return <BrightHubMark />;
  return (
    <div className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold", avatar.bg, avatar.fg)}>
      {avatar.initials}
    </div>
  );
}

const FAQS = [
  {
    q: "Is PathForge free for talents?",
    a: "Yes. Talents never pay a subscription to access projects, apply, or build their Experience Passport. Companies pay for hosting and premium tools, not talents.",
  },
  {
    q: "What is an Experience Passport?",
    a: "A verified record of practical work you've actually completed. The company, the tasks, the deliverables, your evaluation, and a unique verification code a third party can check.",
  },
  {
    q: "Who can post projects?",
    a: "Verified businesses, startups, agencies, and professionals. Every company goes through a verification step before they can publish a project.",
  },
  {
    q: "Is this the same as an internship or a job board?",
    a: "No. PathForge is focused specifically on short, structured practical experience, not long-term hiring, recruitment, or freelance marketplaces.",
  },
];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-4 z-50 mx-auto flex max-w-4xl items-center justify-between rounded-full border border-surface-border bg-surface-1/90 px-4 py-2.5 shadow-sm backdrop-blur sm:px-6">
      <Link to="/" className="flex items-center gap-2">
        <Logo className="h-7 w-7" />
        <span className="font-display text-base font-semibold text-ink-0">PathForge</span>
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className="font-display text-sm font-bold text-ink-2 hover:text-ink-0">
            {l.label}
          </a>
        ))}
      </nav>

      <div className="hidden items-center gap-2 md:flex">
        <Link to="/login" className="font-display rounded-full px-4 py-2 text-sm font-bold text-ink-1 hover:text-ink-0">
          Log in
        </Link>
        <Link
          to="/register"
          className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-ink-0 hover:bg-accent-600"
        >
          Get started
        </Link>
      </div>

      <button onClick={() => setOpen((o) => !o)} className="rounded-full p-2 text-ink-0 md:hidden">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 space-y-1 rounded-3xl border border-surface-border bg-surface-1 p-4 shadow-lg md:hidden">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display block rounded-xl px-3 py-2 text-sm font-bold text-ink-1 hover:bg-surface-2"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="font-display flex-1 rounded-full border border-surface-border px-4 py-2 text-center text-sm font-bold text-ink-0">
              Log in
            </Link>
            <Link to="/register" className="flex-1 rounded-full bg-accent-500 px-4 py-2 text-center text-sm font-semibold text-ink-0">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function MockProjectCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-forest-border bg-forest-card p-5 text-forest-ink shadow-xl">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-accent-500/20 px-2.5 py-1 text-xs font-medium text-accent-300">Marketing</span>
        <span className="text-xs text-forest-ink-dim">3 Days · Remote</span>
      </div>
      <p className="mt-3 text-base font-semibold">Social Media Audit</p>
      <p className="text-sm text-forest-ink-dim">BrightHub Digital</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["Research", "Analytics", "Content Strategy"].map((s) => (
          <span key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-forest-ink-dim">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-forest-border pt-4">
        <span className="text-sm font-semibold text-accent-300">₦20,000</span>
        <span className="flex items-center gap-1 text-xs text-forest-ink-dim">
          <CheckCircle2 size={14} className="text-accent-400" /> Verified company
        </span>
      </div>
    </div>
  );
}

const PREVIEW_NAV = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Browse Projects", icon: Briefcase },
  { label: "My Applications", icon: ClipboardList },
  { label: "Workspaces", icon: FolderKanban },
  { label: "Passport", icon: Award },
  { label: "Messages", icon: MessageSquare },
  { label: "Profile", icon: UserRound },
];

const PREVIEW_PROJECTS: { title: string; sub: string; status: "PUBLISHED" }[] = [
  { title: "UI/UX Review", sub: "Lagos Fintech Co · REMOTE", status: "PUBLISHED" },
  { title: "Sales Data Analysis", sub: "Kaduna Retail Group · HYBRID", status: "PUBLISHED" },
  { title: "Technical Documentation", sub: "DevWorks · REMOTE", status: "PUBLISHED" },
];

const PREVIEW_APPLICATIONS: { title: string; status: "ACCEPTED" | "PENDING" }[] = [
  { title: "Social Media Audit", status: "ACCEPTED" },
  { title: "Market Research", status: "PENDING" },
  { title: "Business Process Documentation", status: "PENDING" },
];

function DashboardPreview() {
  return (
    <div className="mx-auto -mt-16 max-w-5xl overflow-hidden rounded-[2rem] border border-surface-border bg-surface-1 shadow-2xl sm:-mt-24">
      <div className="flex">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-surface-border p-4 sm:flex">
          <div className="mb-6 flex items-center gap-2 px-2">
            <Logo className="h-6 w-6" />
            <span className="font-display text-sm font-semibold text-ink-0">PathForge</span>
          </div>
          <nav className="space-y-1">
            {PREVIEW_NAV.map((item) => (
              <div
                key={item.label}
                className={clsx(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium",
                  item.active ? "bg-accent-500/20 text-ink-0" : "text-ink-2"
                )}
              >
                <item.icon size={15} />
                {item.label}
              </div>
            ))}
          </nav>
          <div className="mt-auto flex items-center gap-2 rounded-xl px-2 py-2 text-ink-2">
            <Bell size={15} />
            <span className="text-xs font-medium">Notifications</span>
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold text-ink-0">Welcome back, David</p>
              <p className="text-xs text-ink-2 sm:text-sm">Here's where your PathForge journey stands today.</p>
            </div>
            <span className="rounded-full bg-accent-500 px-4 py-2 text-xs font-semibold text-ink-0">
              Browse projects
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Applications" value={6} hint="2 pending" icon={<ClipboardList size={16} />} />
            <StatCard label="Active workspaces" value={3} icon={<FolderKanban size={16} />} />
            <StatCard label="Passport records" value={5} hint="Verified experiences" icon={<Award size={16} />} />
            <StatCard label="Open opportunities" value={18} hint="Currently published" icon={<Briefcase size={16} />} />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <p className="mb-3 text-sm font-semibold text-ink-0">Recommended projects</p>
              <div className="space-y-2">
                {PREVIEW_PROJECTS.map((e) => (
                  <div key={e.title} className="flex items-center justify-between gap-2 rounded-xl border border-surface-border px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-0">{e.title}</p>
                      <p className="truncate text-xs text-ink-3">{e.sub}</p>
                    </div>
                    <StatusBadge status={e.status} />
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <p className="mb-3 text-sm font-semibold text-ink-0">Recent applications</p>
              <div className="space-y-2.5">
                {PREVIEW_APPLICATIONS.map((a) => (
                  <div key={a.title} className="flex items-center justify-between">
                    <p className="truncate pr-2 text-sm text-ink-1">{a.title}</p>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={clsx("mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24", className)}>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-accent-600">{children}</p>;
}

export default function Landing() {
  useSmoothScroll();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-surface-0 text-ink-0">
      <div className="px-4 pt-4 sm:px-6">
        <Header />
      </div>

      {/* Hero */}
      <Section className="pt-12 sm:pt-16">
        <div className="overflow-hidden rounded-[2.5rem] bg-forest-bg px-6 py-14 text-forest-ink sm:px-12 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tightest sm:text-5xl lg:text-6xl">
                Learn a skill.
                <br />
                Gain experience.
                <br />
                <span className="text-accent-400">Prove what you can do.</span>
              </h1>
              <p className="mt-6 max-w-md text-base text-forest-ink-dim sm:text-lg">
                PathForge connects young Nigerians with short, structured practical experiences from verified
                businesses — so a skill on your CV becomes evidence you can point to.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-ink-0 hover:bg-accent-600"
                >
                  Get started <ArrowRight size={16} />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-forest-ink hover:bg-white/5"
                >
                  How it works
                </a>
              </div>
            </Reveal>
            <Reveal delay={150} className="flex justify-center lg:justify-end">
              <MockProjectCard />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Product preview */}
      <div className="px-4 sm:px-6">
        <Reveal>
          <DashboardPreview />
        </Reveal>
      </div>

      {/* Stats strip */}
      <Section className="py-0">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map(([num, label], i) => (
            <Reveal key={label} delay={i * 80} className="card p-5 text-center">
              <p className="font-display text-2xl font-bold text-ink-0 sm:text-3xl">{num}</p>
              <p className="mt-1 text-xs text-ink-2 sm:text-sm">{label}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how-it-works">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="font-display text-3xl font-bold tracking-tightest sm:text-4xl">
              From "I know the theory" to a verified record of real work
            </h2>
            <p className="mt-4 max-w-md text-ink-2">
              Traditional internships are scarce, slow, and hard to access. PathForge is built to be short,
              structured, and honest about what you'll walk away with.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {CATEGORIES.map((c, i) => (
                <Reveal key={c.label} delay={150 + i * 80} className={clsx("flex items-center gap-2 rounded-2xl px-4 py-3", c.tone)}>
                  <c.icon size={18} />
                  <span className="text-sm font-medium">{c.label}</span>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 100} className="card flex gap-4 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-ink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-ink-0">{step.title}</p>
                  <p className="mt-1 text-sm text-ink-2">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* For companies */}
      <Section id="for-companies" className="rounded-[2.5rem] bg-surface-2">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>For businesses</Eyebrow>
            <h2 className="font-display text-3xl font-bold tracking-tightest sm:text-4xl">
              Get real work done. Discover talent early.
            </h2>
            <p className="mt-4 max-w-md text-ink-2">
              Post a short, well-defined project, a social media audit, a UI/UX review, a data cleanup without
              committing to a full-time hire. Review the work, give feedback, and verify what was delivered.
            </p>
            <ul className="mt-6 space-y-3">
              {["No long-term commitment required", "Verification protects both sides", "Discover people before you hire them"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink-1">
                    <CheckCircle2 size={16} className="text-accent-600" /> {item}
                  </li>
                )
              )}
            </ul>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-0 px-6 py-3 text-sm font-semibold text-surface-0 hover:opacity-90"
            >
              Post a project <ArrowRight size={16} />
            </Link>
          </Reveal>
          <Reveal delay={150} className="card flex flex-col gap-4 p-6">
            <div className="flex items-center gap-2 text-accent-600">
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold">Company verification</span>
            </div>
            <p className="text-sm text-ink-2">
              Every company is reviewed before they can publish a project, business details, contact
              information, and representative verification.
            </p>
            <div className="flex items-center gap-3 border-t border-surface-border pt-4">
              <Briefcase size={16} className="text-ink-2" />
              <span className="text-sm text-ink-1">300+ companies already hosting projects</span>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="rounded-[2.5rem] bg-forest-bg text-forest-ink">
        <Reveal>
          <Eyebrow>What people say</Eyebrow>
          <h2 className="font-display max-w-lg text-3xl font-bold tracking-tightest sm:text-4xl">
            Real experience, verified from both sides of the table
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100} className="rounded-3xl border border-forest-border bg-forest-card p-6">
              <p className="text-sm leading-relaxed text-forest-ink">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <TestimonialAvatar avatar={t.avatar} />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-forest-ink-dim">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <Reveal className="rounded-[2.5rem] bg-accent-200 px-6 py-16 text-center sm:px-12">
          <h2 className="font-display mx-auto max-w-xl text-3xl font-bold tracking-tightest sm:text-4xl">
            Your next opportunity starts with proof, not promises.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-1">
            Build your Experience Passport with your first practical project. It's free to start.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-0 px-6 py-3 text-sm font-semibold text-surface-0 hover:opacity-90"
          >
            Create your account <ArrowRight size={16} />
          </Link>
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-display text-3xl font-bold tracking-tightest sm:text-4xl">Answers to common questions</h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 70} className="card overflow-hidden p-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-ink-0">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={clsx("shrink-0 text-ink-2 transition-transform duration-300", openFaq === i && "rotate-180")}
                />
              </button>
              <div
                className={clsx(
                  "grid transition-all duration-300 ease-out",
                  openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-ink-2">{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-surface-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-display text-sm font-semibold text-ink-0">PathForge</span>
          </div>
          <p className="text-xs text-ink-3">Experience before employment.</p>
          <Link to="/verify" className="text-xs font-medium text-ink-2 hover:text-ink-0">
            Verify a passport record →
          </Link>
        </div>
      </footer>
    </div>
  );
}
