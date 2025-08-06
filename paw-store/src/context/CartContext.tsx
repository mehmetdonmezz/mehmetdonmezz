'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Sepet item tipi
export interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

// Context tipi
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Context oluştur
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage'dan veri yükle
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('paw-store-cart');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // localStorage'a kaydet
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('paw-store-cart', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isLoaded]);

  // Sepete ekleme
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    console.log('🛒 CartContext - Adding to cart:', product);
    console.log('🛒 Current items before:', items);
    
    const newItem = { ...product, quantity: 1 };
    const existingItemIndex = items.findIndex(item => item.id === product.id);
    
    let newItems;
    if (existingItemIndex >= 0) {
      // Ürün zaten sepette, miktarı artır
      newItems = [...items];
      newItems[existingItemIndex].quantity += 1;
      console.log('🛒 Existing item, increased quantity');
    } else {
      // Yeni ürün, sepete ekle
      newItems = [...items, newItem];
      console.log('🛒 New item added');
    }
    
    console.log('🛒 New items after:', newItems);
    setItems(newItems);
  };

  // Sepetten çıkarma
  const removeFromCart = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  // Miktar güncelleme
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Sepeti temizle
  const clearCart = () => {
    setItems([]);
  };

  // Toplam ürün sayısı
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Toplam fiyat
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook kullanımı için
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}