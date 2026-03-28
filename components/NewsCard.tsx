type Props = {
  title: string;
  source: string;
  summary: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  topic: string;
  language: string;
};

export default function NewsCard({ title, source, summary, sentiment, topic, language }: Props) {
  const sentimentStyles = {
    Positive: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Neutral: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
    Negative: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <article className="rounded-2xl bg-neutral-900 p-5 border border-white/5 hover:border-red-500/50 transition-all cursor-default">
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{source}</p>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sentimentStyles[sentiment]}`}>
          {sentiment}
        </span>
      </div>

      <h4 className="text-lg font-semibold leading-tight text-white mb-2">{title}</h4>
      <p className="text-sm text-neutral-400 line-clamp-2 mb-4">{summary}</p>

      {/* UX TAGS: Topic & Language */}
      <div className="pt-4 border-t border-white/5">
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
          {topic} <span className="mx-1 text-neutral-700">•</span> {language}
        </p>
      </div>
    </article>
  );
}
