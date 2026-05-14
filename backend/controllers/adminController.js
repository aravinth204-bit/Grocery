import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Public (for now, should be protected for admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue from all orders
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Calculate Monthly Revenue for Chart
    const monthlyDataRaw = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = monthlyDataRaw.map(item => ({
      name: monthNames[item._id - 1],
      revenue: item.revenue
    }));

    // Calculate Top Products based on order items
    const topProductsRaw = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          image: { $first: "$orderItems.image" },
          sales: { $sum: "$orderItems.qty" },
          revenue: { $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] } }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 4 }
    ]);

    const topProducts = await Promise.all(topProductsRaw.map(async (p) => {
      const product = await Product.findById(p._id);
      return {
        id: p._id,
        name: p.name,
        image: p.image,
        sales: p.sales,
        revenue: p.revenue,
        stock: product ? (product.stock > 0 ? (product.stock < 10 ? 'Low Stock' : 'In Stock') : 'Out of Stock') : 'N/A'
      };
    }));

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
        recentOrders,
        monthlyData,
        topProducts
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
