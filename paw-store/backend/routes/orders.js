const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateOrder, validateId } = require('../middleware/validation');

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT o.*, json_agg(
         json_build_object(
           'id', oi.id,
           'product_id', oi.product_id,
           'product_name', oi.product_name,
           'product_image', oi.product_image,
           'product_category', oi.product_category,
           'quantity', oi.quantity,
           'price', oi.price,
           'total', oi.total
         )
       ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: { orders: result.rows }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Siparişler alınırken hata oluştu'
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', [authenticateToken, validateOrder], async (req, res) => {
  try {
    const { items, shippingAddressId, paymentMethod, notes } = req.body;

    // Get shipping address
    const addressResult = await db.query(
      'SELECT * FROM addresses WHERE id = $1 AND user_id = $2',
      [shippingAddressId, req.user.id]
    );

    if (addressResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz teslimat adresi'
      });
    }

    const shippingAddress = addressResult.rows[0];

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const productResult = await db.query(
        'SELECT * FROM products WHERE id = $1 AND is_active = true',
        [item.productId]
      );

      if (productResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Ürün bulunamadı: ${item.productId}`
        });
      }

      const product = productResult.rows[0];
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        ...product,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Start transaction
    await db.transaction(async (client) => {
      // Generate order number
      const orderNumber = `ORD${Date.now().toString().slice(-6)}`;

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (order_number, user_id, status, total_amount, shipping_address, payment_method, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [orderNumber, req.user.id, 'pending', totalAmount, JSON.stringify(shippingAddress), paymentMethod, notes]
      );

      const order = orderResult.rows[0];

      // Create order items
      for (const item of orderItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_image, product_category, quantity, price, total)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [order.id, item.id, item.name, item.image_url, 'Category', item.quantity, item.price, item.total]
        );

        // Update product stock
        await client.query(
          'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
          [item.quantity, item.id]
        );
      }

      res.status(201).json({
        success: true,
        message: 'Sipariş başarıyla oluşturuldu',
        data: { 
          order: {
            ...order,
            items: orderItems
          }
        }
      });
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Sipariş oluşturulurken hata oluştu'
    });
  }
});

module.exports = router;