import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleHelp,
  LoaderCircle,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { getProfile } from "../lib/storage";

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    question: "Which section is a core part of the SAT?",
    options: ["Listening", "Reading and Writing", "Speaking", "Interview"],
    answer: 1,
    explanation:
      "The SAT includes Reading and Writing as one of its main tested sections.",
  },
  {
    id: 2,
    question: "What skill is most important for SAT Math success?",
    options: [
      "Guessing quickly",
      "Strong algebra and problem-solving",
      "Memorizing history facts",
      "Writing long essays",
    ],
    answer: 1,
    explanation:
      "SAT Math heavily emphasizes algebra, quantitative reasoning, and efficient problem-solving.",
  },
  {
    id: 3,
    question: "Why is time management important on the SAT?",
    options: [
      "Because students must speak every answer aloud",
      "Because each section has limited time",
      "Because calculators are not allowed at all",
      "Because essays are always required",
    ],
    answer: 1,
    explanation:
      "SAT sections are timed, so pacing is important for completing more questions accurately.",
  },
  {
    id: 4,
    question: "Which habit best improves SAT Reading and Writing performance?",
    options: [
      "Ignoring punctuation rules",
      "Practicing passage-based questions regularly",
      "Memorizing random formulas only",
      "Skipping difficult questions without review",
    ],
    answer: 1,
    explanation:
      "Regular passage-based practice helps build comprehension, grammar accuracy, and test familiarity.",
  },
  {
    id: 5,
    question: "What is one benefit of taking full-length SAT practice tests?",
    options: [
      "They remove the need to study",
      "They improve stamina and pacing",
      "They guarantee a perfect score",
      "They replace all school learning",
    ],
    answer: 1,
    explanation:
      "Practice tests help students build endurance, identify weak areas, and improve pacing.",
  },
  {
    id: 6,
    question:
      "What should a student do first when solving a difficult SAT Math question?",
    options: [
      "Panic and skip immediately",
      "Identify what the question is asking",
      "Write a long paragraph",
      "Change the numbers in the question",
    ],
    answer: 1,
    explanation:
      "Understanding the question clearly is the first step before selecting a strategy.",
  },
  {
    id: 7,
    question: "Which approach is best when reviewing SAT mistakes?",
    options: [
      "Only check whether the answer was wrong",
      "Analyze why the correct answer is right",
      "Ignore explanation details",
      "Retake without reflection",
    ],
    answer: 1,
    explanation:
      "Reviewing the reasoning behind correct answers leads to better improvement.",
  },
  {
    id: 8,
    question: "What does SAT preparation most benefit from?",
    options: [
      "Consistent practice and error review",
      "Studying only the night before",
      "Avoiding official-style questions",
      "Using only vocabulary flashcards",
    ],
    answer: 0,
    explanation:
      "Steady practice combined with reviewing mistakes is one of the most effective preparation methods.",
  },
  {
    id: 9,
    question: "Which of the following best supports SAT Reading comprehension?",
    options: [
      "Reading quickly without understanding",
      "Finding the main idea and supporting evidence",
      "Skipping every long passage",
      "Memorizing all answer choices",
    ],
    answer: 1,
    explanation:
      "Strong SAT reading depends on understanding central ideas and textual evidence.",
  },
  {
    id: 10,
    question: "What is the best mindset for SAT prep?",
    options: [
      "Improvement comes from strategy and practice",
      "Only natural talent matters",
      "One bad test means no progress is possible",
      "Hard questions should always be avoided",
    ],
    answer: 0,
    explanation:
      "SAT performance improves through strategy, repetition, and reviewing mistakes.",
  },
];

