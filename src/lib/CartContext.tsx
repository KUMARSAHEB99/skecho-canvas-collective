import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { getAuth } from 'firebase/auth';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    quantity: number;
    seller: {
      user: {
        name: string;
      }
    }
  }
}

interface Cart {
  id: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: Error | null;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (productId: string) => boolean;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const auth = getAuth();

  const getAuthHeaders = async () => {
    const token = await auth.currentUser?.getIdToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const config = await getAuthHeaders();
      const response = await axios.get('http://40.81.226.49/api/cart', config);
      setCart(response.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      const config = await getAuthHeaders();
      await axios.post('http://40.81.226.49/api/cart/items', {
        productId,
        quantity
      }, config);
      await fetchCart(); // Refresh cart data
      toast.success('Added to cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add to cart');
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setIsLoading(true);
      const config = await getAuthHeaders();
      await axios.delete(`http://40.81.226.49/api/cart/items/${itemId}`, config);
      await fetchCart(); // Refresh cart data
      toast.success('Removed from cart');
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error('Failed to remove from cart');
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const config = await getAuthHeaders();
      await axios.put(`http://40.81.226.49/api/cart/items/${itemId}`, {
        quantity
      }, config);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      console.error('Error updating quantity:', err);
      toast.error('Failed to update quantity');
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      const config = await getAuthHeaders();
      await axios.delete('http://40.81.226.49/api/cart', config);
      await fetchCart(); // Refresh cart data
      toast.success('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInCart = (productId: string) => {
    return cart?.items.some(item => item.product.id === productId) ?? false;
  };

  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 