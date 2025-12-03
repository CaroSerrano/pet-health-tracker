import prisma from '../client.js'

import { AuthService } from './auth-service.js'

export const authService = new AuthService(prisma)

import { PetService } from './pets-service.js'

export const petService = new PetService(prisma)

import { EventService } from './event-services.js'

export const eventService = new EventService(prisma)
