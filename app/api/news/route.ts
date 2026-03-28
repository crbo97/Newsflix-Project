import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

type Sentiment = "Positive" | "Neutral" | "Negative";

type ClassifiedResult = {
  sentiment: Sentiment;
  topic: string;
  language: string;
  confidence: number;
};

function mapPublisherToDomains(publisher: string | null): string | null {
  switch ((publisher || "all").toLowerCase()) {
    case "bbc":
      return "bbc.com,bbc.co.uk";
    case "cnn":
      return "cnn.com";
    case "positive-news":
      return "positive.news";
    case "good-news-network":
      return "goodnewsnetwork.org";
    case "reasons-to-be-cheerful":
      return "reasonstobecheerful.world";
    default:
      return null;
  }
}

function inferTopicFromKeywords(text: string): string {
  if (
    text.includes("climate") ||
    text.includes("emissions") ||
    text.includes("carbon") ||
    text.includes("global warming")
  ) {
    return "Climate Change";
  }

  if (
    text.includes("environment") ||
    text.includes("pollution") ||
    text.includes("conservation") ||
    text.includes("wildlife")
  ) {
    return "Environment";
  }

  if (
    text.includes("storm") ||
    text.includes("hurricane") ||
    text.includes("rain") ||
    text.includes("temperature") ||
    text.includes("weather") ||
    text.includes("flood") ||
    text.includes("wildfire")
  ) {
    return "Weather";
  }

  if (
    text.includes("stock") ||
    text.includes("market") ||
    text.includes("economy") ||
    text.includes("earnings") ||
    text.includes("business") ||
    text.includes("trade") ||
    text.includes("tariff") ||
    text.includes("inflation")
  ) {
    return "Business";
  }

  if (
    text.includes("movie") ||
    text.includes("music") ||
    text.includes("actor") ||
    text.includes("tv") ||
    text.includes("film") ||
    text.includes("celebrity") ||
    text.includes("festival")
  ) {
    return "Entertainment";
  }

  if (
    text.includes("hospital") ||
    text.includes("health") ||
    text.includes("disease") ||
    text.includes("medical") ||
    text.includes("virus") ||
    text.includes("treatment") ||
    text.includes("vaccine")
  ) {
    return "Health";
  }

  if (
    text.includes("science") ||
    text.includes("research") ||
    text.includes("study") ||
    text.includes("scientist") ||
    text.includes("discovery") ||
    text.includes("experiment")
  ) {
    return "Science";
  }

  if (
    text.includes("match") ||
    text.includes("tournament") ||
    text.includes("goal") ||
    text.includes("league") ||
    text.includes("sports") ||
    text.includes("championship") ||
    text.includes("player")
  ) {
    return "Sports";
  }

  if (
    text.includes("ai") ||
    text.includes("technology") ||
    text.includes("software") ||
    text.includes("apple") ||
    text.includes("google") ||
    text.includes("microsoft") ||
    text.includes("startup") ||
    text.includes("chip") ||
    text.includes("robot")
  ) {
    return "Technology";
  }

  return "General";
}

function inferLanguageFromText(text: string): string {
  if (/[а-яё]/i.test(text)) return "Russian";
  if (/[א-ת]/.test(text)) return "Hebrew";
  if (/[ء-ي]/.test(text)) return "Arabic";
  if (/[一-龯]/.test(text)) return "Chinese";
  if (/[ऀ-ॿ]/.test(text)) return "Hindi";

  if (
    text.includes(" el ") ||
    text.includes(" la ") ||
    text.includes(" una ") ||
    text.includes(" que ") ||
    text.includes(" los ")
  ) {
    return "Spanish";
  }

  if (
    text.includes(" le ") ||
    text.includes(" la ") ||
    text.includes(" les ") ||
    text.includes(" des ") ||
    text.includes(" une ")
  ) {
    return "French";
  }

  if (
    text.includes(" der ") ||
    text.includes(" die ") ||
    text.includes(" das ") ||
    text.includes(" und ") ||
    text.includes(" ein ")
  ) {
    return "German";
  }

  if (
    text.includes(" il ") ||
    text.includes(" lo ") ||
    text.includes(" gli ") ||
    text.includes(" una ") ||
    text.includes(" che ")
  ) {
    return "Italian";
  }

  return "English";
}

const strongNegativeWords = [
  "attack",
  "attacks",
  "bomb",
  "bombing",
  "war",
  "missile",
  "strike",
  "strikes",
  "killed",
  "dead",
  "death",
  "injured",
  "wounded",
  "crisis",
  "disaster",
  "explosion",
  "terror",
  "terrorist",
  "hostage",
  "sanction",
  "sanctions",
  "conflict",
  "invasion",
  "evacuation",
  "shooting",
  "earthquake",
  "flood",
  "wildfire",
  "hurricane",
  "layoffs",
  "recession",
  "outbreak",
  "collapse",
  "crash",
];

const strongPositiveWords = [
  "breakthrough",
  "recovery",
  "recover",
  "peace deal",
  "ceasefire",
  "rescue",
  "rescued",
  "medical success",
  "aid delivery",
  "aid arrives",
  "record growth",
  "growth",
  "improves",
  "improvement",
  "decline in deaths",
  "fall in deaths",
  "cure",
  "approval",
  "wins championship",
  "expands access",
  "scholarship",
  "funding boost",
  "job growth",
  "clean energy expansion",
];

