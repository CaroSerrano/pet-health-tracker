import type { Request, Response, NextFunction } from 'express'
import {
  createReminderSchema,
  type ControllerDeps
} from '../types/reminders-types.js'
import { ValidationError } from '../types/errors.js'
import { scheduleEmailReminder } from '../utils/schedulerEmailReminder.js'
import type { TokenPayload } from '../types/auth-types.js'

export const remindersController = (deps: ControllerDeps) => ({
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createReminderSchema.parse(req.body)
      const newReminder = await deps.remindersService.create({
        eventId: data.eventId,
        triggerTime: data.triggerTime
      })
      const eventType = newReminder.event.type
      const user = req.user as TokenPayload
      let event: string = 'evento'
      switch (eventType) {
        case 'VET_VISIT':
          event = 'visita veterinaria'
          break
        case 'FEEDING':
          event = 'alimentación'
          break
        case 'VACCINE':
          event = 'vacunación'
          break
        default:
          throw new Error(`${eventType} is not known`)
      }
      const subject = `Recordatorio de ${event}`
      await scheduleEmailReminder(
        user.email!,
        subject,
        data.message || '',
        data.eventUrl || '',
        newReminder.id,
        new Date(data.triggerTime)
      )
      res.status(201).json(newReminder)
    } catch (error) {
      next(error)
    }
  },

  listEventReminders: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { eventId } = req.params
      if (!eventId) {
        throw new ValidationError('eventId is required')
      }
      const reminders = await deps.remindersService.listByEventId(eventId)
      res.status(200).json(reminders)
    } catch (error) {
      next(error)
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      if (!id) {
        throw new ValidationError('id is required')
      }
      await deps.remindersService.delete(id)
      res.status(200).json({ message: 'Reminder deleted successfully' })
    } catch (error) {
      next(error)
    }
  },

  deleteAllByEventId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { eventId } = req.params
      if (!eventId) {
        throw new ValidationError('eventId is required')
      }
      await deps.remindersService.deleteAllByEventId(eventId)
      res
        .status(200)
        .json({ message: "Event's reminders deleted successfully" })
    } catch (error) {
      next(error)
    }
  }
})
