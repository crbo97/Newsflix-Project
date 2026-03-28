type Props = {
  title: string;
  source: string;
  summary: string;
  mood: "Positive" | "Neutral" | "Negative";
  topic: string;
  language: string;
  url: string;
};

export default function NewsCard({
  title,
  source,
  summary,
  mood,
  topic,
  language,
  url,
}: Props) {
  const moodStyles = {
    Positive: "bg-emerald-500/20 text-emerald-300",
    Neutral: "bg-slate-500/20 text-slate-200",
    Negative: "bg-rose-500/20 text-rose-300",
  };

  return (
    <article className="rounded-2xl bg-neutral-900 p-5 transition hover:bg-neutral-800">
      <p className="text-sm text-neutral-400">{source}</p>

      <h4 className="mt-3 text-lg font-semibold">{title}</h4>

      <p className="mt-2 text-sm text-neutral-300">{summary}</p>

      <p className="mt-3 text-xs text-neutral-500">
        {topic} · {language}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs ${moodStyles[mood]}`}
        >
          {mood}
        </span>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-red-300 hover:text-red-200"
        >
          Read article
        </a>
      </div>
    </article>
  );
}