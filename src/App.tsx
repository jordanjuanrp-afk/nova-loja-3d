import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';
import CustomRequest from './pages/CustomRequest';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import { Product, CartItem, User } from './types';
import { supabase } from './lib/supabase';

function ProtectedRoute({ user, children }: { user: User | null; children: any }) {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [customerData, setCustomerData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    cep: string;
    complement: string;
  } | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('toyverse_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        // error handled silently
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('toyverse_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Handle Supabase Auth
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const isAdmin = session.user.email === 'jordanjuanrp@gmail.com';
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          role: isAdmin ? 'admin' : 'user'
        });
      }
    }).catch((error) => {
      // error handled silently
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const isAdmin = session.user.email === 'jordanjuanrp@gmail.com';
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          role: isAdmin ? 'admin' : 'user'
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAddToCart = (product: Product, quantity: number = 1, color?: string) => {
    const selectedColor = color || product.colors[0];
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.selectedColor === selectedColor);
      
      if (existingItem) {
        return prev.map(item => 
          (item.id === product.id && item.selectedColor === selectedColor)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { ...product, quantity, selectedColor }];
    });

    toast.success(`${product.name} adicionado ao carrinho!`, {
      description: `Cor: ${selectedColor} | Qtd: ${quantity}`,
      action: {
        label: 'Ver Carrinho',
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.info('Item removido do carrinho');
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Por favor, faça login para finalizar a compra.');
      return;
    }
  };

  const handleProceedToPayment = (data: typeof customerData) => {
    if (!user) {
      toast.error('Por favor, faça login para finalizar a compra.');
      return;
    }
    setCustomerData(data);
  };

  const handlePaymentSuccess = () => {
    setCartItems([]);
    setIsCartOpen(false);
    localStorage.removeItem('toyverse_cart');
    setCustomerData(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white">
        <Toaster position="top-center" richColors theme="dark" />
        
        <Navbar 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onOpenCart={() => setIsCartOpen(true)}
          user={user}
        />

        <main>
          <Routes>
            <Route path="/" element={<Home onAddToCart={(p) => handleAddToCart(p)} />} />
            <Route path="/catalogo" element={<Catalog onAddToCart={(p) => handleAddToCart(p)} />} />
            <Route path="/produto/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
            <Route path="/personalizados" element={<CustomRequest />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={
              <Checkout 
                items={cartItems} 
                onUpdateQuantity={handleUpdateQuantity} 
                onRemoveItem={handleRemoveItem}
                onProceedToPayment={handleProceedToPayment}
              />
            } />
            <Route path="/payment" element={
              <Payment 
                items={cartItems}
                customerData={customerData}
                user={user ? { id: user.id, name: user.name, email: user.email } : null}
                onSuccess={handlePaymentSuccess}
              />
            } />
            <Route path="/contato" element={<div className="pt-32 text-center h-screen">Contato em breve...</div>} />
            <Route path="/admin" element={<ProtectedRoute user={user}><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </main>

        <Footer />

        <CartDrawer 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      </div>
    </Router>
  );
}
