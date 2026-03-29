import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../lib/storage";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function update(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    try {
      signUpUser(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Sign up failed.");
    }
  }

  return (
    <div className="min-h-screen px-3 py-4 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-app items-center justify-center rounded-[32px] border border-white/60 bg-surface p-5 shadow-soft">
        <div className="w-full rounded-[28px] bg-white p-6 shadow-soft">
          <div className="mb-6">
            <div className="mb-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              Gnosis
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">
              Sign up
            </h1>
            <p className="mt-2 text-sm text-body">
              Create your workspace and start planning your applications.
            </p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="label">Full Name</span>
              <input
                className="input"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="your name"
              />
            </label>

            <label className="block">
              <span className="label">Email</span>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="label">Password</span>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Create a password"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button className="primary-btn w-full" type="submit">
              Create account
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-body">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
