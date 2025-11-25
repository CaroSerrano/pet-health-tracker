import type { PrismaClient } from '../generated/prisma/client.js';
import { error } from 'console';

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

}
