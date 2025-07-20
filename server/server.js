import express from "express";
import { Groq } from "groq-sdk";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { URL } from "url";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

const GROQ_KEY = process.env.GROQ_KEY;
const groq = new Groq({ apiKey: GROQ_KEY });

// In-memory cache to reduce redundant scraping (simple version)
const cache = new Map();

async function getInternalLinksPuppeteer(baseUrl, maxPages = 10) {
  if (cache.has(baseUrl)) {
    console.log(`Cache hit for ${baseUrl}`);
    return cache.get(baseUrl);
  }

  const visited = new Set();
  const queue = [baseUrl];
  const baseDomain = new URL(baseUrl).origin;
  const contents = [];

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

  try {
    while (queue.length > 0 && visited.size < maxPages) {
      const currentUrl = queue.shift();
      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);

      try {
        await page.goto(currentUrl, {
          waitUntil: "domcontentloaded",
          timeout: 10000, // 10 seconds timeout
        });

        const bodyText = await page.evaluate(() => document.body.innerText);
        contents.push(bodyText.trim());

        const links = await page.evaluate(() =>
          Array.from(document.querySelectorAll("a[href]"))
            .map((a) => a.href)
            .filter(
              (href) =>
                href.startsWith(window.location.origin) &&
                !href.includes("#") &&
                !href.startsWith("mailto:")
            )
        );

        for (const href of links) {
          if (!visited.has(href) && !queue.includes(href)) {
            queue.push(href);
          }
        }
      } catch (err) {
        console.log(`⚠️  Skipped ${currentUrl}: ${err.message}`);
      }
    }
  } finally {
    await browser.close();
  }

  const finalContent = contents.join("\n\n").slice(0, 10000);
  cache.set(baseUrl, finalContent);
  return finalContent;
}

app.post("/chat", async (req, res) => {
  const { url, query, limit = 25 } = req.body;

  if (!url || !query) {
    return res.status(400).json({ error: "Missing 'url' or 'query'." });
  }

  console.log(`📥 Received request for ${url}`);

  let content = await getInternalLinksPuppeteer(url, limit);
  if (!content) {
    content = `Website unreachable. Assume the URL was: ${url}. If you can answer the question related to the site url, answer it or ask politely to try again or later. Don't answer data other than the url site. if the query is out of the url site, tell you can't find anything in the given url scraped data`;
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Answer the user's question based on the provided website content.",
        },
        {
          role: "user",
          content: `Website Content: ${content}\n\nQuestion: ${query}`,
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    });

    let responseContent = "";
    for await (const chunk of chatCompletion) {
      responseContent += chunk.choices[0]?.delta?.content || "";
    }

    res.json({ reply: responseContent });
  } catch (err) {
    console.error("❌ Groq error:", err.message);
    res.status(500).json({ error: "Chat API failed." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running at 4000");
});
