import {
  communityPosts,
  defaultProfile,
  documents,
  initialApplications,
  initialMessages,
  initialTasks,
  notifications,
} from "../data/mockData";

const KEYS = {
  onboardingComplete: "gnosis_onboarding_complete",
  profile: "gnosis_profile",
  tasks: "gnosis_tasks",
  applications: "gnosis_applications",
  posts: "gnosis_posts",
  documents: "gnosis_documents",
  notifications: "gnosis_notifications",
  messages: "gnosis_messages",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getOnboardingComplete() {
  return read(KEYS.onboardingComplete, false);
}

export function setOnboardingComplete(value) {
  write(KEYS.onboardingComplete, value);
}

export function getProfile() {
  const saved = read(KEYS.profile, defaultProfile);
  return {
    ...defaultProfile,
    ...saved,
    targetCountries: Array.isArray(saved?.targetCountries)
      ? saved.targetCountries
      : defaultProfile.targetCountries,
  };
}

export function saveProfile(profile) {
  write(KEYS.profile, {
    ...defaultProfile,
    ...profile,
    targetCountries: Array.isArray(profile?.targetCountries)
      ? profile.targetCountries
      : defaultProfile.targetCountries,
  });
}

export function getTasks() {
  return read(KEYS.tasks, initialTasks);
}

export function saveTasks(tasks) {
  write(KEYS.tasks, tasks);
}

export function addTask(task) {
  const current = getTasks();
  const next = [...current, task];
  saveTasks(next);
  return next;
}

export function getApplications() {
  return read(KEYS.applications, initialApplications);
}

export function saveApplications(applications) {
  write(KEYS.applications, applications);
}

export function addApplication(application) {
  const current = getApplications();
  const exists = current.some(
    (item) => item.universityId === application.universityId,
  );
  if (exists) return current;

  const next = [...current, application];
  saveApplications(next);
  return next;
}

export function getPosts() {
  return read(KEYS.posts, communityPosts);
}

export function savePosts(posts) {
  write(KEYS.posts, posts);
}

export function getDocuments() {
  return read(KEYS.documents, documents);
}

export function saveDocuments(items) {
  write(KEYS.documents, items);
}

export function getNotifications() {
  return read(KEYS.notifications, notifications);
}

export function saveNotifications(items) {
  write(KEYS.notifications, items);
}

export function getMessages() {
  return read(KEYS.messages, initialMessages);
}

export function saveMessages(messages) {
  write(KEYS.messages, messages);
}

export function seedAppData() {
  if (!localStorage.getItem(KEYS.profile)) saveProfile(defaultProfile);
  if (!localStorage.getItem(KEYS.tasks)) saveTasks(initialTasks);
  if (!localStorage.getItem(KEYS.applications))
    saveApplications(initialApplications);
  if (!localStorage.getItem(KEYS.posts)) savePosts(communityPosts);
  if (!localStorage.getItem(KEYS.documents)) saveDocuments(documents);
  if (!localStorage.getItem(KEYS.notifications))
    saveNotifications(notifications);
  if (!localStorage.getItem(KEYS.messages)) saveMessages(initialMessages);
}
