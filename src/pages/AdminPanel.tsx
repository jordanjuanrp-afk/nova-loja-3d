import { useState, useEffect, FormEvent } from 'react';
import { Plus, Trash2, Edit2, Save, X, Package, DollarSign, Tag, Layers, Maximize, Palette, Sparkles, AlertCircle, User, Mail, MessageSquare, Image, GripVertical, ShoppingCart, Bell, Check, XCircle, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { toast } from 'sonner';
import { PRODUCTS } from '../constants';
import { cn } from '../lib/utils';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'products' | 'suggestions' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'articulado',
    image: 'https://picsum.photos/seed/toy/800/800',
    images: [],
    material: 'PLA Premium',
    size: '15cm',
    colors: ['Azul', 'Vermelho', 'Verde', 'Preto', 'Branco'],
    isNew: true,
    isBestSeller: false
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchSuggestions();
    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        console.log('New order:', payload);
        fetchOrders();
        toast.success('Novo pedido recebido!', {
          description: `Pedido #${payload.new.order_number}`
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchSuggestions() {
    try {
      const { data, error } = await supabase
        .from('custom_requests')
        .select('*')
        .order('created_at', { ascending: false })
        ;
      
      if (error && error.code !== '42P01') throw error;
      if (data) setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  const handleConfirmOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId);
      
      if (error) throw error;
      
      toast.success('Pedido confirmado!', {
        description: 'O cliente será notificado.'
      });
      
      fetchOrders();
    } catch (error: any) {
      toast.error('Erro ao confirmar pedido: ' + error.message);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
      
      toast.success('Pedido removido', {
        description: 'O pedido foi excluído permanentemente.'
      });
      
      fetchOrders();
    } catch (error: any) {
      toast.error('Erro ao remover pedido: ' + error.message);
    }
  };

  const handleMarkAsPaid = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);
      
      if (error) throw error;
      
      toast.success('Pedido marcado como Pago!');
      fetchOrders();
    } catch (error: any) {
      toast.error('Erro ao atualizar pedido: ' + error.message);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        ;
      
      if (error) throw error;
      if (data && data.length > 0) {
        const mappedData = data.map(p => ({
          ...p,
          isNew: p.is_new,
          isBestSeller: p.is_best_seller
        }));
        setProducts(mappedData);
      } else {
        setProducts(PRODUCTS);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        const updateData = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          image: formData.image,
          images: formData.images,
          material: formData.material,
          size: formData.size,
          colors: formData.colors,
          is_new: formData.isNew,
          is_best_seller: formData.isBestSeller
        };
        const { error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', editingId)
          ;
        
        if (error) throw error;
        toast.success('Produto atualizado com sucesso!');
      } else {
        const newProduct = {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          is_new: formData.isNew ?? true,
          is_best_seller: formData.isBestSeller ?? false,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          image: formData.image,
          material: formData.material,
          size: formData.size,
          colors: formData.colors,
          created_at: new Date().toISOString()
        };
        delete newProduct.isNew;
        delete newProduct.isBestSeller;
        console.log('Inserting product:', newProduct);
        const { error } = await supabase
          .from('products')
          .insert([newProduct])
          ;
        
        if (error) throw error;
        toast.success('Produto criado com sucesso!');
      }
      
      setIsAdding(false);
      setEditingId(null);
      fetchProducts();
    } catch (error: any) {
      toast.error('Erro ao salvar produto: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        ;
      
      if (error) throw error;
      toast.success('Produto excluído com sucesso!');
      fetchProducts();
    } catch (error: any) {
      toast.error('Erro ao excluir produto: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'articulado',
      image: 'https://picsum.photos/seed/toy/800/800',
      images: [],
      material: 'PLA Premium',
      size: '15cm',
      colors: ['Azul', 'Vermelho', 'Verde', 'Preto', 'Branco'],
      isNew: true,
      isBestSeller: false
    });
    setNewImageUrl('');
    setEditingId(null);
    setIsAdding(false);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: (formData.images || []).filter((_, i) => i !== index)
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Painel de Controle</span>
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter">
              Gerenciar <span className="text-purple-400">Inventário</span>
            </h1>
            <p className="text-gray-400 max-w-md">
              Adicione, edite ou remova produtos da sua loja ToyVerse 3D.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab('products')}
                className={cn(
                  "px-6 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'products' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                )}
              >
                Produtos
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={cn(
                  "px-6 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === 'suggestions' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                )}
              >
                Sugestões
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={cn(
                  "px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  activeTab === 'orders' ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                )}
              >
                <Bell size={16} />
                Pedidos
                {orders.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{orders.length}</span>
                )}
              </button>
            </div>

            {activeTab === 'products' && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 transition-all shadow-xl shadow-purple-500/20 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                Novo Produto
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex gap-4 items-start">
          <AlertCircle className="text-blue-400 shrink-0" size={24} />
          <div>
            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-1">Acesso Restrito</h3>
            <p className="text-gray-400 text-sm">
              Apenas o administrador <span className="text-white font-bold">jordanjuanrp@gmail.com</span> tem permissão para realizar alterações permanentes no banco de dados.
            </p>
          </div>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetForm}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-zinc-900 sticky top-0 z-10">
                  <h2 className="text-2xl font-black text-white">
                    {editingId ? 'Editar Produto' : 'Novo Produto'}
                  </h2>
                  <button onClick={resetForm} className="p-2 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nome do Produto</label>
                      <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Preço (R$)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                          type="number"
                          required
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <select
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value as any})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all appearance-none"
                        >
                          <option value="articulado">Articulado</option>
                          <option value="personalizado">Personalizado</option>
                          <option value="miniatura">Miniatura</option>
                          <option value="educativo">Educativo</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Material</label>
                      <div className="relative">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                          type="text"
                          value={formData.material}
                          onChange={e => setFormData({...formData, material: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Tamanho</label>
                      <div className="relative">
                        <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                          type="text"
                          value={formData.size}
                          onChange={e => setFormData({...formData, size: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">URL da Imagem Principal</label>
                      <div className="relative">
                        <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                          type="text"
                          value={formData.image}
                          onChange={e => setFormData({...formData, image: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Imagens Adicionais</label>
                      <div className="relative">
                        <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                          type="text"
                          value={newImageUrl}
                          onChange={e => setNewImageUrl(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                          placeholder="Cole URL e pressione Enter para adicionar"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-purple-500 transition-all"
                        />
                      </div>
                      {formData.images && formData.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img src={img} alt={`Extra ${idx + 1}`} className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-purple-500 transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={e => setFormData({...formData, isNew: e.target.checked})}
                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Novo Produto</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isBestSeller}
                        onChange={e => setFormData({...formData, isBestSeller: e.target.checked})}
                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Mais Vendido</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-500 transition-all shadow-xl shadow-purple-500/20 disabled:opacity-50"
                  >
                    <Save size={20} />
                    {editingId ? 'Salvar Alterações' : 'Criar Produto'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Products List */}
        {activeTab === 'products' ? (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <div 
                key={product.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-white/10 transition-all group"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {product.category}
                    </span>
                    {product.isNew && (
                      <span className="px-2 py-0.5 bg-blue-500/20 rounded text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                        Novo
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-white">{product.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-1">{product.description}</p>
                </div>

                <div className="text-2xl font-black text-white md:px-8">
                  R$ {product.price.toFixed(2)}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {suggestions.length > 0 ? (
              suggestions.map((sug) => (
                <div key={sug.id} className="bg-zinc-900 border border-white/10 rounded-[32px] p-8 space-y-6 hover:border-orange-500/30 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-400">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">{sug.user_name}</h3>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Mail size={14} />
                          {sug.user_email}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {new Date(sug.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-orange-500/20 rounded text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                        {sug.toy_type}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed italic">"{sug.suggestion}"</p>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                    <a 
                      href={`mailto:${sug.user_email}?subject=ToyVerse - Sua sugestão de brinquedo`}
                      className="px-6 py-2 bg-white text-black font-bold rounded-xl text-sm hover:bg-orange-500 hover:text-white transition-all"
                    >
                      Responder por E-mail
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-xl font-black text-white">Nenhuma sugestão ainda</h3>
                <p className="text-gray-500">As sugestões dos usuários aparecerão aqui.</p>
              </div>
            )}
          </div>
        )}

        {/* Orders List */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 gap-4">
            {orders.length > 0 ? (
              orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                const isPending = order.status === 'pending';
                const isConfirmed = order.status === 'confirmed';
                const isPaid = order.status === 'paid';
                const isRejected = order.status === 'rejected';
                
                return (
                  <div 
                    key={order.id} 
                    className={cn(
                      "bg-zinc-900 border rounded-[32px] p-8 space-y-4 transition-all",
                      isRejected ? "border-red-500/30 bg-red-500/5" :
                      isConfirmed ? "border-blue-500/30" :
                      isPaid ? "border-green-500/30" :
                      "border-white/10 hover:border-yellow-500/30"
                    )}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center",
                          isRejected ? "bg-red-500/10 text-red-400" :
                          isConfirmed ? "bg-blue-500/10 text-blue-400" :
                          isPaid ? "bg-green-500/10 text-green-400" :
                          "bg-yellow-500/10 text-yellow-400"
                        )}>
                          {isRejected ? <XCircle size={24} /> :
                           isConfirmed ? <Clock size={24} /> :
                           isPaid ? <CheckCircle size={24} /> :
                           <ShoppingCart size={24} />}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white">Pedido #{order.order_number || order.id}</h3>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Clock size={14} />
                            <span>{new Date(order.created_at).toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                          isPending ? 'bg-yellow-500/20 text-yellow-400' :
                          isConfirmed ? 'bg-blue-500/20 text-blue-400' :
                          isPaid ? 'bg-green-500/20 text-green-400' :
                          isRejected ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {isPending ? 'Pendente' :
                           isConfirmed ? 'Confirmado' :
                           isPaid ? 'Pago' :
                           isRejected ? 'Recusado' :
                           order.status}
                        </span>
                        <button
                          onClick={() => toggleOrderExpand(order.id)}
                          className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Valor Total:</span>
                        <span className="text-white font-bold">R$ {order.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Forma de Pagamento:</span>
                        <span className="text-white font-bold">
                          {order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'credit' ? 'Cartão de Crédito' : order.payment_method}
                        </span>
                      </div>
                      {order.customer_name && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Cliente:</span>
                          <span className="text-white font-bold">{order.customer_name}</span>
                        </div>
                      )}
                      {order.customer_email && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white font-bold">{order.customer_email}</span>
                        </div>
                      )}
                      
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && order.items && (
                      <div className="bg-black/20 rounded-2xl p-4 space-y-3">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Itens do Pedido</h4>
                        {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                            )}
                            <div className="flex-1">
                              <div className="text-white font-bold">{item.name}</div>
                              {item.color && <div className="text-gray-500 text-xs">Cor: {item.color}</div>}
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold">R$ {item.price}</div>
                              <div className="text-gray-500 text-xs">Qty: {item.quantity || 1}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    {isPending && (
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all"
                        >
                          <Check size={18} />
                          Confirmar Pedido
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
                        >
                          <XCircle size={18} />
                          Recusar
                        </button>
                      </div>
                    )}

                    {isConfirmed && (
                      <div className="flex gap-3 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleMarkAsPaid(order.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all"
                        >
                          <CheckCircle size={18} />
                          Marcar como Pago
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-xl transition-all"
                        >
                          <XCircle size={18} />
                          Cancelar
                        </button>
                      </div>
                    )}

                    {isPaid && (
                      <div className="pt-4 border-t border-green-500/20">
                        <div className="flex items-center gap-2 text-green-400 font-bold">
                          <CheckCircle size={20} />
                          Pagamento confirmado - Pedido em produção
                        </div>
                      </div>
                    )}

                    {isRejected && (
                      <div className="pt-4 border-t border-red-500/20">
                        <div className="flex items-center gap-2 text-red-400 font-bold">
                          <XCircle size={20} />
                          Pedido recusado
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
                  <ShoppingCart size={32} />
                </div>
                <h3 className="text-xl font-black text-white">Nenhum pedido ainda</h3>
                <p className="text-gray-500">Os pedidos dos clientes aparecerão aqui.</p>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="py-20 text-center text-gray-500 font-bold animate-pulse">
            Carregando inventário...
          </div>
        )}
      </div>
    </div>
  );
}
