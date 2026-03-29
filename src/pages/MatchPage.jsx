import { useEffect, useMemo, useState } from "react";
import {
  CheckSquare,
  Square,
  MapPin,
  Search,
  Sparkles,
  X,
  Bookmark,
  BookmarkCheck,
  CircleCheckBig,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/ui";
import { universities } from "../data/mockData";
import {
  applyToSchool,
  getProfile,
  getSavedSchools,
  getTasks,
  getUiPrefs,
  saveTasks,
  saveUiPrefs,
  toggleSavedSchool,
} from "../lib/storage";
import {
  buildRecommendedTasks,
  getMatchCategory,
  getMatchColors,
} from "../lib/helpers";

const filters = ["All", "Reach", "Match", "Safe", "USA", "UK", "Canada"];

export default function MatchPage() {
  const profile = getProfile();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [tasks, setTasks] = useState(getTasks());
  const [hideScoreNote, setHideScoreNote] = useState(
    getUiPrefs().hideMatchScoreNote,
  );
  const [showRecommendPanel, setShowRecommendPanel] = useState(false);
  const [selectedUni, setSelectedUni] = useState(null);
  const [savedSchools, setSavedSchools] = useState(getSavedSchools());

  useEffect(() => {
    const prefs = getUiPrefs();
    saveUiPrefs({
      ...prefs,
      hideMatchScoreNote: hideScoreNote,
    });
  }, [hideScoreNote]);

  const profileItems = useMemo(
    () => [
      ["Name", profile.fullName || "Not set"],
      ["Email", profile.email || "Not set"],
      ["Grade", profile.currentGrade || "Not set"],
      ["Major", profile.targetMajor || "Not set"],
      ["Dream school", profile.dreamSchool || "Not set"],
      ["Countries", profile.targetCountries?.join(", ") || "Not set"],
    ],
    [profile],
  );

  const results = useMemo(() => {
    return universities.filter((uni) => {
      const matchesQuery = uni.name.toLowerCase().includes(query.toLowerCase());
      const category = getMatchCategory(uni.match);

      if (activeFilter === "All") return matchesQuery;
      if (["Reach", "Match", "Safe"].includes(activeFilter)) {
        return matchesQuery && category === activeFilter;
      }
      return matchesQuery && uni.country === activeFilter;
    });
  }, [query, activeFilter]);

  function addRecommendTasks() {
    const suggested = buildRecommendedTasks(profile, tasks);

    if (!suggested.length) {
      alert("AI suggestions are already up to date.");
      setShowRecommendPanel(false);
      return;
    }

    const next = [...suggested, ...tasks];
    setTasks(next);
    saveTasks(next);
    alert(`${suggested.length} personalized tasks added successfully.`);
    setShowRecommendPanel(false);
  }

  function handleApply(uni) {
    const result = applyToSchool(uni);

    if (!result.ok) {
      alert(`${uni.name} is already in Applications.`);
      return;
    }

    alert(`Application submitted successfully for ${uni.name}.`);
  }

  function handleSave(uni) {
    const next = toggleSavedSchool(uni);
    setSavedSchools(next);
  }

  function isSaved(id) {
    return savedSchools.some((item) => item.id === id);
  }

  return (
    <>
      <PageHeader
        title="Find Your Match"
        subtitle="AI-powered university recommendations"
        right={
          <button
            className="secondary-btn !px-3 !py-2 text-sm"
            onClick={() => setShowRecommendPanel((v) => !v)}
          >
            <div className="flex flex-col items-center leading-tight">
              <Sparkles size={16} className="mb-1" />
              <span>AI</span>
              <span>Suggestion</span>
            </div>
          </button>
        }
      />

      {showRecommendPanel ? (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">AI Suggestion</p>
              <p className="mt-1 text-xs text-body">
                Based on your personal information and profile snapshot.
              </p>
            </div>

            <button
              className="icon-btn !h-9 !w-9"
              onClick={() => setShowRecommendPanel(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {profileItems.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] uppercase tracking-wide text-label">
                  {label}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4">
            <div className="flex items-start gap-3">
              <CircleCheckBig size={18} className="mt-0.5 text-brand-600" />
              <div>
                <p className="text-sm font-semibold text-brand-700">
                  Personalized suggestion
                </p>
                <p className="mt-1 text-sm text-brand-700">
                  We use your major, dream school, grade, and target countries
                  to recommend more relevant next steps.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              className="secondary-btn flex-1"
              onClick={() => setShowRecommendPanel(false)}
            >
              Close
            </button>
            <button className="primary-btn flex-1" onClick={addRecommendTasks}>
              Use Suggestion
            </button>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="input h-14 w-full pl-12 pr-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button
          className="inline-flex h-14 shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700"
          onClick={() => setHideScoreNote((v) => !v)}
        >
          {!hideScoreNote ? (
            <CheckSquare size={18} className="text-emerald-600" />
          ) : (
            <Square size={18} className="text-slate-400" />
          )}
          <span>personal information</span>
        </button>
      </div>

      {!hideScoreNote ? (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-700"></p>
          <p className="mt-2 text-xs text-slate-500">
            Current focus: {profile.targetMajor || "Undeclared"} ·{" "}
            {(profile.targetCountries || []).join(", ") ||
              "No countries selected"}
            {profile.gpa ? ` · GPA ${profile.gpa}` : ""}
          </p>
        </div>
      ) : null}

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={
              activeFilter === filter
                ? "pill shrink-0 pill-active"
                : "pill shrink-0"
            }
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {results.map((uni) => {
          const category = getMatchCategory(uni.match);
          const barClass = getMatchColors(uni.match);
          const badgeClass =
            category === "Safe"
              ? "bg-emerald-100 text-emerald-700"
              : category === "Match"
                ? "bg-amber-100 text-amber-700"
                : "bg-rose-100 text-rose-700";

          return (
            <div key={uni.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-lg font-bold text-ink">
                      {uni.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      #{uni.rank}
                    </span>
                  </div>

                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-body">
                    <MapPin size={14} />
                    {uni.location}
                  </p>
                </div>

                <button
                  type="button"
                  className="shrink-0 text-slate-500"
                  onClick={() => handleSave(uni)}
                >
                  {isSaved(uni.id) ? (
                    <BookmarkCheck size={20} className="text-brand-600" />
                  ) : (
                    <Bookmark size={20} />
                  )}
                </button>
              </div>

              <div className="mt-3">
                <Badge className={badgeClass}>{category}</Badge>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">Match</span>
                  <span className="font-bold text-ink">{uni.match}%</span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barClass}`}
                    style={{ width: `${uni.match}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-label">
                    Acceptance
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {uni.acceptanceRate}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-label">
                    Tuition
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {uni.tuition}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-label">
                    Deadline
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">
                    {uni.deadline}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  className="secondary-btn flex-1"
                  onClick={() => setSelectedUni(uni)}
                >
                  View Details
                </button>
                <button
                  className="primary-btn flex-1"
                  onClick={() => handleApply(uni)}
                >
                  Apply
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedUni ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 p-4"
          onClick={() => setSelectedUni(null)}
        >
          <div
            className="mx-auto mt-8 max-w-app rounded-[28px] bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-ink">{selectedUni.name}</h3>
              <button className="icon-btn" onClick={() => setSelectedUni(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p>
                  <span className="font-semibold">Rank:</span> #
                  {selectedUni.rank}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Location:</span>{" "}
                  {selectedUni.location}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Country:</span>{" "}
                  {selectedUni.country}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Match Score:</span>{" "}
                  {selectedUni.match}%
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Acceptance Rate:</span>{" "}
                  {selectedUni.acceptanceRate}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Tuition:</span>{" "}
                  {selectedUni.tuition}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Deadline:</span>{" "}
                  {selectedUni.deadline}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="secondary-btn flex-1"
                onClick={() => setSelectedUni(null)}
              >
                Close
              </button>
              <button
                className="primary-btn flex-1"
                onClick={() => handleApply(selectedUni)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
