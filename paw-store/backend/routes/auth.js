const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const db = require('../config/database');
const { generateToken } = require('../middleware/auth');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateEmail,
  validatePasswordChange
} = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth, gender } = req.body;

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kayıtlı'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = uuidv4();

    // Insert new user
    const result = await db.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, date_of_birth, gender, email_verification_token)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, first_name, last_name, phone, date_of_birth, gender, created_at`,
      [email, hashedPassword, firstName, lastName, phone || null, dateOfBirth || null, gender || null, emailVerificationToken]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Kayıt başarıyla tamamlandı',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          dateOfBirth: user.date_of_birth,
          gender: user.gender,
          createdAt: user.created_at
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıt işlemi sırasında hata oluştu'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user from database
    const result = await db.query(
      'SELECT id, email, password, first_name, last_name, phone, date_of_birth, gender, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı'
      });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Hesabınız deaktif edilmiş'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          dateOfBirth: user.date_of_birth,
          gender: user.gender
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş işlemi sırasında hata oluştu'
    });
  }
});

// @route   POST /api/auth/admin/login
// @desc    Admin login
// @access  Public
router.post('/admin/login', [
  validateUserLogin
], async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get admin from database
    const result = await db.query(
      'SELECT id, email, password, name, role, is_active FROM admin_users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı'
      });
    }

    const admin = result.rows[0];

    // Check if admin is active
    if (!admin.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Admin hesabı deaktif edilmiş'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı'
      });
    }

    // Update last login
    await db.query(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [admin.id]
    );

    // Generate JWT token with admin type
    const token = generateToken(admin.id, 'admin');

    res.json({
      success: true,
      message: 'Admin girişi başarılı',
      data: {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin giriş işlemi sırasında hata oluştu'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', validateEmail, async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const result = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Don't reveal if email exists for security
      return res.json({
        success: true,
        message: 'Şifre sıfırlama bağlantısı email adresinize gönderildi'
      });
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save reset token to database
    await db.query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, user.id]
    );

    // TODO: Send email with reset link
    console.log(`Password reset token for user ${user.id}: ${resetToken}`);

    res.json({
      success: true,
      message: 'Şifre sıfırlama bağlantısı email adresinize gönderildi',
      // Development only - remove in production
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre sıfırlama işlemi sırasında hata oluştu'
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  validatePasswordChange,
  validateEmail
], async (req, res) => {
  try {
    const { email, newPassword, resetToken } = req.body;

    // Find user with valid reset token
    const result = await db.query(
      `SELECT id FROM users 
       WHERE email = $1 
       AND password_reset_token = $2 
       AND password_reset_expires > CURRENT_TIMESTAMP`,
      [email, resetToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı'
      });
    }

    const user = result.rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset token
    await db.query(
      `UPDATE users 
       SET password = $1, password_reset_token = NULL, password_reset_expires = NULL
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    res.json({
      success: true,
      message: 'Şifreniz başarıyla güncellendi'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Şifre sıfırlama işlemi sırasında hata oluştu'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Doğrulama token\'ı gerekli'
      });
    }

    // Find user with verification token
    const result = await db.query(
      'SELECT id FROM users WHERE email_verification_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz doğrulama token\'ı'
      });
    }

    const user = result.rows[0];

    // Update user as verified
    await db.query(
      'UPDATE users SET email_verified = true, email_verification_token = NULL WHERE id = $1',
      [user.id]
    );

    res.json({
      success: true,
      message: 'Email adresiniz başarıyla doğrulandı'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email doğrulama işlemi sırasında hata oluştu'
    });
  }
});

module.exports = router;