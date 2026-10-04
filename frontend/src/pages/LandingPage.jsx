import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <main className="page-width">
        <section className="mx-auto max-w-3xl py-20 text-center sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">A simpler way to share</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink sm:text-6xl">Short links, made simple.</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">Turn long URLs into short links you can keep organized and update whenever you need.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/signup" className="button button-primary">Create account</Link>
            <Link to="/login" className="button button-outline">Log in</Link>
          </div>
          <div className="mx-auto mt-16 max-w-2xl border-t border-line pt-7">
            <p className="text-sm leading-6 text-muted">Create, manage, and edit your short links after logging in. Your links stay available in one straightforward list.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
