'use client';

import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();

  if (items.length === 0) {
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
                <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">Ürünler</a>
                <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">Kategoriler</a>
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

        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-8xl mb-8">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h2>
          <p className="text-xl text-gray-600 mb-8">Henüz sepetinize ürün eklemediniz</p>
          <a 
            href="/products" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Alışverişe Başla
          </a>
        </div>
      </div>
    );
  }

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
              <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">Ürünler</a>
              <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">Kategoriler</a>
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

      {/* Cart Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Alışveriş Sepeti</h2>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Sepeti Temizle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">{item.image}</span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">{item.category}</p>
                    <p className="text-xl font-bold text-blue-600">₺{item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    🗑️
                  </button>
                </div>

                {/* Item Total */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ara Toplam:</span>
                    <span className="text-lg font-bold text-gray-900">₺{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ürün Sayısı:</span>
                  <span className="font-semibold">{getTotalItems()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-semibold">₺{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo:</span>
                  <span className="font-semibold text-green-600">Ücretsiz</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Toplam:</span>
                    <span className="text-2xl font-bold text-blue-600">₺{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mb-4">
                Sipariş Ver
              </button>
              
              <a 
                href="/products" 
                className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg text-center font-semibold hover:bg-blue-50 transition-colors block"
              >
                Alışverişe Devam Et
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}