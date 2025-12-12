import type { ControllerDeps } from '../types/pets-types.js'
import type { Request, Response, NextFunction } from 'express'
import { registerPetsSchema } from '../types/pets-types.js'
import { ValidationError, NotFoundError } from '../types/errors.js'

export const petController = (deps: ControllerDeps) => ({
  registerPet: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerPetsSchema.parse(req.body)
      const userId = (req as any).user.id
      const photoUrl = (req as any).cloudinaryImage
      const nameDuplicate = await deps.petService.namePetDuplicate(
        data.name,
        userId
      )

      if (nameDuplicate) {
        throw new ValidationError(
          'Ya tienes una mascota registrada con ese nombre.'
        )
      }

      const newPet = await deps.petService.register({
        userId,
        name: data.name,
        species: data.species,
        breed: data.breed,
        gender: data.gender,
        age: data.age,
        weight: data.weight,
        weighed_at: data.weighed_at ? data.weighed_at : null,
        notes: data.notes ? data.notes : null,
        photoUrl: photoUrl.url
      })
      return res.status(201).json({
        message: 'Su mascota fue registrada con exito.',
        data: newPet
      })
    } catch (error) {
      next(error)
    }
  },

  consultPet: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id
      const consultPetsUser = await deps.petService.consult(userId)

      if (consultPetsUser.length === 0) {
        throw new ValidationError('No tiene mascotas registradas')
      }
      return res.status(200).json({
        message: 'Listado de mascotas encontradas',
        data: consultPetsUser
      })
    } catch (error) {
      next(error)
    }
  },

  consultPetId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const petId = req.params.id
      if (!petId) {
        throw new ValidationError('Falta el parámetro id.')
      }
      const consultPetIdId = await deps.petService.consultPet(petId)
      if (!consultPetIdId) {
        throw new NotFoundError('La mascota no existe.')
      }
      return res.status(200).json({
        message: 'Mascota Encontrada con exito',
        data: consultPetIdId
      })
    } catch (error) {
      next(error)
    }
  },

  editPetId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerPetsSchema.parse(req.body)
      const petId = req.params.id
      const photoUrl = (req as any).cloudinaryImage

      if (!petId) {
        throw new ValidationError('No existe la mascota.')
      }
      const consultPetIdId = await deps.petService.consultPet(petId)
      if (!consultPetIdId) {
        throw new NotFoundError('La mascota no existe.')
      }
      const editPetsS = await deps.petService.editPets(petId, {
        name: data.name,
        species: data.species,
        breed: data.breed,
        gender: data.gender,
        age: data.age,
        weight: data.weight,
        weighed_at: data.weighed_at ? data.weighed_at : null,
        notes: data.notes ? data.notes : null,
        photoUrl: photoUrl.url
      })
      return res.status(200).json({
        message: 'Mascota actualizada correctamente',
        data: editPetsS
      })
    } catch (error) {
      next(error)
    }
  },

  eliminatePetId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const petId = req.params.id
      if (!petId) {
        throw new ValidationError('Falta el parámetro id.')
      }
      const consultRegister = await deps.petService.consultPet(petId)
      if (!consultRegister) {
        throw new NotFoundError('La mascota no existe o ya fue eliminada.')
      }
      const deletePetId = await deps.petService.deletePet(petId)
      return res.status(200).json({
        message: 'Mascota Eliminada',
        data: deletePetId
      })
    } catch (error) {
      next(error)
    }
  }
})
