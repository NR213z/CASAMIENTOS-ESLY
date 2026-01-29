import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Search, Filter } from 'lucide-react';
import { getProducts } from '../services/productService';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Fetch products from Supabase on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data, error } = await getProducts();

            if (error) {
                setError('Error al cargar productos. Mostrando datos de ejemplo.');
                console.error('Supabase error:', error);
                // Fallback to mock data if Supabase fails
                setProducts(getMockProducts());
            } else {
                setProducts(data || []);
            }

            setLoading(false);
        };

        fetchProducts();
    }, []);

    // Mock products as fallback
    const getMockProducts = () => [
        {
            id: '1',
            name: 'Decoración Premium',
            category: 'decoracion',
            price: 150000,
            image_url: '/product-decoration.jpg',
            description: 'Decoración completa para eventos de hasta 100 personas. Incluye centros de mesa, arreglos florales y ambientación temática.',
            in_stock: true
        },
        {
            id: '2',
            name: 'Paquete de Iluminación',
            category: 'iluminacion',
            price: 85000,
            image_url: '/product-lighting.jpg',
            description: 'Sistema de iluminación profesional con luces LED RGB, spots y efectos especiales para crear el ambiente perfecto.',
            in_stock: true
        },
        {
            id: '3',
            name: 'Mobiliario Lounge',
            category: 'mobiliario',
            price: 120000,
            image_url: '/product-furniture.jpg',
            description: 'Set de mobiliario lounge elegante: sofás, mesas ratona, puffs y sillones para zona de descanso VIP.',
            in_stock: true
        },
        {
            id: '4',
            name: 'Candy Bar Personalizado',
            category: 'catering',
            price: 95000,
            image_url: '/product-candybar.jpg',
            description: 'Mesa dulce totalmente personalizada con temática a elección, incluye postres, dulces y decoración.',
            in_stock: true
        },
        {
            id: '5',
            name: 'Photobooth Premium',
            category: 'entretenimiento',
            price: 75000,
            image_url: '/product-photobooth.jpg',
            description: 'Cabina de fotos con impresión instantánea, backdrop personalizado, props y album digital.',
            in_stock: false
        },
        {
            id: '6',
            name: 'DJ + Sonido Profesional',
            category: 'entretenimiento',
            price: 180000,
            image_url: '/product-dj.jpg',
            description: 'DJ profesional con equipo de sonido completo, luces y playlist personalizada según tus preferencias.',
            in_stock: true
        }
    ];

    const categories = [
        { id: 'all', name: 'Todos' },
        { id: 'decoracion', name: 'Decoración' },
        { id: 'iluminacion', name: 'Iluminación' },
        { id: 'mobiliario', name: 'Mobiliario' },
        { id: 'catering', name: 'Catering' },
        { id: 'entretenimiento', name: 'Entretenimiento' }
    ];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <section id="products" className="section bg-white">
            <div className="container mx-auto px-4">
                <h2 className="mb-4">Nuestros Productos</h2>
                <p className="text-center text-text-light mb-12 max-w-2xl mx-auto">
                    Complementa tu evento con nuestros servicios y productos premium
                </p>

                {error && (
                    <div className="mb-8 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Search and Filter */}
                <div className="mb-12 flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-gold outline-none transition-colors rounded-md"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 flex-wrap justify-center">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm uppercase tracking-wider transition-all ${selectedCategory === cat.id
                                    ? 'bg-gold text-white shadow-gold'
                                    : 'bg-gray-100 text-text-light hover:bg-gray-200'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card shimmer h-96"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className={`card hover-lift cursor-pointer fade-in-up stagger-${(index % 4) + 1}`}
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div className="image-overlay rounded-lg overflow-hidden mb-4">
                                    <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                                        <span className="text-text-light text-4xl">📦</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-serif text-xl text-dark">{product.name}</h3>
                                    {!product.in_stock && (
                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Agotado</span>
                                    )}
                                </div>
                                <p className="text-sm text-text-light mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-serif text-gold">{formatPrice(product.price)}</span>
                                    <button className="btn-gold text-xs py-2 px-4 disabled:opacity-50" disabled={!product.in_stock}>
                                        <ShoppingCart size={16} className="inline mr-1" />
                                        Consultar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-text-light text-lg">No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                            <h3 className="font-serif text-2xl text-dark">{selectedProduct.name}</h3>
                            <button onClick={() => setSelectedProduct(null)} className="text-text-light hover:text-dark transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="aspect-video bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                                <span className="text-text-light text-6xl">📦</span>
                            </div>
                            <div className="mb-6">
                                <span className="inline-block bg-gold-light text-dark px-3 py-1 rounded-full text-sm uppercase tracking-wider mb-4">
                                    {categories.find(c => c.id === selectedProduct.category)?.name}
                                </span>
                                <p className="text-text-light leading-relaxed mb-6">{selectedProduct.description}</p>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                                    <div>
                                        <span className="text-sm text-text-light block mb-1">Precio</span>
                                        <span className="text-3xl font-serif text-gold">{formatPrice(selectedProduct.price)}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <a href="#contact" className="btn btn-gold" onClick={() => setSelectedProduct(null)}>
                                            Consultar Disponibilidad
                                        </a>
                                    </div>
                                </div>
                                {!selectedProduct.in_stock && (
                                    <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                        <strong>Producto agotado.</strong> Contáctanos para conocer la disponibilidad.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Products;
