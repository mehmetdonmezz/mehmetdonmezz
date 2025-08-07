const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// User registration validation
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZğĞıİşŞüÜöÖçÇ\s]+$/)
    .withMessage('First name can only contain letters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-ZğĞıİşŞüÜöÖçÇ\s]+$/)
    .withMessage('Last name can only contain letters'),
  
  body('phone')
    .optional()
    .matches(/^(\+90|0)?[5][0-9]{9}$/)
    .withMessage('Please provide a valid Turkish phone number'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Product name must be between 3 and 255 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  
  body('categoryId')
    .isInt({ min: 1 })
    .withMessage('Please provide a valid category ID'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid image URL'),
  
  handleValidationErrors
];

// Category validation
const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid image URL'),
  
  handleValidationErrors
];

// Address validation
const validateAddress = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Address title must be between 2 and 100 characters'),
  
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Full name must be between 2 and 200 characters'),
  
  body('phone')
    .matches(/^(\+90|0)?[5][0-9]{9}$/)
    .withMessage('Please provide a valid Turkish phone number'),
  
  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  
  body('district')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('District must be between 2 and 100 characters'),
  
  body('postalCode')
    .matches(/^[0-9]{5}$/)
    .withMessage('Postal code must be 5 digits'),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean'),
  
  handleValidationErrors
];

// Order validation
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  
  body('items.*.productId')
    .isInt({ min: 1 })
    .withMessage('Each item must have a valid product ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Each item must have a quantity of at least 1'),
  
  body('shippingAddressId')
    .isInt({ min: 1 })
    .withMessage('Please provide a valid shipping address ID'),
  
  body('paymentMethod')
    .isIn(['card', 'bank_transfer'])
    .withMessage('Payment method must be card or bank_transfer'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('category')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category must be a positive integer'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be non-negative'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be non-negative'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'created_at'])
    .withMessage('Sort by must be name, price, or created_at'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];

// Email validation
const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  handleValidationErrors
];

// Settings validation
const validateSettings = [
  body('siteName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Site name must be between 2 and 100 characters'),
  
  body('siteDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Site description cannot exceed 500 characters'),
  
  body('contactEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid contact email'),
  
  body('contactPhone')
    .optional()
    .matches(/^(\+90|0)?[5][0-9]{9}$/)
    .withMessage('Please provide a valid Turkish phone number'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validatePasswordChange,
  validateProduct,
  validateCategory,
  validateAddress,
  validateOrder,
  validateId,
  validatePagination,
  validateSearch,
  validateEmail,
  validateSettings
};