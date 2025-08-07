const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Admin only
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get statistics
    const stats = await Promise.all([
      db.query('SELECT COUNT(*) as total_users FROM users WHERE is_active = true'),
      db.query('SELECT COUNT(*) as total_products FROM products WHERE is_active = true'),
      db.query('SELECT COUNT(*) as total_orders FROM orders'),
      db.query('SELECT SUM(total_amount) as total_revenue FROM orders WHERE status != \'cancelled\''),
      db.query('SELECT COUNT(*) as pending_orders FROM orders WHERE status = \'pending\'')
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: parseInt(stats[0].rows[0].total_users),
        totalProducts: parseInt(stats[1].rows[0].total_products),
        totalOrders: parseInt(stats[2].rows[0].total_orders),
        totalRevenue: parseFloat(stats[3].rows[0].total_revenue || 0),
        pendingOrders: parseInt(stats[4].rows[0].pending_orders)
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Dashboard verileri alınırken hata oluştu'
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders for admin
// @access  Admin only
router.get('/orders', authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      success: true,
      data: { orders: result.rows }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Siparişler alınırken hata oluştu'
    });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Admin only
router.put('/orders/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz sipariş durumu'
      });
    }

    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Sipariş durumu güncellendi',
      data: { order: result.rows[0] }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Sipariş durumu güncellenirken hata oluştu'
    });
  }
});

module.exports = router;