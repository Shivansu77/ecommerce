import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const { user, token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const { data } = await axios.get('http://localhost:5000/api/v1/admin/stats', config);
                setStats(data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, [user, navigate, token]);

    if (!stats) return <div className="p-10 text-center">Loading Dashboard...</div>;

    const data = [
        { name: 'Amazon', savings: 4000 },
        { name: 'Flipkart', savings: 3000 },
        { name: 'GeM', savings: 9000 }, // GeM usually saves more
        { name: 'Meesho', savings: 2000 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="bg-primary text-white px-4 py-2 rounded flex items-center shadow hover:bg-blue-700"
                >
                    <Package className="w-5 h-5 mr-2" /> Manage Products
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-blue-500 flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full mr-4 text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500 flex items-center">
                    <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Products</p>
                        <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-yellow-500 flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full mr-4 text-yellow-600">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Orders</p>
                        <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-purple-500 flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full mr-4 text-purple-600">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <h3 className="text-2xl font-bold">₹{stats.totalRevenue}</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-bold mb-4">Savings Analysis (Dummy Data)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="savings" fill="#0071dc" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-bold mb-4">Market Share</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="savings"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-bold">Recent Orders</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentOrders && stats.recentOrders.map((order) => (
                            <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm">{order._id.substring(0, 8)}...</td>
                                <td className="p-4">{order.user ? order.user.name : 'Unknown'}</td>
                                <td className="p-4">₹{order.totalPrice}</td>
                                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
