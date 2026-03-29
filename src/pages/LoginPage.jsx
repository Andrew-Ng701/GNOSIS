import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInUser } from "../lib/storage";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
      signInUser(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
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
              Log in
            </h1>
            <p className="mt-2 text-sm text-body">
              Access your profile, tasks, documents, and AI tools.
            </p>
          </div>

          <form className="space-y-4" onSubmit={submit}>
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
                placeholder="Enter your password"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button className="primary-btn w-full" type="submit">
              Log in
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-body">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-brand-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
