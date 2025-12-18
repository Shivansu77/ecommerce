import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, X, Save, ArrowLeft } from 'lucide-react';

const AdminProducts = () => {
    const { user, token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(initialProductState());

    function initialProductState() {
        return {
            name: '',
            gemProductId: '',
            gemPrice: '',
            description: '',
            category: 'Electronics',
            brand: '',
            comparisonType: 'Direct Match',
            images: [{ public_id: 'sample', url: '' }],
            marketplacePrices: [
                { marketplace: 'Amazon', price: '', productUrl: '', isAvailable: true },
                { marketplace: 'Flipkart', price: '', productUrl: '', isAvailable: true }
            ],
            specs: { 'Model': '', 'Warranty': '', 'Color': '' }
        };
    }

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [user, navigate, token]);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/v1/products');
            setProducts(data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    const handleImageChange = (e) => {
        const newImages = [...currentProduct.images];
        newImages[0].url = e.target.value;
        setCurrentProduct({ ...currentProduct, images: newImages });
    };

    const handleMarketplaceChange = (index, field, value) => {
        const updatedPrices = [...currentProduct.marketplacePrices];
        updatedPrices[index][field] = value;
        setCurrentProduct({ ...currentProduct, marketplacePrices: updatedPrices });
    };

    const handleAddMarketplace = () => {
        setCurrentProduct({
            ...currentProduct,
            marketplacePrices: [...currentProduct.marketplacePrices, { marketplace: '', price: '', productUrl: '', isAvailable: true }]
        });
    };

    const handleRemoveMarketplace = (index) => {
        const updatedPrices = currentProduct.marketplacePrices.filter((_, i) => i !== index);
        setCurrentProduct({ ...currentProduct, marketplacePrices: updatedPrices });
    };

    const handleSpecChange = (key, value, oldKey) => {
        const newSpecs = { ...currentProduct.specs };
        if (oldKey !== key) {
            delete newSpecs[oldKey];
        }
        newSpecs[key] = value;
        setCurrentProduct({ ...currentProduct, specs: newSpecs });
    };

    const handleAddSpec = () => {
        setCurrentProduct({ ...currentProduct, specs: { ...currentProduct.specs, '': '' } });
    };

    const handleRemoveSpec = (key) => {
        const newSpecs = { ...currentProduct.specs };
        delete newSpecs[key];
        setCurrentProduct({ ...currentProduct, specs: newSpecs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            if (currentProduct._id) {
                await axios.put(`http://localhost:5000/api/v1/products/${currentProduct._id}`, currentProduct, config);
            } else {
                await axios.post('http://localhost:5000/api/v1/products', currentProduct, config);
            }
            setIsEditing(false);
            setCurrentProduct(initialProductState());
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:5000/api/v1/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const startEdit = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    };

    if (loading) return <div className="p-10 text-center">Loading Products...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="text-gray-500 hover:text-primary">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold">Product Management</h1>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => { setCurrentProduct(initialProductState()); setIsEditing(true); }}
                        className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-white p-6 rounded shadow border max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold mb-4">{currentProduct._id ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Product Name</label>
                                <input type="text" name="name" value={currentProduct.name} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">GeM Product ID</label>
                                <input type="text" name="gemProductId" value={currentProduct.gemProductId} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium">GeM Price (₹)</label>
                                <input type="number" name="gemPrice" value={currentProduct.gemPrice} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Brand</label>
                                <input type="text" name="brand" value={currentProduct.brand} onChange={handleInputChange} className="w-full border p-2 rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Category</label>
                                <select name="category" value={currentProduct.category} onChange={handleInputChange} className="w-full border p-2 rounded">
                                    <option value="">Select Category</option>
                                    <option>Appliances</option>
                                    <option>Automotive</option>
                                    <option>Baby</option>
                                    <option>Clothing</option>
                                    <option>Electronics</option>
                                    <option>Furniture</option>
                                    <option>Grocery</option>
                                    <option>Health & Beauty</option>
                                    <option>Home</option>
                                    <option>Jewellery</option>
                                    <option>Office</option>
                                    <option>Sports</option>
                                    <option>Toys</option>
                                    <option>Office Supplies</option>
                                    <option>IT Peripherals</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Comparison Type</label>
                                <select name="comparisonType" value={currentProduct.comparisonType} onChange={handleInputChange} className="w-full border p-2 rounded">
                                    <option value="Direct Match">Direct Match</option>
                                    <option value="Similar Specs">Similar Specs</option>
                                    <option value="Equivalent">Equivalent</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <textarea name="description" value={currentProduct.description} onChange={handleInputChange} className="w-full border p-2 rounded h-24" required></textarea>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-bold mb-2">Specifications</h3>
                            {Object.entries(currentProduct.specs || {}).map(([key, value], index) => (
                                <div key={index} className="flex gap-4 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Spec Name (e.g. RAM)"
                                        value={key}
                                        onChange={(e) => handleSpecChange(e.target.value, value, key)}
                                        className="w-1/3 border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g. 8GB)"
                                        value={value}
                                        onChange={(e) => handleSpecChange(key, e.target.value, key)}
                                        className="w-1/3 border p-2 rounded"
                                    />
                                    <button type="button" onClick={() => handleRemoveSpec(key)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddSpec} className="text-sm text-primary hover:underline flex items-center mt-2">
                                <Plus className="w-4 h-4 mr-1" /> Add Specification
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Image URL</label>
                            <input type="text" value={currentProduct.images[0]?.url} onChange={handleImageChange} className="w-full border p-2 rounded" placeholder="https://..." />
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="font-bold mb-2">Marketplace Comparison</h3>
                            {currentProduct.marketplacePrices.map((mp, index) => (
                                <div key={index} className="grid grid-cols-4 gap-4 mb-2 p-2 bg-gray-50 rounded items-end">
                                    <div>
                                        <label className="text-xs">Marketplace</label>
                                        <input type="text" value={mp.marketplace} onChange={(e) => handleMarketplaceChange(index, 'marketplace', e.target.value)} className="w-full border p-1 rounded" />
                                    </div>
                                    <div>
                                        <label className="text-xs">Price (₹)</label>
                                        <input type="number" value={mp.price} onChange={(e) => handleMarketplaceChange(index, 'price', e.target.value)} className="w-full border p-1 rounded" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="text-xs">Product URL</label>
                                        <input type="text" value={mp.productUrl} onChange={(e) => handleMarketplaceChange(index, 'productUrl', e.target.value)} className="w-full border p-1 rounded" placeholder="https://..." />
                                    </div>
                                    <button type="button" onClick={() => handleRemoveMarketplace(index)} className="text-red-500 p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={handleAddMarketplace} className="text-sm text-primary hover:underline flex items-center mt-2">
                                <Plus className="w-4 h-4 mr-1" /> Add Marketplace
                            </button>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Save Product</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-black px-6 py-2 rounded font-bold">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded shadow border overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">GeM Price</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Comparisons</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 text-sm">
                                    <td className="p-4">
                                        <img src={product.images[0]?.url} alt="" className="w-12 h-12 object-contain border rounded" />
                                    </td>
                                    <td className="p-4 font-semibold">{product.name}</td>
                                    <td className="p-4">₹{product.gemPrice}</td>
                                    <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.category}</span></td>
                                    <td className="p-4 text-xs text-gray-500">
                                        {product.marketplacePrices.filter(mp => mp.price > 0).length} found
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button onClick={() => startEdit(product)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
