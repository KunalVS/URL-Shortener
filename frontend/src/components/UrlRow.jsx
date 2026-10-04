const publicBase = (import.meta.env.VITE_PUBLIC_SHORT_URL || "http://localhost:3000").replace(/\/+$/, "");

function ExternalLink({ href, children, className }) {
  return <a href={href} target="_blank" rel="noreferrer" className={className}>{children}</a>;
}

function UrlActions({ item, onCopy, onOpen, onEditDestination, onEditCode, onDelete }) {
  const missingId = !item.id;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button type="button" onClick={() => onCopy(item.shortUrl)} className="small-action">Copy</button>
      <button type="button" onClick={() => onOpen(item.shortUrl)} className="small-action">Open</button>
      <button type="button" disabled={missingId} title={missingId ? "The server did not return this URL's ID." : "Edit destination"} onClick={() => onEditDestination(item)} className="small-action">Edit URL</button>
      <button type="button" disabled={missingId} title={missingId ? "The server did not return this URL's ID." : "Edit shortcode"} onClick={() => onEditCode(item)} className="small-action">Edit code</button>
      <button type="button" disabled={missingId} title={missingId ? "The server did not return this URL's ID." : "Delete URL"} onClick={() => onDelete(item)} className="small-action small-action-danger">Delete</button>
    </div>
  );
}

export default function UrlRow({ url, mode = "card", ...actions }) {
  const shortcode = url.shortCode || url.shortcode || "";
  const item = {
    ...url,
    shortcode,
    shortUrl: publicBase + "/" + shortcode,
  };
  const destination = url.targetURL || "";

  if (mode === "table") {
    return (
      <tr className="border-t border-line align-top">
        <td className="whitespace-nowrap px-4 py-4 font-medium text-ink">{shortcode}</td>
        <td className="px-4 py-4"><ExternalLink href={item.shortUrl} className="link-text break-all">{item.shortUrl}</ExternalLink></td>
        <td className="max-w-[260px] px-4 py-4"><ExternalLink href={destination} className="block truncate text-sm text-muted hover:text-ink" title={destination}>{destination}</ExternalLink></td>
        <td className="px-4 py-4"><UrlActions item={item} {...actions} /></td>
      </tr>
    );
  }

  return (
    <article className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Shortcode</p>
          <p className="mt-1 truncate font-semibold text-ink">{shortcode}</p>
        </div>
        <ExternalLink href={item.shortUrl} className="shrink-0 text-sm font-medium text-accent hover:text-accent-dark">Open link ↗</ExternalLink>
      </div>
      <div className="mt-3 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Short URL</p>
        <ExternalLink href={item.shortUrl} className="mt-1 block truncate text-sm link-text" title={item.shortUrl}>{item.shortUrl}</ExternalLink>
      </div>
      <div className="mt-3 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Destination</p>
        <ExternalLink href={destination} className="mt-1 block truncate text-sm text-muted hover:text-ink" title={destination}>{destination}</ExternalLink>
      </div>
      <div className="mt-4 border-t border-line pt-3">
        <UrlActions item={item} {...actions} />
      </div>
    </article>
  );
}
