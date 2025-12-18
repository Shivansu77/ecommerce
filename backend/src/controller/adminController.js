const User = require('../model/user');
const Product = require('../model/product');
const Order = require('../model/order');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const orders = await Order.find({ isPaid: true });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        // Get recent orders
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                recentOrders
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
