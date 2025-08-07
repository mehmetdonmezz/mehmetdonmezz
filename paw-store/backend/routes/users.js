const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validateAddress, validateId } = require('../middleware/validation');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, first_name, last_name, phone, date_of_birth, gender, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    res.json({
      success: true,
      data: { user: result.rows[0] }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil alınırken hata oluştu'
    });
  }
});

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: { addresses: result.rows }
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Adresler alınırken hata oluştu'
    });
  }
});

// @route   POST /api/users/addresses
// @desc    Add new address
// @access  Private
router.post('/addresses', [authenticateToken, validateAddress], async (req, res) => {
  try {
    const { title, fullName, phone, address, city, district, postalCode, isDefault } = req.body;

    // If this is default, unset other defaults
    if (isDefault) {
      await db.query(
        'UPDATE addresses SET is_default = false WHERE user_id = $1',
        [req.user.id]
      );
    }

    const result = await db.query(
      `INSERT INTO addresses (user_id, title, full_name, phone, address, city, district, postal_code, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user.id, title, fullName, phone, address, city, district, postalCode, isDefault || false]
    );

    res.status(201).json({
      success: true,
      message: 'Adres başarıyla eklendi',
      data: { address: result.rows[0] }
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Adres eklenirken hata oluştu'
    });
  }
});

module.exports = router;