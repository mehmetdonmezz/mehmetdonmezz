'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function ProfilePage() {
  const { user, isLoading, isLoggedIn, logout } = useUser();
  const { getTotalItems } = useCart();
  const router = useRouter();

  // Giriş yapmamışsa login'e yönlendir
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login?redirect=/profile');
    }
  }, [isLoading, isLoggedIn, router]);

  // Loading durumu
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapmamışsa
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Yönlendiriliyor...</p>
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
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                🏠 Ana Sayfa
              </a>
              <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                Ürünler
              </a>
              <a href="/cart" className="text-gray-700 hover:text-blue-600 font-medium">
                Sepet ({getTotalItems()})
              </a>
              <button 
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Hoş geldiniz, {user.firstName}!</h2>
              <p className="text-blue-100 mt-1">Hesap bilgilerinizi buradan yönetebilirsiniz</p>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{user.orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Kayıtlı Adres</p>
                <p className="text-2xl font-bold text-gray-900">{user.addresses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Üyelik Süresi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} gün
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a 
            href="/profile/edit" 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <span className="text-blue-600 text-xl">✏️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Profil Düzenle</h3>
                <p className="text-sm text-gray-600">Bilgilerinizi güncelleyin</p>
              </div>
            </div>
          </a>

          <a 
            href="/profile/change-password" 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <span className="text-orange-600 text-xl">🔐</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Şifre Değiştir</h3>
                <p className="text-sm text-gray-600">Hesabınızı güvende tutun</p>
              </div>
            </div>
          </a>

          <a 
            href="/profile/addresses" 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <span className="text-green-600 text-xl">📍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Adres Yönetimi</h3>
                <p className="text-sm text-gray-600">Teslimat adreslerinizi düzenleyin</p>
              </div>
            </div>
          </a>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Info */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                  <p className="text-gray-900">{user.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                  <p className="text-gray-900">{user.lastName}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              )}
              {user.birthDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                  <p className="text-gray-900">{new Date(user.birthDate).toLocaleDateString('tr-TR')}</p>
                </div>
              )}
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Bilgileri Düzenle
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
            </div>
            <div className="p-6 space-y-4">
              <a 
                href="/profile/orders" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <span className="text-xl">📋</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Sipariş Geçmişi</h4>
                  <p className="text-sm text-gray-600">Geçmiş siparişlerinizi görüntüleyin</p>
                </div>
              </a>

              <a 
                href="/profile/addresses" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-xl">📍</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Adres Yönetimi</h4>
                  <p className="text-sm text-gray-600">Teslimat adreslerinizi yönetin</p>
                </div>
              </a>

              <a 
                href="/profile/settings" 
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <span className="text-xl">⚙️</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Hesap Ayarları</h4>
                  <p className="text-sm text-gray-600">Şifre değiştirme ve güvenlik</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        {user.orders.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sipariş No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.orders.slice(0, 3).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'delivered' ? 'Teslim Edildi' :
                           order.status === 'shipped' ? 'Kargoda' :
                           order.status === 'confirmed' ? 'Onaylandı' :
                           order.status === 'pending' ? 'Beklemede' : 'İptal Edildi'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}