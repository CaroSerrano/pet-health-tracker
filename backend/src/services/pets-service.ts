import type { PrismaClient } from '../generated/prisma/client.js'

export class PetService {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async register({
    userId,
    name,
    species,
    breed,
    age,
    weight,
    photoUrl
  }: {
    userId: string
    name: string
    species: string
    breed: string
    age: number
    weight: number
    photoUrl: string
  }) {
    // realizar todas las validaciones
    if (!name) {
      throw new Error('El nombre es obligatorio')
    }

    if (typeof name !== 'string') {
      throw new Error('El nombre debe ser texto')
    }

    if (typeof species !== 'string') {
      throw new Error('La especie debe ser texto')
    }

    if (typeof breed !== 'string') {
      throw new Error('La raza debe ser texto')
    }

    if (typeof age !== 'number' || age <= 0) {
      throw new Error('La edad debe ser un número mayor que 0')
    }

    if (typeof weight !== 'number' || weight <= 0) {
      throw new Error('El peso debe ser un número mayor que 0')
    }

    if (photoUrl && typeof photoUrl !== 'string') {
      throw new Error('La foto debe ser una URL válida')
    }

    return await this.prisma.pet.create({
      data: {
        userId,
        name,
        species,
        breed,
        age,
        weight,
        photoUrl
      }
    })
  }

  async consult(userId: string) {
    const resultPets = await this.prisma.pet.findMany({
      where: { userId }
    })
    return resultPets
  }

  async consultPet(id: string) {
    const resultPedId = await this.prisma.pet.findUnique({
      where: { id }
    })
    return resultPedId
  }

  async deletePet(id: string) {
    const petDelete = await this.prisma.pet.findUnique({
      where: {id}
    });
    if (!petDelete){      
      return null;
    }        
    return await this.prisma.pet.delete({
        where: {id}
      });      
  }
  
  async editPets(
    id: string,
    data: {
      name: string
      species: string
      breed: string
      age: number
      weight: number
      photoUrl: string
    }
  ) {
    const resultEditPets = await this.prisma.pet.update({
      where: { id },
      data
    })
    return resultEditPets
  }

  async namePetDuplicate(name: string, userId: string) {
    return await this.prisma.pet.findFirst({
      where: {
        name,
        userId
      }
    })
  }
}
