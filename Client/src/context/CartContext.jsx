import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';
 
const CartContext = createContext();
 
export function CartProvider({ children }) {
  const { user } = useAuth();
 
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
 
  // ─── Fetch cart ─────────────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!user || user.role !== 'user') return;
    setLoading(true);
    try {
      const res = await api.get('/cart/view');
      const items = res.data.items || res.data || [];
      const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      setCart({ items, total });
    } catch {
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }, [user]);
 
  // fetch on login
  useEffect(() => {
    if (user?.role === 'user') fetchCart();
    else setCart({ items: [], total: 0 });
  }, [user, fetchCart]);
 
  // ─── Add to cart ─────────────────────────────────────────────────────────────
  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart/add', { productId, quantity });
    await fetchCart();
  };
 
  // ─── Remove from cart ────────────────────────────────────────────────────────
  const removeFromCart = async (cartItemId) => {
    await api.delete(`/cart/remove/${cartItemId}`);
    await fetchCart();
  };
 
  // ─── Update quantity ─────────────────────────────────────────────────────────
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    await api.patch(`/cart/items/${cartItemId}`, { quantity });
    await fetchCart();
  };
 
  // ─── Clear cart ──────────────────────────────────────────────────────────────
  const clearCart = async () => {
    await api.delete('/cart');
    setCart({ items: [], total: 0 });
  };
 
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
 
  return (
    <CartContext.Provider value={{
      cart,
      loading,
      itemCount,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}
 
export const useCart = () => useContext(CartContext);
 