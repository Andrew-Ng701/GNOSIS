import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleHelp,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { generateIeltsQuiz } from "../lib/openai";
import { getProfile } from "../lib/storage";

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    question: "Which four sections make up the IELTS test?",
    options: [
      "Reading, Writing, Speaking, Listening",
      "Grammar, Vocabulary, Translation, Interview",
      "Reading, Writing, Dictation, Presentation",
      "Listening, Speaking, Debate, Essay",
    ],
    answer: 0,
    explanation:
      "IELTS consists of four sections: Listening, Reading, Writing, and Speaking.",
  },
  {
    id: 2,
    question:
      "Which section of IELTS is always completed in a face-to-face interview format?",
    options: ["Reading", "Listening", "Writing", "Speaking"],
    answer: 3,
    explanation:
      "The Speaking test is conducted as an interview with an examiner.",
  },
  {
    id: 3,
    question: "How many parts are there in the IELTS Speaking test?",
    options: ["2", "3", "4", "5"],
    answer: 1,
    explanation:
      "IELTS Speaking has 3 parts: introduction/interview, long turn, and discussion.",
  },
  {
    id: 4,
    question: "What is the usual total time for the IELTS Listening test?",
    options: [
      "About 15 minutes",
      "About 30 minutes",
      "About 45 minutes",
      "About 60 minutes",
    ],
    answer: 1,
    explanation:
      "The Listening section usually takes about 30 minutes, with a little extra time depending on delivery mode.",
  },
  {
    id: 5,
    question: "How many questions are there in the IELTS Listening section?",
    options: ["20", "30", "40", "50"],
    answer: 2,
    explanation: "IELTS Listening normally includes 40 questions.",
  },
  {
    id: 6,
    question: "Which statement about IELTS Reading is correct?",
    options: [
      "It always has 2 passages only",
      "It usually has 3 passages",
      "It has 5 short passages only",
      "It has no timing limit",
    ],
    answer: 1,
    explanation: "The Reading test usually contains 3 passages.",
  },
  {
    id: 7,
    question:
      "What is one key difference between Academic and General Training IELTS?",
    options: [
      "The Speaking test is completely different",
      "The Reading and Writing tasks can differ",
      "The Listening test is removed in General Training",
      "Academic has no Speaking section",
    ],
    answer: 1,
    explanation:
      "Academic and General Training mainly differ in Reading and Writing content.",
  },
  {
    id: 8,
    question:
      "In IELTS Writing Task 2, what are candidates usually expected to write?",
    options: [
      "A short note under 50 words",
      "A formal speech script",
      "An essay responding to a prompt",
      "A summary of a listening recording",
    ],
    answer: 2,
    explanation:
      "Writing Task 2 usually requires an essay in response to a question or statement.",
  },
  {
    id: 9,
    question:
      "Which skill is most helpful for improving IELTS Listening performance?",
    options: [
      "Memorizing only difficult idioms",
      "Practicing prediction before listening",
      "Ignoring spelling",
      "Writing very long answers",
    ],
    answer: 1,
    explanation:
      "Prediction helps candidates anticipate what information to listen for.",
  },
  {
    id: 10,
    question: "Why is time management important in the IELTS Reading test?",
    options: [
      "Because candidates can use calculators",
      "Because all answers must be spoken aloud",
      "Because there are multiple passages and limited time",
      "Because the examiner gives hints",
    ],
    answer: 2,
    explanation:
      "Reading includes several passages and requires efficient pacing.",
  },
  {
    id: 11,
    question: "Which approach is best for IELTS Writing improvement?",
    options: [
      "Write without planning",
      "Memorize one essay for every topic",
      "Practice structure, idea development, and clear examples",
      "Focus only on handwriting style",
    ],
    answer: 2,
    explanation:
      "Strong IELTS writing depends on clear structure, relevant support, and coherent ideas.",
  },
  {
    id: 12,
    question:
      "In IELTS Speaking, what should a candidate do if they need a moment to think?",
    options: [
      "Stay silent for the whole test",
      "Use simple fillers and then answer clearly",
      "Switch to their first language",
      "Ask the examiner for the answer",
    ],
    answer: 1,
    explanation:
      "Using natural fillers briefly and continuing confidently is a better speaking strategy.",
  },
  {
    id: 13,
    question:
      "Which of the following is most closely related to coherence and cohesion in IELTS?",
    options: [
      "Using linking words logically",
      "Speaking as fast as possible",
      "Using only advanced vocabulary",
      "Avoiding paragraphs",
    ],
    answer: 0,
    explanation:
      "Coherence and cohesion involve logical organization and effective linking.",
  },
  {
    id: 14,
    question: "What is the main purpose of skimming in IELTS Reading?",
    options: [
      "To memorize every sentence",
      "To understand the general idea quickly",
      "To translate the whole passage",
      "To check grammar rules only",
    ],
    answer: 1,
    explanation:
      "Skimming helps you get the overall meaning fast before focusing on details.",
  },
  {
    id: 15,
    question: "What is the main purpose of scanning in IELTS Reading?",
    options: [
      "To find specific information quickly",
      "To rewrite the passage",
      "To practice pronunciation",
      "To avoid reading headings",
    ],
    answer: 0,
    explanation:
      "Scanning is used to locate names, dates, numbers, and key details quickly.",
  },
  {
    id: 16,
    question: "Which habit is most useful for improving IELTS vocabulary?",
    options: [
      "Memorizing random word lists without context",
      "Learning words in topic-based context and using them actively",
      "Avoiding synonyms",
      "Using the same adjective in every answer",
    ],
    answer: 1,
    explanation:
      "Context-based vocabulary learning is more useful for actual IELTS use.",
  },
  {
    id: 17,
    question: "In IELTS Listening, why does spelling matter?",
    options: [
      "Because answers can be marked wrong if spelled incorrectly",
      "Because spelling is never checked",
      "Because only handwriting is graded",
      "Because candidates must spell every word aloud",
    ],
    answer: 0,
    explanation:
      "Incorrect spelling can lead to lost marks in Listening answers.",
  },
  {
    id: 18,
    question:
      "Which strategy best supports improvement in IELTS Speaking fluency?",
    options: [
      "Memorizing all answers word for word",
      "Regular timed speaking practice on familiar topics",
      "Answering every question with one sentence only",
      "Avoiding feedback",
    ],
    answer: 1,
    explanation: "Timed speaking practice builds fluency and confidence.",
  },
  {
    id: 19,
    question: "What does a band score in IELTS represent?",
    options: [
      "A pass or fail result only",
      "A ranking of handwriting neatness",
      "A measure of English proficiency level",
      "A school subject grade average",
    ],
    answer: 2,
    explanation:
      "IELTS band scores reflect English language proficiency across skills.",
  },
  {
    id: 20,
    question:
      "Which preparation method is the most balanced for IELTS success?",
    options: [
      "Practice only your strongest section",
      "Study all four skills and review mistakes regularly",
      "Skip mock practice entirely",
      "Focus only on difficult vocabulary lists",
    ],
    answer: 1,
    explanation:
      "Balanced preparation across all four skills is the most effective approach.",
  },
];

