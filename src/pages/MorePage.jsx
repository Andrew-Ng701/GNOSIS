import {
  ChevronRight,
  FileText,
  GraduationCap,
  LogOut,
  MessageSquareText,
  RefreshCcw,
  Settings,
  Sparkles,
  UserCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/ui";
import {
  getDocuments,
  getMessages,
  getProfile,
  getTasks,
  saveMessages,
  setOnboardingComplete,
} from "../lib/storage";
import { initialMessages } from "../data/mockData";

export default function MorePage() {
  const navigate = useNavigate();
  const profile = getProfile();
  const tasks = getTasks();
  const docs = getDocuments();
  const messages = getMessages();

  const completeDocs = docs.filter((doc) => doc.status === "Complete").length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  function resetAIChat() {
    saveMessages(initialMessages);
    window.alert("AI conversation has been reset.");
  }

  function restartOnboarding() {
    setOnboardingComplete(false);
    navigate("/", { replace: true });
  }

  function resetAllLocalData() {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("gnosis_"),
    );
    keys.forEach((key) => localStorage.removeItem(key));
    window.location.href = "/";
  }

  return (
    <>
      <PageHeader
        title="More"
        subtitle="Profile, settings, and workspace shortcuts"
      />

      <div className="app-gradient mb-4 rounded-[28px] p-5 text-white shadow-soft">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-white/15 p-3">
            <UserCircle2 size={28} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold">
              {profile.fullName || "Student Profile"}
            </h2>
            <p className="mt-1 text-sm text-white/85">
              {profile.targetMajor || "Undeclared"} ·{" "}
              {profile.country || "No country set"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(profile.targetCountries || []).map((country) => (
                <Badge key={country} className="bg-white/15 text-white">
                  {country}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <MiniStat label="Tasks" value={pendingTasks} />
        <MiniStat label="Docs" value={completeDocs} />
        <MiniStat label="Chats" value={messages.length} />
      </div>

      <div className="mb-6 space-y-3">
        <SectionCard
          icon={<GraduationCap size={18} className="text-brand-500" />}
          title="Application Profile"
          description={`${profile.schoolName || "School not set"} · GPA ${profile.gpa || "N/A"}`}
        />
        <SectionCard
          icon={<Sparkles size={18} className="text-brand-500" />}
          title="Dream School"
          description={profile.dreamSchool || "Not set yet"}
        />
        <SectionCard
          icon={<FileText size={18} className="text-brand-500" />}
          title="Documents"
          description={`${completeDocs} completed out of ${docs.length}`}
          onClick={() => navigate("/documents")}
        />
        <SectionCard
          icon={<MessageSquareText size={18} className="text-brand-500" />}
          title="AI Essay Coach"
          description="Open your essay workspace"
          onClick={() => navigate("/ai-agent")}
        />
      </div>

      <div className="mb-6 card p-4">
        <h2 className="text-lg font-semibold text-ink">Scores</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ScoreItem label="SAT" value={profile.satScore || "—"} />
          <ScoreItem label="ACT" value={profile.actScore || "—"} />
          <ScoreItem label="IELTS" value={profile.ieltsScore || "—"} />
          <ScoreItem label="TOEFL" value={profile.toeflScore || "—"} />
        </div>
      </div>

      <div className="space-y-3">
        <ActionRow
          icon={<RefreshCcw size={17} />}
          label="Reset AI Conversation"
          onClick={resetAIChat}
        />
        <ActionRow
          icon={<Settings size={17} />}
          label="Edit Onboarding Answers"
          onClick={restartOnboarding}
        />
        <ActionRow
          icon={<LogOut size={17} />}
          label="Reset All Local Data"
          onClick={resetAllLocalData}
          danger
        />
      </div>
    </>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-lg font-bold text-ink">{value}</p>
      <p className="text-xs text-body">{label}</p>
    </div>
  );
}

function SectionCard({ icon, title, description, onClick }) {
  const content = (
    <div className="card flex items-center gap-3 p-4">
      <div className="rounded-2xl bg-slate-100 p-3">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 truncate text-xs text-body">{description}</p>
      </div>
      <ChevronRight size={16} className="text-slate-400" />
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}

function ScoreItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[11px] uppercase tracking-wide text-label">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function ActionRow({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className="card flex w-full items-center justify-between gap-3 p-4 text-left"
    >
      <div className="flex items-center gap-3">
        <div
          className={`rounded-2xl p-3 ${
            danger ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-700"
          }`}
        >
          {icon}
        </div>
        <span
          className={`text-sm font-semibold ${danger ? "text-rose-600" : "text-ink"}`}
        >
          {label}
        </span>
      </div>
      <ChevronRight size={16} className="text-slate-400" />
    </button>
  );
}
