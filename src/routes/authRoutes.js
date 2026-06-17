import { Router } from 'express'
import { authController } from '../controllers/authController.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
// create a new router for authentication routes
export const authRoutes = Router()
// display the registration form and handle registration submissions
authRoutes.get('/register', authController.showRegister)
// handle registration form submissions with async error handling
authRoutes.post('/register', asyncHandler(authController.register))
// display the login form and handle login submissions
authRoutes.get('/login', authController.showLogin)
// handle login form submissions with async error handling
authRoutes.post('/login', asyncHandler(authController.login))
// handle logout requests
authRoutes.post('/logout', authController.logout)
