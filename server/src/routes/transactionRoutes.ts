import { Router } from 'express'
import { createTransactionController, getTransactionsController } from '../controllers/transactionController'
import { authMiddleware } from '../middleware/auth'
import { asyncHandler } from '../lib/asyncHandler'

const router = Router()

router.post('/', authMiddleware, asyncHandler(createTransactionController))
router.get('/', authMiddleware, asyncHandler(getTransactionsController))

export default router
