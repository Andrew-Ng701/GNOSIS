import { aiSuggestedTasks } from "../data/mockData";

export function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export function percent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export function getFirstName(fullName = "") {
  return fullName.trim().split(/\s+/)[0] || "there";
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning — here’s your application snapshot.";
  if (hour < 18) return "Good afternoon — stay on top of your next steps.";
  return "Good evening — a few smart moves today go a long way.";
}

export function formatDueDate(dateString) {
  if (!dateString) return "No date";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getCategoryColor(category = "") {
  const map = {
    Research: "bg-sky-100 text-sky-700",
    Documents: "bg-amber-100 text-amber-700",
    Essays: "bg-violet-100 text-violet-700",
    Exams: "bg-rose-100 text-rose-700",
    Applications: "bg-emerald-100 text-emerald-700",
  };

  return map[category] || "bg-slate-100 text-slate-700";
}

export function getDocumentStatusColor(status = "") {
  const map = {
    Complete: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Upload: "bg-slate-100 text-slate-700",
  };

  return map[status] || "bg-slate-100 text-slate-700";
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

export function buildRecommendedTasks(profile = {}, tasks = []) {
  const existingTitles = new Set((tasks || []).map((task) => task.title));
  const generated = [];

  const major = profile.targetMajor || "your target major";
  const dreamSchool = profile.dreamSchool || "your dream school";
  const countries = profile.targetCountries || [];

  const suggestions = [
    ...aiSuggestedTasks,
    {
      id: "task-rec-1",
      title: `Research admission requirements for ${dreamSchool}`,
      category: "Research",
      dueDate: getFutureDate(5),
      completed: false,
    },
    {
      id: "task-rec-2",
      title: `Draft essay examples for ${major}`,
      category: "Essays",
      dueDate: getFutureDate(7),
      completed: false,
    },
    {
      id: "task-rec-3",
      title: "Prepare transcript and academic records",
      category: "Documents",
      dueDate: getFutureDate(4),
      completed: false,
    },
    {
      id: "task-rec-4",
      title: "Review standardized test strategy",
      category: "Exams",
      dueDate: getFutureDate(10),
      completed: false,
    },
    {
      id: "task-rec-5",
      title: `Shortlist universities in ${countries.join(", ") || "target countries"}`,
      category: "Applications",
      dueDate: getFutureDate(6),
      completed: false,
    },
  ];

  for (const item of suggestions) {
    if (!existingTitles.has(item.title)) {
      generated.push({
        ...item,
        id: uid("task"),
      });
    }
  }

  return generated;
}

export function getMatchCategory(score = 0) {
  if (score >= 80) return "Safe";
  if (score >= 60) return "Match";
  return "Reach";
}

export function getMatchColors(score = 0) {
  if (score >= 80) return "from-emerald-400 to-emerald-600";
  if (score >= 60) return "from-amber-400 to-orange-500";
  return "from-rose-400 to-rose-600";
}

export function calculateUniversityMatch(university, profile = {}) {
  let score = university.match || 50;

  const targetCountries = profile.targetCountries || [];
  const major = (profile.targetMajor || "").toLowerCase();
  const dreamSchool = (profile.dreamSchool || "").toLowerCase();
  const gpa = parseFloat(profile.gpa);

  if (targetCountries.includes(university.country)) {
    score += 8;
  }

  if (dreamSchool && university.name.toLowerCase() === dreamSchool) {
    score += 6;
  }

  if (major.includes("computer") || major.includes("engineering")) {
    if (
      [
        "MIT",
        "Stanford",
        "Caltech",
        "ETH Zurich",
        "HKUST",
        "National University of Singapore",
        "Imperial College London",
      ].includes(university.name)
    ) {
      score += 4;
    }
  }

  if (!Number.isNaN(gpa)) {
    if (gpa >= 3.8) score += 8;
    else if (gpa >= 3.5) score += 4;
    else if (gpa < 3.0) score -= 6;
  }

  const sat = parseInt(profile.satScore, 10);
  if (!Number.isNaN(sat)) {
    if (sat >= 1500) score += 6;
    else if (sat >= 1400) score += 3;
    else if (sat < 1200) score -= 5;
  }

  const ielts = parseFloat(profile.ieltsScore);
  if (!Number.isNaN(ielts) && ielts >= 7.5) {
    score += 2;
  }

  const toefl = parseInt(profile.toeflScore, 10);
  if (!Number.isNaN(toefl) && toefl >= 105) {
    score += 2;
  }

  return Math.max(20, Math.min(98, Math.round(score)));
}

function getFutureDate(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function buildCVText(cv = {}) {
  const lines = [];

  const fullName = cv.fullName?.trim() || "Your Name";
  const contact = [cv.email, cv.phone, cv.city].filter(Boolean).join(" | ");

  lines.push(fullName);
  if (contact) lines.push(contact);

  if (cv.summary?.trim()) {
    lines.push("");
    lines.push("SUMMARY");
    lines.push(cv.summary.trim());
  }

  if (cv.education?.trim()) {
    lines.push("");
    lines.push("EDUCATION");
    lines.push(cv.education.trim());
  }

  if (cv.experience?.trim()) {
    lines.push("");
    lines.push("EXPERIENCE");
    lines.push(cv.experience.trim());
  }

  if (cv.activities?.trim()) {
    lines.push("");
    lines.push("ACTIVITIES");
    lines.push(cv.activities.trim());
  }

  if (cv.awards?.trim()) {
    lines.push("");
    lines.push("AWARDS");
    lines.push(cv.awards.trim());
  }

  if (cv.skills?.trim()) {
    lines.push("");
    lines.push("SKILLS");
    lines.push(cv.skills.trim());
  }

  return lines.join("\n");
}
