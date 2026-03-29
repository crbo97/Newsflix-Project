"use client";

import { useEffect, useMemo, useState } from "react";
import NewsCard from "@/components/NewsCard";

type NewsItem = {
  title: string;
  source: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  topic: string;
  language: string;
  confidence?: number;
};

const sentiments = ["All", "Positive", "Neutral", "Negative"] as const;
const publishers = ["all", "bbc", "cnn", "usa-today"] as const;

export default function Home() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [publisher, setPublisher] = useState("all");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [sentimentFilter, setSentimentFilter] = useState("All");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefreshFeed = () => {
    setSearchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/news?q=&pageSize=15&publisher=${publisher}`
        );
        const data = await res.json();
        setArticles(data.articles ?? []);
      } catch (error) {
        console.error(error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [publisher, searchTrigger]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      return (
        sentimentFilter === "All" ||
        article.sentiment === sentimentFilter
      );
    });
  }, [articles, sentimentFilter]);

  const sentimentCounts = useMemo(() => {
    const total = articles.length || 1;
    const positive = articles.filter((a) => a.sentiment === "Positive").length;
    const neutral = articles.filter((a) => a.sentiment === "Neutral").length;
    const negative = articles.filter((a) => a.sentiment === "Negative").length;

    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100),
    };
  }, [articles]);

  return (
    <main className= "min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white">
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-red-500">
            Newsflix
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-300">
            Choose your news mood. Explore articles by sentiment, topic, and language.
          </p>
        </div>

        <div className="mb-10 rounded-3xl bg-neutral-900 p-8">
          <h2 className="text-3xl font-semibold">
            Your personalized news stream
          </h2>

          <div className="mt-6 max-w-3xl rounded-2xl border border-white/5 bg-black/40 p-5">
            <p className="text-lg leading-relaxed text-neutral-200">
              Your news spot that cares for your mental health.
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              Check the tone of your news before diving into them.
            </p>

            <button
              onClick={handleRefreshFeed}
              className="mt-4 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Refresh feed
            </button>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm text-neutral-400">Publisher</p>
            <div className="flex flex-wrap gap-2">
              {publishers.map((p) => (
                <button
                  key={p}
                  onClick={() => setPublisher(p)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    publisher === p
                      ? "bg-white text-black"
                      : "bg-neutral-800 text-white hover:bg-neutral-700"
                  }`}
                >
                  {p === "usa-today" ? "USA Today" : p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {mounted && (
            <p className="mt-6 border-t border-white/5 pt-4 text-sm text-neutral-400">
              Current Batch: {sentimentCounts.positive}% Positive ·{" "}
              {sentimentCounts.neutral}% Neutral ·{" "}
              {sentimentCounts.negative}% Negative
            </p>
          )}
        </div>

        <div className="mb-10">
          <div>
            <p className="mb-3 text-sm text-neutral-400">Mood</p>
            <div className="flex flex-wrap gap-2">
              {sentiments.map((s) => (
                <button
                  key={s}
                  onClick={() => setSentimentFilter(s)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    sentimentFilter === s
                      ? "bg-white text-black"
                      : "bg-neutral-900 text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center gap-3 text-neutral-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
            Loading AI insights...
          </div>
        ) : filteredArticles.length === 0 ? (
          <p className="mt-10 text-neutral-400">
            No articles matched your filters.
          </p>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <NewsCard
                key={`${article.url}-${index}`}
                title={article.title}
                source={article.source}
                summary={article.description}
                mood={article.sentiment}
                topic={article.topic}
                language={article.language}
                url={article.url}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}