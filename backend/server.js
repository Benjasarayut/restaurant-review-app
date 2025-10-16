const express = require('express');
const cors = require('cors');
require('dotenv').config();

const restaurantRoutes = require('./routes/restaurants');
const reviewRoutes = require('./routes/reviews');
const { readJsonFile } = require('./utils/fileManager');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🍜 Restaurant Review API',
    version: '1.0.0',
    endpoints: {
      restaurants: '/api/restaurants',
      reviews: '/api/reviews',
      stats: '/api/stats'
    }
  });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/api/stats', async (req, res) => {
  try {
    const restaurants = await readJsonFile('restaurants.json');
    const reviews = await readJsonFile('reviews.json');

    const totalRestaurants = restaurants.length;
    const totalReviews = reviews.length;

    const rated = restaurants.filter(r => typeof r.averageRating === 'number' && r.averageRating > 0);
    const averageRating =
      rated.length > 0
        ? Math.round((rated.reduce((s, r) => s + r.averageRating, 0) / rated.length) * 10) / 10
        : 0;

    const topRatedRestaurants = [...restaurants]
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) return b.averageRating - a.averageRating;
        if (b.totalReviews !== a.totalReviews) return b.totalReviews - a.totalReviews;
        return a.name.localeCompare(b.name, 'th');
      })
      .slice(0, 5);

    res.json({
      success: true,
      data: { totalRestaurants, totalReviews, averageRating, topRatedRestaurants }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงสถิติ' });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
