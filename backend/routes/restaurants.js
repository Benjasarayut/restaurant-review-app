const express = require('express');
const router = express.Router();
const { readJsonFile } = require('../utils/fileManager');

router.get('/', async (req, res) => {
  try {
    let restaurants = await readJsonFile('restaurants.json');
    const { search, category, minRating, priceRange } = req.query;

    if (search) {
      const s = search.toLowerCase();
      restaurants = restaurants.filter(r =>
        (r.name || '').toLowerCase().includes(s) ||
        (r.description || '').toLowerCase().includes(s)
      );
    }

    if (category && category.trim() !== '') {
      restaurants = restaurants.filter(r => r.category === category);
    }

    if (minRating !== undefined && minRating !== '') {
      const mr = parseFloat(minRating);
      if (!isNaN(mr)) {
        restaurants = restaurants.filter(r => (r.averageRating || 0) >= mr);
      }
    }

    if (priceRange !== undefined && priceRange !== '') {
      const pr = parseInt(priceRange);
      if (!isNaN(pr)) {
        restaurants = restaurants.filter(r => parseInt(r.priceRange) === pr);
      }
    }

    res.json({
      success: true,
      data: restaurants,
      total: restaurants.length,
      filters: {
        search: search || null,
        category: category || null,
        minRating: minRating || null,
        priceRange: priceRange || null
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurants = await readJsonFile('restaurants.json');
    const reviews = await readJsonFile('reviews.json');

    const restaurant = restaurants.find(r => r.id === parseInt(id));
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'ไม่พบร้านอาหารนี้' });
    }

    const restaurantReviews = reviews
      .filter(r => r.restaurantId === parseInt(id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: { ...restaurant, reviews: restaurantReviews }
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลร้าน'
    });
  }
});

module.exports = router;
