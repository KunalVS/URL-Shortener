import { useState } from "react";
import { shortenUrl } from "../api/urls.js";
import { ApiError } from "../api/client.js";

export function isHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function validate(destination, code) {
  if (!destination.trim()) return "Enter a destination URL.";
  if (!isHttpUrl(destination.trim())) return "Enter a valid http or https URL.";
  if (code && code.length < 6) return "A custom shortcode must be at least 6 characters.";
  if (code && !/^[A-Za-z0-9_-]+$/.test(code)) {
    return "Use only letters, numbers, underscores, or hyphens in a shortcode.";
  }
  return "";
}

export default function UrlForm({ publicBase, onCreated, onRefresh }) {
  const [destination, setDestination] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const validation = validate(destination.trim(), code.trim());
    if (validation) {
      setError(validation);
      return;
    }
    setBusy(true);
    try {
      const result = await shortenUrl(destination.trim(), code.trim());
      const shortcode = result?.shortcode || result?.shortCode;
      if (!shortcode) throw new Error("The server did not return a shortcode.");
      onCreated({ shortcode, shortUrl: publicBase + "/" + shortcode });
      setDestination("");
      setCode("");
      await onRefresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create this short link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="destination" className="field-label">Destination URL</label>
        <input
          id="destination"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://example.com/a-long-page"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "create-error" : "destination-help"}
          className="field"
        />
        <p id="destination-help" className="mt-1.5 text-xs text-muted">Paste the full address, including https://.</p>
      </div>
      <div>
        <label htmlFor="custom-code" className="field-label">Custom shortcode <span className="font-normal text-muted">(optional)</span></label>
        <input
          id="custom-code"
          type="text"
          autoComplete="off"
          placeholder="my-custom-link"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          aria-invalid={Boolean(error && code)}
          aria-describedby="code-help"
          className="field"
        />
        <p id="code-help" className="mt-1.5 text-xs text-muted">At least 6 characters. Letters, numbers, _ and -.</p>
      </div>
      {error && <p id="create-error" role="alert" className="status-error">{error}</p>}
      <button type="submit" disabled={busy} className="button button-primary w-full sm:w-auto">
        {busy ? "Creating…" : "Create short link"}
      </button>
    </form>
  );
}
