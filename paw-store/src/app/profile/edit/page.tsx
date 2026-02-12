'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function EditProfilePage() {
  const { user, isLoggedIn, isLoading, updateProfile } = useUser();
  const { getTotalItems } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, isLoading, router]);

  // Form verilerini user bilgileriyle doldur
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
    // Hata ve başarı mesajlarını temizle
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccess('Profil bilgileriniz başarıyla güncellendi!');
        setIsDirty(false);
        // 2 saniye sonra profil sayfasına yönlendir
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmCancel = confirm('Yaptığınız değişiklikler kaydedilmedi. Çıkmak istediğinizden emin misiniz?');
      if (!confirmCancel) return;
    }
    router.push('/profile');
  };

  // Loading durumunda
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
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

      {/* Edit Profile Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Ana Sayfa</a>
            <span>›</span>
            <a href="/profile" className="hover:text-blue-600">Profil</a>
            <span>›</span>
            <span className="text-blue-600 font-medium">Profil Düzenle</span>
          </nav>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">✏️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Profil Düzenle</h1>
                <p className="text-blue-100">Bilgilerinizi güncelleyin</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Adınız"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Soyadınız"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Adresi *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">📧</span>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  ⚠️ Email adresinizi değiştirmek için müşteri hizmetleri ile iletişime geçin.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">İletişim Bilgileri</h3>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">📱</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="+90 555 123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Kişisel Bilgiler</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Doğum Tarihi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">🎂</span>
                      </div>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                      Cinsiyet
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">👤</span>
                      </div>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none"
                      >
                        <option value="">Seçiniz</option>
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                        <option value="other">Diğer</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-400 text-sm">▼</span>
                      </div>
                    </div>
                  </div>
                </div>
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
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting || !isDirty
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Kaydediliyor...
                    </div>
                  ) : (
                    '💾 Değişiklikleri Kaydet'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  ↩️ İptal
                </button>
              </div>

              {/* Help Text */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Yardıma mı ihtiyacınız var?{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                    Müşteri hizmetleri ile iletişime geçin
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <a 
            href="/profile/orders" 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <span className="text-purple-600 text-xl">📦</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Siparişlerim</h3>
                <p className="text-sm text-gray-600">Sipariş geçmişinizi görüntüleyin</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}