import { useCartContext } from '../context/CartContext';

const useCart = () => {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    cartCount 
  } = useCartContext();

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isEmpty: cart.length === 0,
  };
};

export default useCart;
