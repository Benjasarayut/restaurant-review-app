import { useState, useEffect, useRef, useCallback } from 'react';
import { getRestaurants } from './services/api';
import FilterPanel from './components/FilterPanel';
import RestaurantDetail from './components/RestaurantDetail';
import RestaurantCard from './components/RestaurantCard';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const debounceRef = useRef(null);

  // ✅ ใช้ useCallback ป้องกัน useEffect เรียกซ้ำ
  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getRestaurants(filters);
      if (result.success) setRestaurants(result.data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ✅ โหลดข้อมูลแบบหน่วง (ไม่วนลูป)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRestaurants();
    }, 400);
  }, [fetchRestaurants]);

  // ✅ ตั้ง dark mode ครั้งเดียว
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // ✅ toggle class บน body
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  if (selectedRestaurant) {
    return (
      <RestaurantDetail
        restaurantId={selectedRestaurant}
        onBack={() => setSelectedRestaurant(null)}
      />
    );
  }

  return (
    <div className="app">
      <div className="theme-toggle">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <header>
        <h1>🍽️ Restaurant Review</h1>
        <p>ค้นหาและรีวิวร้านอาหารโปรดของคุณ</p>
      </header>

      <SearchBar onSearch={(search) => setFilters({ ...filters, search })} />
      <FilterPanel filters={filters} onFilterChange={(f) => setFilters({ ...filters, ...f })} />

      <main>
        {loading ? (
          <div className="loading">กำลังโหลด...</div>
        ) : restaurants.length === 0 ? (
          <div className="no-results">ไม่พบร้านอาหาร</div>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} onSelect={setSelectedRestaurant} />
            ))}
          </div>
        )}
      </main>

      <footer>© 2025 Restaurant Review App | สร้างด้วย React + Express</footer>
    </div>
  );
}

export default App;
