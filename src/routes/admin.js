const express = require('express');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const User = require('../models/User');

const router = express.Router();

// All admin routes require authentication & admin role
router.use(auth, requireRole('admin'));

// GET /api/v1/admin/users - list all users (admin only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('name email role createdAt');
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


