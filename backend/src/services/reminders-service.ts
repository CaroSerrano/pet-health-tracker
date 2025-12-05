import { type PrismaClient, type Reminder } from '../generated/prisma/client.js'
import type {
  CreatePayload,
  ReminderWithEvent,
  UpdatePayload
} from '../types/reminders-types.js'

export class RemindersService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }
  async listByEventId(eventId: string): Promise<Reminder[]> {
    const reminders = await this.prisma.reminder.findMany({
      where: { eventId }
    })
    return reminders
  }
  async create(data: CreatePayload): Promise<ReminderWithEvent> {
    const newReminder = await this.prisma.reminder.create({
      data,
      include: { event: true }
    })
    return newReminder
  }

  async update(id: string, data: UpdatePayload): Promise<Reminder> {
    const updated = await this.prisma.reminder.update({
      where: { id: id },
      data
    })
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.prisma.reminder.delete({ where: { id } })
  }

  async deleteAllByEventId(eventId: string): Promise<void> {
    await this.prisma.reminder.deleteMany({ where: { eventId } })
  }
}
