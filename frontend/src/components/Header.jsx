import { Link } from "react-router-dom";

export default function Header({ authenticated = false, onLogout }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="page-width flex h-[68px] items-center justify-between">
        <Link to={authenticated ? "/dashboard" : "/"} className="inline-flex items-center gap-2.5 rounded-md focus-ring">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-bold text-white" aria-hidden="true">S</span>
          <span className="text-lg font-semibold tracking-tight text-ink">Shortly</span>
        </Link>
        {authenticated ? (
          <button type="button" onClick={onLogout} className="button button-quiet">Log out</button>
        ) : (
          <Link to="/login" className="text-sm font-medium text-muted transition hover:text-ink focus-ring">Log in</Link>
        )}
      </div>
    </header>
  );
}
