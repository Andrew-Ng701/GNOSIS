import {
  Bot,
  Brain,
  CalendarClock,
  ClipboardList,
  FileText,
  GraduationCap,
  PencilLine,
  RefreshCcw,
  User,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import { Badge, SectionTitle } from "../components/ui";
import { buildCVText, getMatchCategory, percent } from "../lib/helpers";
import {
  getApplications,
  getCvData,
  getDocuments,
  getProfile,
  getSavedSchools,
  resetAppData,
  saveApplications,
  saveCvData,
  saveDocuments,
} from "../lib/storage";

export default function MorePage() {
  const navigate = useNavigate();
  const profile = getProfile();
  const savedSchools = getSavedSchools();
  const [mentorBooking, setMentorBooking] = useState(null);

  const mentors = [
    {
      id: "mentor-1",
      name: "Dr. Emma Carter",
      expertise: ["SAT Reading", "SAT Writing", "College Applications"],
    },
    {
      id: "mentor-2",
      name: "Jason Lee",
      expertise: ["SAT Math", "Test Strategy", "Time Management"],
    },
    {
      id: "mentor-3",
      name: "Sophia Wong",
      expertise: ["SAT Verbal", "Essay Planning", "Interview Preparation"],
    },
  ];

  const [applications, setApplications] = useState(getApplications());
  const [docs, setDocs] = useState(getDocuments());
  const [showCvModal, setShowCvModal] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [mentorTime, setMentorTime] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState(mentors[0].id);

  const [cvData, setCvData] = useState(() => {
    const saved = getCvData();
    return {
      ...saved,
      fullName: saved.fullName || profile.fullName || "",
      email: saved.email || profile.email || "",
      city: saved.city || profile.city || "",
      phone: saved.phone || "",
      summary: saved.summary || "",
      education: saved.education || "",
      experience: saved.experience || "",
      activities: saved.activities || "",
      awards: saved.awards || "",
      skills: saved.skills || "",
    };
  });

  const selectedMentor = useMemo(() => {
    return (
      mentors.find((mentor) => mentor.id === selectedMentorId) || mentors[0]
    );
  }, [selectedMentorId]);

  const profileItems = useMemo(
    () => [
      ["Name", profile.fullName || "Not set"],
      ["Email", profile.email || "Not set"],
      ["Grade", profile.currentGrade || "Not set"],
      ["Country", profile.country || "Not set"],
      ["City", profile.city || "Not set"],
      ["School", profile.schoolName || "Not set"],
      ["Major", profile.targetMajor || "Not set"],
      ["Dream school", profile.dreamSchool || "Not set"],
      ["Countries", profile.targetCountries?.join(", ") || "Not set"],
      ["GPA", profile.gpa || "Not set"],
    ],
    [profile],
  );

  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      const aTime = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
      const bTime = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [applications]);

  const cvPreview = useMemo(() => buildCVText(cvData), [cvData]);

  const profileCompletion = useMemo(() => {
    const fields = [
      profile.fullName,
      profile.email,
      profile.currentGrade,
      profile.country,
      profile.city,
      profile.schoolName,
      profile.gpa,
      profile.targetMajor,
      profile.dreamSchool,
      profile.targetCountries?.length ? "has-countries" : "",
    ];
    const filled = fields.filter(Boolean).length;
    return percent(filled, fields.length);
  }, [profile]);

  function formatAppliedAt(value) {
    if (!value) return "No date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No date";
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  }

  function getBadgeClass(score) {
    const category = getMatchCategory(score || 0);
    if (category === "Safe") return "bg-emerald-100 text-emerald-700";
    if (category === "Match") return "bg-amber-100 text-amber-700";
    return "bg-rose-100 text-rose-700";
  }

  function syncDocuments(next) {
    setDocs(next);
    saveDocuments(next);
  }

  function saveCv() {
    saveCvData(cvData);

    const next = docs.map((doc) =>
      doc.name === "CV Resume"
        ? {
            ...doc,
            status: "Complete",
            fileName: "cv-profile-generated.pdf",
          }
        : doc,
    );

    syncDocuments(next);
    alert("CV saved successfully.");
    setShowCvModal(false);
  }

  function handleCancelApplication(id, name) {
    const confirmed = window.confirm(`Cancel application for ${name}?`);
    if (!confirmed) return;

    const next = applications.filter((item) => item.id !== id);
    setApplications(next);
    saveApplications(next);
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Reset all local app data? This will clear onboarding, profile, posts, tasks, documents, saved schools, applications, and CV data.",
    );
    if (!confirmed) return;

    resetAppData();
    window.location.href = "/";
  }

  function handleMentorBooking() {
    if (!selectedMentorId) {
      alert("Please choose a mentor first.");
      return;
    }

    if (!mentorTime) {
      alert("Please choose a session time first.");
      return;
    }

    const booking = {
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      expertise: selectedMentor.expertise,
      time: mentorTime,
      status: "Confirmed",
      bookedAt: new Date().toISOString(),
    };

    setMentorBooking(booking);
    setShowMentorModal(false);
    setMentorTime("");

    alert(
      `Your session with ${selectedMentor.name} has been booked successfully. Quick confirmation has been sent.`,
    );
  }

  function handleCancelMentorBooking() {
    if (!mentorBooking) return;

    const confirmed = window.confirm(
      `Cancel your booking with ${mentorBooking.mentorName}?`,
    );
    if (!confirmed) return;

    setMentorBooking(null);
  }

  function openSatPractice() {
    navigate("/sat-practice");
  }

  return (
    <>
      <PageHeader title="More" />

      <div className="mb-6 grid grid-cols-2 gap-3">
        <QuickCard
          icon={<GraduationCap size={18} />}
          title="Find Schools"
          desc="See AI-powered recommendations."
          onClick={() => navigate("/match")}
        />
        <QuickCard
          icon={<Bot size={18} />}
          title="AI Essay Coach"
          desc="Draft, refine, and practice."
          onClick={() => navigate("/ai-agent")}
        />
        <QuickCard
          icon={<ClipboardList size={18} />}
          title="My Timeline"
          desc="Manage next steps and deadlines."
          onClick={() => navigate("/timeline")}
        />
        <QuickCard
          icon={<FileText size={18} />}
          title="Documents"
          desc="Track uploads and readiness."
          onClick={() => navigate("/documents")}
        />
      </div>
      <SectionTitle title="Mentor & Practice" />
      <div className="space-y-3">
        <div className="card p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
              <Users size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-ink">
                Mentor Matching
              </h3>
              <p className="mt-1 text-sm text-body">
                Book sessions with vetted mentors, choose a specific mentor, and
                schedule in advance with quick confirmation.
              </p>

              <button
                className="primary-btn mt-4 w-full"
                onClick={() => setShowMentorModal(true)}
              >
                Book Mentor Session
              </button>

              {mentorBooking ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-ink">
                    Booking Details
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-3">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Mentor
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {mentorBooking.mentorName}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Expertise
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {mentorBooking.expertise.join(", ")}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Session Time
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {mentorBooking.time}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-medium text-emerald-700">
                        {mentorBooking.status}
                      </p>
                    </div>
                  </div>

                  <button
                    className="secondary-btn mt-4 w-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    onClick={handleCancelMentorBooking}
                  >
                    Cancel Booking
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-violet-50 p-3 text-violet-600">
              <Brain size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-ink">
                Personalized Practice for SAT
              </h3>
              <p className="mt-1 text-sm text-body">
                Practice 10 SAT multiple-choice questions with immediate answer
                feedback after each question.
              </p>

              <button
                className="primary-btn mt-4 w-full"
                onClick={openSatPractice}
              >
                Start SAT Practice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle title="Profile Snapshot" />
        <div className="card p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <User size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {profile.fullName || "Student"}
              </p>
              <p className="truncate text-xs text-body">
                {profile.email || "No email set"}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">
                Profile completeness
              </span>
              <span className="font-bold text-ink">{profileCompletion}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="app-gradient h-full rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
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
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle title="Saved Schools" />
        <div className="card p-4">
          {savedSchools.length ? (
            <div className="space-y-3">
              {savedSchools.map((school) => (
                <div key={school.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-ink">
                        {school.name}
                      </p>
                      <p className="mt-1 text-xs text-body">
                        {school.location || "Location not set"}
                        {school.country ? `, ${school.country}` : ""}
                      </p>
                    </div>

                    <Badge className={getBadgeClass(school.match)}>
                      {getMatchCategory(school.match || 0)}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Match
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {typeof school.match === "number"
                          ? `${school.match}%`
                          : "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Country
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {school.country || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Rank
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {school.rank || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No saved schools yet"
              description="Bookmark schools from Match to keep them here."
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle title="Applications" />
        <div className="card p-4">
          {sortedApplications.length ? (
            <div className="space-y-3">
              {sortedApplications.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-ink">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-body">
                        {item.location || item.country
                          ? `${item.location || ""}${
                              item.location && item.country ? ", " : ""
                            }${item.country || ""}`
                          : "Location not set"}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        onClick={() =>
                          handleCancelApplication(item.id, item.name)
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {item.status || "Applied"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Applied
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {formatAppliedAt(item.appliedAt)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Deadline
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {item.deadline || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-3">
                      <p className="text-[11px] uppercase tracking-wide text-label">
                        Tuition
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {item.tuition || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No applications yet"
              description="Apply to schools from Match to keep track of them here."
            />
          )}
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle title="CV Builder" />
        <div className="card p-4">
          <button
            className="primary-btn flex w-full items-center justify-center gap-2"
            onClick={() => setShowCvModal(true)}
          >
            <PencilLine size={16} />
            Make CV
          </button>
          <p className="mt-3 text-sm text-body">
            Open the full CV form, edit your details, and save it to mark CV
            Resume as complete.
          </p>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-ink">Preview</p>
            <pre className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-700">
              {cvPreview || "Your CV preview will appear here."}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle title="App Actions" />
        <div className="card p-4">
          <button
            className="secondary-btn flex w-full items-center justify-center gap-2"
            onClick={handleReset}
          >
            <RefreshCcw size={16} />
            Reset App Data
          </button>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <CalendarClock size={18} className="mt-0.5 text-slate-500" />
              <div>
                <p className="text-sm font-semibold text-ink">
                  Local demo storage
                </p>
                <p className="mt-1 text-sm text-body">
                  This app currently stores profile, tasks, documents, saved
                  schools, applications, and CV data in local browser storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCvModal ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 p-4"
          onClick={() => setShowCvModal(false)}
        >
          <div
            className="mx-auto mt-8 max-h-[85vh] max-w-app overflow-y-auto rounded-[28px] bg-white p-5 shadow-soft modal-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-ink">Make CV</h3>
              <button
                className="icon-btn"
                onClick={() => setShowCvModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Full Name">
                <input
                  className="input"
                  value={cvData.fullName}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                />
              </Field>

              <Field label="Email">
                <input
                  className="input"
                  value={cvData.email}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </Field>

              <Field label="Phone">
                <input
                  className="input"
                  value={cvData.phone}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </Field>

              <Field label="City">
                <input
                  className="input"
                  value={cvData.city}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </Field>

              <Field label="Summary">
                <textarea
                  className="input min-h-[110px]"
                  value={cvData.summary}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, summary: e.target.value }))
                  }
                />
              </Field>

              <Field label="Education">
                <textarea
                  className="input min-h-[110px]"
                  value={cvData.education}
                  onChange={(e) =>
                    setCvData((prev) => ({
                      ...prev,
                      education: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Experience">
                <textarea
                  className="input min-h-[110px]"
                  value={cvData.experience}
                  onChange={(e) =>
                    setCvData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Activities">
                <textarea
                  className="input min-h-[110px]"
                  value={cvData.activities}
                  onChange={(e) =>
                    setCvData((prev) => ({
                      ...prev,
                      activities: e.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Awards">
                <textarea
                  className="input min-h-[110px]"
                  value={cvData.awards}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, awards: e.target.value }))
                  }
                />
              </Field>

              <Field label="Skills">
                <textarea
                  className="input min-h-[110px]"
                  value={cvData.skills}
                  onChange={(e) =>
                    setCvData((prev) => ({ ...prev, skills: e.target.value }))
                  }
                />
              </Field>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="secondary-btn flex-1"
                onClick={() => setShowCvModal(false)}
              >
                Cancel
              </button>
              <button className="primary-btn flex-1" onClick={saveCv}>
                Save CV
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showMentorModal ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 p-4"
          onClick={() => setShowMentorModal(false)}
        >
          <div
            className="mx-auto mt-12 max-w-app rounded-[28px] bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-ink">Mentor Matching</h3>
              <button
                className="icon-btn"
                onClick={() => setShowMentorModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-ink">
                  Select a mentor and book in advance
                </p>
                <p className="mt-1 text-sm text-body">
                  Choose a specific mentor, review their expertise, and schedule
                  your appointment with quick confirmation.
                </p>
              </div>

              <label className="block">
                <span className="label">Choose mentor</span>
                <select
                  className="input"
                  value={selectedMentorId}
                  onChange={(e) => setSelectedMentorId(e.target.value)}
                >
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
                <p className="text-sm font-semibold text-ink">Main expertise</p>
                <p className="mt-2 text-sm text-body">
                  {selectedMentor.expertise.join(", ")}
                </p>
              </div>

              <label className="block">
                <span className="label">Preferred session time</span>
                <input
                  type="datetime-local"
                  className="input"
                  value={mentorTime}
                  onChange={(e) => setMentorTime(e.target.value)}
                />
              </label>

              <div className="flex gap-3">
                <button
                  className="secondary-btn flex-1"
                  onClick={() => setShowMentorModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-btn flex-1"
                  onClick={handleMentorBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function QuickCard({ icon, title, desc, onClick, fullWidth = false }) {
  return (
    <button
      onClick={onClick}
      className={`card p-4 text-left ${fullWidth ? "w-full" : ""}`}
    >
      <div className="mb-2 text-brand-500">{icon}</div>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs text-body">{desc}</p>
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
