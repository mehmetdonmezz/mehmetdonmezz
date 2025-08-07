'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, Order } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function OrdersPage() {
  const { user, isLoggedIn, isLoading } = useUser();
  const { getTotalItems } = useCart();
  const router = useRouter();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, isLoading, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'confirmed': return 'Onaylandı';
      case 'preparing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'preparing': return '📦';
      case 'shipped': return '🚚';
      case 'delivered': return '🎉';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Sipariş filtreleme ve sıralama
  const getFilteredAndSortedOrders = () => {
    if (!user?.orders) return [];

    let filtered = user.orders;

    // Status filtresi
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Sıralama
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      } else {
        return sortOrder === 'desc' ? b.total - a.total : a.total - b.total;
      }
    });

    return filtered;
  };

  // Loading durumunda
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapmamışsa boş döndür (redirect olacak)
  if (!isLoggedIn) {
    return null;
  }

  const filteredOrders = getFilteredAndSortedOrders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
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
              <a href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                👤 Profil
              </a>
              <a href="/cart" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sepet ({getTotalItems()})
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Orders Management */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Ana Sayfa</a>
            <span>›</span>
            <a href="/profile" className="hover:text-blue-600">Profil</a>
            <span>›</span>
            <span className="text-purple-600 font-medium">Siparişlerim</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Siparişlerim</h1>
            <p className="text-gray-600">Sipariş geçmişinizi görüntüleyin ve takip edin</p>
          </div>
          <div className="mt-4 sm:mt-0 bg-white rounded-lg px-4 py-2 shadow-lg">
            <span className="text-sm text-gray-600">Toplam: </span>
            <span className="font-bold text-purple-600">{user?.orders?.length || 0} Sipariş</span>
          </div>
        </div>

        {/* Filters and Sorting */}
        {user?.orders && user.orders.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex-1">
                <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  Durum Filtresi
                </label>
                <select
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="all">Tüm Siparişler</option>
                  <option value="pending">Bekliyor</option>
                  <option value="confirmed">Onaylandı</option>
                  <option value="preparing">Hazırlanıyor</option>
                  <option value="shipped">Kargoda</option>
                  <option value="delivered">Teslim Edildi</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex-1">
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'total')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="date">Tarihe Göre</option>
                  <option value="total">Tutara Göre</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex-1">
                <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                  Sıra
                </label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="desc">Yeniden Eskiye</option>
                  <option value="asc">Eskiden Yeniye</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-xl">📦</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Sipariş #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {getStatusText(order.status)}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ₺{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{order.items.length} ürün</span>
                      <span>•</span>
                      <span>Teslimat: {order.shippingAddress.city}</span>
                      <span>•</span>
                      <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} adet</span>
                    </div>
                    
                    {/* First few items */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-2xl">{item.image}</span>
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-gray-500">x{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="bg-purple-50 text-purple-700 rounded-lg px-3 py-2 text-sm font-medium">
                          +{order.items.length - 3} ürün daha
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => openOrderModal(order)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      🔍 Detayları Görüntüle
                    </button>
                    {order.status === 'delivered' && (
                      <button className="flex-1 sm:flex-none bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                        ⭐ Değerlendir
                      </button>
                    )}
                    {['pending', 'confirmed'].includes(order.status) && (
                      <button className="flex-1 sm:flex-none bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium">
                        ❌ İptal Et
                      </button>
                    )}
                    <button className="flex-1 sm:flex-none bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      🔄 Tekrar Sipariş
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filterStatus !== 'all' ? 'Bu durumda sipariş bulunamadı' : 'Henüz sipariş vermemişsiniz'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus !== 'all' ? 'Farklı bir filtre deneyebilirsiniz' : 'İlk siparişinizi vermek için ürünlere göz atın'}
            </p>
            <a
              href="/products"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              🛍️ Alışverişe Başla
            </a>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  Sipariş Detayı #{selectedOrder.id}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">📋 Sipariş Bilgileri</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sipariş No:</span>
                      <span className="font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tarih:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durum:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)} {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam:</span>
                      <span className="font-bold text-purple-600">₺{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">📍 Teslimat Adresi</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                    <p>{selectedOrder.shippingAddress.phone}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.district} / {selectedOrder.shippingAddress.city}</p>
                    <p>{selectedOrder.shippingAddress.postalCode}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">🛒 Sipariş İçeriği</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ürün
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fiyat
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Adet
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{item.image}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₺{item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₺{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          Toplam Tutar:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-purple-600">
                          ₺{selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  ↩️ Kapat
                </button>
                {selectedOrder.status === 'delivered' && (
                  <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
                    ⭐ Değerlendir
                  </button>
                )}
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  🔄 Tekrar Sipariş Ver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}