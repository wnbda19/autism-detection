export interface Demographics {
  ageMonths: number;
  gender: "Male" | "Female" | "";
  region: string;
  whoCompleting: string;
  familyASDHistory: "No" | "Yes" | "";
}

export interface Answer {
  label: string;
  score: number;
}

export interface Question {
  id: string;
  category: string;
  categoryEmoji: string;
  text: string;
  options: { label: string; score: 0 | 1 }[];
}

export type Screen = "welcome" | "demographics" | "questions" | "results";
