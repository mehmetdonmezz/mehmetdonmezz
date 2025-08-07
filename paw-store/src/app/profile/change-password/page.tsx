'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function ChangePasswordPage() {
  const { user, isLoggedIn, isLoading, changePassword } = useUser();
  const { getTotalItems } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, isLoading, router]);

  // Şifre gücü hesaplama
  useEffect(() => {
    let strength = 0;
    if (formData.newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.newPassword)) strength += 1;
    if (/[a-z]/.test(formData.newPassword)) strength += 1;
    if (/[0-9]/.test(formData.newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.newPassword)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.newPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata ve başarı mesajlarını temizle
    if (error) setError('');
    if (success) setSuccess('');
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Form validasyonu
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      setIsSubmitting(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Yeni şifre çok zayıf. En az 8 karakter, büyük harf, küçük harf ve rakam içermelidir.');
      setIsSubmitting(false);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('Yeni şifre mevcut şifre ile aynı olamaz');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      if (result.success) {
        setSuccess('Şifreniz başarıyla değiştirildi! Güvenliğiniz için tekrar giriş yapmanız gerekiyor.');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Çok Zayıf', color: 'text-red-600' };
      case 2: return { text: 'Zayıf', color: 'text-orange-600' };
      case 3: return { text: 'Orta', color: 'text-yellow-600' };
      case 4: return { text: 'Güçlü', color: 'text-green-600' };
      case 5: return { text: 'Çok Güçlü', color: 'text-green-700' };
      default: return { text: '', color: '' };
    }
  };

  const getPasswordStrengthWidth = () => {
    return `${(passwordStrength / 5) * 100}%`;
  };

  // Loading durumunda
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
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

      {/* Change Password Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Ana Sayfa</a>
            <span>›</span>
            <a href="/profile" className="hover:text-blue-600">Profil</a>
            <span>›</span>
            <span className="text-orange-600 font-medium">Şifre Değiştir</span>
          </nav>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🔐</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Şifre Değiştir</h1>
                <p className="text-orange-100">Hesabınızı güvende tutun</p>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="px-8 py-6 bg-orange-50 border-b border-orange-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-orange-600 text-xl">🛡️</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-orange-900 mb-2">Güvenlik İpuçları</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Şifreniz en az 8 karakter olmalıdır</li>
                  <li>• Büyük harf, küçük harf, rakam ve özel karakter kullanın</li>
                  <li>• Kişisel bilgilerinizi şifrenizde kullanmayın</li>
                  <li>• Şifrenizi kimseyle paylaşmayın</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Mevcut Şifre *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">🔒</span>
                  </div>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Mevcut şifrenizi girin"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-sm">{showPasswords.current ? '🙈' : '👁️'}</span>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">🔑</span>
                  </div>
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Yeni şifrenizi girin"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-sm">{showPasswords.new ? '🙈' : '👁️'}</span>
                  </button>
                </div>
                
                {/* Password Strength */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Şifre Gücü:</span>
                      <span className={`text-xs font-medium ${getPasswordStrengthText().color}`}>
                        {getPasswordStrengthText().text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength <= 1 ? 'bg-red-500' :
                          passwordStrength === 2 ? 'bg-orange-500' :
                          passwordStrength === 3 ? 'bg-yellow-500' :
                          passwordStrength === 4 ? 'bg-green-500' :
                          'bg-green-600'
                        }`}
                        style={{ width: getPasswordStrengthWidth() }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Yeni Şifre Tekrarı *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm">🔑</span>
                  </div>
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    placeholder="Yeni şifrenizi tekrarlayın"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-sm">{showPasswords.confirm ? '🙈' : '👁️'}</span>
                  </button>
                </div>
                {formData.confirmPassword && formData.newPassword && formData.confirmPassword !== formData.newPassword && (
                  <p className="mt-1 text-xs text-red-600">Şifreler eşleşmiyor</p>
                )}
                {formData.confirmPassword && formData.newPassword && formData.confirmPassword === formData.newPassword && (
                  <p className="mt-1 text-xs text-green-600">✓ Şifreler eşleşiyor</p>
                )}
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
                  disabled={
                    isSubmitting || 
                    !formData.currentPassword || 
                    !formData.newPassword || 
                    !formData.confirmPassword ||
                    passwordStrength < 3 || 
                    formData.newPassword !== formData.confirmPassword ||
                    formData.currentPassword === formData.newPassword
                  }
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isSubmitting || 
                    !formData.currentPassword || 
                    !formData.newPassword || 
                    !formData.confirmPassword ||
                    passwordStrength < 3 || 
                    formData.newPassword !== formData.confirmPassword ||
                    formData.currentPassword === formData.newPassword
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Şifre değiştiriliyor...
                    </div>
                  ) : (
                    '🔐 Şifreyi Değiştir'
                  )}
                </button>
                <a
                  href="/profile"
                  className="flex-1 sm:flex-none px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors text-center"
                >
                  ↩️ İptal
                </a>
              </div>

              {/* Help Text */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  Şifrenizi mi unuttunuz?{' '}
                  <a href="/auth/forgot-password" className="text-orange-600 hover:text-orange-800 font-medium">
                    Şifre sıfırlama
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-xl mr-2">💡</span>
            Güvenlik Önerileri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Şifrenizi düzenli olarak değiştirin</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Her hesap için farklı şifre kullanın</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>İki faktörlü doğrulama açın</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Şüpheli aktiviteleri raporlayın</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}