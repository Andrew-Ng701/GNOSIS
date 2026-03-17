import { CalendarDays, CheckCircle2, MapPin, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/ui";
import {
  applicationStatuses,
  universities,
  universityFilters,
} from "../data/mockData";
import {
  addApplication,
  addTask,
  getApplications,
  getProfile,
} from "../lib/storage";
import {
  formatDueDate,
  getMatchCategory,
  getMatchColors,
  uid,
} from "../lib/helpers";

export default function MatchPage() {
  const profile = getProfile();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [applications, setApplications] = useState(getApplications());
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const targetCountries = Array.isArray(profile.targetCountries)
      ? profile.targetCountries
      : [];

    return [...universities]
      .filter((uni) => {
        const category = getMatchCategory(uni.match);
        const text = [
          uni.name,
          uni.shortName,
          uni.location,
          uni.country,
          ...(uni.majors || []),
          ...(uni.tags || []),
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery = normalizedQuery
          ? text.includes(normalizedQuery)
          : true;

        if (!matchesQuery) return false;
        if (activeFilter === "All") return true;
        if (["Reach", "Match", "Safe"].includes(activeFilter)) {
          return category === activeFilter;
        }
        return uni.country === activeFilter;
      })
      .sort((a, b) => {
        const aMajorMatch = (a.majors || []).includes(profile.targetMajor)
          ? 1
          : 0;
        const bMajorMatch = (b.majors || []).includes(profile.targetMajor)
          ? 1
          : 0;

        const aCountryMatch = targetCountries.includes(a.country) ? 1 : 0;
        const bCountryMatch = targetCountries.includes(b.country) ? 1 : 0;

        if (bMajorMatch !== aMajorMatch) return bMajorMatch - aMajorMatch;
        if (bCountryMatch !== aCountryMatch)
          return bCountryMatch - aCountryMatch;
        return b.match - a.match;
      });
  }, [activeFilter, profile.targetCountries, profile.targetMajor, query]);

  function isApplied(universityId) {
    return applications.some((item) => item.universityId === universityId);
  }

  function handleApply(uni) {
    if (isApplied(uni.id)) return;

    const next = addApplication({
      id: uid("app"),
      universityId: uni.id,
      universityName: uni.name,
      targetMajor:
        (uni.majors || []).includes(profile.targetMajor) && profile.targetMajor
          ? profile.targetMajor
          : uni.majors?.[0] || profile.targetMajor || "Undeclared",
      status: applicationStatuses[0],
      deadline: uni.deadline,
      country: uni.country,
      appliedAt: new Date().toISOString(),
    });

    setApplications(next);

    addTask({
      id: uid("task"),
      title: `Start application for ${uni.shortName || uni.name}`,
      category: "Applications",
      dueDate: uni.deadline,
      completed: false,
      linkedUniversityId: uni.id,
    });

    addTask({
      id: uid("task"),
      title: `Prepare documents for ${uni.shortName || uni.name}`,
      category: "Documents",
      dueDate: uni.deadline,
      completed: false,
      linkedUniversityId: uni.id,
    });

    setSelectedUniversity((current) =>
      current?.id === uni.id ? { ...uni } : current,
    );
  }

  return (
    <>
      <PageHeader
        title="Find Your Match"
        subtitle="AI-powered university recommendations"
      />

      <div className="relative mb-4">
        <Search
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          className="input pl-11"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search universities, countries, majors..."
        />
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {universityFilters.map((filter) => (
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

      <div className="mb-4 rounded-2xl border border-brand-100 bg-brand-50 p-4">
        <p className="text-sm text-brand-700">
          Results are prioritized using your target major, country preferences,
          and saved profile information.
        </p>
        <p className="mt-2 text-xs text-brand-600">
          Current focus: {profile.targetMajor || "Undeclared"} ·{" "}
          {(profile.targetCountries || []).join(", ") ||
            "No countries selected"}
        </p>
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

          const applied = isApplied(uni.id);
          const majorFit = (uni.majors || []).includes(profile.targetMajor);

          return (
            <div key={uni.id} className="card overflow-hidden p-4">
              {uni.image ? (
                <div className="mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={uni.image}
                    alt={uni.name}
                    className="h-40 w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-ink">{uni.name}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      #{uni.rank}
                    </span>
                  </div>

                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-body">
                    <MapPin size={14} />
                    {uni.location}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className={badgeClass}>{category}</Badge>
                    {majorFit ? (
                      <Badge className="bg-brand-100 text-brand-700">
                        Major Fit
                      </Badge>
                    ) : null}
                    {(profile.targetCountries || []).includes(uni.country) ? (
                      <Badge className="bg-sky-100 text-sky-700">
                        Target Country
                      </Badge>
                    ) : null}
                  </div>
                </div>
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

              <p className="mt-4 text-sm leading-6 text-body">
                {uni.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(uni.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
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
                    {formatDueDate(uni.deadline)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  className="secondary-btn flex-1"
                  onClick={() => setSelectedUniversity(uni)}
                >
                  View Details
                </button>
                <button
                  className={`flex-1 ${applied ? "secondary-btn" : "primary-btn"}`}
                  onClick={() => handleApply(uni)}
                  disabled={applied}
                >
                  {applied ? "Added" : "Apply"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {results.length === 0 ? (
        <div className="card mt-4 p-6 text-center">
          <p className="text-base font-semibold text-ink">No matches found</p>
          <p className="mt-2 text-sm text-body">
            Try another keyword or switch to a different country or match
            filter.
          </p>
        </div>
      ) : null}

      {selectedUniversity ? (
        <UniversityModal
          university={selectedUniversity}
          applied={isApplied(selectedUniversity.id)}
          onClose={() => setSelectedUniversity(null)}
          onApply={() => handleApply(selectedUniversity)}
          targetMajor={profile.targetMajor}
        />
      ) : null}
    </>
  );
}

function UniversityModal({
  university,
  applied,
  onClose,
  onApply,
  targetMajor,
}) {
  const category = getMatchCategory(university.match);
  const badgeClass =
    category === "Safe"
      ? "bg-emerald-100 text-emerald-700"
      : category === "Match"
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/30 p-4" onClick={onClose}>
      <div
        className="mx-auto mt-10 max-w-app rounded-[28px] bg-white p-5 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-ink">{university.name}</h3>
              <Badge className={badgeClass}>{category}</Badge>
            </div>
            <p className="mt-2 inline-flex items-center gap-1 text-sm text-body">
              <MapPin size={14} />
              {university.location}
            </p>
          </div>

          <button className="icon-btn !h-10 !w-10" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {university.image ? (
          <div className="mb-4 overflow-hidden rounded-2xl">
            <img
              src={university.image}
              alt={university.name}
              className="h-48 w-full object-cover"
            />
          </div>
        ) : null}

        <p className="text-sm leading-6 text-body">{university.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoCard label="Rank" value={`#${university.rank}`} />
          <InfoCard label="Country" value={university.country} />
          <InfoCard label="Acceptance Rate" value={university.acceptanceRate} />
          <InfoCard
            label="Application Round"
            value={university.applicationRound}
          />
          <InfoCard label="Tuition" value={university.tuition} />
          <InfoCard label="Type" value={university.type} />
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <CalendarDays size={16} />
            Deadline
          </div>
          <p className="mt-2 text-sm text-body">
            {formatDueDate(university.deadline)}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-ink">Supported majors</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(university.majors || []).map((major) => (
              <Badge
                key={major}
                className={
                  major === targetMajor
                    ? "bg-brand-100 text-brand-700"
                    : "bg-slate-100 text-slate-700"
                }
              >
                {major}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-ink">Highlights</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(university.tags || []).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="secondary-btn flex-1" onClick={onClose}>
            Close
          </button>
          <button
            className={`flex-1 ${applied ? "secondary-btn" : "primary-btn"}`}
            onClick={onApply}
            disabled={applied}
          >
            {applied ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} />
                Added to Applications
              </span>
            ) : (
              "Apply"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-label">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
