const colorMap = {
  low: 'bg-teal-100 text-teal-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

function UrgencyBadge({ level }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${colorMap[level] || colorMap.low}`}>
      {level} priority
    </span>
  );
}

export default UrgencyBadge;
