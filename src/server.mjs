import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 5001;

app.use(cors());

const eventPages = [
  "https://www.eurofurence.org/EF28/schedule/day_2024-09-17.en.html",
  "https://www.eurofurence.org/EF28/schedule/day_2024-09-18.en.html",
  "https://www.eurofurence.org/EF28/schedule/day_2024-09-19.en.html",
  "https://www.eurofurence.org/EF28/schedule/day_2024-09-20.en.html",
  "https://www.eurofurence.org/EF28/schedule/day_2024-09-21.en.html",
  "https://www.eurofurence.org/EF28/schedule/day_2024-09-22.en.html",
  "https://www.eurofurence.org/EF28/schedule/day_2024-09-23.en.html",
];

// Basic in memory cache to avoid ddosing the website whilst still being kind of up to date
const cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes in milliseconds

const fetchPageHTML = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  console.log(`Fetched ${url}`);
  return text;
};

app.get('/fetch-events', async (req, res) => {
  try {
    const now = Date.now();
    const pages = await Promise.all(eventPages.map(async (url) => {
      if (cache[url] && (now - cache[url].timestamp < CACHE_TTL)) {
        console.log(`Cache hit for ${url}`);
        return cache[url].data;
      } else {
        console.log(`Cache miss for ${url}`);
        const data = await fetchPageHTML(url);
        cache[url] = { data, timestamp: now };
        return data;
      }
    }));
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event pages' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});