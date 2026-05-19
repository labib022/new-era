const express = require('express')
const router = express.Router()
const User = require('../models/User')
const authMiddleware = require('../middleware/auth')  

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json({ message: 'User created!', data: user })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ message: 'User updated!', data: user })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted!' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})


router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Welcome!', userId: req.user.id })
})

module.exports = router