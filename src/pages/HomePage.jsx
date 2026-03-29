import {
  Bell,
  ChartColumn,
  ClipboardList,
  GraduationCap,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressRing from "../components/ProgressRing";
import NotificationPanel from "../components/NotificationPanel";
import StatCard from "../components/StatCard";
import { Badge, SectionTitle } from "../components/ui";
import {
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
      profile.targetMajor,
      profile.dreamSchool,
    ];
    const filled = fields.filter(Boolean).length;
    return percent(filled, fields.length);
  }, [profile]);

  const readinessScore = useMemo(() => {
    const docComplete = documents.filter((d) => d.status === "Complete").length;
    const taskDone = tasks.filter((t) => t.completed).length;
    return Math.min(
      100,
      Math.round(docComplete * 10 + taskDone * 8 + (profile.gpa ? 10 : 0)),
    );
  }, [documents, tasks, profile.gpa]);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter((t) => !t.completed)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
  }, [tasks]);

  const overallScore = Math.round((profileScore + readinessScore) / 2);

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
            Welcome back, {getFirstName(profile.fullName)}!
          </h1>
          <p className="mt-1 text-sm text-body">{getGreeting()}</p>
        </div>

        <button
          className="icon-btn relative"
          onClick={() => setNotificationsOpen(true)}
        >
          <Bell size={18} />
          {unreadCount > 0 ? (
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          ) : null}
        </button>
      </div>

      <div className="app-gradient mb-4 rounded-[28px] p-5 text-white shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/80">Gnosis Score</p>
            <h2 className="mt-1 text-xl font-bold">Application Readiness</h2>
            <p className="mt-3 text-sm text-white/85">
              8 Schools Matched · 3 Reach
            </p>
          </div>
          <ProgressRing value={overallScore} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-xs text-white/75">Profile</p>
            <p className="mt-1 text-lg font-bold">{profileScore}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-xs text-white/75">Readiness</p>
            <p className="mt-1 text-lg font-bold">{readinessScore}</p>
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
          value={8}
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
              <button onClick={() => toggleTask(task.id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-square-check-big text-emerald-600"
                  aria-hidden="true"
                >
                  <path d="M21 10.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.5"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
              </button>
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
        <div className="card p-5 text-center">
          <p className="text-sm font-semibold text-ink">No upcoming tasks</p>
          <p className="mt-2 text-sm text-body">
            You are all caught up for now.
          </p>
        </div>
      )}

      <div className="mt-6">
        <SectionTitle title="Quick Actions" />
        <div className="grid grid-cols-2 gap-3">
          <ActionCard
            title="Find Schools"
            desc="See AI-powered recommendations."
            onClick={() => navigate("/match")}
          />
          <ActionCard
            title="AI Essay Coach"
            desc="Draft, refine, and practice."
            onClick={() => navigate("/ai-agent")}
          />
          <ActionCard
            title="My Timeline"
            desc="Manage next steps and deadlines."
            onClick={() => navigate("/timeline")}
          />
          <ActionCard
            title="Documents"
            desc="Track uploads and readiness."
            onClick={() => navigate("/documents")}
          />
        </div>
      </div>

      <div className="mt-6">
        <SectionTitle title="Application Progress" />
        <div className="card p-4">
          <TimelineStep
            done
            title="Research Schools"
            desc="Shortlist and compare programs."
          />
          <TimelineStep
            done
            title="Build Profile"
            desc="Complete your academic profile."
          />
          <TimelineStep
            active
            title="Write Essays"
            desc="Draft and improve personal statements."
          />
          <TimelineStep
            title="Submit Applications"
            desc="Finalize forms and uploads."
          />
          <TimelineStep
            isLast
            title="Track Results"
            desc="Monitor offers and updates."
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

function ActionCard({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-4 text-left transition active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
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
        {!isLast ? <div className="mt-1 h-full w-0.5 bg-slate-200" /> : null}
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 text-xs text-body">{desc}</p>
      </div>
    </div>
  );
}
