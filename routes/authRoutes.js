const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

// Register
router.post('/register',
  [
    body('name').notEmpty().withMessage('Name is required!'),
    body('email').isEmail().withMessage('Valid email is required!'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters!')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password } = req.body
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await User.create({ name, email, password: hashedPassword })
      res.json({ message: 'Registration successful!', data: user })
    } catch (error) {
      res.status(400).json({ success: false, message: error.message })
    }
  }
)

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User not found!' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password!' })
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )
    res.json({ message: 'Login successful!', token })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

module.exports = router