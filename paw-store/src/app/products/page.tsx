'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const { addToCart, getTotalItems } = useCart();

  // Sahte ürün verisi
  const products = [
    {
      id: 1,
      name: "Royal Canin Köpek Maması",
      price: 299.99,
      category: "Köpek",
      image: "🐕",
      description: "Yetişkin köpekler için dengeli beslenme",
      inStock: true
    },
    {
      id: 2,
      name: "Whiskas Kedi Maması",
      price: 89.99,
      category: "Kedi",
      image: "🐱",
      description: "Tavuklu kedi maması, 2kg",
      inStock: true
    },
    {
      id: 3,
      name: "Kong Köpek Oyuncağı",
      price: 45.00,
      category: "Köpek",
      image: "🎾",
      description: "Dayanıklı kauçuk oyuncak",
      inStock: true
    },
    {
      id: 4,
      name: "Kedi Tırmalama Tahtası",
      price: 120.00,
      category: "Kedi",
      image: "🪵",
      description: "Doğal sisal malzemeli",
      inStock: false
    },
    {
      id: 5,
      name: "Kuş Kafesi Premium",
      price: 350.00,
      category: "Kuş",
      image: "🏠",
      description: "Büyük boy, paslanmaz çelik",
      inStock: true
    },
    {
      id: 6,
      name: "Akvaryum Filtresi",
      price: 180.00,
      category: "Akvaryum",
      image: "🔧",
      description: "100L kapasiteye kadar",
      inStock: true
    },
    {
      id: 7,
      name: "Köpek Tasması Premium",
      price: 65.00,
      category: "Köpek",
      image: "🦴",
      description: "Deri tasma, ayarlanabilir",
      inStock: true
    },
    {
      id: 8,
      name: "Kedi Kumu Kaliteli",
      price: 25.99,
      category: "Kedi",
      image: "📦",
      description: "Topaklanan, 10L",
      inStock: true
    }
  ];

  const categories = ["Tümü", "Köpek", "Kedi", "Kuş", "Akvaryum"];

  // Filtrelenmiş ürünler
  const filteredProducts = selectedCategory === 'Tümü' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐾</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PawStore</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Ana Sayfa</a>
              <a href="/products" className="text-blue-600 font-medium">Ürünler</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">Kategoriler</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">İletişim</a>
            </nav>
            <div className="flex items-center space-x-4">
              <a href="/cart" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sepet ({getTotalItems()})
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ürünlerimiz</h2>
          <p className="text-xl text-gray-600">Sevimli dostlarınız için kaliteli ürünler</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full border-2 font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-6xl">{product.image}</span>
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">₺{product.price}</span>
                  <div className="flex items-center space-x-2">
                    {product.inStock ? (
                      <span className="text-green-600 text-xs font-medium">✓ Stokta</span>
                    ) : (
                      <span className="text-red-600 text-xs font-medium">✗ Tükendi</span>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    console.log('🔥 BUTTON CLICKED!', product.name);
                    alert('🚨 Test: ' + product.name + ' butonuna tıklandı!');
                    
                    if (product.inStock) {
                      console.log('🛒 Adding to cart...', product);
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        category: product.category,
                        image: product.image
                      });
                      alert('✅ ' + product.name + ' sepete eklendi!');
                    }
                  }}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backgroundColor: product.inStock ? '#2563eb' : '#d1d5db',
                    color: product.inStock ? 'white' : '#6b7280',
                    border: 'none'
                  }}
                  disabled={!product.inStock}
                >
                  {product.inStock ? '🛒 SEPETE EKLE' : '❌ STOKTA YOK'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}