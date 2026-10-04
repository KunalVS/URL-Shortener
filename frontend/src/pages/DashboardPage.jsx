import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUrl, getMyUrls, updateCode, updateUrl } from "../api/urls.js";
import Header from "../components/Header.jsx";
import UrlForm from "../components/UrlForm.jsx";
import UrlList from "../components/UrlList.jsx";
import EditUrlModal from "../components/EditUrlModal.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const publicBase = (import.meta.env.VITE_PUBLIC_SHORT_URL || "http://localhost:3000").replace(/\/+$/, "");

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Copy is unavailable in this browser.");
}

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [notice, setNotice] = useState(null);
  const [created, setCreated] = useState(null);
  const [activeEdit, setActiveEdit] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const closeEdit = useCallback(() => setActiveEdit(null), []);
  const closeDelete = useCallback(() => setPendingDelete(null), []);

  const refreshUrls = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const result = await getMyUrls();
      setUrls(result);
    } catch (cause) {
      setListError(cause instanceof Error ? cause.message : "Could not load your links.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUrls();
  }, [refreshKey, refreshUrls]);

  async function handleCopy(value) {
    try {
      await copyText(value);
      setNotice({ type: "success", text: "Short URL copied to clipboard." });
    } catch (cause) {
      setNotice({ type: "error", text: cause instanceof Error ? cause.message : "Could not copy the link." });
    }
  }

  function handleOpen(value) {
    window.open(value, "_blank", "noopener,noreferrer");
  }

  async function handleSaveEdit(value) {
    if (activeEdit.field === "code") {
      await updateCode(activeEdit.item.id, value);
      setNotice({ type: "success", text: "Shortcode updated." });
    } else {
      await updateUrl(activeEdit.item.id, value);
      setNotice({ type: "success", text: "Destination URL updated." });
    }
    await refreshUrls();
  }

  async function handleDelete() {
    await deleteUrl(pendingDelete.id);
    setNotice({ type: "success", text: "Short link deleted." });
    await refreshUrls();
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const actions = {
    onCopy: handleCopy,
    onOpen: handleOpen,
    onEditDestination: (item) => setActiveEdit({ item, field: "url" }),
    onEditCode: (item) => setActiveEdit({ item, field: "code" }),
    onDelete: (item) => setPendingDelete(item),
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Header authenticated onLogout={handleLogout} />
      <main className="page-width pb-16 pt-8 sm:pt-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-accent">Your workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Link dashboard</h1>
          <p className="mt-2 text-sm text-muted">Create and manage your short links.</p>
        </div>

        {notice && (
          <div role={notice.type === "error" ? "alert" : "status"} className={notice.type === "error" ? "status-error mb-5" : "status-success mb-5"}>
            <div className="flex items-center justify-between gap-3">
              <span>{notice.text}</span>
              <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message" className="rounded px-1 text-base leading-none opacity-70 hover:opacity-100">×</button>
            </div>
          </div>
        )}

        <section aria-labelledby="create-heading" className="surface-section">
          <div className="section-heading">
            <div>
              <h2 id="create-heading" className="text-lg font-semibold text-ink">Create short link</h2>
              <p className="mt-1 text-sm text-muted">Choose a destination and optionally set your own shortcode.</p>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <UrlForm
              publicBase={publicBase}
              onCreated={(value) => {
                setCreated(value);
                setNotice({ type: "success", text: "Short link created." });
              }}
              onRefresh={refreshUrls}
            />
            {created && (
              <div className="mt-5 rounded-xl border border-accent/20 bg-accent-soft p-4">
                <p className="text-sm font-medium text-ink">Your short link is ready</p>
                <a href={created.shortUrl} target="_blank" rel="noreferrer" className="mt-1 block break-all text-sm font-medium text-accent underline decoration-accent/30 underline-offset-4">{created.shortUrl}</a>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => handleCopy(created.shortUrl)} className="button button-outline button-compact">Copy</button>
                  <button type="button" onClick={() => handleOpen(created.shortUrl)} className="button button-outline button-compact">Open</button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section aria-labelledby="saved-heading" className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="saved-heading" className="text-lg font-semibold text-ink">Saved URLs</h2>
              <p className="mt-1 text-sm text-muted">Links associated with your account.</p>
            </div>
            {!loading && !listError && <span className="text-xs text-muted">{urls.length} {urls.length === 1 ? "link" : "links"}</span>}
          </div>
          <UrlList
            urls={urls}
            loading={loading}
            error={listError}
            onRetry={() => setRefreshKey((key) => key + 1)}
            actions={actions}
          />
        </section>
      </main>
      {activeEdit && (
        <EditUrlModal
          key={activeEdit.field + activeEdit.item.id}
          item={activeEdit.item}
          field={activeEdit.field}
          onClose={closeEdit}
          onSave={handleSaveEdit}
        />
      )}
      {pendingDelete && (
        <ConfirmDeleteModal
          item={pendingDelete}
          onClose={closeDelete}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
