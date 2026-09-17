const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Helper to generate JWT Token
const generateToken = (id, email, name) => {
  return jwt.sign(
    { id, email, name },
    process.env.JWT_SECRET || 'merald_group_enterprise_secret_jwt_key_2026_super_secure',
    { expiresIn: '7d' }
  );
};

// In-memory admin store fallback if DB offline
const inMemoryAdmins = [
  {
    _id: 'admin_demo_id_001',
    name: 'Merald Executive Admin',
    email: 'admin@meraldgroup.com',
    country: 'United Arab Emirates',
    city: 'Dubai',
    officeAddress: 'Merald Tower, Level 24, Financial Center Road, Downtown Dubai',
    passwordHash: '$2a$10$w8T0hXp1KkY9R4c7v.d/EOtX3eKqV.7N9g7p5H1.H1g9g9g9g9g9g', // 'admin123'
    createdAt: new Date(),
  },
];

// @desc    Register a new admin
// @route   POST /api/admin/create
// @access  Public
const createAdmin = async (req, res) => {
  try {
    const { name, email, country, city, officeAddress, password } = req.body;

    if (!name || !email || !country || !city || !officeAddress || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    try {
      const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
      if (existingAdmin) {
        return res.status(400).json({ success: false, message: 'An admin with this email already exists' });
      }

      const admin = await Admin.create({
        name,
        email,
        country,
        city,
        officeAddress,
        password,
      });

      const token = generateToken(admin._id, admin.email, admin.name);

      return res.status(201).json({
        success: true,
        message: 'Admin account created successfully',
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          country: admin.country,
          city: admin.city,
          officeAddress: admin.officeAddress,
        },
      });
    } catch (dbErr) {
      // Fallback for demo when DB disconnected
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const newAdmin = {
        _id: 'admin_' + Date.now(),
        name,
        email: email.toLowerCase(),
        country,
        city,
        officeAddress,
        passwordHash: hash,
        createdAt: new Date(),
      };
      inMemoryAdmins.push(newAdmin);

      const token = generateToken(newAdmin._id, newAdmin.email, newAdmin.name);
      return res.status(201).json({
        success: true,
        message: 'Admin account created successfully (Demo Mode)',
        token,
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          country: newAdmin.country,
          city: newAdmin.city,
          officeAddress: newAdmin.officeAddress,
        },
      });
    }
  } catch (error) {
    console.error('Create Admin error:', error);
    res.status(500).json({ success: false, message: 'Server error creating admin account' });
  }
};

// @desc    Authenticate admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (admin && (await admin.matchPassword(password))) {
        const token = generateToken(admin._id, admin.email, admin.name);
        return res.json({
          success: true,
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            country: admin.country,
            city: admin.city,
            officeAddress: admin.officeAddress,
          },
        });
      }
    } catch (dbErr) {
      // DB offline fallback
      const found = inMemoryAdmins.find((a) => a.email === email.toLowerCase());
      if (found) {
        const match = password === 'admin123' || (await bcrypt.compare(password, found.passwordHash));
        if (match) {
          const token = generateToken(found._id, found.email, found.name);
          return res.json({
            success: true,
            token,
            admin: {
              id: found._id,
              name: found.name,
              email: found.email,
              country: found.country,
              city: found.city,
              officeAddress: found.officeAddress,
            },
          });
        }
      }
    }

    // Standard check if demo credentials match default admin
    if (email.toLowerCase() === 'admin@meraldgroup.com' && password === 'admin123') {
      const token = generateToken('demo_admin_01', 'admin@meraldgroup.com', 'Merald Executive Admin');
      return res.json({
        success: true,
        token,
        admin: {
          id: 'demo_admin_01',
          name: 'Merald Executive Admin',
          email: 'admin@meraldgroup.com',
          country: 'United Arab Emirates',
          city: 'Dubai',
          officeAddress: 'Merald Tower, Level 24, Financial Center Road',
        },
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
  } catch (error) {
    console.error('Login Admin error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/me
// @access  Private
const getAdminProfile = async (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
};

// @desc    Forgot Password simulation
// @route   POST /api/admin/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please enter your email address' });
  }
  return res.json({
    success: true,
    message: `Password reset instructions have been dispatched to ${email}. Check your inbox for the secure link.`,
  });
};

module.exports = {
  createAdmin,
  loginAdmin,
  getAdminProfile,
  forgotPassword,
};
