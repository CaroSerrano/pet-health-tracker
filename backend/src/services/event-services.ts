import { EventType, PrismaClient } from '../generated/prisma/client.js'

export class EventService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async register({
    petId,
    type,
    description,
    date,
    attachmentUrl
  }: {
    petId: string
    type: EventType
    description: string
    date: string
    attachmentUrl: string
  }) {
    return this.prisma.event.create({
      data: {
        petId,
        type,
        description,
        date,
        attachmentUrl
      }
    })
  }

  async consultEventPet(petId: string) {
    const resulEvent = await this.prisma.event.findMany({
      where: { petId },
      orderBy: { date: 'desc' }
    })
    return resulEvent
  }

  async consultEventTypePet(petId: string, type: EventType) {
    const resulEventType = await this.prisma.event.findMany({
      where: { petId, type },
      orderBy: { date: 'desc' }
    })
    return resulEventType
  }
}
