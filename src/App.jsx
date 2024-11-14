import React, { useState, useEffect } from 'react';
import './App.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.images[0]?.large} alt={product.title} />
      <h2>{product.title}</h2>
      <p className="average-rating">Rating: {product.average_rating}</p>
      <p className="price">${product.price}</p>
      <button>Adicionar ao carrinho</button>
    </div>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState([0, 100]); // Filtro de preço inicial
  const [ratingFilter, setRatingFilter] = useState(0); // Filtro de nota inicial
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001');
        const data = await response.json();
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        const data = await response.json();
        setCategories(data);
        console.log(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product =>
    (category === 'All' || product.main_category === category) &&
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    product.price >= priceFilter[0] && product.price <= priceFilter[1] &&
    product.average_rating >= ratingFilter
  );

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleCategorySelect = (category) => {
    setCategory(category);
    setDropdownOpen(false);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.split(',').map(Number);
    setPriceFilter(value);
  };

  const handleRatingChange = (e) => {
    setRatingFilter(Number(e.target.value));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Minha Loja</h1>
        <input 
          type="text" 
          placeholder="Buscar produtos..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </header>

      <div className="content">
        <aside className="filter-sidebar">
          <div className="category-dropdown">
            <button onClick={toggleDropdown}>
              {category === 'All' ? 'Selecionar Categoria' : category}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => handleCategorySelect('All')}>Todos</button>
                {categories.map((cat, index) => (
                  <button key={index} onClick={() => handleCategorySelect(cat.main_category)}>
                    {cat.main_category}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="filter-options">
            <label>
              Preço:
              <input
                type="range"
                min="0"
                max="100"
                value={priceFilter.join(',')}
                onChange={handlePriceChange}
                step="1"
              />
              <span>{`$${priceFilter[0]} - $${priceFilter[1]}`}</span>
            </label>
            <label>
              Avaliação:
              <input
                type="number"
                min="0"
                max="5"
                value={ratingFilter}
                onChange={handleRatingChange}
                step="1"
              />
            </label>
          </div>
        </aside>

        <main className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>Nenhum produto encontrado</p>
          )}
        </main>
      </div>

      <footer className="App-footer">
        <p>&copy; 2024 Minha Loja</p>
      </footer>
    </div>
  );
}

export default App;
