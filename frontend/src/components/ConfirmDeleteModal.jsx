import { useEffect, useRef, useState } from "react";

export default function ConfirmDeleteModal({ item, onClose, onDelete }) {
  const dialogRef = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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

  async function handleDelete() {
    setBusy(true);
    setError("");
    try {
      await onDelete();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete this link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog ref={dialogRef} aria-labelledby="delete-dialog-title" className="dialog-panel">
      <div className="p-6 sm:p-7">
        <h2 id="delete-dialog-title" className="text-lg font-semibold text-ink">Delete this short link?</h2>
        <p className="mt-2 text-sm leading-6 text-muted">The link <span className="font-medium text-ink">{item.shortCode || item.shortcode}</span> will be removed. This cannot be undone.</p>
        {error && <p role="alert" className="status-error mt-3">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="button button-quiet">Cancel</button>
          <button type="button" onClick={handleDelete} disabled={busy} className="button button-danger">{busy ? "Deleting…" : "Delete link"}</button>
        </div>
      </div>
    </dialog>
  );
}
