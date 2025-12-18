import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Filter, Star } from 'lucide-react';

const ProductListing = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [minPrice, setMinPrice] = useState(minPriceParam || '');
    const [maxPrice, setMaxPrice] = useState(maxPriceParam || '');
    const [sortBy, setSortBy] = useState('newest');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Sync state with URL params
    useEffect(() => {
        setMinPrice(minPriceParam || '');
        setMaxPrice(maxPriceParam || '');
    }, [minPriceParam, maxPriceParam]);

    const navigate = useNavigate();

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);

        if (minPrice) params.set('minPrice', minPrice);
        else params.delete('minPrice');

        if (maxPrice) params.set('maxPrice', maxPrice);
        else params.delete('maxPrice');

        // Reset page if needed, but here we just update URL
        navigate(`/products?${params.toString()}`);
        setShowMobileFilters(false);
    };

    const clearFilters = () => {
        setSearchParams({});
        setMinPrice('');
        setMaxPrice('');
        setShowMobileFilters(false);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (category) params.category = category;
                if (search) params.keyword = search;

                // Construct gemPrice filter properly
                if (minPriceParam) params['gemPrice[gte]'] = minPriceParam;
                if (maxPriceParam) params['gemPrice[lte]'] = maxPriceParam;

                // Sort
                if (sortBy === 'price_low') params.sort = 'gemPrice';
                if (sortBy === 'price_high') params.sort = '-gemPrice';
                if (sortBy === 'newest') params.sort = '-createdAt';

                const { data } = await axios.get('http://localhost:5000/api/v1/products', { params });
                setProducts(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, search, minPriceParam, maxPriceParam, sortBy]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Mobile Filter Toggle */}
                <button
                    className="md:hidden flex items-center gap-2 bg-white p-2 rounded border shadow-sm w-fit mb-4"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                    <Filter className="w-4 h-4" /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* Filters Sidebar */}
                <div className={`w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden'} md:block`}>
                    <div className="bg-white p-4 rounded shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between font-bold text-gray-700 mb-4 pb-2 border-b">
                            <div className="flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</div>
                            {(category || search || minPriceParam || maxPriceParam) && (
                                <button onClick={clearFilters} className="text-xs text-red-500 hover:underline">Clear All</button>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2 text-sm">Departments</h3>
                            <ul className="space-y-2 text-sm text-gray-600 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {['Appliances', 'Automotive', 'Baby', 'Clothing', 'Electronics', 'Furniture', 'Grocery', 'Health & Beauty', 'Home', 'Jewellery', 'Office', 'Office Supplies', 'Sports', 'Toys', 'IT Peripherals'].map(cat => (
                                    <li key={cat}>
                                        <Link to={`/products?category=${cat}`} className={`block hover:text-primary hover:bg-gray-50 p-1 rounded ${category === cat ? 'text-primary font-bold bg-blue-50' : ''}`}>
                                            {cat}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2 text-sm">Price</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-20 border rounded px-2 py-1 text-sm bg-gray-50"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-20 border rounded px-2 py-1 text-sm bg-gray-50"
                                />
                            </div>
                            <button onClick={applyFilters} className="w-full bg-secondary text-black font-bold py-1 rounded text-sm hover:bg-yellow-400">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">
                            {search ? `Search results for "${search}"` : category ? `${category}` : 'All Products'}
                        </h1>
                        <div className="flex items-center justify-between">
                            <p className="text-gray-500 text-sm">{products.length} results found</p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border rounded px-2 py-1 text-sm bg-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">Loading...</div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white rounded shadow-sm border border-gray-200 flex flex-col hover:shadow-lg transition group">
                                    <div className="p-4 flex-grow relative">
                                        <div className="h-48 flex items-center justify-center mb-4">
                                            <img src={product.images[0]?.url || 'https://via.placeholder.com/150'} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" />
                                        </div>
                                        <h3 className="text-gray-900 mb-1 leading-tight hover:text-primary hover:underline cursor-pointer text-sm font-medium h-10 overflow-hidden">{product.name}</h3>

                                        <div className="flex items-center gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                                            <span className="text-xs text-gray-500">(42)</span>
                                        </div>

                                        <div className="mt-1">
                                            <div className="text-xl font-bold text-gray-900">₹{product.gemPrice}</div>
                                            <div className="text-[10px] text-gray-500">GeM Official Price</div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs space-y-1">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Market Lowest:</span>
                                                <span className="font-semibold">₹{product.lowestMarketplacePrice}</span>
                                            </div>
                                            {product.gemPrice < product.lowestMarketplacePrice && (
                                                <div className="text-green-700 font-bold bg-green-50 py-1 px-2 rounded mt-1 inline-block">
                                                    Save ₹{(product.lowestMarketplacePrice - product.gemPrice).toFixed(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-3 border-t border-gray-100">
                                        <Link to={`/products/${product._id}`} className="block w-full text-center border-2 border-primary text-primary font-bold py-2 rounded-full hover:bg-primary hover:text-white transition text-xs uppercase tracking-wide">
                                            Compare Now
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded border border-gray-200">
                            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                            <Link to="/" className="text-primary hover:underline mt-2 inline-block">Back to Home</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListing;
