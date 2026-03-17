import {
  Bell,
  ChartColumn,
  ClipboardList,
  GraduationCap,
  CalendarDays,
  ArrowRight,
  FileText,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import ProgressRing from "../components/ProgressRing";
import NotificationPanel from "../components/NotificationPanel";
import StatCard from "../components/StatCard";
import { Badge, SectionTitle } from "../components/ui";
import {
  getApplications,
  getDocuments,
  getNotifications,
  getProfile,
  getTasks,
  saveTasks,
} from "../lib/storage";
import {
  formatDueDate,
  getCategoryColor,
  getFirstName,
  getGreeting,
  getTaskProgress,
  percent,
} from "../lib/helpers";

export default function HomePage() {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [tasks, setTasks] = useState(getTasks());

  const profile = getProfile();
  const notifications = getNotifications();
  const documents = getDocuments();
  const applications = getApplications();

  const unreadCount = notifications.filter((item) => item.unread).length;
  const progress = getTaskProgress(tasks);

  const profileScore = useMemo(() => {
    const fields = [
      profile.fullName,
      profile.email,
      profile.currentGrade,
      profile.country,
      profile.city,
      profile.schoolName,
      profile.gpa,
      profile.curriculum,
      profile.targetMajor,
      profile.dreamSchool,
    ];
    const filled = fields.filter(Boolean).length;
    return percent(filled, fields.length);
  }, [profile]);

  const readinessScore = useMemo(() => {
    const docComplete = documents.filter((d) => d.status === "Complete").length;
    const taskDone = tasks.filter((t) => t.completed).length;
    const applicationsStarted = applications.length;
    return Math.min(
      100,
      Math.round(
        docComplete * 8 +
          taskDone * 6 +
          applicationsStarted * 7 +
          (profile.gpa ? 1 : 0) * 8 +
          (profile.targetCountries?.length ? 1 : 0) * 8,
      ),
    );
  }, [
    applications.length,
    documents,
    profile.gpa,
    profile.targetCountries,
    tasks,
  ]);

  const overallScore = Math.round((profileScore + readinessScore) / 2);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter((t) => !t.completed)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
  }, [tasks]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);
  }, [applications]);

  const completedDocs = documents.filter(
    (doc) => doc.status === "Complete",
  ).length;
  const pendingDocs = documents.length - completedDocs;

  function toggleTask(id) {
    const next = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    setTasks(next);
    saveTasks(next);
  }

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Welcome back, {getFirstName(profile.fullName)}! 👋
          </h1>
          <p className="mt-1 text-sm text-body">{getGreeting()}</p>
        </div>

        <button
          className="icon-btn relative"
          onClick={() => setNotificationsOpen(true)}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="app-gradient mb-4 rounded-[28px] p-5 text-white shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/80">Gnosis Score</p>
            <h2 className="mt-1 text-xl font-bold">Application Readiness</h2>
            <p className="mt-3 text-sm text-white/85">
              {applications.length} Applications ·{" "}
              {tasks.filter((item) => !item.completed).length} Active Tasks
            </p>
          </div>
          <ProgressRing value={overallScore} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-xs text-white/75">Profile</p>
            <p className="mt-1 text-lg font-bold">{profileScore}%</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-xs text-white/75">Readiness</p>
            <p className="mt-1 text-lg font-bold">{readinessScore}%</p>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard
          icon={<ClipboardList size={20} />}
          value={tasks.filter((t) => !t.completed).length}
          label="Tasks"
        />
        <StatCard
          icon={<GraduationCap size={20} />}
          value={applications.length}
          label="Schools"
        />
        <StatCard
          icon={<ChartColumn size={20} />}
          value={`${progress.percent}%`}
          label="Progress"
        />
      </div>

      <SectionTitle
        title="Upcoming Tasks"
        action={
          <Link to="/timeline" className="text-sm font-medium text-brand-600">
            Manage
          </Link>
        }
      />

      {upcomingTasks.length > 0 ? (
        <div className="space-y-3">
          {upcomingTasks.map((task) => (
            <div key={task.id} className="card flex items-center gap-3 p-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-5 w-5 rounded border-slate-300 accent-brand-500"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {task.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-body">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={13} />
                    Due {formatDueDate(task.dueDate)}
                  </span>
                  <Badge className={getCategoryColor(task.category)}>
                    {task.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-5">
          <p className="text-sm font-semibold text-ink">No upcoming tasks</p>
          <p className="mt-1 text-sm text-body">
            Start by adding a school from Match or create a task in Timeline.
          </p>
        </div>
      )}

      <div className="mt-6">
        <SectionTitle title="Quick Actions" />
        <div className="grid grid-cols-2 gap-3">
          <ActionCard
            icon={<GraduationCap size={18} className="text-brand-500" />}
            title="Find Schools"
            desc="Browse AI-powered recommendations and add applications."
            onClick={() => navigate("/match")}
          />
          <ActionCard
            icon={<Sparkles size={18} className="text-brand-500" />}
            title="AI Essay Coach"
            desc="Brainstorm, revise, and practice interview answers."
            onClick={() => navigate("/ai-agent")}
          />
          <ActionCard
            icon={<CalendarDays size={18} className="text-brand-500" />}
            title="My Timeline"
            desc="Manage deadlines, tasks, and next steps."
            onClick={() => navigate("/timeline")}
          />
          <ActionCard
            icon={<FileText size={18} className="text-brand-500" />}
            title="Documents"
            desc="Track uploads and application file readiness."
            onClick={() => navigate("/documents")}
          />
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle
          title="Active Applications"
          action={
            <button
              className="text-sm font-medium text-brand-600"
              onClick={() => navigate("/match")}
            >
              Explore
            </button>
          }
        />

        {recentApplications.length > 0 ? (
          <div className="space-y-3">
            {recentApplications.map((application) => (
              <div key={application.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {application.universityName}
                    </p>
                    <p className="mt-1 text-xs text-body">
                      {application.targetMajor} · {application.country}
                    </p>
                  </div>
                  <Badge
                    className={getApplicationStatusColor(application.status)}
                  >
                    {application.status}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-body">
                  <CalendarDays size={13} />
                  Deadline {formatDueDate(application.deadline)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-5">
            <p className="text-sm font-semibold text-ink">
              No applications yet
            </p>
            <p className="mt-1 text-sm text-body">
              Visit the Match page to shortlist universities and start applying.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <SectionTitle title="Application Progress" />
        <div className="card p-4">
          <TimelineStep
            done={Boolean(applications.length)}
            title="Shortlist Universities"
            desc="Build a balanced list of reach, match, and safe schools."
          />
          <TimelineStep
            done={profileScore >= 80}
            title="Complete Profile"
            desc="Fill in your academic details, target major, and countries."
          />
          <TimelineStep
            active={tasks.some(
              (task) => task.category === "Essays" && !task.completed,
            )}
            done={tasks.some(
              (task) => task.category === "Essays" && task.completed,
            )}
            title="Write Essays"
            desc="Draft and improve your personal statement and supplements."
          />
          <TimelineStep
            active={pendingDocs > 0}
            done={pendingDocs === 0}
            title="Prepare Documents"
            desc="Upload transcripts, recommendations, scores, and resume."
          />
          <TimelineStep
            isLast
            active={applications.some((app) => app.status === "Applying")}
            title="Submit Applications"
            desc="Finalize forms and track status updates by deadline."
          />
        </div>
      </div>

      <NotificationPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
      />
    </>
  );
}

function ActionCard({ icon, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-4 text-left transition active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
        </div>
        <ArrowRight size={16} className="text-brand-500" />
      </div>
      <p className="mt-2 text-xs leading-5 text-body">{desc}</p>
    </button>
  );
}

function TimelineStep({
  title,
  desc,
  done = false,
  active = false,
  isLast = false,
}) {
  return (
    <div className={`flex gap-3 ${!isLast ? "pb-4" : ""}`}>
      <div className="flex flex-col items-center">
        <div
          className={`mt-1 h-3.5 w-3.5 rounded-full ${
            done ? "bg-emerald-500" : active ? "bg-brand-500" : "bg-slate-300"
          }`}
        />
        {!isLast && <div className="mt-1 h-full w-0.5 bg-slate-200" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 text-xs text-body">{desc}</p>
      </div>
    </div>
  );
}

function getApplicationStatusColor(status) {
  if (status === "Offer") return "bg-emerald-100 text-emerald-700";
  if (status === "Submitted") return "bg-sky-100 text-sky-700";
  if (status === "Applying") return "bg-amber-100 text-amber-700";
  if (status === "Rejected") return "bg-rose-100 text-rose-700";
  if (status === "Interview") return "bg-violet-100 text-violet-700";
  return "bg-slate-100 text-slate-700";
}
