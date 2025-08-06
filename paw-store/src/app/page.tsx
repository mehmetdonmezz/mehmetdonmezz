import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
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
              <a href="/" className="text-blue-600 font-medium">Ana Sayfa</a>
              <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">Ürünler</a>
              <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">Kategoriler</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium">İletişim</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sepet (0)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sevimli Dostlarınız İçin
            <span className="text-blue-600 block">Her Şey Burada!</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Köpek, kedi, kuş ve diğer evcil hayvanlarınız için kaliteli ürünler. 
            Hızlı teslimat ve güvenli alışveriş garantisi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
              Ürünleri İncele
            </a>
            <a href="/products" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-block">
              Kategoriler
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Popüler Kategoriler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Köpek Ürünleri", icon: "🐕", color: "bg-orange-100 hover:bg-orange-200" },
              { name: "Kedi Ürünleri", icon: "🐱", color: "bg-purple-100 hover:bg-purple-200" },
              { name: "Kuş Ürünleri", icon: "🐦", color: "bg-green-100 hover:bg-green-200" },
              { name: "Akvaryum", icon: "🐠", color: "bg-blue-100 hover:bg-blue-200" }
            ].map((category) => (
              <div key={category.name} className={`${category.color} p-8 rounded-xl text-center cursor-pointer transition-colors`}>
                <div className="text-4xl mb-4">{category.icon}</div>
                <h4 className="text-xl font-semibold text-gray-800">{category.name}</h4>
                <p className="text-gray-600 mt-2">Kaliteli ürünler</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Neden PawStore?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Hızlı Teslimat", 
                description: "Siparişleriniz 24 saat içinde kapınızda",
                icon: "🚚"
              },
              { 
                title: "Güvenli Ödeme", 
                description: "Kredi kartı ve havale seçenekleri",
                icon: "🔒"
              },
              { 
                title: "Kaliteli Ürünler", 
                description: "Sadece güvenilir markalardan ürünler",
                icon: "⭐"
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐾</span>
            </div>
            <h1 className="text-2xl font-bold">PawStore</h1>
          </div>
          <p className="text-gray-400 mb-4">Sevimli dostlarınız için en iyisi</p>
          <p className="text-gray-500 text-sm">© 2024 PawStore. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
