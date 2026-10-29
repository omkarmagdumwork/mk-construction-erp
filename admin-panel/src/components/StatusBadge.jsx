const colors = {
  planning: "bg-blue-100 text-blue-700",
  "in-progress": "bg-amber-100 text-amber-700",
  "on-hold": "bg-red-100 text-red-700",
  completed: "bg-green-100 text-green-700",
  todo: "bg-slate-100 text-slate-700",
  done: "bg-green-100 text-green-700",
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  closed: "bg-slate-100 text-slate-700",
  active: "bg-green-100 text-green-700",
  inactive: "bg-slate-100 text-slate-700",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
      colors[status] || "bg-slate-100 text-slate-700"
    }`}
  >
    {status?.replace("-", " ")}
  </span>
);

export default StatusBadge;