function classifyWithRules(title: string, description: string): ClassifiedResult | null {
  const text = `${title} ${description}`.toLowerCase();

  if (strongNegativeWords.some((word) => text.includes(word))) {
    return {
      sentiment: "Negative",
      topic: inferTopicFromKeywords(text),
      language: inferLanguageFromText(text),
      confidence: 0.92,
    };
  }

  if (strongPositiveWords.some((word) => text.includes(word))) {
    return {
      sentiment: "Positive",
      topic: inferTopicFromKeywords(text),
      language: inferLanguageFromText(text),
      confidence: 0.88,
    };
  }

  return null;
}

async function classifyArticlesBatch(
  articles: Array<{ title: string; description: string }>
): Promise<ClassifiedResult[]> {
  const prompt = `
You are classifying multiple news articles for a product called Newsflix.

Classify based on the likely emotional impact of the EVENT on a typical reader,
not on whether the writing style sounds neutral or journalistic.

Interpretation rules:
- war, attacks, bombings, deaths, disasters, disease outbreaks, fraud, major layoffs, market crashes -> Negative
- breakthroughs, recoveries, peace agreements, rescues, successful treatments, humanitarian aid, positive social improvements -> Positive
- routine announcements, administrative changes, schedules, standard earnings reports, product updates without clear positive/negative impact -> Neutral

Return ONLY valid JSON.
Do not add markdown.
Do not add explanation.

Return a JSON array with one object per article, in the same order.
Each object must have exactly:
{
  "sentiment": "Positive | Neutral | Negative",
  "topic": "General | Environment | Weather | Business | Entertainment | Climate Change | Health | Science | Sports | Technology",
  "language": "Arabic | German | English | Spanish | French | Hebrew | Italian | Dutch | Norwegian | Portuguese | Russian | Swedish | Chinese | Hindi",
  "confidence": 0.0
}

Articles:
${JSON.stringify(articles, null, 2)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const raw = response.text.trim();
  console.log("Gemini batch raw response:", raw);

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error("Gemini batch response was not an array");
  }

  return parsed.map((item) => ({
    sentiment: item.sentiment ?? "Neutral",
    topic: item.topic ?? "General",
    language: item.language ?? "English",
    confidence: Number(item.confidence ?? 0.6),
  }));
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const rawQ = searchParams.get("q")?.trim() || "";
  const q =
    rawQ || "world OR breakthrough OR recovery OR innovation OR success";

  const pageSize = Math.min(
    Number(searchParams.get("pageSize") || "100"),
    100
  );

  const publisher = searchParams.get("publisher");

  try {
    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", q);
    url.searchParams.set("pageSize", String(pageSize));
    url.searchParams.set("sortBy", "publishedAt");

    const domains = mapPublisherToDomains(publisher);
    if (domains) {
      url.searchParams.set("domains", domains);
    }

    console.log("Publisher selected:", publisher);
    console.log("Domains applied:", domains);
    console.log("NewsAPI URL:", url.toString());

    const newsRes = await fetch(url.toString(), {
      headers: {
        "X-Api-Key": process.env.NEWS_API_KEY || "",
      },
      cache: "no-store",
    });

    const rawText = await newsRes.text();

    if (!newsRes.ok) {
      console.error("NewsAPI error:", rawText);
      return NextResponse.json(
        {
          error: "Failed to fetch news from NewsAPI",
          status: newsRes.status,
          details: rawText,
        },
        { status: 500 }
      );
    }

    const newsJson = JSON.parse(rawText);

    const rawArticles = (newsJson.articles ?? [])
      .filter((article: any) => article?.title && article?.url)
      .slice(0, pageSize);

    const baseArticles = rawArticles.map((article: any) => ({
      title: article.title ?? "Untitled",
      source: article.source?.name ?? "Unknown source",
      description: article.description ?? "No description available.",
      url: article.url ?? "#",
      imageUrl: article.urlToImage ?? null,
      publishedAt: article.publishedAt ?? "",
    }));

    const ruleResults = baseArticles.map((article) =>
      classifyWithRules(article.title, article.description)
    );

    const needsGeminiIndexes = ruleResults
      .map((result, index) => (result === null ? index : -1))
      .filter((index) => index !== -1);

    console.log("Articles needing Gemini:", needsGeminiIndexes.length);

    let geminiResults: ClassifiedResult[] = [];

    if (needsGeminiIndexes.length > 0) {
      try {
        geminiResults = await classifyArticlesBatch(
          needsGeminiIndexes.map((index) => ({
            title: baseArticles[index].title,
            description: baseArticles[index].description,
          }))
        );
      } catch (error) {
        console.error("Gemini batch classification error:", error);

        geminiResults = needsGeminiIndexes.map((index) => {
          const text =
            `${baseArticles[index].title} ${baseArticles[index].description}`.toLowerCase();

          return {
            sentiment: "Neutral",
            topic: inferTopicFromKeywords(text),
            language: inferLanguageFromText(text),
            confidence: 0.45,
          };
        });
      }
    }

    let geminiCursor = 0;

    const articles = baseArticles.map((article, index) => {
      const ruleResult = ruleResults[index];
      const classification =
        ruleResult ??
        geminiResults[geminiCursor++] ?? {
          sentiment: "Neutral" as Sentiment,
          topic: inferTopicFromKeywords(
            `${article.title} ${article.description}`.toLowerCase()
          ),
          language: inferLanguageFromText(
            `${article.title} ${article.description}`.toLowerCase()
          ),
          confidence: 0.45,
        };

      return {
        ...article,
        sentiment: classification.sentiment,
        topic: classification.topic,
        language: classification.language,
        confidence: classification.confidence,
        classificationSource: ruleResult ? "rules" : "gemini",
      };
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}