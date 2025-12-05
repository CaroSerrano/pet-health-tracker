import { vi, describe, it, beforeEach, expect } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { remindersController } from './reminder-controller.js'
import {
  createReminderSchema,
  type ControllerDeps,
  type CreateReminderSchema,
  type ReminderWithEvent
} from '../types/reminders-types.js'
import { scheduleEmailReminder } from '../utils/schedulerEmailReminder.js'

vi.mock('../types/reminders-types.js', () => ({
  createReminderSchema: { parse: vi.fn() }
}))

vi.mock('../utils/schedulerEmailReminder.js', () => ({
  scheduleEmailReminder: vi.fn()
}))

describe('reminder-controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.resetAllMocks()
  })

  const setupMocks = (reqOverrides = {}, resOverrides = {}) => {
    const res: Partial<Response> = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
      json: vi.fn(),
      cookie: vi.fn().mockReturnThis(),
      ...resOverrides
    }
    const req: Partial<Request> = {
      body: {},
      user: {},
      params: {},
      ...reqOverrides
    }
    const next: Partial<NextFunction> = vi.fn()

    const nextFn = next as NextFunction
    const resFn = res as Response
    const reqFn = req as Request

    return { reqFn, resFn, nextFn }
  }

  describe('create', () => {
    it('should call remindersService.create and respond with newReminder', async () => {
      const reqBody = {
        eventId: '1',
        triggerTime: '2025-12-12T12:00:00Z'
      } satisfies CreateReminderSchema
      const { reqFn, resFn, nextFn } = setupMocks({ body: reqBody })
      vi.mocked(createReminderSchema.parse).mockReturnValue(reqBody)
      vi.mocked(scheduleEmailReminder).mockResolvedValue(undefined)

      const mockedNewReminder: ReminderWithEvent = {
        id: '1',
        eventId: '1',
        triggerTime: new Date('2025-12-12T12:00:00Z'),
        status: 'PENDING',
        event: {
          id: '1',
          attachmentUrl: '',
          date: new Date(),
          description: '',
          petId: '',
          type: 'FEEDING'
        }
      }

      const deps = {
        remindersService: {
          create: vi.fn().mockResolvedValue(mockedNewReminder),
          update: vi.fn(),
          listByEventId: vi.fn(),
          delete: vi.fn(),
          deleteAllByEventId: vi.fn()
        }
      } satisfies ControllerDeps

      const controller = remindersController(deps)
      await controller.create(reqFn, resFn, nextFn)
      await scheduleEmailReminder(
        'email@example.com',
        'asunto',
        'mensaje',
        'eventURl',
        '1',
        new Date('2025-12-12T12:00:00Z')
      )

      expect(createReminderSchema.parse).toHaveBeenCalledWith(reqBody)
      expect(deps.remindersService.create).toHaveBeenCalledWith(reqBody)
      expect(resFn.status).toHaveBeenCalledWith(201)
      expect(resFn.json).toHaveBeenLastCalledWith(mockedNewReminder)
      expect(nextFn).not.toHaveBeenCalled()
    })
  })

  describe('listEventReminders', () => {
    it('should call remindersService.listByEventId and respond with found reminders', async () => {
      const reqParams = {
        eventId: '1'
      }
      const { reqFn, resFn, nextFn } = setupMocks({ params: reqParams })
      const deps = {
        remindersService: {
          create: vi.fn(),
          update: vi.fn(),
          listByEventId: vi.fn().mockResolvedValue([]),
          delete: vi.fn(),
          deleteAllByEventId: vi.fn()
        }
      } satisfies ControllerDeps

      const controller = remindersController(deps)
      await controller.listEventReminders(reqFn, resFn, nextFn)
      expect(deps.remindersService.listByEventId).toHaveBeenCalledWith('1')
      expect(resFn.status).toHaveBeenCalledWith(200)
      expect(resFn.json).toHaveBeenCalledWith([])
      expect(nextFn).not.toHaveBeenCalled()
    })

    it('should throw an error if eventId is not in request params', async () => {
      const { reqFn, resFn, nextFn } = setupMocks()
      const deps = {
        remindersService: {
          create: vi.fn(),
          update: vi.fn(),
          listByEventId: vi.fn().mockResolvedValue([]),
          delete: vi.fn(),
          deleteAllByEventId: vi.fn()
        }
      } satisfies ControllerDeps

      const controller = remindersController(deps)
      await controller.listEventReminders(reqFn, resFn, nextFn)
      expect(nextFn).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should call remindersService.delete with id', async () => {
      const reqParams = {
        id: '1'
      }
      const { reqFn, resFn, nextFn } = setupMocks({ params: reqParams })
      const deps = {
        remindersService: {
          create: vi.fn(),
          update: vi.fn(),
          listByEventId: vi.fn(),
          delete: vi.fn().mockResolvedValue(undefined),
          deleteAllByEventId: vi.fn()
        }
      } satisfies ControllerDeps

      const controller = remindersController(deps)
      await controller.delete(reqFn, resFn, nextFn)
      expect(deps.remindersService.delete).toHaveBeenCalledWith('1')
      expect(resFn.status).toHaveBeenCalledWith(200)
      expect(resFn.json).toHaveBeenCalledWith({
        message: 'Reminder deleted successfully'
      })
      expect(nextFn).not.toHaveBeenCalled()
    })
    it('should throw an error if id is not in request params', async () => {
      const { reqFn, resFn, nextFn } = setupMocks()
      const deps = {
        remindersService: {
          create: vi.fn(),
          update: vi.fn(),
          listByEventId: vi.fn().mockResolvedValue([]),
          delete: vi.fn(),
          deleteAllByEventId: vi.fn()
        }
      } satisfies ControllerDeps

      const controller = remindersController(deps)
      await controller.delete(reqFn, resFn, nextFn)
      expect(nextFn).toHaveBeenCalled()
    })
  })

  describe('deleteAllByEventId', () => {
    it('should call remindersService.deleteAllByEventId', async () => {
      const reqParams = {
        eventId: '1'
      }
      const { reqFn, resFn, nextFn } = setupMocks({ params: reqParams })
      const deps = {
        remindersService: {
          create: vi.fn(),
          update: vi.fn(),
          listByEventId: vi.fn(),
          delete: vi.fn(),
          deleteAllByEventId: vi.fn().mockResolvedValue(undefined)
        }
      } satisfies ControllerDeps

      const controller = remindersController(deps)
      await controller.deleteAllByEventId(reqFn, resFn, nextFn)
      expect(deps.remindersService.deleteAllByEventId).toHaveBeenCalledWith('1')
      expect(resFn.status).toHaveBeenCalledWith(200)
      expect(resFn.json).toHaveBeenCalledWith({
        message: "Event's reminders deleted successfully"
      })
      expect(nextFn).not.toHaveBeenCalled()
    })

    it('should throw an error if eventId is not in request params', async () => {
      const { reqFn, resFn, nextFn } = setupMocks()
      const deps = {
        remindersService: {
          create: vi.fn(),
          update: vi.fn(),
          listByEventId: vi.fn(),
          delete: vi.fn(),
          deleteAllByEventId: vi.fn().mockResolvedValue([])
        }
      } satisfies ControllerDeps

      const controller = remindersController(deps)
      await controller.deleteAllByEventId(reqFn, resFn, nextFn)
      expect(nextFn).toHaveBeenCalled()
    })
  })
})
