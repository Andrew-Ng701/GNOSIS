import { Sparkles, Plus, CheckSquare, Square } from "lucide-react";
import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/ui";
import {
  buildRecommendedTasks,
  formatDueDate,
  getCategoryColor,
  getTaskProgress,
  uid,
} from "../lib/helpers";
import { getProfile, getTasks, saveTasks } from "../lib/storage";

export default function TimelinePage() {
  const profile = getProfile();
  const [tasks, setTasks] = useState(getTasks());
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Applications");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const progress = useMemo(() => getTaskProgress(tasks), [tasks]);

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

  function addTask(e) {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const next = [
      {
        id: uid("task"),
        title: title.trim(),
        category,
        dueDate,
        completed: false,
      },
      ...tasks,
    ];

    sync(next);
    setTitle("");
    setCategory("Applications");
    setDueDate("");
    setMessage("Task added.");
  }

  function addAISuggestions() {
    const suggested = buildRecommendedTasks(profile, tasks);
    if (!suggested.length) {
      setMessage("AI suggestions are already up to date.");
      return;
    }

    const next = [...suggested, ...tasks];
    sync(next);
    setMessage(`${suggested.length} AI-suggested tasks added.`);
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  );

  return (
    <>
      <PageHeader
        title="My Timeline"
        subtitle="Manage tasks, deadlines, and AI next steps"
        showBack
      />

      <div className="card mb-4 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            {progress.completed} of {progress.total} complete
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

      <form className="card mb-4 p-4" onSubmit={addTask}>
        <h3 className="mb-4 text-base font-semibold text-ink">Add Task</h3>

        <div className="space-y-3">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />

          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Applications">Applications</option>
            <option value="Research">Research</option>
            <option value="Essays">Essays</option>
            <option value="Documents">Documents</option>
            <option value="Exams">Exams</option>
          </select>

          <input
            className="input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button className="primary-btn w-full" type="submit">
            <Plus size={16} className="mr-1 inline-block" />
            Add Task
          </button>
        </div>
      </form>

      {message ? (
        <div className="mb-4 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {message}
        </div>
      ) : null}

      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <div key={task.id} className="card flex items-start gap-3 p-4">
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              className="mt-0.5 shrink-0 text-slate-400"
            >
              {task.completed ? (
                <CheckSquare size={22} className="text-emerald-600" />
              ) : (
                <Square size={22} />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={
                  task.completed
                    ? "break-words pr-1 text-sm font-semibold leading-6 text-slate-400 line-through"
                    : "break-words pr-1 text-sm font-semibold leading-6 text-ink"
                }
              >
                {task.title}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-body">
                <span>Due {formatDueDate(task.dueDate)}</span>
                <Badge className={getCategoryColor(task.category)}>
                  {task.category}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
