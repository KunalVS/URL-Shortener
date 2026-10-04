import UrlRow from "./UrlRow.jsx";
import EmptyState from "./EmptyState.jsx";

export default function UrlList({ urls, loading, error, onRetry, actions }) {
  if (loading) {
    return <div role="status" className="rounded-xl border border-line bg-white px-5 py-8 text-center text-sm text-muted">Loading your links…</div>;
  }
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-5">
        <p role="alert" className="text-sm text-red-700">{error}</p>
        <button type="button" onClick={onRetry} className="button button-quiet mt-3">Try again</button>
      </div>
    );
  }
  if (urls.length === 0) {
    return <EmptyState title="No short links yet">Create your first link above and it will appear here.</EmptyState>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-line bg-white md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-4 py-3">Shortcode</th>
              <th scope="col" className="px-4 py-3">Short URL</th>
              <th scope="col" className="px-4 py-3">Destination</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>{urls.map((url, index) => <UrlRow key={url.id || url.shortCode || index} url={url} mode="table" {...actions} />)}</tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {urls.map((url, index) => <UrlRow key={url.id || url.shortCode || index} url={url} {...actions} />)}
      </div>
      {urls.some((url) => !url.id) && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          Some saved links do not include an ID from the server, so editing or deleting those links is unavailable.
        </p>
      )}
    </>
  );
}
