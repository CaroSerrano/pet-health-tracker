import { describe, it, expect, vi, beforeEach, expectTypeOf } from 'vitest'
import prismaMock from '../__mocks__/client.js'
import { RemindersService } from './reminders-service.js'
import type {
  CreatePayload,
  ReminderWithEvent
} from '../types/reminders-types.js'
import type { Reminder } from '../generated/prisma/client.js'

const service = new RemindersService(prismaMock)

vi.mock('/src/client')

describe('reminders-service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('create', () => {
    it('should call prisma.create with data and return created reminder with event included', async () => {
      const data: CreatePayload = {
        eventId: '1',
        triggerTime: '2025-12-12T12:00:00Z'
      }
      const newReminder = await service.create(data)
      expect(prismaMock.reminder.create).toHaveBeenCalledWith({
        data: data,
        include: { event: true }
      })
      expectTypeOf(newReminder).toEqualTypeOf<ReminderWithEvent>
    })
  })

  describe('listByEventId', () => {
    it('should call prisma.findMany with eventId as filter and return result array', async () => {
      const result = await service.listByEventId('1')
      expect(prismaMock.reminder.findMany).toHaveBeenCalledWith({
        where: { eventId: '1' }
      })

      expectTypeOf(result).toBeArray()
    })
  })

  describe('update', () => {
    it('should call prisma.update with id and data and return updated reminder', async () => {
      const result = await service.update('1', { status: 'SENT' })
      expect(prismaMock.reminder.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'SENT' }
      })
      expectTypeOf(result).toEqualTypeOf<Reminder>
    })
  })

  describe('delete', () => {
    it('should call prisma.delete with id', async () => {
      await service.delete('1')
      expect(prismaMock.reminder.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      })
    })
  })

  describe('deleteAllByEventId', () => {
    it('should call prisma.deleteMany with eventId as filter', async () => {
      await service.deleteAllByEventId('1')
      expect(prismaMock.reminder.deleteMany).toHaveBeenCalledWith({
        where: { eventId: '1' }
      })
    })
  })
})
