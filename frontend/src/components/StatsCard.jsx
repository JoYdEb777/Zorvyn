export default function StatsCard({ label, value, icon, type }) {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon">{icon}</div>
      </div>
      <div className="stat-card-value">{value}</div>
    </div>
  );
}
