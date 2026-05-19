const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
app.use(express.json())


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected!'))
.catch((err) => console.log(err))

const userRoutes = require('./routes/userRoutes')
app.use('/users', userRoutes)

const authRoutes = require('./routes/authRoutes')
app.use('/auth', authRoutes)

app.listen(3000, () => {
  console.log('Server running on port 3000!')
})