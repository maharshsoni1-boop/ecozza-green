"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // unique identifier (variantId)
  productId: string;
  variantId: string;
  productName: string;
  variantTitle: string;
  slug: string;
  weightKg: number;
  unitPrice: number; // GST inclusive in INR
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  totalWeightKg: number;
  itemCount: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1499;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ecozza_green_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("ecozza_green_cart", JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart", e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, id: item.variantId, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const totalWeightKg = items.reduce(
    (sum, item) => sum + item.weightKg * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalWeightKg,
        itemCount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        isFreeShipping,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
