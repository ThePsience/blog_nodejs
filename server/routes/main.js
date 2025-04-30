const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Home Page
router.get('/', async (req, res) => {
  try {
    const locals = {
      title: 'NodeJs Blog',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.',
    };

    let perPage = 3;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { title: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    // Count is deprecated - please use countDocuments({}) instead
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    const hasNextPagePlus = nextPage <= Math.ceil(count * perPage);

    res.render('index', {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      prevPage: hasNextPagePlus ? page - 1 : null,
    });
  } catch (error) {
    console.log(error);
  }
});

// Post Page
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await Post.findById({ _id: slug });
    const locals = {
      title: data.title,
      description: data.description,
    };
    res.render('post', { locals, data });
  } catch (error) {
    console.log('Error fetching post:', error);
  }
});

// ABout Page
router.get('/about', async (req, res) => {
  const locals = {
    title: 'NodeJS Blog',
    description: 'Welcome to the blog',
  };
  try {
    const data = await Post.find().sort({ title: 'desc' });
    res.render('about', { locals, data });
  } catch (error) {
    console.log('Error fetching posts:', error);
  }
});

// Search Route
router.post('/search', async (req, res) => {
  const locals = {
    title: 'Search',
    description: 'Search for posts',
  };
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z ]/g, '');

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
      ],
    });
    res.render('search', { locals, data });
  } catch (error) {
    console.log('Error searching posts:', error);
  }
});

module.exports = router;
