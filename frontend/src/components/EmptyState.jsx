export default function EmptyState({ title, children }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-5 py-10 text-center">
      <h3 className="font-medium text-ink">{title}</h3>
      {children && <p className="mt-1 text-sm text-muted">{children}</p>}
    </div>
  );
}
