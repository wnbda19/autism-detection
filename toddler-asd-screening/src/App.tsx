import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Answer, Demographics, Screen } from "./types";
import { QUESTIONS } from "./data/questions";
import WelcomeScreen from "./components/WelcomeScreen";
import DemographicsForm from "./components/DemographicsForm";
import QuestionPage from "./components/QuestionPage";
import ResultsScreen from "./components/ResultsScreen";

const initialDemographics: Demographics = {
  ageMonths: 24,
  gender: "",
  region: "",
  whoCompleting: "",
  familyASDHistory: "",
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [demographics, setDemographics] =
    useState<Demographics>(initialDemographics);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(Answer | null)[]>(
    () => Array(QUESTIONS.length).fill(null)
  );

  const score = answers.reduce((sum, a) => sum + (a?.score ?? 0), 0);

  const handleRetake = () => {
    setScreen("welcome");
    setDemographics(initialDemographics);
    setQuestionIndex(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
  };

  const handleSelectAnswer = (answer: Answer) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = answer;
      return next;
    });
  };

  const handleQuestionBack = () => {
    if (questionIndex === 0) {
      setScreen("demographics");
    } else {
      setQuestionIndex((i) => i - 1);
    }
  };

  const handleQuestionNext = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setScreen("results");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {screen === "welcome" && (
          <WelcomeScreen
            key="welcome"
            onBegin={() => setScreen("demographics")}
          />
        )}

        {screen === "demographics" && (
          <DemographicsForm
            key="demographics"
            data={demographics}
            onChange={setDemographics}
            onBack={() => setScreen("welcome")}
            onContinue={() => {
              setQuestionIndex(0);
              setScreen("questions");
            }}
          />
        )}

        {screen === "questions" && (
          <QuestionPage
            key={`q-${questionIndex}`}
            question={QUESTIONS[questionIndex]}
            index={questionIndex}
            total={QUESTIONS.length}
            selected={answers[questionIndex]}
            onSelect={handleSelectAnswer}
            onBack={handleQuestionBack}
            onNext={handleQuestionNext}
          />
        )}

        {screen === "results" && (
          <ResultsScreen
            key="results"
            score={score}
            demographics={demographics}
            onRetake={handleRetake}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
