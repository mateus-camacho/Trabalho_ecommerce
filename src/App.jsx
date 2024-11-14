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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001');
        const data = await response.json();
        setProducts(data);
        console.log(data);  // Verifique os dados recebidos aqui
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        const data = await response.json();
        setCategories(data);
        console.log(data);  // Verifique os dados recebidos aqui
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const filteredProducts = products.filter(product => 
    (category === 'All' || product.main_category === category) &&
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleCategorySelect = (category) => {
    setCategory(category);
    setDropdownOpen(false);
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

      <main className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>Nenhum produto encontrado</p>
        )}
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 Minha Loja</p>
      </footer>
    </div>
  );
}

export default App;
