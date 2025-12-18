import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/productSlice';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const { products, isLoading } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex gap-6">
                {/* Sidebar Navigation */}
                <aside className="w-64 hidden md:block flex-shrink-0">
                    <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-100 p-3 font-bold border-b text-gray-700">Departments</div>
                        <ul className="divide-y divide-gray-100 text-sm">
                            {['Appliances', 'Automotive', 'Baby', 'Clothing', 'Electronics', 'Furniture', 'Grocery', 'Health & Beauty', 'Home', 'Jewellery', 'Office', 'Sports', 'Toys'].map((cat) => (
                                <li key={cat}>
                                    <Link to={`/products?category=${cat}`} className="block px-4 py-2.5 hover:bg-blue-50 hover:text-primary transition hover:pl-6">
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Hero Grid */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {/* Main Hero Banner */}
                        <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-white rounded shadow-sm border border-gray-200 p-8 flex flex-col justify-center min-h-[300px] relative overflow-hidden">
                            <div className="relative z-10 max-w-md">
                                <h1 className="text-3xl md:text-5xl font-light text-primary mb-4">
                                    Compare <span className="font-bold">Government Prices</span>
                                </h1>
                                <p className="text-gray-600 mb-6 text-lg">
                                    Official GeM prices vs Amazon, Flipkart & more. Save tax money efficiently.
                                </p>
                                <Link to="/products" className="bg-accent text-white py-2 px-8 font-bold uppercase tracking-wide text-sm w-max hover:bg-orange-600 shadow-sm transition">
                                    Start Comparing
                                </Link>
                            </div>
                            {/* Decorative circle */}
                            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-100 rounded-full opacity-50"></div>
                        </div>

                        {/* Side Banners */}
                        <div className="flex flex-col gap-4">
                            <Link to="/products?category=Office Supplies" className="bg-white p-6 rounded shadow-sm border border-gray-200 flex-1 flex flex-col justify-center hover:shadow-md transition group cursor-pointer">
                                <h3 className="text-xl font-light text-primary mb-2 group-hover:underline">Office Supplies</h3>
                                <p className="text-gray-500 text-sm mb-4">Bulk savings on paper & ink.</p>
                                <span className="text-primary font-semibold text-sm">View Deals &gt;</span>
                            </Link>
                            <Link to="/products?category=IT Peripherals" className="bg-white p-6 rounded shadow-sm border border-gray-200 flex-1 flex flex-col justify-center hover:shadow-md transition group cursor-pointer">
                                <h3 className="text-xl font-light text-primary mb-2 group-hover:underline">IT Peripherals</h3>
                                <p className="text-gray-500 text-sm mb-4">Laptops, Printers & Monitors.</p>
                                <span className="text-primary font-semibold text-sm">Compare Now &gt;</span>
                            </Link>
                        </div>
                    </div>

                    {/* Featured Products Grid */}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-light text-gray-800">Trending <span className="font-bold">Comparisons</span></h2>
                        <Link to="/products" className="text-primary text-sm hover:underline">View All</Link>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">Loading products...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div key={product._id} className="bg-white rounded shadow-sm border border-gray-200 flex flex-col hover:shadow-lg transition group">
                                        <div className="p-4 flex-grow relative">
                                            <div className="h-48 flex items-center justify-center mb-4">
                                                <img src={product.images[0]?.url || 'https://via.placeholder.com/150'} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" />
                                            </div>
                                            <h3 className="text-gray-900 mb-1 leading-tight hover:text-primary hover:underline cursor-pointer">{product.name}</h3>

                                            <div className="mt-2">
                                                <div className="text-2xl font-bold text-gray-900">₹{product.gemPrice}</div>
                                                <div className="text-xs text-gray-500">GeM Official Price</div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-gray-100 text-sm space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Market Lowest:</span>
                                                    <span className="font-semibold">₹{product.lowestMarketplacePrice}</span>
                                                </div>
                                                {product.gemPrice < product.lowestMarketplacePrice && (
                                                    <div className="text-green-700 font-bold text-center bg-green-50 py-1 rounded text-xs mt-2">
                                                        Save ₹{(product.lowestMarketplacePrice - product.gemPrice).toFixed(0)} on GeM
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-3 border-t border-gray-100">
                                            <Link to={`/products/${product._id}`} className="block w-full text-center border-2 border-primary text-primary font-bold py-2 rounded-full hover:bg-primary hover:text-white transition text-sm">
                                                Compare
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 text-center text-gray-500 py-10 bg-white rounded border">
                                    No products found. Admin needs to add products.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
