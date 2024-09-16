import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import xml2js from 'xml2js';

const app = express();
const PORT = 3001;

app.use(cors());

const xmlPage = "https://www.eurofurence.org/EF28/schedule/schedule.en.xml";

// Basic in memory cache to avoid ddosing the website whilst still being kind of up to date
const cache = {};
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes in milliseconds

const fetchXMLData = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  console.log(`Fetched ${url}`);
  return text;
};

const parseXMLToJSON = async (xml) => {
  const parser = new xml2js.Parser({ mergeAttrs: true, trim: true });
  const result = await parser.parseStringPromise(xml);
  return result;
};

app.get('/fetch-events', async (req, res) => {
  try {
    const now = Date.now();
    if (cache[xmlPage] && (now - cache[xmlPage].timestamp < CACHE_TTL)) {
      console.log(`Cache hit for ${xmlPage}`);
      res.json(cache[xmlPage].data);
    } else {
      console.log(`Cache miss for ${xmlPage}`);
      const xmlData = await fetchXMLData(xmlPage);
      const jsonData = await parseXMLToJSON(xmlData);
      cache[xmlPage] = { data: jsonData, timestamp: now };
      res.json(jsonData);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});