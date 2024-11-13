import React, { useState } from 'react';
import './App.css';
import cachorro from './assets/cachorro.jpg';
import hollow from './assets/hollow.jpg';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <button>Adicionar ao carrinho</button>
    </div>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const products = [
    { id: 1, name: 'Roupa Maltes', description: 'Descrição do produto', price: 19.99, image: cachorro, category: 'roupa_de_cachorro' },
    { id: 2, name: 'Hollow Knight', description: 'Descrição do produto', price: 29.99, image: hollow, category: 'Video_game' },
    // Outros produtos
  ];

  const filteredProducts = products.filter(product => 
    (category === 'All' || product.category === category) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="category-buttons">
        <button onClick={() => setCategory('All')}>Todos</button>
        <button onClick={() => setCategory('roupa_de_cachorro')}>roupa de cachorro</button>
        <button onClick={() => setCategory('Video_game')}>Jogo</button>
        <button onClick={() => setCategory('Recomendacao')}>Recomendacao</button>
        {/* Adicione mais botões de categoria */}
      </div>

      <main className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
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
