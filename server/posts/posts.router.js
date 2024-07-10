const express = require('express');
const axios = require('axios');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();

    // Here i have used api request as per given by the vidyalai .


    
    const postsWithImages = await Promise.all(posts.map(async (post) => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/albums/1/photos`);
      const photos = response.data.slice(0, 3);

      return {
        ...post,
        images: photos.map(photo => ({ url: photo.thumbnailUrl }))
      };
    }));

    res.json(postsWithImages);
  } catch (error) {
    console.error("Error fetching posts with images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
