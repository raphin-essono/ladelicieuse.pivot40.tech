import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CartItem } from '@/data/products';
import { ls } from '@/lib/storage';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalCalories: number;
  lastAdded: CartItem | null;
  dismissContinuation: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'ladelicieuse_cart';

function loadStoredCart(): CartItem[] {
  try {
    const raw = ls.get(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return parsed.filter(item =>
      item.id && item.name && item.type &&
      (!item.items || item.items.every(i => i.ingredient?.id))
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadStoredCart);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  useEffect(() => {
    ls.set(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    const newItem = { ...item, id: `${item.id}-${Date.now()}` };
    setItems(prev => [...prev, newItem]);
    setLastAdded(newItem);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== id));
      return;
    }
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const dismissContinuation = useCallback(() => setLastAdded(null), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
  const totalCalories = items.reduce((sum, item) => sum + item.totalCalories * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice, totalCalories,
      lastAdded, dismissContinuation,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
