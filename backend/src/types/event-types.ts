import { string, z } from 'zod'
import type { EventService } from '../services/event-services.js'
import { EventType } from '../generated/prisma/client.js'

export interface ControllerDeps {
  eventService: InstanceType<typeof EventService>
}

export const registerEventSchema = z.object({
  type: z.nativeEnum(EventType, {
    message: 'El tipo de evento es obligatorio'
  }),
  description: z
    .string({ message: 'La descripcion es obligatoria' })
    .min(5, { message: 'La descripcion debe tener minimo 5 caracteres' }),
  date: z.string({ message: 'La fecha es obligatoria' })
})

export type RegisterEventSchema = z.infer<typeof registerEventSchema>
