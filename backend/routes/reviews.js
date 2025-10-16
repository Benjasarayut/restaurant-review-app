const express = require('express');
const router = express.Router();
const { readJsonFile, writeJsonFile } = require('../utils/fileManager');
const { validateReview } = require('../middleware/validation');

router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await readJsonFile('reviews.json');

    const restaurantReviews = reviews
      .filter(r => r.restaurantId === parseInt(restaurantId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: restaurantReviews,
      total: restaurantReviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงรีวิว'
    });
  }
});

router.post('/', validateReview, async (req, res) => {
  try {
    const { restaurantId, userName, rating, comment, visitDate } = req.body;

    const reviews = await readJsonFile('reviews.json');
    const restaurants = await readJsonFile('restaurants.json');

    const restaurantIndex = restaurants.findIndex(r => r.id === parseInt(restaurantId));
    if (restaurantIndex === -1) {
      return res.status(404).json({ success: false, message: 'ไม่พบร้านอาหารนี้' });
    }

    const newReview = {
      id: Date.now(),
      restaurantId: parseInt(restaurantId),
      userName: userName.trim(),
      rating: parseInt(rating),
      comment: comment.trim(),
      visitDate: visitDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    reviews.push(newReview);
    await writeJsonFile('reviews.json', reviews);

    const restaurantReviews = reviews.filter(r => r.restaurantId === parseInt(restaurantId));
    const totalRating = restaurantReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverageRating = totalRating / restaurantReviews.length;

    restaurants[restaurantIndex].averageRating = Math.round(newAverageRating * 10) / 10;
    restaurants[restaurantIndex].totalReviews = restaurantReviews.length;

    await writeJsonFile('restaurants.json', restaurants);

    const updated = restaurants[restaurantIndex];

    res.status(201).json({
      success: true,
      message: 'เพิ่มรีวิวสำเร็จ',
      data: newReview,
      restaurant: {
        id: updated.id,
        name: updated.name,
        averageRating: updated.averageRating,
        totalReviews: updated.totalReviews
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มรีวิว'
    });
  }
});

module.exports = router;
