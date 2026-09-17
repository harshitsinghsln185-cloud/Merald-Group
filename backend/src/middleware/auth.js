const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'merald_group_enterprise_secret_jwt_key_2026_super_secure'
      );

      try {
        req.admin = await Admin.findById(decoded.id).select('-password');
      } catch (err) {
        // Fallback if mongo is not connected
        req.admin = { id: decoded.id, email: decoded.email, name: decoded.name || 'Admin' };
      }

      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
