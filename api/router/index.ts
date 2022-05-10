import express from 'express'
import { AuthController, SauceController } from '@Controller'
import { auth, checkDB, validateEmail, upload } from '@Middleware'

const router = express.Router()

// Routes publiques
router.post('/auth/signup', checkDB, validateEmail, AuthController.signup)
router.post('/auth/login', checkDB, AuthController.login)

// Routes authentifiées
router.get('/sauces', auth, SauceController.getAll)
router.post('/sauces', auth, upload, SauceController.create)
router.get('/sauces/:id', auth, SauceController.read)
router.put('/sauces/:id', auth, upload, SauceController.update)
router.delete('/sauces/:id', auth, SauceController.delete)
router.post('/sauces/:id/like', auth, SauceController.vote)

export default router
