import { motion } from "motion/react";
import {
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import type { Demographics } from "../types";

interface ResultsScreenProps {
  score: number;
  demographics: Demographics;
  onRetake: () => void;
}

function getRisk(score: number) {
  if (score <= 2) {
    return {
      level: "Low Risk",
      label: "No Significant ASD Traits Detected",
      description:
        "Your child's responses fall within the typical range. Continue monitoring development as usual and speak with a pediatrician if you have any new concerns.",
      cardClass: "bg-emerald-50 border-emerald-200",
      textClass: "text-emerald-700",
      badgeClass: "bg-emerald-100 text-emerald-700",
      Icon: CheckCircle2,
    };
  }
  if (score <= 5) {
    return {
      level: "Borderline",
      label: "Some Indicators Present — Follow-up Recommended",
      description:
        "Some responses suggest areas worth discussing with a healthcare professional. A follow-up developmental screening may be helpful.",
      cardClass: "bg-amber-50 border-amber-200",
      textClass: "text-amber-700",
      badgeClass: "bg-amber-100 text-amber-700",
      Icon: AlertTriangle,
    };
  }
  return {
    level: "High Risk",
    label: "ASD Traits Detected — Professional Evaluation Strongly Recommended",
    description:
      "Several responses indicate elevated concern. We recommend arranging an evaluation with a qualified developmental specialist or pediatrician soon.",
    cardClass: "bg-red-50 border-red-200",
    textClass: "text-red-700",
    badgeClass: "bg-red-100 text-red-700",
    Icon: AlertCircle,
  };
}



export default function ResultsScreen({
  score,
  demographics,
  onRetake,
}: ResultsScreenProps) {
  const risk = getRisk(score);
  const RiskIcon = risk.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-xl px-4 pb-16 pt-8"
    >
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex rounded-full bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
          Assessment Complete
        </span>
        <h1 className="mt-3 text-2xl font-bold leading-[1.4] text-foreground">
          Screening Results
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Based on the Q-CHAT-10 questionnaire responses
        </p>
      </div>

      {/* Score circle */}
      <div className="relative mx-auto mt-8 flex h-32 w-32 items-center justify-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            delay: 0.15,
            stiffness: 260,
            damping: 18,
          }}
          className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#5C4FE5] to-[#7c3aed] text-white shadow-xl shadow-primary/20"
        >
          <span className="text-5xl font-extrabold leading-none">{score}</span>
          <span className="mt-1 text-xs font-semibold opacity-75">
            out of 10
          </span>
        </motion.div>
        <div
          className={`absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-card ${risk.badgeClass}`}
        >
          <RiskIcon className="h-[18px] w-[18px]" />
        </div>
      </div>

      {/* Risk card */}
      <div className={`mt-8 rounded-2xl border p-5 sm:p-6 ${risk.cardClass}`}>
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${risk.badgeClass}`}
          >
            <RiskIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${risk.textClass}`}>
              {risk.level}
            </h2>
            <p
              className={`mt-0.5 text-sm font-semibold opacity-90 ${risk.textClass}`}
            >
              {risk.label}
            </p>
            <p
              className={`mt-2 text-sm leading-relaxed opacity-80 ${risk.textClass}`}
            >
              {risk.description}
            </p>
            <p
              className={`mt-3 text-xs font-medium opacity-70 ${risk.textClass}`}
            >
              Score: {score}/10 · {demographics.ageMonths} months ·{" "}
              {demographics.gender || "—"}
              {demographics.familyASDHistory === "Yes"
                ? " · Family ASD history"
                : ""}
            </p>
          </div>
        </div>
      </div>


      {/* Disclaimer */}
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-bold text-amber-800">
            Medical Disclaimer
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-700">
            This screening tool does not provide a diagnosis of autism spectrum
            disorder. Results should be interpreted by a qualified healthcare
            professional. If you have concerns about your child's development,
            please seek professional evaluation regardless of this score.
          </p>
        </div>
      </div>

      {/* Retake */}
      <button
        type="button"
        onClick={onRetake}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-card py-4 text-base font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-secondary active:scale-[0.98]"
      >
        <RefreshCw className="h-4 w-4" />
        Retake Assessment
      </button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Based on the Q-CHAT-10 questionnaire · For children aged 18–72 months
      </p>
    </motion.div>
  );
}
