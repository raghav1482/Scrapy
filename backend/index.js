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

// Function to parse reviews from CarDekho's HTML
const parseReviews = (html) => {
  const $ = cheerio.load(html);
  const reviews = [];

  // Iterate through each review inside <li> tags with the specific structure
  $('li .readReviewBox').each((index, element) => {
    const review = $(element);

    // Extract author name and date
    const authorInfo = review.find('.authorSummary .name').text().trim();
    const [author, date] = authorInfo.split(' on ');

    // Extract rating
    const rating = review.find('.ratingStarNew').text().trim();

    // Extract title
    const title = review.find('.title').text().trim();

    // Extract review content
    const body = review.find('.contentheight div').text().trim();

    reviews.push({
      author: author || 'Unknown Author',
      date: date || 'Unknown Date',
      rating: rating || 'No Rating',
      title: title || 'No Title',
      body: body || 'No Content',
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
  const maxPages = 50; // Maximum number of pages to scrape

  while (hasMorePages && page <= maxPages) {
    const url = `${baseUrl}?page=${page}`;
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


// API endpoint to scrape CarDekho reviews
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
      reviewBodies.push(`Average Rating: ${averageRating.toFixed(2)}`);
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
