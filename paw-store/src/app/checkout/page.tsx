'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { user, isLoggedIn, isLoading } = useUser();
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, isLoading, router]);

  // Sepet boşsa products sayfasına yönlendir
  useEffect(() => {
    if (items.length === 0) {
      router.push('/products');
    }
  }, [items, router]);

  // Varsayılan adres seç
  useEffect(() => {
    if (user?.addresses) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (user.addresses.length > 0) {
        setSelectedAddress(user.addresses[0].id);
      }
    }
  }, [user]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvc') {
      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 3);
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const validateStep = () => {
    if (step === 'shipping') {
      return selectedAddress !== '';
    } else if (step === 'payment') {
      if (paymentMethod === 'card') {
        return cardData.number.replace(/\s/g, '').length === 16 &&
               cardData.expiry.length === 5 &&
               cardData.cvc.length === 3 &&
               cardData.name.length > 0;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 'shipping') {
      setStep('payment');
    } else if (step === 'payment') {
      setStep('review');
    }
  };

  const prevStep = () => {
    if (step === 'payment') {
      setStep('shipping');
    } else if (step === 'review') {
      setStep('payment');
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    setError('');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Demo: 90% success rate
      const success = Math.random() > 0.1;
      
      if (success) {
        setSuccess('Ödeme başarılı! Siparişiniz alındı.');
        clearCart();
        
        setTimeout(() => {
          router.push('/profile/orders');
        }, 2000);
      } else {
        throw new Error('Ödeme işlemi başarısız. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ödeme işlemi sırasında bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getSelectedAddress = () => {
    return user?.addresses?.find(addr => addr.id === selectedAddress);
  };

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    if (num.startsWith('3')) return 'amex';
    return 'unknown';
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

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

  // Giriş yapmamışsa veya sepet boşsa boş döndür (redirect olacak)
  if (!isLoggedIn || items.length === 0) {
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
              <span className="text-sm text-gray-600">Güvenli Ödeme</span>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-green-600' : step === 'payment' || step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step === 'shipping' ? 'bg-green-600 text-white' : step === 'payment' || step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                ✓
              </div>
              <span className="font-medium">Teslimat</span>
            </div>
            <div className={`w-16 h-1 ${step === 'payment' || step === 'review' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center space-x-2 ${step === 'payment' ? 'text-green-600' : step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step === 'payment' ? 'bg-green-600 text-white' : step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step === 'review' ? '✓' : '2'}
              </div>
              <span className="font-medium">Ödeme</span>
            </div>
            <div className={`w-16 h-1 ${step === 'review' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center space-x-2 ${step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
              <span className="font-medium">Onay</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Step 1: Shipping */}
              {step === 'shipping' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📍 Teslimat Adresi</h2>
                  
                  {user?.addresses && user.addresses.length > 0 ? (
                    <div className="space-y-4">
                      {user.addresses.map((address) => (
                        <div key={address.id} className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${selectedAddress === address.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                          <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="address"
                              value={address.id}
                              checked={selectedAddress === address.id}
                              onChange={(e) => setSelectedAddress(e.target.value)}
                              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{address.title}</h3>
                                {address.isDefault && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                    Varsayılan
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">
                                <strong>{address.fullName}</strong><br />
                                {address.address}<br />
                                {address.district} / {address.city} {address.postalCode}<br />
                                📱 {address.phone}
                              </p>
                            </div>
                          </label>
                        </div>
                      ))}
                      
                      <div className="text-center pt-4">
                        <a href="/profile/addresses" className="text-green-600 hover:text-green-800 font-medium">
                          ➕ Yeni adres ekle
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-gray-400">📍</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Adres Bulunamadı</h3>
                      <p className="text-gray-600 mb-4">Sipariş verebilmek için adres eklemeniz gerekiyor.</p>
                      <a href="/profile/addresses" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                        Adres Ekle
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 'payment' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">💳 Ödeme Yöntemi</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank')}
                          className="h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">💳 Kredi/Banka Kartı</h3>
                          <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                        </div>
                      </label>
                    </div>
                    
                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'bank' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={paymentMethod === 'bank'}
                          onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank')}
                          className="h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">🏦 Banka Havalesi</h3>
                          <p className="text-sm text-gray-600">Havale/EFT ile ödeme</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Numarası *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={(e) => handleCardInputChange('number', e.target.value)}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors font-mono text-lg"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <span className="text-xl">{getCardIcon(getCardType(cardData.number))}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Son Kullanma *
                          </label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors font-mono text-lg"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC *
                          </label>
                          <input
                            type="text"
                            value={cardData.cvc}
                            onChange={(e) => handleCardInputChange('cvc', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors font-mono text-lg"
                            placeholder="123"
                            maxLength={3}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Üzerindeki İsim *
                        </label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => handleCardInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                          placeholder="JOHN DOE"
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>

                      {/* Demo Card Info */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                          <span className="text-blue-400 mr-2">💡</span>
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">Demo Kart Bilgileri:</p>
                            <p>Kart: 4242 4242 4242 4242 | Tarih: 12/28 | CVC: 123</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Info */}
                  {paymentMethod === 'bank' && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">🏦 Banka Bilgileri</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Banka:</strong> Garanti BBVA</p>
                        <p><strong>Hesap Sahibi:</strong> PawStore Ltd. Şti.</p>
                        <p><strong>IBAN:</strong> TR12 0006 2000 1234 0006 7890 12</p>
                        <p><strong>Açıklama:</strong> Sipariş No: #PAW{Date.now()}</p>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 text-sm">
                          ⚠️ Havale açıklama kısmına mutlaka sipariş numaranızı yazınız.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review */}
              {step === 'review' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">✅ Sipariş Özeti</h2>
                  
                  {/* Address Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">📍 Teslimat Adresi</h3>
                    {getSelectedAddress() && (
                      <div className="text-sm text-gray-600">
                        <p><strong>{getSelectedAddress()?.fullName}</strong></p>
                        <p>{getSelectedAddress()?.address}</p>
                        <p>{getSelectedAddress()?.district} / {getSelectedAddress()?.city}</p>
                        <p>📱 {getSelectedAddress()?.phone}</p>
                      </div>
                    )}
                  </div>

                  {/* Payment Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">💳 Ödeme Yöntemi</h3>
                    <div className="text-sm text-gray-600">
                      {paymentMethod === 'card' ? (
                        <p>Kredi Kartı (**{cardData.number.slice(-4)})</p>
                      ) : (
                        <p>Banka Havalesi</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">🛒 Sipariş İçeriği</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{item.image}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₺{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={step === 'shipping'}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    step === 'shipping'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  ← Geri
                </button>

                {step !== 'review' ? (
                  <button
                    onClick={nextStep}
                    disabled={!validateStep()}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      !validateStep()
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    İleri →
                  </button>
                ) : (
                  <button
                    onClick={processPayment}
                    disabled={isProcessing}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      isProcessing
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Ödeme İşleniyor...
                      </div>
                    ) : (
                      '💳 Ödemeyi Tamamla'
                    )}
                  </button>
                )}
              </div>

              {/* Messages */}
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
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Sipariş Özeti</h3>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="font-medium">₺{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span className="font-medium">₺{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo</span>
                  <span className="font-medium text-green-600">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Toplam</span>
                  <span className="text-green-600">₺{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <span>🔒</span>
                  <span className="text-sm font-medium">256-bit SSL ile güvende</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}