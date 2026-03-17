export default function EmptyState({ title, description, action }) {
  return (
    <div className="card p-6 text-center">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-body">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
