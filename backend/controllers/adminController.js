import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Public (for now, should be protected for admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue from all orders
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Get recent 5 orders for the table
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all customers with their order stats
// @route   GET /api/admin/customers
// @access  Private/Admin (Public for now)
export const getCustomers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    const orders = await Order.find({});

    const customersWithStats = users.map(user => {
      const userOrders = orders.filter(order => order.user?.toString() === user._id.toString());
      const totalSpending = userOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
      
      return {
        ...user.toObject(),
        totalOrders: userOrders.length,
        totalSpending
      };
    });

    res.status(200).json({
      success: true,
      count: customersWithStats.length,
      data: customersWithStats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
