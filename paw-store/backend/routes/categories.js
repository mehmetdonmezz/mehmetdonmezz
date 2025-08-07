const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');
const { validateCategory, validateId } = require('../middleware/validation');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories WHERE is_active = true ORDER BY name'
    );

    res.json({
      success: true,
      data: { categories: result.rows }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategoriler alınırken hata oluştu'
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category
// @access  Admin only
router.post('/', [authenticateAdmin, validateCategory], async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    const result = await db.query(
      'INSERT INTO categories (name, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      [name, description, imageUrl]
    );

    res.status(201).json({
      success: true,
      message: 'Kategori başarıyla oluşturuldu',
      data: { category: result.rows[0] }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Kategori oluşturulurken hata oluştu'
    });
  }
});

module.exports = router;