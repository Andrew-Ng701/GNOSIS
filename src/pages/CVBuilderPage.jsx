import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import { buildCVText } from "../lib/helpers";
import { getCV, saveCV, getProfile } from "../lib/storage";

export default function CVBuilderPage() {
  const profile = getProfile();
  const [cv, setCv] = useState({
    ...getCV(),
    fullName: getCV().fullName || profile.fullName || "",
    email: getCV().email || profile.email || "",
    city: getCV().city || profile.city || "",
  });
  const [saved, setSaved] = useState(false);

  const preview = useMemo(() => buildCVText(cv), [cv]);

  function update(name, value) {
    const next = { ...cv, [name]: value };
    setCv(next);
    setSaved(false);
  }

  function submit(e) {
    e.preventDefault();
    saveCV(cv);
    setSaved(true);
  }

  async function copyCV() {
    await navigator.clipboard.writeText(preview);
  }

  return (
    <>
      <PageHeader
        title="CV Builder"
        subtitle="Build a student resume you can copy and refine"
        showBack
      />

      <form className="space-y-4" onSubmit={submit}>
        <label className="block">
          <span className="label">Full Name</span>
          <input
            className="input"
            value={cv.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Email</span>
          <input
            className="input"
            value={cv.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Phone</span>
          <input
            className="input"
            value={cv.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">City</span>
          <input
            className="input"
            value={cv.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Summary</span>
          <textarea
            className="input min-h-[110px]"
            value={cv.summary}
            onChange={(e) => update("summary", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Education</span>
          <textarea
            className="input min-h-[110px]"
            value={cv.education}
            onChange={(e) => update("education", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Experience</span>
          <textarea
            className="input min-h-[110px]"
            value={cv.experience}
            onChange={(e) => update("experience", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Activities</span>
          <textarea
            className="input min-h-[110px]"
            value={cv.activities}
            onChange={(e) => update("activities", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Awards</span>
          <textarea
            className="input min-h-[110px]"
            value={cv.awards}
            onChange={(e) => update("awards", e.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Skills</span>
          <textarea
            className="input min-h-[110px]"
            value={cv.skills}
            onChange={(e) => update("skills", e.target.value)}
          />
        </label>

        {saved ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            CV saved successfully.
          </div>
        ) : null}

        <div className="flex gap-3">
          <button className="primary-btn flex-1" type="submit">
            Save CV
          </button>
          <button
            className="secondary-btn flex-1"
            type="button"
            onClick={copyCV}
          >
            Copy CV
          </button>
        </div>
      </form>

      <div className="card mt-6 p-4">
        <h3 className="text-base font-semibold text-ink">Preview</h3>
        <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {preview}
        </pre>
      </div>
    </>
  );
}
