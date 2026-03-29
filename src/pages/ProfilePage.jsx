import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { saveProfile, getProfile } from "../lib/storage";

export default function ProfilePage() {
  const [form, setForm] = useState(getProfile());
  const [saved, setSaved] = useState(false);

  function update(name, value) {
    const next = { ...form, [name]: value };
    setForm(next);
    setSaved(false);
  }

  function submit(e) {
    e.preventDefault();
    saveProfile(form);
    setSaved(true);
  }

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Update your academic details and preferences"
        showBack
      />

      <form className="space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="label">Full Name</span>
          <input
            className="input"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Email</span>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">School Name</span>
          <input
            className="input"
            value={form.schoolName}
            onChange={(e) => update("schoolName", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">GPA</span>
          <input
            className="input"
            value={form.gpa}
            onChange={(e) => update("gpa", e.target.value)}
            placeholder="3.8"
          />
        </label>

        <label className="block">
          <span className="label">Target Major</span>
          <input
            className="input"
            value={form.targetMajor}
            onChange={(e) => update("targetMajor", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Target Countries</span>
          <input
            className="input"
            value={(form.targetCountries || []).join(", ")}
            onChange={(e) =>
              update(
                "targetCountries",
                e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              )
            }
            placeholder="USA, UK, Canada"
          />
        </label>

        <label className="block">
          <span className="label">Dream School</span>
          <input
            className="input"
            value={form.dreamSchool}
            onChange={(e) => update("dreamSchool", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">SAT Score</span>
          <input
            className="input"
            value={form.satScore}
            onChange={(e) => update("satScore", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">ACT Score</span>
          <input
            className="input"
            value={form.actScore}
            onChange={(e) => update("actScore", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">IELTS Score</span>
          <input
            className="input"
            value={form.ieltsScore}
            onChange={(e) => update("ieltsScore", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">TOEFL Score</span>
          <input
            className="input"
            value={form.toeflScore}
            onChange={(e) => update("toeflScore", e.target.value)}
          />
        </label>

        {saved ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Profile saved successfully.
          </div>
        ) : null}

        <button className="primary-btn w-full" type="submit">
          Save Profile
        </button>
      </form>
    </>
  );
}
