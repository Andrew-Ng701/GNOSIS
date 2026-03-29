import {
  communityPosts,
  defaultProfile,
  documents,
  initialMessages,
  initialTasks,
  notifications,
} from "../data/mockData";

const KEYS = {
  onboardingComplete: "gnosis-onboarding-complete",
  profile: "gnosis-profile",
  tasks: "gnosis-tasks",
  posts: "gnosis-posts",
  documents: "gnosis-documents",
  notifications: "gnosis-notifications",
  messages: "gnosis-messages",
  uiPrefs: "gnosis-ui-prefs",
  cvData: "gnosis-cv-data",
  savedSchools: "gnosis-saved-schools",
  applications: "gnosis-applications",
  users: "gnosis-users",
  currentUser: "gnosis-current-user",
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

function remove(key) {
  localStorage.removeItem(key);
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export function getOnboardingComplete() {
  return read(KEYS.onboardingComplete, false);
}

export function setOnboardingComplete(value) {
  write(KEYS.onboardingComplete, value);
}

export function getProfile() {
  return read(KEYS.profile, defaultProfile);
}

export function saveProfile(profile) {
  write(KEYS.profile, profile);
}

export function getTasks() {
  return read(KEYS.tasks, initialTasks);
}

export function saveTasks(tasks) {
  write(KEYS.tasks, tasks);
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

export function getUiPrefs() {
  return read(KEYS.uiPrefs, {
    hideMatchScoreNote: false,
    hideCvBuilder: false,
  });
}

export function saveUiPrefs(prefs) {
  write(KEYS.uiPrefs, prefs);
}

export function getCvData() {
  return read(KEYS.cvData, {
    fullName: "",
    email: "",
    phone: "",
    city: "",
    summary: "",
    education: "",
    experience: "",
    activities: "",
    awards: "",
    skills: "",
  });
}

export function saveCvData(data) {
  write(KEYS.cvData, data);
}

export function getCV() {
  return getCvData();
}

export function saveCV(data) {
  saveCvData(data);
}

export function getSavedSchools() {
  return read(KEYS.savedSchools, []);
}

export function saveSavedSchools(items) {
  write(KEYS.savedSchools, items);
}

export function isSchoolSaved(universityId) {
  return getSavedSchools().some((item) => item.id === universityId);
}

export function toggleSavedSchool(university) {
  const current = getSavedSchools();
  const exists = current.some((item) => item.id === university.id);

  const next = exists
    ? current.filter((item) => item.id !== university.id)
    : [
        ...current,
        {
          id: university.id,
          name: university.name,
          rank: university.rank,
          location: university.location,
          country: university.country,
          match: university.match,
        },
      ];

  saveSavedSchools(next);
  return next;
}

export function getApplications() {
  return read(KEYS.applications, []);
}

export function saveApplications(items) {
  write(KEYS.applications, items);
}

export function hasAppliedToSchool(universityId) {
  return getApplications().some((item) => item.universityId === universityId);
}

export function applyToSchool(university) {
  const current = getApplications();
  const exists = current.some(
    (item) =>
      item.universityId === university.id ||
      item.name?.toLowerCase() === university.name?.toLowerCase(),
  );

  if (exists) {
    return {
      ok: false,
      reason: "duplicate",
      applications: current,
    };
  }

  const entry = {
    id: createId("app"),
    universityId: university.id,
    name: university.name,
    rank: university.rank,
    location: university.location,
    country: university.country,
    tuition: university.tuition,
    deadline: university.deadline,
    match: university.match,
    status: "Applied",
    appliedAt: new Date().toISOString(),
  };

  const next = [entry, ...current];
  saveApplications(next);

  return {
    ok: true,
    item: entry,
    applications: next,
  };
}

export function removeApplication(applicationId) {
  const current = getApplications();
  const next = current.filter((item) => item.id !== applicationId);
  saveApplications(next);
  return next;
}

export function clearApplications() {
  saveApplications([]);
}

export function getUsers() {
  return read(KEYS.users, []);
}

export function saveUsers(users) {
  write(KEYS.users, users);
}

export function getCurrentUser() {
  return read(KEYS.currentUser, null);
}

export function saveCurrentUser(user) {
  write(KEYS.currentUser, user);
}

export function signUpUser({ fullName, email, password }) {
  const users = getUsers();
  const normalizedEmail = normalizeEmail(email);

  if (!fullName?.trim()) throw new Error("Full name is required.");
  if (!normalizedEmail) throw new Error("Email is required.");
  if (!password?.trim()) throw new Error("Password is required.");

  const exists = users.some(
    (user) => normalizeEmail(user.email) === normalizedEmail,
  );

  if (exists) {
    throw new Error("This email is already registered.");
  }

  const user = {
    id: createId("user"),
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
  };

  const nextUsers = [...users, user];
  saveUsers(nextUsers);

  saveCurrentUser({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  });

  const currentProfile = getProfile();
  saveProfile({
    ...defaultProfile,
    ...currentProfile,
    fullName: currentProfile.fullName || user.fullName,
    email: currentProfile.email || user.email,
  });

  return user;
}

export function signInUser({ email, password }) {
  const users = getUsers();
  const normalizedEmail = normalizeEmail(email);

  const user = users.find(
    (item) =>
      normalizeEmail(item.email) === normalizedEmail &&
      item.password === password,
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  saveCurrentUser({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  });

  const currentProfile = getProfile();
  saveProfile({
    ...defaultProfile,
    ...currentProfile,
    fullName: currentProfile.fullName || user.fullName,
    email: currentProfile.email || user.email,
  });

  return user;
}

export function signOutUser() {
  remove(KEYS.currentUser);
}

export function resetAppData() {
  Object.values(KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

export function seedAppData() {
  if (!localStorage.getItem(KEYS.profile)) saveProfile(defaultProfile);
  if (!localStorage.getItem(KEYS.tasks)) saveTasks(initialTasks);
  if (!localStorage.getItem(KEYS.posts)) savePosts(communityPosts);
  if (!localStorage.getItem(KEYS.documents)) saveDocuments(documents);
  if (!localStorage.getItem(KEYS.notifications))
    saveNotifications(notifications);
  if (!localStorage.getItem(KEYS.messages)) saveMessages(initialMessages);

  if (!localStorage.getItem(KEYS.uiPrefs)) {
    saveUiPrefs({
      hideMatchScoreNote: false,
      hideCvBuilder: false,
    });
  }

  if (!localStorage.getItem(KEYS.cvData)) {
    saveCvData({
      fullName: "",
      email: "",
      phone: "",
      city: "",
      summary: "",
      education: "",
      experience: "",
      activities: "",
      awards: "",
      skills: "",
    });
  }

  if (!localStorage.getItem(KEYS.savedSchools)) {
    saveSavedSchools([]);
  }

  if (!localStorage.getItem(KEYS.applications)) {
    saveApplications([]);
  }

  if (!localStorage.getItem(KEYS.users)) {
    saveUsers([]);
  }
}
