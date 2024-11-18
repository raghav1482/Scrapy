require('dotenv').config(); 

const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;

const fetchYouTubeComments = async (videoId) => {
  const options = {
    method: 'GET',
    url: 'https://youtube-v31.p.rapidapi.com/commentThreads',
    params: {
      part: 'snippet',
      videoId: videoId,
      maxResults: '100',
    },
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY, 
      'x-rapidapi-host': 'youtube-v31.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const comments = response.data.items.map(item => item.snippet.topLevelComment.snippet.textDisplay);
    return comments;
  } catch (error) {
    console.error('Error fetching YouTube comments:', error);
    throw error;
  }
};

app.get('/fetch-comments', async (req, res) => {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: 'videoId parameter is required' });
  }

  try {
    const commentsArray = await fetchYouTubeComments(videoId);
    res.json(commentsArray);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
