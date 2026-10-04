import { useEffect, useRef, useState } from "react";
import { isHttpUrl } from "./UrlForm.jsx";

export default function EditUrlModal({ item, field, onClose, onSave }) {
  const dialogRef = useRef(null);
  const [value, setValue] = useState(field === "code" ? (item.shortCode || item.shortcode || "") : (item.targetURL || ""));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isCode = field === "code";
  const title = isCode ? "Edit shortcode" : "Edit destination";
  const label = isCode ? "Shortcode" : "Destination URL";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    if (!dialog.open) dialog.showModal();
    const handleCancel = (event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      if (dialog.open) dialog.close();
    };
  }, [onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const cleanValue = value.trim();
    if (isCode && (cleanValue.length < 6 || !/^[A-Za-z0-9_-]+$/.test(cleanValue))) {
      setError("Use at least 6 letters, numbers, underscores, or hyphens.");
      return;
    }
    if (!isCode && !isHttpUrl(cleanValue)) {
      setError("Enter a valid http or https URL.");
      return;
    }
    setBusy(true);
    try {
      await onSave(cleanValue);
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your changes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog ref={dialogRef} aria-labelledby="edit-dialog-title" className="dialog-panel" onClick={(event) => {
      if (event.target === dialogRef.current) onClose();
    }}>
      <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="edit-dialog-title" className="text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-muted">Changes are saved to your account.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-md px-2 py-1 text-xl leading-none text-muted hover:bg-slate-100 focus-ring">×</button>
        </div>
        <div className="mt-5">
          <label htmlFor="edit-value" className="field-label">{label}</label>
          <input id="edit-value" autoFocus value={value} onChange={(event) => setValue(event.target.value)} className="field" />
          {error && <p role="alert" className="status-error mt-2">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="button button-quiet">Cancel</button>
          <button type="submit" disabled={busy} className="button button-primary">{busy ? "Saving…" : "Save changes"}</button>
        </div>
      </form>
    </dialog>
  );
}
