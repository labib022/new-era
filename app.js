const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
app.use(express.json())

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected!'))
.catch((err) => console.log(err))

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number
})

const User = mongoose.model('User', userSchema)

// Routes
app.get('/users', async (req, res) => {
  const users = await User.find()
  res.json(users)
})

app.post('/users', async (req, res) => {
  const user = await User.create(req.body)
  res.json({ message: 'User created!', data: user })
})

app.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json({ message: 'User updated!', data: user })
})

app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'User deleted!' })
})

app.listen(3000, () => {
  console.log('Server running on port 3000!')
})