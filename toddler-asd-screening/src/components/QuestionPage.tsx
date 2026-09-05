import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Answer, Question } from "../types";

interface QuestionPageProps {
  question: Question;
  index: number;
  total: number;
  selected: Answer | null;
  onSelect: (answer: Answer) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function QuestionPage({
  question,
  index,
  total,
  selected,
  onSelect,
  onBack,
  onNext,
}: QuestionPageProps) {
  const barWidth = ((index + 2) / 12) * 100;
  const isLast = index === total - 1;
  const answered = selected !== null;

  return (
    <motion.div
      key={`q-${index}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-xl px-4 pb-16 pt-8"
    >
      {/* Nav */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          Question {index + 1} of {total}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#5C4FE5] to-[#7c3aed]"
          initial={false}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step dots */}
      <div className="mt-3 flex items-center justify-center gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const isCompleted = i < index;
          const isCurrent = i === index;
          return (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isCompleted
                  ? "w-4 bg-primary"
                  : isCurrent
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-muted"
              }`}
            />
          );
        })}
      </div>

      {/* Category badge */}
      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
        <span>{question.categoryEmoji}</span>
        {question.category}
      </div>

      {/* Question card */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 text-sm font-bold text-white">
            {index + 1}
          </div>
          <p className="pt-1 text-base font-semibold leading-relaxed text-foreground">
            {question.text}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {question.options.map((option) => {
            const isSelected = selected?.label === option.label;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() =>
                  onSelect({ label: option.label, score: option.score })
                }
                className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary"
                }`}
              >
                {isSelected ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                ) : (
                  <span className="flex h-5 w-5 shrink-0 rounded-full border-2 border-border" />
                )}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next button */}
      <button
        type="button"
        disabled={!answered}
        onClick={onNext}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
          answered
            ? "bg-gradient-to-r from-[#5C4FE5] to-[#7c3aed] text-white hover:opacity-90"
            : "cursor-not-allowed bg-muted text-muted-foreground"
        }`}
      >
        {isLast ? "See Results" : "Next Question"}
        {answered && <ArrowRight className="h-5 w-5" />}
      </button>
      {!answered && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Please select an answer to continue.
        </p>
      )}
    </motion.div>
  );
}