export default function IELTSPracticePage() {
  const profile = useMemo(() => getProfile(), []);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState("");

  const answeredCount = useMemo(() => Object.keys(selected).length, [selected]);

  const score = useMemo(() => {
    return questions.reduce((total, q) => {
      return total + (selected[q.id] === q.answer ? 1 : 0);
    }, 0);
  }, [questions, selected]);

  async function loadQuiz() {
    setLoading(true);
    setError("");
    setUsingFallback(false);
    setSelected({});
    setSubmitted(false);

    try {
      const generated = await generateIeltsQuiz(profile);

      if (!Array.isArray(generated) || generated.length === 0) {
        throw new Error("Generated quiz is empty.");
      }

      setQuestions(generated);
    } catch (err) {
      console.error("Failed to generate IELTS quiz:", err);
      setQuestions(FALLBACK_QUESTIONS);
      setUsingFallback(true);
      setError(
        err?.message ||
          "Failed to generate quiz from AI. Loaded local practice set instead.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuiz();
  }, []);

  function choose(questionId, optionIndex) {
    if (submitted || loading) return;

    setSelected((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  }

  function submitAnswers() {
    if (!questions.length) return;

    if (answeredCount < questions.length) {
      const confirmed = window.confirm(
        `You have answered ${answeredCount} out of ${questions.length} questions. Submit anyway?`,
      );
      if (!confirmed) return;
    }

    setSubmitted(true);
  }

  function resetQuizProgress() {
    setSelected({});
    setSubmitted(false);
  }

  if (loading) {
    return (
      <>
        <PageHeader
          title="IELTS Practice"
          subtitle="Generating a personalized MC practice set"
          showBack
        />

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <LoaderCircle className="animate-spin text-brand-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-ink">
                Generating your IELTS practice
              </p>
              <p className="mt-1 text-sm text-body">
                Creating 20 multiple-choice questions based on IELTS format and
                exam concepts.
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
        title="IELTS Practice"
        subtitle="20 multiple-choice questions generated for your practice"
        showBack
      />

      <div className="card mb-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">
              Personalized Practice
            </p>
            <p className="mt-1 text-sm text-body">
              Dynamic questions focused on IELTS format, exam understanding, and
              score-improving concepts.
            </p>
          </div>

          <div className="rounded-2xl bg-brand-50 px-3 py-2 text-sm font-bold text-brand-600">
            {answeredCount}/{questions.length}
          </div>
        </div>

        {usingFallback ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            AI generation was unavailable, so a local practice set was loaded
            instead.
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            This set was generated dynamically when you entered the page.
          </div>
        )}

        {error ? (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {error}
          </div>
        ) : null}

        {submitted ? (
          <div className="mt-3 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            You completed the practice set. Your score is {score} out of{" "}
            {questions.length}.
          </div>
        ) : null}
      </div>

      <div className="mb-4 flex gap-3">
        <button
          className="secondary-btn flex flex-1 items-center justify-center gap-2"
          onClick={loadQuiz}
        >
          <RefreshCcw size={16} />
          Generate New Set
        </button>

        <button className="secondary-btn flex-1" onClick={resetQuizProgress}>
          Reset Answers
        </button>
      </div>

      <div className="space-y-4">
        {questions.map((item, index) => {
          const picked = selected[item.id];
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
                        submitted && optionIndex === item.answer;
                      const showWrong =
                        submitted && active && optionIndex !== item.answer;

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
                            {submitted ? (
                              showCorrect ? (
                                <CheckCircle2
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

                  {submitted ? (
                    <div
                      className={[
                        "mt-3 rounded-2xl px-4 py-3 text-sm",
                        isCorrect
                          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border border-amber-200 bg-amber-50 text-amber-700",
                      ].join(" ")}
                    >
                      {item.explanation}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-3">
        <button className="secondary-btn flex-1" onClick={resetQuizProgress}>
          Reset
        </button>
        <button className="primary-btn flex-1" onClick={submitAnswers}>
          Submit Answers
        </button>
      </div>
    </>
  );
}
