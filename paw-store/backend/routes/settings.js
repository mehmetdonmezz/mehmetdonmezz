const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateAdmin } = require('../middleware/auth');
const { validateSettings } = require('../middleware/validation');

// @route   GET /api/settings
// @desc    Get all settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT key, value FROM settings');
    
    const settings = {};
    result.rows.forEach(row => {
      settings[row.key] = row.value;
    });

    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Ayarlar alınırken hata oluştu'
    });
  }
});

// @route   PUT /api/settings
// @desc    Update settings
// @access  Admin only
router.put('/', [authenticateAdmin, validateSettings], async (req, res) => {
  try {
    const settings = req.body;

    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        `INSERT INTO settings (key, value, description, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (key) 
         DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
        [key, JSON.stringify(value), `Setting for ${key}`]
      );
    }

    res.json({
      success: true,
      message: 'Ayarlar başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Ayarlar güncellenirken hata oluştu'
    });
  }
});

module.exports = router;