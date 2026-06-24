function GuideCard({ guide }) {
  return (
    <div className="rounded-xl bg-slate-800 p-4 text-white">
      <p className="text-lg font-bold">{guide.name}</p>

      <p className="text-sm text-green-400">
        {guide.role}
      </p>
    </div>
  );
}

export default GuideCard;