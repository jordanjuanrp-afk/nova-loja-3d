import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { Product, CartItem, User } from './types';
import { supabase } from './lib/supabase';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('toyverse_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart', e);
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
      console.error('Error getting session:', error);
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
    toast.success('Pedido realizado com sucesso!', {
      description: 'Em breve você receberá um e-mail com os detalhes do envio.'
    });
    setCartItems([]);
    setIsCartOpen(false);
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
            <Route path="/contato" element={<div className="pt-32 text-center h-screen">Contato em breve...</div>} />
            {user?.role === 'admin' && (
              <Route path="/admin" element={<AdminPanel />} />
            )}
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
