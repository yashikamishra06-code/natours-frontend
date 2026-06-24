function OverviewBox({ label, text, icon }) {
  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <p className="text-sm uppercase text-green-400">{label}</p>

      <div className="mt-2 flex items-center gap-2 text-white">
        <span>{icon}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default OverviewBox;