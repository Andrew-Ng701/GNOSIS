export default function StatCard({ icon, label, value }) {
  return (
    <div className="card p-4">
      <div className="mb-2 text-brand-500">{icon}</div>
      <p className="text-lg font-bold text-ink">{value}</p>
      <p className="text-xs text-body">{label}</p>
    </div>
  );
}
