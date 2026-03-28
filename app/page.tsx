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
const publishers = ["all", "bbc", "cnn", "positive-news", "good-news-network", "reasons-to-be-cheerful"] as const;
const topics = [
  "All",
  "General",
  "Environment",
  "Business",
  "Health",
  "Science",
  "Technology",
] as const;
const languages = [
  "All",
  "English",
  "Spanish",
  "German",
  "French",
  "Chinese",
] as const;

export default function Home() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [publisher, setPublisher] = useState("all");

  const [mounted, setMounted] = useState(false);

  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/news?q=${encodeURIComponent(query)}&pageSize=100&publisher=${publisher}`
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
  }, [query, publisher, searchTrigger]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const sentimentOk =
        sentimentFilter === "All" || article.sentiment === sentimentFilter;
      const topicOk =
        topicFilter === "All" || article.topic === topicFilter;
      const languageOk =
        languageFilter === "All" || article.language === languageFilter;

      return sentimentOk && topicOk && languageOk;
    });
  }, [articles, sentimentFilter, topicFilter, languageFilter]);

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
    <main className="min-h-screen bg-black text-white">
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

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
			        onKeyDown={(e) => {
  			        if (e.key === "Enter") {
    			        setQuery(inputValue.trim());
                   setSearchTrigger((prev) => prev + 1);
 			       }
		         }}
              placeholder="Search any topic..."
              className="w-full rounded-full bg-black px-5 py-3 text-white outline-none ring-1 ring-white/10"
            />

            <button
              onClick={() => setQuery(inputValue.trim())}
              className="rounded-full bg-white px-5 py-3 font-medium text-black"
            >
              Search
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
                  {p.toUpperCase()}
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

        <div className="mb-10 grid gap-8 md:grid-cols-3">
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

          <div>
            <p className="mb-3 text-sm text-neutral-400">Topic</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopicFilter(t)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    topicFilter === t
                      ? "bg-white text-black"
                      : "bg-neutral-900 text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm text-neutral-400">Language</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguageFilter(l)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    languageFilter === l
                      ? "bg-white text-black"
                      : "bg-neutral-900 text-white"
                  }`}
                >
                  {l}
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