const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // password encrypt করো
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.json({ message: 'Registration successful!', data: user })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // user খোঁজো
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User not found!' })
    }

    // password check করো
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password!' })
    }

    // token বানাও
    const token = jwt.sign(
      { id: user._id },
      'mysecretkey',
      { expiresIn: '1d' }
    )

    res.json({ message: 'Login successful!', token })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

module.exports = router