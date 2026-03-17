import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  GraduationCap,
  MessageSquareText,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  cityOptionsByCountry,
  countryOptions,
  defaultProfile,
  dreamSchools,
  gradeOptions,
  majorOptions,
  targetCountryOptions,
} from "../data/mockData";
import {
  getOnboardingComplete,
  getProfile,
  saveProfile,
  setOnboardingComplete,
} from "../lib/storage";

const totalSteps = 4;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState(defaultProfile);

  useEffect(() => {
    if (getOnboardingComplete()) {
      navigate("/home", { replace: true });
      return;
    }

    const saved = getProfile();
    setForm({
      ...defaultProfile,
      ...saved,
      targetCountries: Array.isArray(saved.targetCountries)
        ? saved.targetCountries
        : defaultProfile.targetCountries,
    });
  }, [navigate]);

  const progress = useMemo(() => (step / totalSteps) * 100, [step]);

  const availableCities = useMemo(() => {
    return cityOptionsByCountry[form.country] || ["Other"];
  }, [form.country]);

  const selectedTargetCountries = useMemo(() => {
    return Array.isArray(form.targetCountries) ? form.targetCountries : [];
  }, [form.targetCountries]);

  function updateField(name, value) {
    const next = { ...form, [name]: value };
    setForm(next);
    saveProfile(next);
  }

  function updateMany(patch) {
    const next = { ...form, ...patch };
    setForm(next);
    saveProfile(next);
  }

  function handleCountryChange(country) {
    const nextCities = cityOptionsByCountry[country] || ["Other"];
    const keepCurrentCity = nextCities.includes(form.city);

    updateMany({
      country,
      city: keepCurrentCity ? form.city : nextCities[0],
      customCity: keepCurrentCity ? form.customCity : "",
    });
  }

  function handleCityChange(city) {
    updateMany({
      city,
      customCity: city === "Other" ? form.customCity || "" : "",
    });
  }

  function toggleTargetCountry(country) {
    const has = selectedTargetCountries.includes(country);
    const next = has
      ? selectedTargetCountries.filter((item) => item !== country)
      : [...selectedTargetCountries, country];

    updateMany({
      targetCountries: next,
      otherTargetCountry:
        country === "Other" && has ? "" : form.otherTargetCountry,
    });
  }

  function validateCurrentStep() {
    if (step === 1) {
      return (
        form.fullName.trim() &&
        form.email.trim() &&
        form.currentGrade.trim() &&
        form.country.trim() &&
        form.city.trim() &&
        (form.city !== "Other" || form.customCity.trim())
      );
    }

    if (step === 2) {
      return (
        form.schoolName.trim() &&
        form.gpa.trim() &&
        form.targetMajor.trim() &&
        form.curriculum.trim()
      );
    }

    if (step === 3) {
      return (
        selectedTargetCountries.length > 0 &&
        form.dreamSchool.trim() &&
        (!selectedTargetCountries.includes("Other") ||
          form.otherTargetCountry.trim())
      );
    }

    return true;
  }

  function nextStep() {
    if (!validateCurrentStep()) return;
    if (step < totalSteps) setStep((current) => current + 1);
  }

  function prevStep() {
    if (step > 1) setStep((current) => current - 1);
  }

  function completeSetup() {
    if (!validateCurrentStep()) return;

    const normalizedCity =
      form.city === "Other" ? form.customCity.trim() : form.city;

    const normalizedTargetCountries = selectedTargetCountries.includes("Other")
      ? [
          ...selectedTargetCountries.filter((item) => item !== "Other"),
          form.otherTargetCountry.trim(),
        ].filter(Boolean)
      : selectedTargetCountries;

    const finalProfile = {
      ...form,
      city: normalizedCity,
      targetCountries: normalizedTargetCountries,
    };

    saveProfile(finalProfile);
    setOnboardingComplete(true);
    setDone(true);
  }

  function launchApp() {
    navigate("/home");
  }

  if (done) {
    return (
      <div className="min-h-screen px-3 py-4 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-app items-center justify-center rounded-[32px] border border-white/60 bg-surface p-5 shadow-soft">
          <div className="w-full rounded-[28px] bg-white p-6 text-center shadow-soft">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <CheckCircle2 size={40} />
            </div>

            <h1 className="text-2xl font-bold text-ink">
              You&apos;re All Set!
            </h1>
            <p className="mt-2 text-sm text-body">
              Your Gnosis workspace is ready. Your dashboard, matches, and essay
              coaching will now use the preferences you just saved.
            </p>

            <div className="mt-6 space-y-3 text-left">
              <Feature
                icon={<Sparkles size={18} />}
                title="AI Matching"
                desc="Personalized school recommendations based on your academic goals."
              />
              <Feature
                icon={<MessageSquareText size={18} />}
                title="Essay Coach"
                desc="Draft, revise, and improve your personal statement with AI."
              />
              <Feature
                icon={<TimerReset size={18} />}
                title="Timeline Manager"
                desc="Track deadlines, tasks, and next actions in one place."
              />
              <Feature
                icon={<GraduationCap size={18} />}
                title="Community"
                desc="Explore admissions tips, milestone posts, and student resources."
              />
            </div>

            <button className="primary-btn mt-6 w-full" onClick={launchApp}>
              Launch Gnosis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6">
      <div className="mx-auto min-h-[calc(100vh-2rem)] max-w-app rounded-[32px] border border-white/60 bg-surface p-4 shadow-soft">
        <div className="rounded-[28px] bg-white p-5 shadow-soft">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm font-medium text-slate-500">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="app-gradient h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              Gnosis
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Build your application path
            </h1>
            <p className="mt-2 text-sm text-body">
              We&apos;ll personalize your dashboard, school matches, timeline,
              and essay coaching experience.
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <Field label="Full Name">
                <input
                  className="input"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="Andrew Ng"
                />
              </Field>

              <Field label="Email">
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Current Grade">
                <select
                  className="input"
                  value={form.currentGrade}
                  onChange={(e) => updateField("currentGrade", e.target.value)}
                >
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Country">
                <select
                  className="input"
                  value={form.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                >
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="City">
                <select
                  className="input"
                  value={
                    availableCities.includes(form.city) ? form.city : "Other"
                  }
                  onChange={(e) => handleCityChange(e.target.value)}
                >
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </Field>

              {(form.city === "Other" ||
                !availableCities.includes(form.city)) && (
                <Field label="Custom City">
                  <input
                    className="input"
                    value={form.customCity}
                    onChange={(e) => updateField("customCity", e.target.value)}
                    placeholder="Enter your city"
                  />
                </Field>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label="School Name">
                <input
                  className="input"
                  value={form.schoolName}
                  onChange={(e) => updateField("schoolName", e.target.value)}
                  placeholder="Your current school"
                />
              </Field>

              <Field label="Curriculum">
                <select
                  className="input"
                  value={form.curriculum}
                  onChange={(e) => updateField("curriculum", e.target.value)}
                >
                  {[
                    "High School Diploma",
                    "IB",
                    "A-Level",
                    "AP",
                    "DSE",
                    "CBSE",
                    "Other",
                  ].map((curriculum) => (
                    <option key={curriculum} value={curriculum}>
                      {curriculum}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="GPA / Predicted Grade">
                <input
                  className="input"
                  value={form.gpa}
                  onChange={(e) => updateField("gpa", e.target.value)}
                  placeholder="3.8 / 4.0 or 42/45"
                />
              </Field>

              <Field label="Target Major">
                <select
                  className="input"
                  value={form.targetMajor}
                  onChange={(e) => updateField("targetMajor", e.target.value)}
                >
                  {majorOptions.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Field label="Target Countries">
                <div className="flex flex-wrap gap-2">
                  {targetCountryOptions.map((country) => {
                    const active = selectedTargetCountries.includes(country);

                    return (
                      <button
                        key={country}
                        type="button"
                        onClick={() => toggleTargetCountry(country)}
                        className={active ? "pill pill-active" : "pill"}
                      >
                        {country}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {selectedTargetCountries.includes("Other") && (
                <Field label="Other Target Country">
                  <input
                    className="input"
                    value={form.otherTargetCountry}
                    onChange={(e) =>
                      updateField("otherTargetCountry", e.target.value)
                    }
                    placeholder="Enter country name"
                  />
                </Field>
              )}

              <Field label="Dream School">
                <input
                  list="dream-schools"
                  className="input"
                  value={form.dreamSchool}
                  onChange={(e) => updateField("dreamSchool", e.target.value)}
                  placeholder="Search or enter a university"
                />
                <datalist id="dream-schools">
                  {dreamSchools.map((school) => (
                    <option key={school} value={school} />
                  ))}
                </datalist>
              </Field>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-ink">Current focus</p>
                <p className="mt-1 text-sm text-body">
                  {form.targetMajor || "Undeclared"} ·{" "}
                  {selectedTargetCountries.join(", ") ||
                    "No countries selected"}
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Field label="SAT Score">
                <input
                  className="input"
                  value={form.satScore}
                  onChange={(e) => updateField("satScore", e.target.value)}
                  placeholder="Optional"
                />
              </Field>

              <Field label="ACT Score">
                <input
                  className="input"
                  value={form.actScore}
                  onChange={(e) => updateField("actScore", e.target.value)}
                  placeholder="Optional"
                />
              </Field>

              <Field label="IELTS Score">
                <input
                  className="input"
                  value={form.ieltsScore}
                  onChange={(e) => updateField("ieltsScore", e.target.value)}
                  placeholder="Optional"
                />
              </Field>

              <Field label="TOEFL Score">
                <input
                  className="input"
                  value={form.toeflScore}
                  onChange={(e) => updateField("toeflScore", e.target.value)}
                  placeholder="Optional"
                />
              </Field>

              <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4">
                <p className="text-sm font-semibold text-brand-700">
                  You can update these scores later.
                </p>
                <p className="mt-1 text-sm text-brand-600">
                  Gnosis will still generate school matches even if your test
                  scores are empty.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button className="secondary-btn flex-1" onClick={prevStep}>
                Back
              </button>
            )}

            {step < totalSteps ? (
              <button className="primary-btn flex-1" onClick={nextStep}>
                Continue
              </button>
            ) : (
              <button className="primary-btn flex-1" onClick={completeSetup}>
                Complete Setup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3">
      <div className="mt-0.5 rounded-full bg-brand-50 p-2 text-brand-600">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-body">{desc}</p>
      </div>
    </div>
  );
}
