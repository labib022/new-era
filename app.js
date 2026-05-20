const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const logger = require('./middleware/logger')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
require('dotenv').config()

const app = express()

app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))


app.use(express.json())


app.use(logger)


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests! Try again later.' }
})
app.use(limiter)


//  MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB Connected!'))
.catch((err) => console.log(err))

//  Routes
const userRoutes = require('./routes/userRoutes')
app.use('/users', userRoutes)

const authRoutes = require('./routes/authRoutes')
app.use('/auth', authRoutes)

//  Server Start
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}! 🚀`)
})