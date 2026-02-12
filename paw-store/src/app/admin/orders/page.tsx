'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { useUser, Order } from '@/context/UserContext';

export default function AdminOrdersPage() {
  const { isAdmin, isLoading: adminLoading, logout } = useAdmin();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Admin kontrolü
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, adminLoading, router]);

  // Tüm siparişleri yükle (normalde API'den gelir)
  useEffect(() => {
    if (isAdmin) {
      // Mock data - gerçek uygulamada tüm kullanıcılardan siparişleri çeker
      const mockOrders: Order[] = [
        {
          id: 'ORD001',
          date: '2024-01-05T14:30:00Z',
          status: 'delivered',
          total: 284.97,
          items: [
            { id: 1, name: 'Royal Canin Köpek Maması', price: 199.99, quantity: 1, image: '🐕', category: 'Köpek Maması' },
            { id: 3, name: 'Kong Köpek Oyuncağı', price: 45.00, quantity: 1, image: '🎾', category: 'Köpek Oyuncağı' },
            { id: 5, name: 'Köpek Tasması', price: 39.98, quantity: 1, image: '🎀', category: 'Köpek Aksesuarı' }
          ],
          shippingAddress: {
            id: '1', title: 'Ev', fullName: 'Ahmet Yılmaz', phone: '+90 555 123 4567',
            address: 'Ataşehir Mahallesi, Test Sokak No:5 Daire:3', city: 'İstanbul', district: 'Ataşehir',
            postalCode: '34750', isDefault: true
          }
        },
        {
          id: 'ORD002',
          date: '2024-01-10T10:15:00Z',
          status: 'shipped',
          total: 89.99,
          items: [
            { id: 2, name: 'Whiskas Kedi Maması', price: 89.99, quantity: 1, image: '🐱', category: 'Kedi Maması' }
          ],
          shippingAddress: {
            id: '2', title: 'İş', fullName: 'Ayşe Demir', phone: '+90 555 987 6543',
            address: 'Kadıköy Mahallesi, İş Sokak No:12', city: 'İstanbul', district: 'Kadıköy',
            postalCode: '34710', isDefault: false
          }
        },
        {
          id: 'ORD003',
          date: '2024-01-15T16:45:00Z',
          status: 'pending',
          total: 159.98,
          items: [
            { id: 4, name: 'Kedi Kumu', price: 79.99, quantity: 2, image: '🏺', category: 'Kedi Bakımı' }
          ],
          shippingAddress: {
            id: '3', title: 'Ev', fullName: 'Mehmet Kaya', phone: '+90 555 111 2233',
            address: 'Beşiktaş Mahallesi, Deniz Sokak No:8', city: 'İstanbul', district: 'Beşiktaş',
            postalCode: '34353', isDefault: true
          }
        },
        {
          id: 'ORD004',
          date: '2024-01-18T09:20:00Z',
          status: 'confirmed',
          total: 125.50,
          items: [
            { id: 6, name: 'Kedi Oyuncağı', price: 25.50, quantity: 1, image: '🪀', category: 'Kedi Oyuncağı' },
            { id: 7, name: 'Pet Shampoo', price: 50.00, quantity: 2, image: '🧴', category: 'Bakım' }
          ],
          shippingAddress: {
            id: '4', title: 'Ev', fullName: 'Fatma Özkan', phone: '+90 555 444 5566',
            address: 'Üsküdar Mahallesi, Çamlık Sokak No:15', city: 'İstanbul', district: 'Üsküdar',
            postalCode: '34664', isDefault: true
          }
        },
        {
          id: 'ORD005',
          date: '2024-01-20T13:10:00Z',
          status: 'preparing',
          total: 299.99,
          items: [
            { id: 8, name: 'Premium Kedi Maması', price: 149.99, quantity: 2, image: '🐱', category: 'Kedi Maması' }
          ],
          shippingAddress: {
            id: '5', title: 'Ofis', fullName: 'Can Yıldız', phone: '+90 555 777 8899',
            address: 'Şişli Mahallesi, İş Merkezi No:25', city: 'İstanbul', district: 'Şişli',
            postalCode: '34381', isDefault: false
          }
        }
      ];
      setOrders(mockOrders);
    }
  }, [isAdmin]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getFilteredAndSortedOrders = () => {
    let filtered = orders;

    // Status filtresi
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.phone.includes(searchTerm)
      );
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setIsUpdating(false);
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

  // Loading durumunda
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Admin değilse boş döndür (redirect olacak)
  if (!isAdmin) {
    return null;
  }

  const filteredOrders = getFilteredAndSortedOrders();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🐾</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">PawStore Admin</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-500">
                <span>›</span>
                <span className="text-blue-600 font-medium">Sipariş Yönetimi</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                📊 Dashboard
              </a>
              <a href="/admin/products" className="text-gray-600 hover:text-gray-900">
                🛍️ Ürünler
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sipariş Yönetimi</h1>
          <p className="text-gray-600">Tüm siparişleri görüntüleyin ve yönetin</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">🎉</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Teslim Edildi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Toplam Ciro</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Arama
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Sipariş No, müşteri adı, telefon..."
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Bekliyor</option>
                <option value="confirmed">Onaylandı</option>
                <option value="preparing">Hazırlanıyor</option>
                <option value="shipped">Kargoda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                Sıralama
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'total')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="date">Tarihe Göre</option>
                <option value="total">Tutara Göre</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
                Sıra
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="desc">Yüksekten Düşüğe</option>
                <option value="asc">Düşükten Yükseğe</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sipariş
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-blue-600 text-sm font-bold">📦</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          <div className="text-sm text-gray-500">{order.items.length} ürün</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.shippingAddress.fullName}</div>
                      <div className="text-sm text-gray-500">{order.shippingAddress.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₺{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openOrderModal(order)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        👁️ Detay
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={isUpdating}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="pending">Bekliyor</option>
                        <option value="confirmed">Onaylandı</option>
                        <option value="preparing">Hazırlanıyor</option>
                        <option value="shipped">Kargoda</option>
                        <option value="delivered">Teslim Edildi</option>
                        <option value="cancelled">İptal Edildi</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sipariş Bulunamadı</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Filtrelere uygun sipariş bulunamadı. Farklı kriterler deneyin.'
                  : 'Henüz sipariş bulunmuyor.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
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
              {/* Order Info Grid */}
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
                        {new Date(selectedOrder.date).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
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
                      <span className="font-bold text-blue-600">₺{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">👤 Müşteri Bilgileri</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                    <p>📱 {selectedOrder.shippingAddress.phone}</p>
                    <p>📍 {selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.district} / {selectedOrder.shippingAddress.city}</p>
                    <p>📮 {selectedOrder.shippingAddress.postalCode}</p>
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
                          Kategori
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
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.category}
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
                        <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          Toplam Tutar:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-blue-600">
                          ₺{selectedOrder.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">📝 Durum Güncelle</h3>
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-blue-800">Yeni Durum:</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    disabled={isUpdating}
                    className="border border-blue-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="pending">⏳ Bekliyor</option>
                    <option value="confirmed">✅ Onaylandı</option>
                    <option value="preparing">📦 Hazırlanıyor</option>
                    <option value="shipped">🚚 Kargoda</option>
                    <option value="delivered">🎉 Teslim Edildi</option>
                    <option value="cancelled">❌ İptal Edildi</option>
                  </select>
                  {isUpdating && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  )}
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
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  📧 Müşteriyi Bilgilendir
                </button>
                <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  📄 Fatura Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}