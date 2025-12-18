import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import { removeFromCart, addToCart } from '../redux/cartSlice';
import axios from 'axios';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { user, token } = useSelector((state) => state.auth);

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    useEffect(() => {
        // Load razorpay script
        const loadRazorpay = async () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        };
        loadRazorpay();
    }, []);

    const checkoutHandler = async () => {
        if (!user) {
            navigate('/login?redirect=cart');
            return;
        }

        try {
            // 1. Create Order on Backend
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const { data: { order } } = await axios.post('http://localhost:5000/api/v1/payment/create-order', { amount: total }, config);

            const { data: { key } } = await axios.get('http://localhost:5000/api/v1/payment/razorpay-key', config);

            // 2. Open Razorpay Modal
            const options = {
                key: key,
                amount: order.amount,
                currency: "INR",
                name: "GeM Compare",
                description: "Purchase of GeM Products",
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyConfig = {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            }
                        };
                        await axios.post('http://localhost:5000/api/v1/payment/verify', response, verifyConfig);
                        alert('Payment Successful! Order Placed.');
                        // Here we normally dispatch createOrder action to save full order in DB and clear cart
                        navigate('/'); // Redirect to profile or success page
                    } catch (error) {
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#0071dc"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error(error);
            alert('Something went wrong during checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/" className="text-primary hover:underline flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go back to shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
                    {cartItems.map((item) => (
                        <div key={item.product} className="flex flex-col sm:flex-row items-center justify-between border-b last:border-0 py-4">
                            <div className="flex items-center space-x-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded bg-gray-50" />
                                <div>
                                    <Link to={`/products/${item.product}`} className="font-semibold text-lg hover:underline">{item.name}</Link>
                                    <p className="text-gray-500 text-sm">₹{item.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center mt-4 sm:mt-0 space-x-4">
                                <select
                                    value={item.qty}
                                    className="border rounded p-1"
                                    onChange={(e) => dispatch(addToCart({ ...item, qty: Number(e.target.value) }))}
                                >
                                    {[...Array(item.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => dispatch(removeFromCart(item.product))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)} items)</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>GST (18%)</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={checkoutHandler}
                        className="w-full bg-secondary text-black font-bold py-3 rounded hover:bg-yellow-500 transition"
                    >
                        Proceed to Checkout
                    </button>
                    <div className="mt-4 text-xs text-center text-gray-500">
                        Secure payments via Razorpay
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
