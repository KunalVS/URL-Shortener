import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../api/auth.js";
import Header from "../components/Header.jsx";

export default function SignupPage() {
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (!firstname.trim() || !lastname.trim()) {
      setError("Enter your first and last name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 3) {
      setError("Password must be at least 3 characters.");
      return;
    }
    setBusy(true);
    try {
      await signUp({ firstname: firstname.trim(), lastname: lastname.trim(), email: email.trim(), password });
      navigate("/login", { replace: true, state: { message: "Your account was created. You can now log in." } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create your account. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <main className="page-width flex justify-center py-10 sm:py-14">
        <section className="w-full max-w-md rounded-2xl border border-line bg-white p-6 sm:p-8">
          <p className="text-sm font-medium text-accent">Get started</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">Create your account</h1>
          <p className="mt-2 text-sm text-muted">A few details and you can start shortening links.</p>
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="field-label">First name</label>
                  <input id="first-name" autoComplete="given-name" value={firstname} onChange={(event) => setFirstname(event.target.value)} className="field" />
                </div>
                <div>
                  <label htmlFor="last-name" className="field-label">Last name</label>
                  <input id="last-name" autoComplete="family-name" value={lastname} onChange={(event) => setLastname(event.target.value)} className="field" />
                </div>
              </div>
              <div>
                <label htmlFor="signup-email" className="field-label">Email</label>
                <input id="signup-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field" />
              </div>
              <div>
                <label htmlFor="signup-password" className="field-label">Password</label>
                <input id="signup-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="field" />
                <p className="mt-1.5 text-xs text-muted">Use at least 3 characters.</p>
              </div>
              {error && <p role="alert" className="status-error">{error}</p>}
              <button type="submit" disabled={busy} className="button button-primary w-full">{busy ? "Creating account…" : "Create account"}</button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-medium text-accent hover:text-accent-dark focus-ring">Log in</Link></p>
        </section>
      </main>
    </div>
  );
}
