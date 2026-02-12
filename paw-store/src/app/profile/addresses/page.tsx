'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, Address } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function AddressesPage() {
  const { user, isLoggedIn, isLoading, addAddress, updateAddress, deleteAddress } = useUser();
  const { getTotalItems } = useCart();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    isDefault: false
  });

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, isLoading, router]);

  const resetForm = () => {
    setFormData({
      title: '',
      fullName: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      postalCode: '',
      isDefault: false
    });
    setEditingAddress(null);
    setError('');
    setSuccess('');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setFormData({
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode,
      isDefault: address.isDefault
    });
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      let result;
      if (editingAddress) {
        result = await updateAddress(editingAddress.id, formData);
      } else {
        result = await addAddress(formData);
      }

      if (result.success) {
        setSuccess(editingAddress ? 'Adres başarıyla güncellendi!' : 'Adres başarıyla eklendi!');
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    const confirmDelete = confirm('Bu adresi silmek istediğinizden emin misiniz?');
    if (!confirmDelete) return;

    try {
      const result = await deleteAddress(addressId);
      if (result.success) {
        setSuccess('Adres başarıyla silindi!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message);
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Adres silinirken bir hata oluştu.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Türkiye şehirleri (bazı örnekler)
  const cities = [
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Şanlıurfa', 
    'Gaziantep', 'Kocaeli', 'Mersin', 'Diyarbakır', 'Hatay', 'Manisa', 'Kayseri'
  ];

  // Loading durumunda
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapmamışsa boş döndür (redirect olacak)
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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

      {/* Addresses Management */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Ana Sayfa</a>
            <span>›</span>
            <a href="/profile" className="hover:text-blue-600">Profil</a>
            <span>›</span>
            <span className="text-green-600 font-medium">Adres Yönetimi</span>
          </nav>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Adres Yönetimi</h1>
            <p className="text-gray-600">Teslimat adreslerinizi yönetin</p>
          </div>
          <button
            onClick={openAddModal}
            className="mt-4 sm:mt-0 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Yeni Adres Ekle</span>
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <span className="text-green-400 mr-2">✅</span>
              <span className="text-sm font-medium">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <span className="text-red-400 mr-2">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Addresses Grid */}
        {user?.addresses && user.addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-green-300 transition-colors relative">
                {address.isDefault && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    ⭐ Varsayılan
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 text-xl">📍</span>
                      <h3 className="font-semibold text-gray-900">{address.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p className="font-medium text-gray-900">{address.fullName}</p>
                    <p>📱 {address.phone}</p>
                    <p className="leading-relaxed">{address.address}</p>
                    <p>{address.district} / {address.city}</p>
                    <p>📮 {address.postalCode}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(address)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-400">📍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz adres eklememişsiniz</h3>
            <p className="text-gray-600 mb-6">Hızlı teslimat için adres ekleyin</p>
            <button
              onClick={openAddModal}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              ➕ İlk Adresimi Ekle
            </button>
          </div>
        )}
      </div>

      {/* Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingAddress ? 'Adres Düzenle' : 'Yeni Adres Ekle'}
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Address Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Adres Başlığı *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    placeholder="Ev, İş, vb."
                    required
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      placeholder="Adınız Soyadınız"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      placeholder="+90 555 123 4567"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Adres *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors resize-none"
                    placeholder="Mahalle, sokak, kapı no, daire no..."
                    required
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Şehir *
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      required
                    >
                      <option value="">Şehir seçin</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                      İlçe *
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      placeholder="İlçe"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Posta Kodu *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                      placeholder="34000"
                      required
                    />
                  </div>
                </div>

                {/* Default Address */}
                <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="text-sm font-medium text-gray-900">
                    Bu adresi varsayılan adres olarak ayarla
                  </label>
                </div>

                {/* Success/Error Messages */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    <div className="flex">
                      <span className="text-green-400 mr-2">✅</span>
                      <span className="text-sm font-medium">{success}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex">
                      <span className="text-red-400 mr-2">⚠️</span>
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isSubmitting
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        {editingAddress ? 'Güncelleniyor...' : 'Ekleniyor...'}
                      </div>
                    ) : (
                      editingAddress ? '💾 Adresi Güncelle' : '➕ Adresi Ekle'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    ↩️ İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}