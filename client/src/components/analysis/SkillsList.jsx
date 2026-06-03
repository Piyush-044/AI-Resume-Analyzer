export default function SkillsList({ title, items, variant = 'default' }) {
  if (!items?.length) return null;

  const badgeClass =
    variant === 'missing'
      ? 'bg-red-50 text-red-700'
      : variant === 'recommended'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-slate-100 text-slate-700';

  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-slate-900">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((skill, i) => (
          <span key={i} className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
