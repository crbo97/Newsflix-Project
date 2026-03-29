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

  const topicStyles: Record<string, string> = {
    Technology: "bg-cyan-500/20 text-cyan-300",
    Business: "bg-amber-500/20 text-amber-300",
    Health: "bg-pink-500/20 text-pink-300",
    Science: "bg-violet-500/20 text-violet-300",
    Environment: "bg-green-500/20 text-green-300",
    "Climate Change": "bg-lime-500/20 text-lime-300",
    Weather: "bg-sky-500/20 text-sky-300",
    Entertainment: "bg-fuchsia-500/20 text-fuchsia-300",
    Sports: "bg-orange-500/20 text-orange-300",
    General: "bg-neutral-700 text-neutral-200",
  };

  return (
    <article className="rounded-2xl bg-neutral-900 p-5 transition hover:bg-neutral-800">
      <p className="text-sm text-neutral-400">{source}</p>

      <h4 className="mt-3 text-lg font-semibold">{title}</h4>

      <p className="mt-2 text-sm text-neutral-300">{summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs ${moodStyles[mood]}`}
        >
          {mood}
        </span>

        <span
          className={`inline-block rounded-full px-3 py-1 text-xs ${
            topicStyles[topic] ?? "bg-neutral-700 text-neutral-200"
          }`}
        >
          {topic}
        </span>
      </div>

      <p className="mt-3 text-xs text-neutral-500">{language}</p>

      <div className="mt-4 flex items-center justify-end">
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