'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Kullanıcı tipi
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  createdAt: string;
  addresses: Address[];
  orders: Order[];
}

// Adres tipi
export interface Address {
  id: number;
  title: string; // Ev, İş, vs.
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

// Sipariş tipi (basit)
export interface Order {
  id: number;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

// Auth Context tipi
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, message: string}>;
  register: (userData: RegisterData) => Promise<{success: boolean, message: string}>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<{success: boolean, message: string}>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{success: boolean, message: string}>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<{success: boolean, message: string}>;
  updateAddress: (id: number, address: Omit<Address, 'id'>) => Promise<{success: boolean, message: string}>;
  deleteAddress: (id: number) => Promise<{success: boolean, message: string}>;
  forgotPassword: (email: string) => Promise<{success: boolean, message: string}>;
  createOrder: (orderData: {items: any[], shippingAddress: Address, paymentMethod: string, total: number}) => Promise<{success: boolean, message: string, orderId?: string}>;
}

// Kayıt verisi tipi
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
}

// Context oluştur
const UserContext = createContext<UserContextType | undefined>(undefined);

// Sahte kullanıcı verisi (gerçek projede API'den gelir)
const mockUsers: Array<User & {password: string}> = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'Test123!',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    phone: '+90 555 123 4567',
    birthDate: '1990-01-15',
    gender: 'male',
    createdAt: '2024-01-01T00:00:00Z',
    addresses: [
      {
        id: 1,
        title: 'Ev',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        address: 'Atatürk Cad. No: 123 Daire: 5',
        city: 'İstanbul',
        district: 'Kadıköy',
        postalCode: '34000',
        phone: '+90 555 123 4567',
        isDefault: true
      }
    ],
    orders: [
      {
        id: 'ORD001',
        date: '2024-01-05T14:30:00Z',
        status: 'delivered',
        total: 284.97,
        items: [
          {
            id: 1,
            name: 'Royal Canin Köpek Maması',
            price: 199.99,
            quantity: 1,
            image: '🐕',
            category: 'Köpek Maması'
          },
          {
            id: 3,
            name: 'Kong Köpek Oyuncağı',
            price: 45.00,
            quantity: 1,
            image: '🎾',
            category: 'Köpek Oyuncağı'
          },
          {
            id: 5,
            name: 'Köpek Tasması',
            price: 39.98,
            quantity: 1,
            image: '🎀',
            category: 'Köpek Aksesuarı'
          }
        ],
        shippingAddress: {
          id: '1',
          title: 'Ev',
          fullName: 'Ahmet Yılmaz',
          phone: '+90 555 123 4567',
          address: 'Ataşehir Mahallesi, Test Sokak No:5 Daire:3',
          city: 'İstanbul',
          district: 'Ataşehir',
          postalCode: '34750',
          isDefault: true
        }
      },
      {
        id: 'ORD002',
        date: '2024-01-10T10:15:00Z',
        status: 'shipped',
        total: 89.99,
        items: [
          {
            id: 2,
            name: 'Whiskas Kedi Maması',
            price: 89.99,
            quantity: 1,
            image: '🐱',
            category: 'Kedi Maması'
          }
        ],
        shippingAddress: {
          id: '1',
          title: 'Ev',
          fullName: 'Ahmet Yılmaz',
          phone: '+90 555 123 4567',
          address: 'Ataşehir Mahallesi, Test Sokak No:5 Daire:3',
          city: 'İstanbul',
          district: 'Ataşehir',
          postalCode: '34750',
          isDefault: true
        }
      },
      {
        id: 'ORD003',
        date: '2024-01-15T16:45:00Z',
        status: 'pending',
        total: 159.98,
        items: [
          {
            id: 4,
            name: 'Kedi Kumu',
            price: 79.99,
            quantity: 2,
            image: '🏺',
            category: 'Kedi Bakımı'
          }
        ],
        shippingAddress: {
          id: '1',
          title: 'Ev',
          fullName: 'Ahmet Yılmaz',
          phone: '+90 555 123 4567',
          address: 'Ataşehir Mahallesi, Test Sokak No:5 Daire:3',
          city: 'İstanbul',
          district: 'Ataşehir',
          postalCode: '34750',
          isDefault: true
        }
      }
    ]
  }
];

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // LocalStorage'dan kullanıcı durumunu yükle
  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem('paw-store-user-id');
      if (savedUserId) {
        // Gerçek projede API'den kullanıcı bilgilerini çekerdik
        const foundUser = mockUsers.find(u => u.id === parseInt(savedUserId));
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
        }
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // LocalStorage'a kullanıcı ID'si kaydet
  useEffect(() => {
    if (user) {
      localStorage.setItem('paw-store-user-id', user.id.toString());
    } else {
      localStorage.removeItem('paw-store-user-id');
    }
  }, [user]);

  // Email validasyonu
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Şifre validasyonu
  const validatePassword = (password: string): {valid: boolean, message: string} => {
    if (password.length < 8) {
      return {valid: false, message: 'Şifre en az 8 karakter olmalıdır'};
    }
    if (!/[A-Z]/.test(password)) {
      return {valid: false, message: 'Şifre en az bir büyük harf içermelidir'};
    }
    if (!/[a-z]/.test(password)) {
      return {valid: false, message: 'Şifre en az bir küçük harf içermelidir'};
    }
    if (!/[0-9]/.test(password)) {
      return {valid: false, message: 'Şifre en az bir rakam içermelidir'};
    }
    return {valid: true, message: 'Şifre geçerli'};
  };

  // Giriş fonksiyonu
  const login = async (email: string, password: string): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!validateEmail(email)) {
          resolve({success: false, message: 'Geçerli bir email adresi giriniz'});
          return;
        }

        const foundUser = mockUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          resolve({success: true, message: 'Giriş başarılı'});
        } else {
          resolve({success: false, message: 'Email veya şifre hatalı'});
        }
      }, 1000); // 1 saniye simülasyon
    });
  };

  // Kayıt fonksiyonu
  const register = async (userData: RegisterData): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Email validasyonu
        if (!validateEmail(userData.email)) {
          resolve({success: false, message: 'Geçerli bir email adresi giriniz'});
          return;
        }

        // Şifre validasyonu
        const passwordCheck = validatePassword(userData.password);
        if (!passwordCheck.valid) {
          resolve({success: false, message: passwordCheck.message});
          return;
        }

        // Email zaten kayıtlı mı?
        const existingUser = mockUsers.find(u => u.email === userData.email);
        if (existingUser) {
          resolve({success: false, message: 'Bu email adresi zaten kayıtlı'});
          return;
        }

        // Yeni kullanıcı oluştur
        const newUser: User & {password: string} = {
          id: Math.max(...mockUsers.map(u => u.id), 0) + 1,
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          birthDate: userData.birthDate,
          gender: userData.gender,
          createdAt: new Date().toISOString(),
          addresses: [],
          orders: []
        };

        mockUsers.push(newUser);
        
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        
        resolve({success: true, message: 'Kayıt başarılı! Hoş geldiniz!'});
      }, 1500); // 1.5 saniye simülasyon
    });
  };

  // Çıkış fonksiyonu
  const logout = () => {
    setUser(null);
  };

  // Profil güncelleme
  const updateProfile = async (userData: Partial<User>): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!user) {
          resolve({success: false, message: 'Kullanıcı bulunamadı'});
          return;
        }

        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        
        // Mock users array'i de güncelle
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
        }

        resolve({success: true, message: 'Profil başarıyla güncellendi'});
      }, 1000);
    });
  };

  // Şifre değiştirme
  const changePassword = async (currentPassword: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!user) {
          resolve({success: false, message: 'Kullanıcı bulunamadı'});
          return;
        }

        const userWithPassword = mockUsers.find(u => u.id === user.id);
        if (!userWithPassword || userWithPassword.password !== currentPassword) {
          resolve({success: false, message: 'Mevcut şifre hatalı'});
          return;
        }

        const passwordCheck = validatePassword(newPassword);
        if (!passwordCheck.valid) {
          resolve({success: false, message: passwordCheck.message});
          return;
        }

        userWithPassword.password = newPassword;
        resolve({success: true, message: 'Şifre başarıyla değiştirildi'});
      }, 1000);
    });
  };

  // Adres ekleme
  const addAddress = async (addressData: Omit<Address, 'id'>): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!user) {
          resolve({success: false, message: 'Kullanıcı bulunamadı'});
          return;
        }

        const newAddress: Address = {
          ...addressData,
          id: Math.max(...user.addresses.map(a => a.id), 0) + 1
        };

        const updatedUser = {
          ...user,
          addresses: [...user.addresses, newAddress]
        };

        setUser(updatedUser);
        resolve({success: true, message: 'Adres başarıyla eklendi'});
      }, 800);
    });
  };

  // Adres güncelleme
  const updateAddress = async (id: number, addressData: Omit<Address, 'id'>): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!user) {
          resolve({success: false, message: 'Kullanıcı bulunamadı'});
          return;
        }

        const updatedAddresses = user.addresses.map(addr => 
          addr.id === id ? { ...addressData, id } : addr
        );

        const updatedUser = {
          ...user,
          addresses: updatedAddresses
        };

        setUser(updatedUser);
        resolve({success: true, message: 'Adres başarıyla güncellendi'});
      }, 800);
    });
  };

  // Adres silme
  const deleteAddress = async (id: number): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!user) {
          resolve({success: false, message: 'Kullanıcı bulunamadı'});
          return;
        }

        const updatedAddresses = user.addresses.filter(addr => addr.id !== id);
        const updatedUser = {
          ...user,
          addresses: updatedAddresses
        };

        setUser(updatedUser);
        resolve({success: true, message: 'Adres başarıyla silindi'});
      }, 500);
    });
  };

  // Şifremi unuttum
  const forgotPassword = async (email: string): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!validateEmail(email)) {
          resolve({success: false, message: 'Geçerli bir email adresi giriniz'});
          return;
        }

        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser) {
          resolve({success: true, message: 'Şifre sıfırlama linki email adresinize gönderildi'});
        } else {
          resolve({success: false, message: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'});
        }
      }, 1500);
    });
  };

  // Sipariş oluşturma
  const createOrder = async (orderData: {items: any[], shippingAddress: Address, paymentMethod: string, total: number}): Promise<{success: boolean, message: string, orderId?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!user) {
          resolve({success: false, message: 'Kullanıcı bulunamadı'});
          return;
        }

        // Yeni sipariş ID'si oluştur
        const orderId = `ORD${String(Date.now()).slice(-6)}`;
        const currentDate = new Date().toISOString();

        // Sipariş objesi oluştur
        const newOrder: Order = {
          id: orderId,
          date: currentDate,
          status: 'pending',
          total: orderData.total,
          items: orderData.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category
          })),
          shippingAddress: orderData.shippingAddress
        };

        // Kullanıcının siparişlerine ekle
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          mockUsers[userIndex].orders = [...mockUsers[userIndex].orders, newOrder];
          
          // State'i güncelle
          setUser(prev => prev ? {
            ...prev,
            orders: [...prev.orders, newOrder]
          } : null);
        }

        resolve({success: true, message: 'Sipariş başarıyla oluşturuldu', orderId});
      }, 1000);
    });
  };

  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    forgotPassword,
    createOrder,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook kullanımı için
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}