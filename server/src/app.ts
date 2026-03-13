import express from 'express'
import authRoutes from './routes/authRoutes'
import transactionRoutes from './routes/transactionRoutes'
import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

app.use(errorHandler)

export default app
