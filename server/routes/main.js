const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Home Page
router.get('/', async (req, res) => {
  const locals = {
    title: 'NodeJS Blog',
    description: 'Welcome to the blog',
  };
  try {
    const data = await Post.find().sort({ createdAt: 'desc' });
    res.render('index', { locals, data });
  } catch (error) {
    console.log('Error fetching posts:', error);
  }
});

module.exports = router;
