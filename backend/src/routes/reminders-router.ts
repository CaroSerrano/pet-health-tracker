import { remindersController } from '../controllers/reminder-controller.js'
import { remindersService } from '../services/index.js'
import express from 'express'
import { authMiddleware } from '../middlewares/auth.js'

const controller = remindersController({ remindersService })

const router = express.Router()

router.use(authMiddleware)

router.post('/', controller.create)
router.delete('/:id', controller.delete)
router.delete('/event/:eventId', controller.deleteAllByEventId)
router.get('/:eventId', controller.listEventReminders)

export default router
