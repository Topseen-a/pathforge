import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Megaphone,
  Menu,
  Palette,
  PenTool,
  ShieldCheck,
  X,
} from "lucide-react";
import { clsx } from "clsx";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-companies", label: "For companies" },
  { href: "#faq", label: "FAQ" },
];

const STATS: [string, string][] = [
  ["1,200+", "Learners"],
  ["300+", "Companies"],
  ["4,800+", "Experiences run"],
  ["100%", "Free for learners"],
];

const STEPS = [
  {
    title: "Discover an experience",
    description: "Browse short, structured projects from verified businesses — filtered by skill, duration, and pay.",
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

const TESTIMONIALS = [
  {
    quote: "PathForge turned my first real project into proof employers actually trust.",
    name: "Chidinma A.",
    role: "Product Design Experience Record",
  },
  {
    quote: "We needed a social media audit and got a genuinely sharp piece of work back — plus a talent pipeline.",
    name: "BrightHub Digital",
    role: "Hiring company",
  },
  {
    quote: "Three days, one mentor review, and suddenly I had something real to put on my portfolio.",
    name: "David O.",
    role: "Digital Marketing Experience Record",
  },
];

const FAQS = [
  {
    q: "Is PathForge free for learners?",
    a: "Yes. Learners never pay a subscription to access experiences, apply, or build their Experience Passport. Companies pay for hosting and premium tools — not learners.",
  },
  {
    q: "What is an Experience Passport?",
    a: "A verified record of practical work you've actually completed — the company, the tasks, the deliverables, your evaluation, and a unique verification code a third party can check.",
  },
  {
    q: "Who can post experiences?",
    a: "Verified businesses, startups, agencies, and professionals. Every company goes through a verification step before they can publish an experience.",
  },
  {
    q: "Is this the same as an internship or a job board?",
    a: "No. PathForge is focused specifically on short, structured practical experience — not long-term hiring, recruitment, or freelance marketplaces.",
  },
];

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-4 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-surface-border bg-surface-1/90 px-4 py-2.5 shadow-sm backdrop-blur sm:px-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-accent-500" />
        <span className="text-base font-semibold text-ink-0">PathForge</span>
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className="text-sm font-medium text-ink-2 hover:text-ink-0">
            {l.label}
          </a>
        ))}
      </nav>

      <div className="hidden items-center gap-2 md:flex">
        <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-ink-1 hover:text-ink-0">
          Log in
        </Link>
        <Link
          to="/register"
          className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-ink-0 hover:bg-accent-400"
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
              className="block rounded-xl px-3 py-2 text-sm font-medium text-ink-1 hover:bg-surface-2"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1 rounded-full border border-surface-border px-4 py-2 text-center text-sm font-medium text-ink-0">
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

function MockExperienceCard() {
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

function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={clsx("mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24", className)}>
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent-600">{children}</p>;
}

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-surface-0 text-ink-0">
      <div className="px-4 pt-4 sm:px-6">
        <Header />
      </div>

      {/* Hero */}
      <Section className="pt-12 sm:pt-16">
        <div className="overflow-hidden rounded-[2.5rem] bg-forest-bg px-6 py-14 text-forest-ink sm:px-12 sm:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tightest sm:text-5xl lg:text-6xl">
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
                  className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-ink-0 hover:bg-accent-400"
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
            </div>
            <div className="flex justify-center lg:justify-end">
              <MockExperienceCard />
            </div>
          </div>
        </div>
      </Section>

      {/* Stats strip */}
      <Section className="py-0">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map(([num, label]) => (
            <div key={label} className="card p-5 text-center">
              <p className="text-2xl font-bold text-ink-0 sm:text-3xl">{num}</p>
              <p className="mt-1 text-xs text-ink-2 sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how-it-works">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tightest sm:text-4xl">
              From "I know the theory" to a verified record of real work
            </h2>
            <p className="mt-4 max-w-md text-ink-2">
              Traditional internships are scarce, slow, and hard to access. PathForge is built to be short,
              structured, and honest about what you'll walk away with.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <div key={c.label} className={clsx("flex items-center gap-2 rounded-2xl px-4 py-3", c.tone)}>
                  <c.icon size={18} />
                  <span className="text-sm font-medium">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="card flex gap-4 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-ink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-ink-0">{step.title}</p>
                  <p className="mt-1 text-sm text-ink-2">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* For companies */}
      <Section id="for-companies" className="rounded-[2.5rem] bg-surface-2">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>For businesses</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tightest sm:text-4xl">
              Get real work done. Discover talent early.
            </h2>
            <p className="mt-4 max-w-md text-ink-2">
              Post a short, well-defined project — a social media audit, a UI/UX review, a data cleanup — without
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
              Post an experience <ArrowRight size={16} />
            </Link>
          </div>
          <div className="card flex flex-col gap-4 p-6">
            <div className="flex items-center gap-2 text-accent-600">
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold">Company verification</span>
            </div>
            <p className="text-sm text-ink-2">
              Every company is reviewed before they can publish an experience — business details, contact
              information, and representative verification.
            </p>
            <div className="flex items-center gap-3 border-t border-surface-border pt-4">
              <Briefcase size={16} className="text-ink-2" />
              <span className="text-sm text-ink-1">300+ companies already hosting experiences</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="rounded-[2.5rem] bg-forest-bg text-forest-ink">
        <Eyebrow>What people say</Eyebrow>
        <h2 className="max-w-lg text-3xl font-bold tracking-tightest sm:text-4xl">
          Real experience, verified — from both sides of the table
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-3xl border border-forest-border bg-forest-card p-6">
              <p className="text-sm leading-relaxed text-forest-ink">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent-500/25" />
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-forest-ink-dim">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <div className="rounded-[2.5rem] bg-accent-200 px-6 py-16 text-center sm:px-12">
          <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tightest sm:text-4xl">
            Your next opportunity starts with proof, not promises.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-ink-1">
            Build your Experience Passport with your first practical project — it's free to start.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-0 px-6 py-3 text-sm font-semibold text-surface-0 hover:opacity-90"
          >
            Create your account <ArrowRight size={16} />
          </Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="text-3xl font-bold tracking-tightest sm:text-4xl">Answers to common questions</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="card overflow-hidden p-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-ink-0">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={clsx("shrink-0 text-ink-2 transition-transform", openFaq === i && "rotate-180")}
                />
              </button>
              {openFaq === i && <p className="px-5 pb-4 text-sm text-ink-2">{f.a}</p>}
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-surface-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-accent-500" />
            <span className="text-sm font-semibold text-ink-0">PathForge</span>
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
