export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export function percent(part, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((part / total) * 100)));
}

export function formatDueDate(input) {
  if (!input) return "TBD";

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getMatchCategory(score) {
  if (score >= 80) return "Safe";
  if (score >= 60) return "Match";
  return "Reach";
}

export function getMatchColors(score) {
  if (score >= 80) return "from-emerald-400 to-green-500";
  if (score >= 60) return "from-amber-400 to-orange-500";
  return "from-rose-400 to-red-500";
}

export function getDocumentStatusColor(status) {
  if (status === "Complete") return "bg-emerald-100 text-emerald-700";
  if (status === "Pending") return "bg-amber-100 text-amber-700";
  if (status === "Upload") return "bg-sky-100 text-sky-700";
  return "bg-slate-100 text-slate-700";
}

export function getCategoryColor(category) {
  if (category === "Research") return "bg-sky-100 text-sky-700";
  if (category === "Documents") return "bg-amber-100 text-amber-700";
  if (category === "Essays") return "bg-violet-100 text-violet-700";
  if (category === "Exams") return "bg-rose-100 text-rose-700";
  if (category === "Applications") return "bg-emerald-100 text-emerald-700";
  return "bg-slate-100 text-slate-700";
}

export function getTaskProgress(tasks = []) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  return {
    total,
    completed,
    percent: percent(completed, total),
  };
}

export function getFirstName(fullName) {
  if (!fullName?.trim()) return "there";
  return fullName.trim().split(/\s+/)[0];
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12)
    return "Good morning — here’s your latest admissions progress.";
  if (hour < 18) return "Good afternoon — let’s keep your applications moving.";
  return "Good evening — here’s what still needs attention.";
}
