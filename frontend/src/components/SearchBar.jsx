function SearchBar({ onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault(); // ⛔ ป้องกันรีหน้า
    const value = e.target.search.value.trim();
    onSearch(value);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        placeholder="ค้นหาร้านอาหาร..."
        autoComplete="off"
      />
      <button type="submit">🔍 ค้นหา</button>
    </form>
  );
}

export default SearchBar;
