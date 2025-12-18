import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../redux/cartSlice';
import { Check, X, ShieldCheck } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/v1/products/${id}`);
                setProduct(data.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            image: product.images[0]?.url,
            price: product.gemPrice,
            countInStock: 10, // hardcoded for now
            qty: 1
        }));
        navigate('/cart');
    };

    if (loading) return <div className="p-10 text-center">Loading comparison...</div>;
    if (!product) return <div className="p-10 text-center">Product not found</div>;

    const gemSavings = product.lowestMarketplacePrice - product.gemPrice;
    const isGemCheaper = gemSavings > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Image Gallery */}
                <div>
                    <div className="border rounded-lg overflow-hidden bg-white p-4">
                        <img src={product.images[0]?.url} alt={product.name} className="w-full h-96 object-contain" />
                    </div>
                </div>

                {/* Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <span className="bg-gray-200 px-2 py-1 rounded">Brand: {product.brand}</span>
                        <span className="bg-gray-200 px-2 py-1 rounded">Category: {product.category}</span>
                    </div>

                    <p className="text-gray-700 mb-6">{product.description}</p>

                    {/* GeM Price Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-semibold text-primary flex items-center">
                                <ShieldCheck className="w-5 h-5 mr-1" />
                                GeM Official Price
                            </span>
                            <span className="text-3xl font-bold text-gray-900">₹{product.gemPrice}</span>
                        </div>
                        {isGemCheaper ? (
                            <div className="text-green-700 font-bold text-sm">
                                ✅ You save ₹{gemSavings.toFixed(2)} compared to market!
                            </div>
                        ) : (
                            <div className="text-red-600 font-bold text-sm">
                                ⚠️ Market price is lower by ₹{Math.abs(gemSavings).toFixed(2)}
                            </div>
                        )}
                        <button
                            onClick={addToCartHandler}
                            className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            Buy Now from GeM
                        </button>
                    </div>

                    {/* Specifications */}
                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-2">Technical Specifications</h3>
                        <div className="bg-white border rounded">
                            {product.specs && Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="flex border-b last:border-0 p-3">
                                    <span className="w-1/3 font-semibold text-gray-600">{key}</span>
                                    <span className="w-2/3">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <h2 className="text-2xl font-bold mb-6">Marketplace Comparison</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 border">Marketplace</th>
                            <th className="p-4 border">Price</th>
                            <th className="p-4 border">Status</th>
                            <th className="p-4 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* GeM Row */}
                        <tr className="bg-blue-50 border-b">
                            <td className="p-4 border font-bold text-primary flex items-center">
                                <ShieldCheck className="w-4 h-4 mr-1" /> GeM (Government e-Marketplace)
                            </td>
                            <td className="p-4 border font-bold">₹{product.gemPrice}</td>
                            <td className="p-4 border text-green-600 font-bold">Available</td>
                            <td className="p-4 border">
                                <button className="text-blue-600 font-semibold cursor-default">
                                    Official Source
                                </button>
                            </td>
                        </tr>

                        {/* Other Marketplaces */}
                        {product.marketplacePrices.map((mp, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-4 border font-semibold">{mp.marketplace}</td>
                                <td className="p-4 border">₹{mp.price}</td>
                                <td className="p-4 border">
                                    {mp.isAvailable ? (
                                        <span className="flex items-center text-green-600"><Check className="w-4 h-4 mr-1" /> In Stock</span>
                                    ) : (
                                        <span className="flex items-center text-red-500"><X className="w-4 h-4 mr-1" /> Out of Stock</span>
                                    )}
                                </td>
                                <td className="p-4 border">
                                    <a href={mp.productUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        View on {mp.marketplace}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDetails;
