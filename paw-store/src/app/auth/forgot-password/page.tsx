'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function ForgotPasswordPage() {
  const { isLoggedIn, isLoading, forgotPassword } = useUser();
  const { getTotalItems } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [countdown, setCountdown] = useState(0);

  // Giriş yapmışsa profil sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push('/profile');
    }
  }, [isLoggedIn, isLoading, router]);

  // Geri sayım timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Şifre gücü hesaplama
  useEffect(() => {
    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[a-z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    setPasswordStrength(strength);
  }, [newPassword]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess('Doğrulama kodu email adresinize gönderildi!');
        setStep('code');
        setCountdown(300); // 5 dakika
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Demo için basit kod kontrolü (gerçek projede backend'den doğrulanır)
    if (verificationCode === '123456') {
      setSuccess('Doğrulama kodu onaylandı! Yeni şifrenizi belirleyin.');
      setStep('newPassword');
    } else {
      setError('Doğrulama kodu hatalı. Lütfen tekrar deneyin.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    // Form validasyonu
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setIsSubmitting(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Şifre çok zayıf. En az 8 karakter, büyük harf, küçük harf ve rakam içermelidir.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Demo için başarılı kabul et (gerçek projede backend ile şifre güncellenir)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Şifreniz başarıyla değiştirildi! Giriş sayfasına yönlendiriliyorsunuz...');
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;
    
    setIsSubmitting(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSuccess('Yeni doğrulama kodu gönderildi!');
        setCountdown(300);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Kod gönderilirken hata oluştu.');
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading durumunda
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
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

      {/* Forgot Password Form */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center space-x-2 ${step === 'email' ? 'text-red-600' : step === 'code' || step === 'newPassword' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'email' ? 'bg-red-600 text-white' : step === 'code' || step === 'newPassword' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  1
                </div>
                <span className="text-sm font-medium">Email</span>
              </div>
              <div className={`w-8 h-0.5 ${step === 'code' || step === 'newPassword' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-2 ${step === 'code' ? 'text-red-600' : step === 'newPassword' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'code' ? 'bg-red-600 text-white' : step === 'newPassword' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <span className="text-sm font-medium">Kod</span>
              </div>
              <div className={`w-8 h-0.5 ${step === 'newPassword' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center space-x-2 ${step === 'newPassword' ? 'text-red-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'newPassword' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  3
                </div>
                <span className="text-sm font-medium">Şifre</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">🔒</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {step === 'email' && 'Şifre Sıfırlama'}
                  {step === 'code' && 'Doğrulama Kodu'}
                  {step === 'newPassword' && 'Yeni Şifre'}
                </h2>
                <p className="text-red-100">
                  {step === 'email' && 'Email adresinizi girin'}
                  {step === 'code' && 'Gelen kodu girin'}
                  {step === 'newPassword' && 'Güvenli şifre belirleyin'}
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-8 py-8">
              {/* Step 1: Email */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                        placeholder="ornek@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Demo Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                      <span className="text-blue-400 mr-2">💡</span>
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Demo Bilgi:</p>
                        <p>Herhangi bir email adresi girebilirsiniz. Doğrulama kodu: <code className="bg-blue-100 px-1 rounded">123456</code></p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isSubmitting || !email
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Kod gönderiliyor...
                      </div>
                    ) : (
                      '📤 Doğrulama Kodu Gönder'
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Verification Code */}
              {step === 'code' && (
                <form onSubmit={handleCodeSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                      Doğrulama Kodu *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">🔢</span>
                      </div>
                      <input
                        type="text"
                        id="code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors text-center text-2xl font-mono tracking-widest"
                        placeholder="123456"
                        maxLength={6}
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      <strong>{email}</strong> adresine gönderilen 6 haneli kodu girin
                    </p>
                  </div>

                  {/* Timer */}
                  {countdown > 0 && (
                    <div className="text-center">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <span className="text-orange-600 text-sm">
                          ⏱️ Yeni kod gönderebilmeniz için: {formatTime(countdown)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={verificationCode.length !== 6}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        verificationCode.length !== 6
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
                      }`}
                    >
                      ✅ Kodu Doğrula
                    </button>
                    <button
                      type="button"
                      onClick={resendCode}
                      disabled={countdown > 0 || isSubmitting}
                      className={`flex-1 sm:flex-none px-6 py-3 border-2 rounded-lg font-semibold transition-colors ${
                        countdown > 0 || isSubmitting
                          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                          : 'border-red-600 text-red-600 hover:bg-red-50'
                      }`}
                    >
                      🔄 Tekrar Gönder
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 'newPassword' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
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
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                        placeholder="Yeni şifrenizi girin"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <span className="text-sm">{showPasswords.new ? '🙈' : '👁️'}</span>
                      </button>
                    </div>
                    
                    {/* Password Strength */}
                    {newPassword && (
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

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre Tekrarı *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-sm">🔑</span>
                      </div>
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                        placeholder="Şifrenizi tekrarlayın"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <span className="text-sm">{showPasswords.confirm ? '🙈' : '👁️'}</span>
                      </button>
                    </div>
                    {confirmPassword && newPassword && confirmPassword !== newPassword && (
                      <p className="mt-1 text-xs text-red-600">Şifreler eşleşmiyor</p>
                    )}
                    {confirmPassword && newPassword && confirmPassword === newPassword && (
                      <p className="mt-1 text-xs text-green-600">✓ Şifreler eşleşiyor</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || 
                      !newPassword || 
                      !confirmPassword ||
                      passwordStrength < 3 || 
                      newPassword !== confirmPassword
                    }
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                      isSubmitting || 
                      !newPassword || 
                      !confirmPassword ||
                      passwordStrength < 3 || 
                      newPassword !== confirmPassword
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5'
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
                </form>
              )}

              {/* Success/Error Messages */}
              {success && (
                <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <div className="flex">
                    <span className="text-green-400 mr-2">✅</span>
                    <span className="text-sm font-medium">{success}</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <div className="flex">
                    <span className="text-red-400 mr-2">⚠️</span>
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Back to Login */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Şifrenizi hatırladınız mı?{' '}
                  <a 
                    href="/auth/login" 
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Giriş yapın
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}