'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoggedIn, isLoading: userLoading } = useUser();
  const { getTotalItems } = useCart();
  const router = useRouter();

  // Zaten giriş yapmışsa yönlendir
  useEffect(() => {
    if (!userLoading && isLoggedIn) {
      router.push('/profile');
    }
  }, [isLoggedIn, userLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Başarılı giriş sonrası yönlendirme
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/profile';
        router.push(redirectTo);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Hata mesajını temizle
    if (error) setError('');
  };

  // Loading durumunda
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
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
              <a href="/cart" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sepet ({getTotalItems()})
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 py-12">
              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl font-bold">👤</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Hoş Geldiniz!</h2>
                <p className="text-gray-600">Hesabınıza giriş yapın</p>
              </div>

              {/* Demo Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm font-medium mb-2">📧 Demo Giriş Bilgileri:</p>
                <p className="text-blue-700 text-sm">Email: test@example.com</p>
                <p className="text-blue-700 text-sm">Şifre: Test123!</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Adresi
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
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">🔒</span>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Şifrenizi giriniz"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <span className="text-sm">{showPassword ? '🙈' : '👁️'}</span>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                      Beni hatırla
                    </label>
                  </div>
                  <a 
                    href="/auth/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Şifremi unuttum
                  </a>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex">
                      <span className="text-red-400 mr-2">⚠️</span>
                      <span className="text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                    isLoading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Giriş yapılıyor...
                    </div>
                  ) : (
                    'Giriş Yap'
                  )}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Hesabınız yok mu?{' '}
                  <a 
                    href="/auth/register" 
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Kayıt olun
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Giriş yaparak{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800">Kullanım Şartları</a>
              {' '}ve{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800">Gizlilik Politikası</a>
              'nı kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}