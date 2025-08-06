'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Ürün tipi
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  inStock: boolean;
}

// Context tipi
interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  getProduct: (id: number) => Product | undefined;
}

// Context oluştur
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// İlk ürünler (sahte veri)
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Royal Canin Köpek Maması",
    price: 299.99,
    category: "Köpek",
    image: "🐕",
    description: "Yetişkin köpekler için dengeli beslenme",
    inStock: true
  },
  {
    id: 2,
    name: "Whiskas Kedi Maması",
    price: 89.99,
    category: "Kedi",
    image: "🐱",
    description: "Tavuklu kedi maması, 2kg",
    inStock: true
  },
  {
    id: 3,
    name: "Kong Köpek Oyuncağı",
    price: 45.00,
    category: "Köpek",
    image: "🎾",
    description: "Dayanıklı kauçuk oyuncak",
    inStock: true
  },
  {
    id: 4,
    name: "Kedi Tırmalama Tahtası",
    price: 120.00,
    category: "Kedi",
    image: "🪵",
    description: "Doğal sisal malzemeli",
    inStock: false
  },
  {
    id: 5,
    name: "Kuş Kafesi Premium",
    price: 350.00,
    category: "Kuş",
    image: "🏠",
    description: "Büyük boy, paslanmaz çelik",
    inStock: true
  },
  {
    id: 6,
    name: "Akvaryum Filtresi",
    price: 180.00,
    category: "Akvaryum",
    image: "🔧",
    description: "100L kapasiteye kadar",
    inStock: true
  },
  {
    id: 7,
    name: "Köpek Tasması Premium",
    price: 65.00,
    category: "Köpek",
    image: "🦴",
    description: "Deri tasma, ayarlanabilir",
    inStock: true
  },
  {
    id: 8,
    name: "Kedi Kumu Kaliteli",
    price: 25.99,
    category: "Kedi",
    image: "📦",
    description: "Topaklanan, 10L",
    inStock: true
  }
];

// Provider component
export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage'dan veri yükle
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('paw-store-products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // localStorage'a kaydet
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('paw-store-products', JSON.stringify(products));
      } catch (error) {
        console.error('Error saving products to localStorage:', error);
      }
    }
  }, [products, isLoaded]);

  // Ürün ekleme
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct = { ...productData, id: newId };
    setProducts(prev => [...prev, newProduct]);
  };

  // Ürün güncelleme
  const updateProduct = (id: number, productData: Omit<Product, 'id'>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...productData, id } : product
    ));
  };

  // Ürün silme
  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  // Ürün getirme
  const getProduct = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

// Hook kullanımı için
export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}