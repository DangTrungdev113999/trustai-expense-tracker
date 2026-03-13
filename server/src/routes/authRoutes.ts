import { Router } from 'express'
import { registerController, loginController } from '../controllers/authController'
import { asyncHandler } from '../lib/asyncHandler'

const router = Router()

router.post('/register', asyncHandler(registerController))
router.post('/login', asyncHandler(loginController))

export default router
