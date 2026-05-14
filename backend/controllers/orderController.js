import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { sendOrderNotification } from '../utils/whatsappService.js';
import { generateInvoice } from '../utils/invoiceGenerator.js';
import path from 'path';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ success: false, error: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Create Real-time Notification
    try {
      const notification = await Notification.create({
        title: 'New Order Received!',
        message: `A new order #${createdOrder._id.toString().slice(-6)} of $${totalPrice} has been placed.`,
        type: 'order',
        orderId: createdOrder._id
      });

      // Get io instance and emit
      const io = req.app.get('io');
      io.to('admin_room').emit('new_notification', notification);

      // Send WhatsApp Notification
      await sendOrderNotification({
        customerName: req.user.name,
        amount: totalPrice,
        paymentMethod,
        address: `${shippingAddress.address}, ${shippingAddress.city}`,
        orderId: createdOrder._id
      });

      // Generate Invoice PDF
      const invoiceName = `invoice-${createdOrder._id}.pdf`;
      const invoicePath = path.join(process.cwd(), 'uploads', 'invoices', invoiceName);
      await generateInvoice(createdOrder, invoicePath);
      
      // Update order with invoice URL
      createdOrder.invoiceUrl = `/uploads/invoices/${invoiceName}`;
      await createdOrder.save();
    } catch (err) {
      console.error('Notification/Invoice Error:', err);
    }

    res.status(201).json({
      success: true,
      data: createdOrder,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      // Check if order belongs to the user or if user is admin
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ success: false, error: 'Not authorized to view this order' });
      }
      res.status(200).json({ success: true, data: order });
    } else {
      res.status(404).json({ success: false, error: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin (Public for now for admin dashboard ease)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name').sort('-createdAt');
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.status(200).json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ success: false, error: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (order) {
      res.status(200).json({ success: true, message: 'Order removed' });
    } else {
      res.status(404).json({ success: false, error: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/orders/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = orders.length;
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments({});

    // Calculate Monthly Revenue for Chart
    const monthlyData = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Map month numbers to names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyData = monthlyData.map(item => ({
      name: monthNames[item._id - 1],
      total: item.total
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalSales,
          totalOrders,
          totalUsers,
          totalProducts
        },
        monthlyData: formattedMonthlyData
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
