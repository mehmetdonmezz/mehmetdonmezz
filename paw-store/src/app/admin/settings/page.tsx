'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  paymentSettings: {
    stripeEnabled: boolean;
    stripePublicKey: string;
    bankTransferEnabled: boolean;
    bankDetails: string;
  };
  shippingSettings: {
    freeShippingLimit: number;
    shippingCost: number;
    estimatedDelivery: string;
  };
}

export default function AdminSettingsPage() {
  const { isAdmin, isLoading: adminLoading, logout } = useAdmin();
  const router = useRouter();
  
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'PawStore',
    siteDescription: 'En kaliteli pet shop ürünleri',
    contactEmail: 'info@pawstore.com',
    contactPhone: '+90 555 123 4567',
    address: 'İstanbul, Türkiye',
    socialMedia: {
      facebook: 'https://facebook.com/pawstore',
      instagram: 'https://instagram.com/pawstore',
      twitter: 'https://twitter.com/pawstore'
    },
    seoSettings: {
      metaTitle: 'PawStore - Pet Shop Online Mağaza',
      metaDescription: 'Köpek, kedi ve diğer evcil hayvanlar için kaliteli ürünler. Hızlı teslimat, güvenli ödeme.',
      metaKeywords: 'pet shop, köpek maması, kedi maması, pet ürünleri, evcil hayvan'
    },
    paymentSettings: {
      stripeEnabled: true,
      stripePublicKey: 'pk_test_...',
      bankTransferEnabled: true,
      bankDetails: 'Ziraat Bankası\nIBAN: TR00 0001 0000 0000 0000 0000 00\nPawStore Ltd. Şti.'
    },
    shippingSettings: {
      freeShippingLimit: 200,
      shippingCost: 15.99,
      estimatedDelivery: '1-3 iş günü'
    }
  });

  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'payment' | 'shipping'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Admin kontrolü
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, adminLoading, router]);

  // Ayarları localStorage'dan yükle
  useEffect(() => {
    if (isAdmin) {
      const savedSettings = localStorage.getItem('siteSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, [isAdmin]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // localStorage'a kaydet
      localStorage.setItem('siteSettings', JSON.stringify(settings));
      
      setSaveMessage('Ayarlar başarıyla kaydedildi! ✅');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveMessage('Kaydetme sırasında hata oluştu! ❌');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0] as keyof SiteSettings],
            [keys[1]]: value
          }
        };
      }
    });
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
                <span className="text-blue-600 font-medium">Ayarlar</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                📊 Dashboard
              </a>
              <a href="/admin/products" className="text-gray-600 hover:text-gray-900">
                🛍️ Ürünler
              </a>
              <a href="/admin/orders" className="text-gray-600 hover:text-gray-900">
                📦 Siparişler
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Ayarları</h1>
          <p className="text-gray-600">Web sitenizin genel ayarlarını yönetin</p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${saveMessage.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'general' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🏢 Genel Bilgiler
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'seo' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🔍 SEO Ayarları
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'payment' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                💳 Ödeme Ayarları
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'shipping' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🚚 Kargo Ayarları
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">🏢 Genel Bilgiler</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Adı
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleInputChange('siteName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İletişim E-postası
                      </label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İletişim Telefonu
                      </label>
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adres
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Açıklaması
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">📱 Sosyal Medya</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook
                        </label>
                        <input
                          type="url"
                          value={settings.socialMedia.facebook}
                          onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram
                        </label>
                        <input
                          type="url"
                          value={settings.socialMedia.instagram}
                          onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter
                        </label>
                        <input
                          type="url"
                          value={settings.socialMedia.twitter}
                          onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Settings */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 SEO Ayarları</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Başlık
                    </label>
                    <input
                      type="text"
                      value={settings.seoSettings.metaTitle}
                      onChange={(e) => handleInputChange('seoSettings.metaTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {settings.seoSettings.metaTitle.length}/60 karakter
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Açıklama
                    </label>
                    <textarea
                      value={settings.seoSettings.metaDescription}
                      onChange={(e) => handleInputChange('seoSettings.metaDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {settings.seoSettings.metaDescription.length}/160 karakter
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anahtar Kelimeler
                    </label>
                    <input
                      type="text"
                      value={settings.seoSettings.metaKeywords}
                      onChange={(e) => handleInputChange('seoSettings.metaKeywords', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="virgülle ayırın"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Anahtar kelimeleri virgül ile ayırın
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">💳 Ödeme Ayarları</h2>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Stripe Ödeme</h3>
                        <p className="text-sm text-gray-600">Kredi kartı ödemeleri için</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.paymentSettings.stripeEnabled}
                          onChange={(e) => handleInputChange('paymentSettings.stripeEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {settings.paymentSettings.stripeEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stripe Public Key
                        </label>
                        <input
                          type="text"
                          value={settings.paymentSettings.stripePublicKey}
                          onChange={(e) => handleInputChange('paymentSettings.stripePublicKey', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="pk_test_..."
                        />
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Banka Havalesi</h3>
                        <p className="text-sm text-gray-600">EFT/Havale ile ödeme</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.paymentSettings.bankTransferEnabled}
                          onChange={(e) => handleInputChange('paymentSettings.bankTransferEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {settings.paymentSettings.bankTransferEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banka Bilgileri
                        </label>
                        <textarea
                          value={settings.paymentSettings.bankDetails}
                          onChange={(e) => handleInputChange('paymentSettings.bankDetails', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="Banka adı, IBAN, hesap sahibi..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Settings */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">🚚 Kargo Ayarları</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ücretsiz Kargo Limiti (₺)
                      </label>
                      <input
                        type="number"
                        value={settings.shippingSettings.freeShippingLimit}
                        onChange={(e) => handleInputChange('shippingSettings.freeShippingLimit', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kargo Ücreti (₺)
                      </label>
                      <input
                        type="number"
                        value={settings.shippingSettings.shippingCost}
                        onChange={(e) => handleInputChange('shippingSettings.shippingCost', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahmini Teslimat Süresi
                    </label>
                    <input
                      type="text"
                      value={settings.shippingSettings.estimatedDelivery}
                      onChange={(e) => handleInputChange('shippingSettings.estimatedDelivery', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="örn: 1-3 iş günü"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Bilgi</h3>
                    <p className="text-sm text-blue-800">
                      {settings.shippingSettings.freeShippingLimit}₺ ve üzeri siparişlerde kargo ücretsiz olacak. 
                      Altındaki siparişler için {settings.shippingSettings.shippingCost}₺ kargo ücreti alınacak.
                    </p>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="border-t pt-6 mt-8">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>Ayarları Kaydet</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}