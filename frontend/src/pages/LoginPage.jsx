import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginRequest } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import Header from "../components/Header.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const info = location.state?.message;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 3) {
      setError("Password must be at least 3 characters.");
      return;
    }
    setBusy(true);
    try {
      const result = await loginRequest({ email: email.trim(), password });
      if (!result?.token) throw new Error("The server did not return an authentication token.");
      login(result.token);
      navigate("/dashboard", { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not log in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <main className="page-width flex justify-center py-12 sm:py-20">
        <section className="w-full max-w-md rounded-2xl border border-line bg-white p-6 sm:p-8">
          <p className="text-sm font-medium text-accent">Welcome back</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Log in to Shortly</h1>
          <p className="mt-2 text-sm text-muted">Manage your short links from one place.</p>
          {info && <p role="status" className="status-info mt-5">{info}</p>}
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor="login-email" className="field-label">Email</label>
              <input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field" />
            </div>
            <div>
              <label htmlFor="login-password" className="field-label">Password</label>
              <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="field" />
            </div>
            {error && <p role="alert" className="status-error">{error}</p>}
            <button type="submit" disabled={busy} className="button button-primary w-full">{busy ? "Logging in…" : "Log in"}</button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">New to Shortly? <Link to="/signup" className="font-medium text-accent hover:text-accent-dark focus-ring">Create an account</Link></p>
        </section>
      </main>
    </div>
  );
}
