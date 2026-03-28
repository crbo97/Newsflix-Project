"use client";

import { useState } from "react";
import NewsCard from "@/components/NewsCard";

export default function Home() {
  // 1. STATE
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");

  // 2. CONFIG
  const topics = ["All", "Environment", "Weather", "Business", "Health", "Science", "Technology", "Sports"];
  const languages = ["All", "English", "Spanish", "French", "German", "Italian"];
  const moods = ["All", "Positive", "Neutral", "Negative"];

  // 3. DATA
  const news = [
    { title: "AI breakthrough in medical diagnosis", source: "BBC", summary: "New algorithms show 99% accuracy.", sentiment: "Positive" as const, topic: "Technology", language: "English" },
    { title: "Storm disrupts transport network", source: "Reuters", summary: "Heavy winds cause major delays.", sentiment: "Negative" as const, topic: "Weather", language: "English" },
    { title: "Costa Rica lidera en energía solar", source: "La Nación", summary: "Avances significativos en renovables.", sentiment: "Positive" as const, topic: "Environment", language: "Spanish" },
    { title: "New health tech startup raises $50M", source: "TechCrunch", summary: "Focusing on wearable heart monitors.", sentiment: "Positive" as const, topic: "Health", language: "English" },
    { title: "Inflation numbers stay flat", source: "WSJ", summary: "Market reacts calmly to latest reports.", sentiment: "Neutral" as const, topic: "Business", language: "English" },
  ];

  // 4. CORE LOGIC (Combined Filters)
  const filteredNews = news.filter((n) => {
    return (
      (sentimentFilter === "All" || n.sentiment === sentimentFilter) &&
      (topicFilter === "All" || n.topic === topicFilter) &&
      (languageFilter === "All" || n.language === languageFilter)
    );
  });

  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-black text-red-600 mb-10 tracking-tighter">NEWSFLIX</h1>

        {/* FILTER UI GRID */}
        <div className="space-y-6 mb-12 bg-neutral-900/30 p-6 rounded-3xl border border-white/5">
          {/* Mood Filter */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-neutral-500 w-20">MOOD:</span>
            <div className="flex gap-2 flex-wrap">
              {moods.map(m => (
                <button key={m} onClick={() => setSentimentFilter(m)} className={`px-3 py-1 rounded-full text-xs transition ${sentimentFilter === m ? "bg-red-600 text-white" : "bg-neutral-800 text-neutral-400"}`}>{m}</button>
              ))}
            </div>
          </div>

          {/* Topic Filter */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-neutral-500 w-20">TOPIC:</span>
            <div className="flex gap-2 flex-wrap">
              {topics.map(t => (
                <button key={t} onClick={() => setTopicFilter(t)} className={`px-3 py-1 rounded-full text-xs transition ${topicFilter === t ? "bg-white text-black" : "bg-neutral-800 text-neutral-400"}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Language Filter */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-neutral-500 w-20">LANG:</span>
            <div className="flex gap-2 flex-wrap">
              {languages.map(l => (
                <button key={l} onClick={() => setLanguageFilter(l)} className={`px-3 py-1 rounded-full text-xs transition ${languageFilter === l ? "bg-white text-black" : "bg-neutral-800 text-neutral-400"}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((n, i) => <NewsCard key={i} {...n} />)}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20 bg-neutral-900/20 rounded-3xl border border-dashed border-neutral-800">
            <p className="text-neutral-500">No headlines match this specific combination.</p>
            <button onClick={() => {setSentimentFilter("All"); setTopicFilter("All"); setLanguageFilter("All");}} className="mt-4 text-red-500 text-sm font-bold underline">Reset all filters</button>
          </div>
        )}
      </div>
    </main>
  );
}
