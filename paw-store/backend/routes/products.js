const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateAdmin, optionalAuth } = require('../middleware/auth');
const { validateProduct, validateId, validatePagination, validateSearch } = require('../middleware/validation');

// @route   GET /api/products
// @desc    Get all products with pagination and filtering
// @access  Public
router.get('/', [validatePagination, validateSearch], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE p.is_active = true';
    const queryParams = [];
    let paramIndex = 1;

    // Category filter
    if (req.query.category) {
      whereClause += ` AND p.category_id = $${paramIndex}`;
      queryParams.push(req.query.category);
      paramIndex++;
    }

    // Search query
    if (req.query.q) {
      whereClause += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      queryParams.push(`%${req.query.q}%`);
      paramIndex++;
    }

    // Price filters
    if (req.query.minPrice) {
      whereClause += ` AND p.price >= $${paramIndex}`;
      queryParams.push(req.query.minPrice);
      paramIndex++;
    }

    if (req.query.maxPrice) {
      whereClause += ` AND p.price <= $${paramIndex}`;
      queryParams.push(req.query.maxPrice);
      paramIndex++;
    }

    // Sorting
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'desc';
    const orderClause = `ORDER BY p.${sortBy} ${sortOrder}`;

    const query = `
      SELECT p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url, p.created_at,
             c.name as category_name, c.id as category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);

    const result = await db.query(query, queryParams);

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM products p ${whereClause}`;
    const countParams = queryParams.slice(0, -2); // Remove limit and offset
    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        products: result.rows,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürünler alınırken hata oluştu'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', validateId, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1 AND p.is_active = true`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.json({
      success: true,
      data: { product: result.rows[0] }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün alınırken hata oluştu'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Admin only
router.post('/', [authenticateAdmin, validateProduct], async (req, res) => {
  try {
    const { name, description, price, stockQuantity, categoryId, imageUrl } = req.body;

    const result = await db.query(
      `INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, stockQuantity || 0, categoryId, imageUrl]
    );

    res.status(201).json({
      success: true,
      message: 'Ürün başarıyla oluşturuldu',
      data: { product: result.rows[0] }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün oluşturulurken hata oluştu'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Admin only
router.put('/:id', [authenticateAdmin, validateId, validateProduct], async (req, res) => {
  try {
    const { name, description, price, stockQuantity, categoryId, imageUrl } = req.body;

    const result = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock_quantity = $4, 
           category_id = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, description, price, stockQuantity, categoryId, imageUrl, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Ürün başarıyla güncellendi',
      data: { product: result.rows[0] }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün güncellenirken hata oluştu'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Admin only
router.delete('/:id', [authenticateAdmin, validateId], async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE products SET is_active = false WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Ürün silinirken hata oluştu'
    });
  }
});

module.exports = router;