function RestaurantCard({ restaurant, onSelect }) {
  return (
    <div className="restaurant-card" onClick={() => onSelect(restaurant.id)}>
      <img
        src={restaurant.image || 'https://placehold.co/300x200?text=No+Image'}
        alt={restaurant.name}
        className="restaurant-image"
      />

      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p className="category">{restaurant.category}</p>
        <p className="desc">
          {restaurant.description.length > 60
            ? restaurant.description.substring(0, 60) + '...'
            : restaurant.description}
        </p>

        <div className="rating-row">
          <span className="rating">⭐ {restaurant.averageRating}</span>
          <span className="price">{'฿'.repeat(restaurant.priceRange)}</span>
          <span className="reviews">({restaurant.totalReviews} รีวิว)</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
