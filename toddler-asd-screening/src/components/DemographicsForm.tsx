import type { ReactNode } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";
import type { Demographics } from "../types";
import { SAUDI_REGIONS } from "../data/regions";

interface DemographicsFormProps {
  data: Demographics;
  onChange: (data: Demographics) => void;
  onBack: () => void;
  onContinue: () => void;
}

const WHO_OPTIONS = [
  "Family member",
  "Health care professional",
  "Other",
] as const;

function PillButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
        selected
          ? "border-primary bg-primary text-white shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary"
      }`}
    >
      {selected ? (
        <CheckCircle2 className="h-5 w-5 shrink-0" />
      ) : (
        <span className="flex h-5 w-5 shrink-0 rounded-full border-2 border-border" />
      )}
      {children}
    </button>
  );
}

export default function DemographicsForm({
  data,
  onChange,
  onBack,
  onContinue,
}: DemographicsFormProps) {
  const isComplete =
    data.ageMonths >= 12 &&
    data.ageMonths <= 36 &&
    data.gender !== "" &&
    data.region !== "" &&
    data.whoCompleting !== "" &&
    data.familyASDHistory !== "";

  const set = <K extends keyof Demographics>(
    key: K,
    value: Demographics[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  const adjustAge = (delta: number) => {
    set("ageMonths", Math.min(36, Math.max(12, data.ageMonths + delta)));
  };

  return (
    <motion.div
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
          Step 1 of 11
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5C4FE5] to-[#7c3aed]"
          style={{ width: "9%" }}
        />
      </div>

      <h1 className="mt-6 text-2xl font-bold leading-[1.4] text-foreground">
        Child's Information
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Please provide a few details before starting the questionnaire.
      </p>

      {/* Form card */}
      <div className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Age */}
        <section className="p-5 sm:p-6">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Child's Age (months)
          </label>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => adjustAge(-1)}
              disabled={data.ageMonths <= 12}
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-primary transition-all duration-200 hover:bg-secondary active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease age"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="min-w-[4.5rem] text-center">
              <span className="text-4xl font-extrabold text-primary">
                {data.ageMonths}
              </span>
              <p className="text-xs font-medium text-muted-foreground">
                months
              </p>
            </div>
            <button
              type="button"
              onClick={() => adjustAge(1)}
              disabled={data.ageMonths >= 36}
              className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-card text-primary transition-all duration-200 hover:bg-secondary active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase age"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <input
            type="range"
            min={12}
            max={36}
            value={data.ageMonths}
            onChange={(e) => set("ageMonths", Number(e.target.value))}
            className="mt-4 w-full cursor-pointer accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>12 months</span>
            <span>36 months</span>
          </div>
        </section>

        {/* Gender */}
        <section className="p-5 sm:p-6">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Gender
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                { value: "Male" as const, emoji: "👦" },
                { value: "Female" as const, emoji: "👧" },
              ] as const
            ).map(({ value, emoji }) => (
              <PillButton
                key={value}
                selected={data.gender === value}
                onClick={() => set("gender", value)}
              >
                {emoji} {value}
              </PillButton>
            ))}
          </div>
        </section>

        {/* Region */}
        <section className="p-5 sm:p-6">
          <label
            htmlFor="region"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Region (Saudi Arabia)
          </label>
          <div className="relative mt-3">
            <select
              id="region"
              value={data.region}
              onChange={(e) => set("region", e.target.value)}
              className="w-full rounded-xl border-2 border-border bg-muted px-4 py-3 pr-10 text-sm font-semibold text-foreground outline-none transition-all duration-200 focus:border-primary"
            >
              <option value="" disabled>
                Select a province…
              </option>
              {SAUDI_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </section>

        {/* Who completing */}
        <section className="p-5 sm:p-6">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Who is completing this assessment?
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {WHO_OPTIONS.map((option) => (
              <PillButton
                key={option}
                selected={data.whoCompleting === option}
                onClick={() => set("whoCompleting", option)}
              >
                {option}
              </PillButton>
            ))}
          </div>
        </section>

        {/* Family ASD history */}
        <section className="p-5 sm:p-6">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Family history of ASD?
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            Has anyone in the immediate family been diagnosed with autism
            spectrum disorder?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                { value: "No" as const, emoji: "✗" },
                { value: "Yes" as const, emoji: "✓" },
              ] as const
            ).map(({ value, emoji }) => (
              <PillButton
                key={value}
                selected={data.familyASDHistory === value}
                onClick={() => set("familyASDHistory", value)}
              >
                {emoji}&nbsp;&nbsp;{value}
              </PillButton>
            ))}
          </div>
        </section>
      </div>

      {/* Continue button */}
      <button
        type="button"
        disabled={!isComplete}
        onClick={onContinue}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold transition-all duration-200 active:scale-[0.98] ${
          isComplete
            ? "bg-gradient-to-r from-[#5C4FE5] to-[#7c3aed] text-white hover:opacity-90"
            : "cursor-not-allowed bg-muted text-muted-foreground"
        }`}
      >
        Continue
        {isComplete && <ArrowRight className="h-5 w-5" />}
      </button>
      {!isComplete && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Please complete all fields above to continue.
        </p>
      )}
    </motion.div>
  );
}
