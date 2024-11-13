import React, { useState } from 'react';
import './App.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const products = [
    { id: 1, name: 'Produto 1', description: 'Descrição do produto', price: 19.99, image: 'imagem1.jpg', category: 'Eletrônicos' },
    { id: 2, name: 'Produto 2', description: 'Descrição do produto', price: 29.99, image: 'imagem2.jpg', category: 'Roupas' },
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
        <button onClick={() => setCategory('Eletrônicos')}>Eletrônicos</button>
        <button onClick={() => setCategory('Roupas')}>Roupas</button>
        <button onClick={() => setCategory('Livros')}>Livros</button>
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
