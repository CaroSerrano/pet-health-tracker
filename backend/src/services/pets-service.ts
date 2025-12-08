import { create } from 'domain';
import type { PrismaClient } from '../generated/prisma/client.js';
import { error } from 'console';
import cloudinary from '../cloudinary.js';

export class PetService {
  prisma: PrismaClient;                 

  constructor(prisma: PrismaClient) {   
    this.prisma = prisma;
  }

    async register({
    userId,    
    name,     
    species, 
    breed,    
    age,     
    weight,   
    photoUrl, 
   
    }: {
    userId: string; 
    name: string;
    species: string;
    breed: string;
    age: number;
    weight: number;
    photoUrl: string;
        
    }) {    
    
    return await this.prisma.pet.create({
      data: {
        userId,
        name,
        species,
        breed,
        age,
        weight,
        photoUrl,    
      },
    });    
  }  

  async consult(userId: string) {      
    const resultPets = await this.prisma.pet.findMany({
      where: {userId}
    });        
    return resultPets;    
  }

  async consultPet(id: string){
    const resultPedId = await this.prisma.pet.findUnique({
      where: {id}
    });   
    return resultPedId;
  }

  async deletePet(id: string){
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
      name: string;
      species: string;
      breed: string;
      age: number;
      weight: number;      
      photoUrl: string;
  }) 
  {
    const resultEditPets = await this.prisma.pet.update({
      where: {id},
        data         
    });
    return resultEditPets;
  }

  async namePetDuplicate(name: string, userId: string) {
    return await this.prisma.pet.findFirst({
      where: {
        name,
        userId,
      },
    });
  } 
}
