import { motion } from "motion/react";
import {
  Brain,
  Clock,
  FileText,
  Lock,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface WelcomeScreenProps {
  onBegin: () => void;
}

const stats = [
  { icon: Clock, label: "5–10 min", sub: "Average time" },
  { icon: FileText, label: "10 questions", sub: "Evidence-based" },
  { icon: Lock, label: "Private", sub: "Nothing stored" },
];

const steps = [
  {
    title: "Child's Information",
    description: "Share basic information about your child and family.",
  },
  {
    title: "10 Behavioral Questions",
    description: "Answer 10 brief questions about everyday behaviours.",
  },
  {
    title: "Instant Results",
    description: "View a screening score with clear next-step guidance.",
  },
];

export default function WelcomeScreen({ onBegin }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-xl px-4 pb-16 pt-8"
    >
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#5C4FE5] to-[#7c3aed] p-8 text-white">
        <div className="pointer-events-none absolute -top-14 -right-14 h-52 w-52 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/10" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold tracking-wide">
            <Brain className="h-3.5 w-3.5" />
            Q-CHAT-10 Screening Tool
          </div>
          <h1 className="text-2xl font-extrabold leading-[1.4] text-white">
            Toddler ASD Screening
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            A gentle, research-based checklist designed for toddlers aged 18–72
            months to help families notice early social-communication patterns.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, label, sub }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-foreground">About this tool</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The Quantitative Checklist for Autism in Toddlers (Q-CHAT-10) is a
          brief, evidence-based screening questionnaire used to identify
          toddlers who may benefit from further developmental evaluation. It is
          not a diagnosis.
        </p>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/15 bg-secondary p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-secondary-foreground">
              Disclaimer
            </p>
            <p className="mt-1 text-xs leading-relaxed text-secondary-foreground/80">
              This screening is for informational purposes only and does not
              replace professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-foreground">How it works</h2>
        <div className="mt-4 space-y-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start gap-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#5C4FE5] to-[#7c3aed] text-sm font-bold text-white">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onBegin}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5C4FE5] to-[#7c3aed] py-4 text-base font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
      >
        Begin Assessment
        <ArrowRight className="h-5 w-5" />
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        For children aged 18–72 months · Based on the Q-CHAT-10 Questionnaire
      </p>
    </motion.div>
  );
}
