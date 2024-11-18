const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// Function to fetch HTML from a given URL
const fetchHTML = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    return data;
  } catch (error) {
    console.error(`Could not fetch the page: ${error}`);
    return null;
  }
};

// Function to parse the reviews from the HTML
const parseReviews = (html) => {
  const $ = cheerio.load(html);
  const reviews = [];

  $('.review').each((index, element) => {
    const review = $(element);
    const title = review.find('.review-title').text().trim();
    const rating = review.find('.review-rating .a-icon-alt').text().trim();
    const body = review.find('.review-text').text().trim();
    const date = review.find('.review-date').text().trim();

    reviews.push({
      title,
      rating,
      body,
      date
    });
  });

  return reviews;
};

// Function to break a body of text into sentences
const breakIntoSentences = (text) => {
  return text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
};

// Function to extract numerical rating from rating string
const extractRating = (ratingStr) => {
  const match = ratingStr.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : null;
};

// Function to scrape all pages of reviews
const scrapeAllPages = async (baseUrl) => {
  let page = 1;
  let hasMorePages = true;
  let allReviews = [];

  while (hasMorePages) {
    const url = `${baseUrl}&pageNumber=${page}`;
    console.log(`Fetching page ${page}`);
    const html = await fetchHTML(url);

    if (html) {
      const reviews = parseReviews(html);
      if (reviews.length > 0) {
        allReviews = allReviews.concat(reviews);
        page++;
      } else {
        hasMorePages = false;
      }
    } else {
      hasMorePages = false;
    }
  }

  return allReviews;
};

// API endpoint to scrape Amazon reviews
app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get('/scrape-reviews', async (req, res) => {
  const baseUrl = req.query.url;
  if (!baseUrl) {
    return res.status(400).send({ error: 'URL parameter is required' });
  }

  try {
    const reviews = await scrapeAllPages(baseUrl);
    let reviewBodies = [];
    let totalRating = 0;
    let ratingCount = 0;

    reviews.forEach(review => {
      const sentences = breakIntoSentences(review.body);
      reviewBodies = reviewBodies.concat(sentences);

      const rating = extractRating(review.rating);
      if (rating !== null) {
        totalRating += rating;
        ratingCount++;
      }
    });

    if (ratingCount > 0) {
      const averageRating = totalRating / ratingCount;
      reviewBodies.push(`${averageRating.toFixed(2)}`);
    }

    res.json(reviewBodies);
  } catch (error) {
    console.error(`Error scraping reviews: ${error}`);
    res.status(500).send({ error: 'Failed to scrape reviews' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