export default function SATPracticePage() {
  const profile = useMemo(() => getProfile(), []);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [revealed, setRevealed] = useState({});
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const answeredCount = useMemo(() => Object.keys(selected).length, [selected]);

  const score = useMemo(() => {
    return questions.reduce((total, q) => {
      return total + (selected[q.id] === q.answer ? 1 : 0);
    }, 0);
  }, [questions, selected]);

  async function loadQuiz() {
    setLoading(true);
    setUsingFallback(false);
    setSelected({});
    setRevealed({});

    try {
      const localized = FALLBACK_QUESTIONS.map((item) => ({
        ...item,
        question:
          profile?.targetMajor && item.id === 2
            ? `${item.question} (${profile.targetMajor} preparation context)`
            : item.question,
      }));

      setQuestions(localized);
    } catch {
      setQuestions(FALLBACK_QUESTIONS);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuiz();
  }, []);

  function choose(questionId, optionIndex) {
    if (revealed[questionId]) return;

    setSelected((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));

    setRevealed((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  }

  function resetQuiz() {
    setSelected({});
    setRevealed({});
  }

  if (loading) {
    return (
      <>
        <PageHeader
          title="SAT Practice"
          subtitle="Preparing your SAT multiple-choice questions"
          showBack
        />

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <LoaderCircle className="animate-spin text-brand-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-ink">
                Preparing your SAT practice set
              </p>
              <p className="mt-1 text-sm text-body">
                Loading 10 multiple-choice questions with instant answer
                feedback.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="SAT Practice"
        subtitle="10 multiple-choice questions with immediate answer feedback"
        showBack
      />

      <div className="card mb-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">
              Personalized Practice
            </p>
            <p className="mt-1 text-sm text-body">
              Focus on SAT format, test understanding, and improvement concepts.
            </p>
          </div>

          <div className="rounded-2xl bg-brand-50 px-3 py-2 text-sm font-bold text-brand-600">
            {answeredCount}/{questions.length}
          </div>
        </div>

        {usingFallback ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Fallback SAT question set loaded.
          </div>
        ) : null}

        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Current score: {score} / {questions.length}
        </div>
      </div>

      <div className="mb-4 flex gap-3">
        <button className="secondary-btn flex-1" onClick={resetQuiz}>
          Reset Answers
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((item, index) => {
          const picked = selected[item.id];
          const answered = revealed[item.id];
          const isCorrect = picked === item.answer;

          return (
            <div key={item.id} className="card p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  Q{index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">
                    {item.question}
                  </p>

                  <div className="mt-3 space-y-2">
                    {item.options.map((option, optionIndex) => {
                      const active = picked === optionIndex;
                      const showCorrect =
                        answered && optionIndex === item.answer;
                      const showWrong =
                        answered && active && optionIndex !== item.answer;

                      return (
                        <button
                          key={`${item.id}-${optionIndex}-${option}`}
                          type="button"
                          onClick={() => choose(item.id, optionIndex)}
                          className={[
                            "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                            showCorrect
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : showWrong
                                ? "border-rose-300 bg-rose-50 text-rose-700"
                                : active
                                  ? "border-brand-300 bg-brand-50 text-brand-700"
                                  : "border-slate-200 bg-white text-slate-700",
                          ].join(" ")}
                        >
                          <span className="flex items-start gap-3">
                            {answered ? (
                              showCorrect ? (
                                <CheckCircle2
                                  size={18}
                                  className="mt-0.5 shrink-0"
                                />
                              ) : showWrong ? (
                                <XCircle
                                  size={18}
                                  className="mt-0.5 shrink-0"
                                />
                              ) : (
                                <CircleHelp
                                  size={18}
                                  className="mt-0.5 shrink-0 opacity-70"
                                />
                              )
                            ) : active ? (
                              <CheckCircle2
                                size={18}
                                className="mt-0.5 shrink-0"
                              />
                            ) : (
                              <Circle
                                size={18}
                                className="mt-0.5 shrink-0 opacity-60"
                              />
                            )}
                            <span>{option}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {answered ? (
                    <div
                      className={[
                        "mt-3 rounded-2xl px-4 py-3 text-sm",
                        isCorrect
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border border-amber-200 bg-amber-50 text-amber-700",
                      ].join(" ")}
                    >
                      <p className="font-semibold">
                        {isCorrect ? "Correct answer." : "Incorrect answer."}
                      </p>
                      <p className="mt-1">{item.explanation}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
