import { CalendarDays, Plus, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import { Badge } from "../components/ui";
import { aiSuggestedTasks } from "../data/mockData";
import {
  formatDueDate,
  getCategoryColor,
  getTaskProgress,
  uid,
} from "../lib/helpers";
import { getApplications, getTasks, saveTasks } from "../lib/storage";

const categories = ["Research", "Documents", "Essays", "Exams", "Applications"];

export default function TimelinePage() {
  const [tasks, setTasks] = useState(getTasks());
  const [applications] = useState(getApplications());
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    category: "Research",
    dueDate: "",
  });

  const progress = useMemo(() => getTaskProgress(tasks), [tasks]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed)
        return Number(a.completed) - Number(b.completed);
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [tasks]);

  const upcomingApplications = useMemo(() => {
    return [...applications].sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline),
    );
  }, [applications]);

  function sync(next) {
    setTasks(next);
    saveTasks(next);
  }

  function toggleTask(id) {
    const next = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    sync(next);
  }

  function deleteTask(id) {
    const next = tasks.filter((task) => task.id !== id);
    sync(next);
  }

  function addTask() {
    if (!draft.title.trim() || !draft.dueDate) return;

    const next = [
      {
        id: uid("task"),
        title: draft.title.trim(),
        category: draft.category,
        dueDate: draft.dueDate,
        completed: false,
        linkedUniversityId: "",
      },
      ...tasks,
    ];

    sync(next);
    setDraft({ title: "", category: "Research", dueDate: "" });
    setShowModal(false);
  }

  function addAISuggestions() {
    const existingTitles = new Set(tasks.map((t) => t.title));
    const newItems = aiSuggestedTasks
      .filter((item) => !existingTitles.has(item.title))
      .map((item) => ({ ...item, id: uid("task") }));

    if (!newItems.length) return;
    sync([...tasks, ...newItems]);
  }

  return (
    <>
      <PageHeader
        title="Timeline Manager"
        subtitle="Track every next step clearly"
        showBack
      />

      <div className="card mb-4 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            {progress.completed} of {progress.total} completed
          </span>
          <span className="font-bold text-ink">{progress.percent}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="app-gradient h-full rounded-full"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      <div className="mb-5 flex gap-3">
        <button
          className="primary-btn flex-1"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} className="mr-1 inline-block" />
          Add Task
        </button>
        <button className="secondary-btn flex-1" onClick={addAISuggestions}>
          <Sparkles size={16} className="mr-1 inline-block text-brand-500" />
          AI Suggest
        </button>
      </div>

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">
            Application Deadlines
          </h2>
          <span className="text-xs text-body">
            {upcomingApplications.length} tracked
          </span>
        </div>

        {upcomingApplications.length > 0 ? (
          <div className="space-y-3">
            {upcomingApplications.map((application) => (
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

                <div className="mt-3 inline-flex items-center gap-1 text-xs text-body">
                  <CalendarDays size={13} />
                  Deadline {formatDueDate(application.deadline)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-5">
            <p className="text-sm font-semibold text-ink">
              No application deadlines yet
            </p>
            <p className="mt-1 text-sm text-body">
              Add universities from Match and their deadlines will appear here.
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Task Timeline</h2>
          <span className="text-xs text-body">{tasks.length} total tasks</span>
        </div>

        {sortedTasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Add your first application task to start building momentum."
            action={
              <button
                className="primary-btn"
                onClick={() => setShowModal(true)}
              >
                Add Task
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <div key={task.id} className="card flex items-center gap-3 p-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5 rounded border-slate-300 accent-brand-500"
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-semibold ${
                      task.completed
                        ? "text-slate-400 line-through"
                        : "text-ink"
                    }`}
                  >
                    {task.title}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge className={getCategoryColor(task.category)}>
                      {task.category}
                    </Badge>
                    <span className="text-xs text-body">
                      Due {formatDueDate(task.dueDate)}
                    </span>
                    {task.linkedUniversityId ? (
                      <span className="text-xs text-brand-600">
                        Linked application
                      </span>
                    ) : null}
                  </div>
                </div>

                <button
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="mx-auto mt-16 max-w-app rounded-[28px] bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-ink">Add Task</h3>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="label">Task Name</span>
                <input
                  className="input"
                  value={draft.title}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, title: e.target.value }))
                  }
                  placeholder="Finalize personal statement"
                />
              </label>

              <label className="block">
                <span className="label">Category</span>
                <select
                  className="input"
                  value={draft.category}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, category: e.target.value }))
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="label">Due Date</span>
                <input
                  type="date"
                  className="input"
                  value={draft.dueDate}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, dueDate: e.target.value }))
                  }
                />
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="secondary-btn flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="primary-btn flex-1" onClick={addTask}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
