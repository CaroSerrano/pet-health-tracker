import { vi, describe, it, beforeEach, expect } from 'vitest'
import type { Request, Response, NextFunction } from 'express'
import { petController } from './pets-controller.js'
import {
  registerPetsSchema,
  type RegisterPetsSchema
} from '../types/pets-types.js'

vi.mock('../types/pets-types.js', () => ({
  registerPetsSchema: { parse: vi.fn() }
}))

describe('pets-controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })
  describe('register', () => {
    it('calls petService.register', async () => {
      const reqBody = {
        name: 'Firulais',
        species: 'Perro',
        breed: 'Labrador',
        gender: 'male',
        age: '2023-12-12T12:00:00Z',
        weight: 20
      } satisfies RegisterPetsSchema
      const req: Partial<Request> = {
        body: reqBody,
        user: { id: 'user123' },
        cloudinaryImage: { url: 'http://img.com/pet.jpg' }
      } as any
      const res: Partial<Response> = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      }
      const next: NextFunction = vi.fn()
      const mockPetCreated = {
        id: 'pet001',
        userId: 'user123',
        ...reqBody,
        notes: null,
        weighedAt: null,
        photoUrl: 'http://img.com/pet.jpg'
      }
      vi.mocked(registerPetsSchema.parse).mockReturnValue(reqBody)
      const deps = {
        petService: {
          prisma: {} as any,
          register: vi.fn().mockResolvedValue(mockPetCreated),
          consult: vi.fn(),
          consultPet: vi.fn(),
          deletePet: vi.fn(),
          editPets: vi.fn(),
          namePetDuplicate: vi.fn().mockResolvedValue(false)
        }
      }
      const controller = petController(deps)
      await controller.registerPet(
        req as Request,
        res as Response,
        next as NextFunction
      )
      expect(registerPetsSchema.parse).toHaveBeenCalledWith(reqBody)
      expect(deps.petService.namePetDuplicate).toHaveBeenCalledWith(
        'Firulais',
        'user123'
      )
      expect(deps.petService.register).toHaveBeenCalledWith({
        userId: 'user123',
        name: 'Firulais',
        species: 'Perro',
        breed: 'Labrador',
        gender: 'male',
        age: '2023-12-12T12:00:00Z',
        weight: 20,
        notes: null,
        weighedAt: null,
        photoUrl: 'http://img.com/pet.jpg'
      })
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Su mascota fue registrada con exito.',
        data: mockPetCreated
      })
      expect(next).not.toHaveBeenCalled()
    })

    describe('consult', () => {
      it('calls petService.consult', async () => {
        const mockPets = [
          {
            id: '1',
            name: 'Firulais',
            species: 'Perro',
            breed: 'Labrador',
            age: 3,
            weight: 20,
            photoUrl:
              'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
            userId: 'user123',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
        const req: Partial<Request> = {
          user: { id: 'user123' }
        } as any
        const res: Partial<Response> = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn()
        } as any
        const next: Partial<NextFunction> = vi.fn()
        const deps = {
          petService: {
            prisma: {} as any, // revisar
            register: vi.fn(),
            consult: vi.fn().mockResolvedValue(mockPets),
            consultPet: vi.fn(),
            deletePet: vi.fn(),
            editPets: vi.fn(),
            namePetDuplicate: vi.fn()
          }
        }
        const controller = petController(deps)
        await controller.consultPet(
          req as Request,
          res as Response,
          next as NextFunction
        )
        expect(deps.petService.consult).toHaveBeenCalledWith('user123')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
          message: 'Listado de mascotas encontradas',
          data: mockPets
        })
        expect(next).not.toHaveBeenCalled()
      })
    })

    describe('consultPet', () => {
      it('calls petService.consultPet ', async () => {
        const mockPets = {
          id: '1',
          name: 'Firulais',
          species: 'Perro',
          breed: 'Labrador',
          age: 3,
          weight: 20,
          photoUrl:
            'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
          userId: 'user123',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        const req: Partial<Request> = {
          params: { id: '1' }
        } as any
        const res: Partial<Response> = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn()
        } as any
        const next: Partial<NextFunction> = vi.fn()
        const deps = {
          petService: {
            prisma: {} as any,
            register: vi.fn(),
            consult: vi.fn(),
            consultPet: vi.fn().mockResolvedValue(mockPets),
            deletePet: vi.fn(),
            editPets: vi.fn(),
            namePetDuplicate: vi.fn()
          }
        }
        const controller = petController(deps)
        await controller.consultPetId(
          req as Request,
          res as Response,
          next as NextFunction
        )
        expect(deps.petService.consultPet).toHaveBeenCalledWith('1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
          message: 'Mascota Encontrada con exito',
          data: mockPets
        })
        expect(next).not.toHaveBeenCalled()
      })
      it('calls petService.consultPet, if pet does not exist', async () => {
        const req = {
          params: { id: 'pet999' }
        } as unknown as Request
        const res = {
          status: vi.fn(),
          json: vi.fn()
        } as unknown as Response
        const next = vi.fn()
        const deps = {
          petService: {
            prisma: {} as any,
            register: vi.fn(),
            consult: vi.fn(),
            consultPet: vi.fn().mockResolvedValue(undefined),
            deletePet: vi.fn(),
            editPets: vi.fn(),
            namePetDuplicate: vi.fn()
          }
        }
        const controller = petController(deps)
        await controller.consultPetId(
          req as Request,
          res as Response,
          next as NextFunction
        )
        expect(deps.petService.consultPet).toHaveBeenCalledWith('pet999')
        expect(next).toHaveBeenCalled()
        const [[errorArg]] = (next as any).mock.calls
        expect(errorArg.message).toBe('La mascota no existe.')
      })
    })

    describe('deletePet', () => {
      it('calls petService.deletePet ', async () => {
        const mockPetsDelete = {
          id: '1',
          name: 'Firulais',
          species: 'Perro',
          breed: 'Labrador',
          age: 3,
          weight: 20,
          photoUrl:
            'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
          userId: 'user123',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        const req: Partial<Request> = {
          params: { id: '1' }
        } as any
        const res: Partial<Response> = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn()
        } as any
        const next: Partial<NextFunction> = vi.fn()
        const deps = {
          petService: {
            prisma: {} as any,
            register: vi.fn(),
            consult: vi.fn(),
            consultPet: vi.fn().mockResolvedValue({ id: '1' }),
            deletePet: vi.fn().mockResolvedValue(mockPetsDelete),
            editPets: vi.fn(),
            namePetDuplicate: vi.fn()
          }
        }
        const controller = petController(deps)
        await controller.eliminatePetId(
          req as Request,
          res as Response,
          next as NextFunction
        )
        expect(deps.petService.consultPet).toHaveBeenCalledWith('1')
        expect(deps.petService.deletePet).toHaveBeenCalledWith('1')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
          message: 'Mascota Eliminada',
          data: mockPetsDelete
        })
        expect(next).not.toHaveBeenCalled()
      })

      it('petService.deletePet, if pet does not exist', async () => {
        const req: Partial<Request> = {
          params: { id: '1' }
        } as any
        const res: Partial<Response> = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn()
        } as any
        const next: Partial<NextFunction> = vi.fn()
        const deps = {
          petService: {
            prisma: {} as any,
            register: vi.fn(),
            consult: vi.fn(),
            consultPet: vi.fn().mockResolvedValue(null),
            deletePet: vi.fn(),
            editPets: vi.fn(),
            namePetDuplicate: vi.fn()
          }
        }
        const controller = petController(deps)
        await controller.eliminatePetId(
          req as Request,
          res as Response,
          next as NextFunction
        )
        expect(deps.petService.consultPet).toHaveBeenCalledWith('1')
        expect(next).toHaveBeenCalled()
      })
    })

    describe('editPets', () => {
      it('calls petService.editPets', async () => {
        const reqBody = {
          name: 'Firulais',
          species: 'Perro',
          breed: 'Labrador',
          gender: 'male',
          age: '2023-12-12T12:00:00Z',
          weight: 20
        } satisfies RegisterPetsSchema
        const req: Partial<Request> = {
          body: reqBody,
          params: { id: 'pet001' },
          cloudinaryImage: { url: 'http://img.com/pet.jpg' }
        } as any
        const res: Partial<Response> = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn()
        }
        const next = vi.fn()
        const mockPetEdit = {
          ...reqBody,
          photoUrl: 'http://img.com/pet.jpg',
          notes: null,
          weighed_at: null
        }
        vi.mocked(registerPetsSchema.parse).mockReturnValue(reqBody)
        const deps = {
          petService: {
            prisma: {} as any,
            register: vi.fn(),
            consult: vi.fn(),
            consultPet: vi.fn().mockResolvedValue(true),
            deletePet: vi.fn(),
            editPets: vi.fn().mockResolvedValue(mockPetEdit),
            namePetDuplicate: vi.fn()
          }
        }
        const controller = petController(deps)
        await controller.editPetId(
          req as Request,
          res as Response,
          next as NextFunction
        )
        expect(registerPetsSchema.parse).toHaveBeenCalledWith(reqBody)
        expect(deps.petService.editPets).toHaveBeenCalledWith('pet001', {
          name: 'Firulais',
          species: 'Perro',
          breed: 'Labrador',
          gender: 'male',
          age: '2023-12-12T12:00:00Z',
          notes: null,
          weighed_at: null,
          weight: 20,
          photoUrl: 'http://img.com/pet.jpg'
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
          message: 'Mascota actualizada correctamente',
          data: mockPetEdit
        })
        expect(next).not.toHaveBeenCalled()
      })
      it('calls petService.editPets, if pet does not exist', async () => {
        const reqBody = {
          name: 'Firulais',
          species: 'Perro',
          breed: 'Labrador',
          gender: 'male',
          age: '2023-12-12T12:00:00Z',
          weight: 20
        } satisfies RegisterPetsSchema
        const req: Partial<Request> = {
          body: reqBody,
          params: { id: 'pet001' },
          cloudinaryImage: { url: 'http://img.com/pet.jpg' }
        } as any
        const res: Partial<Response> = {
          status: vi.fn().mockReturnThis(),
          json: vi.fn()
        }
        const next: NextFunction = vi.fn()
        vi.mocked(registerPetsSchema.parse).mockReturnValue(reqBody)
        const deps = {
          petService: {
            prisma: {} as any,
            register: vi.fn(),
            consult: vi.fn(),
            consultPet: vi.fn().mockResolvedValue(null),
            deletePet: vi.fn(),
            editPets: vi.fn(),
            namePetDuplicate: vi.fn()
          }
        }
        const controller = petController(deps)
        await controller.editPetId(
          req as Request,
          res as Response,
          next as NextFunction
        )
        expect(deps.petService.consultPet).toHaveBeenCalledWith('pet001')
        expect(deps.petService.editPets).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
        const [[errorArg]] = (next as any).mock.calls
        expect(errorArg.message).toBe('La mascota no existe.')
      })
    })
  })
})
