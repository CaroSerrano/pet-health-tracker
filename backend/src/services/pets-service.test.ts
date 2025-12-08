import {describe, it, expect, vi, beforeEach} from 'vitest';
import {PetService} from './pets-service.js';
import prismaMock from '../__mocks__/client.js';

const service = new PetService(prismaMock);

vi.mock('../src/client');

describe('pets-service', () => {
  beforeEach( () => {
    vi.restoreAllMocks()
  });
  describe('register', () => {
    it('should register an pets successfully.', async () => {
      const mockPet = {
        id: '1',        
        name: 'Manchitas',
        species: 'Perro',
        breed: 'Puder',
        age: 7,
        weight: 8.5,
        photoUrl: 'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
        userId: 'd74d8fe5-6782-47fa-a292-4f3f6d7da038',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.pet.create.mockResolvedValue(mockPet); 
      await expect(
        service.register({           
          name:'Manchitas',
          species:'Perro',
          breed: 'Puder',
          age:7, 
          weight:8.5,
          photoUrl: 'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
          userId:'d74d8fe5-6782-47fa-a292-4f3f6d7da038',
        })
      ).resolves.toEqual(mockPet);     
      expect(prismaMock.pet.create).toHaveBeenCalledWith({ 
        data: {
          name:'Manchitas',
          species:'Perro',
          breed: 'Puder',
          age:7, 
          weight:8.5,
          photoUrl: 'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
          userId:'d74d8fe5-6782-47fa-a292-4f3f6d7da038', 
        }     
      });       
    }); 
  });

  describe('consult',() => {
    it ('should consult pets by userId',async () =>{
      const mockpets = [{
        id: '1',        
        name: 'Manchitas',
        species: 'Perro',
        breed: 'Puder',
        age: 7,
        weight: 8.5,
        photoUrl: 'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
        userId: 'd74d8fe5-6782-47fa-a292-4f3f6d7da038',
        createdAt: new Date(),
        updatedAt: new Date(),
      }];
      prismaMock.pet.findMany.mockResolvedValue(mockpets);   
      const result = await service.consult('d74d8fe5-6782-47fa-a292-4f3f6d7da038');
      expect(prismaMock.pet.findMany).toHaveBeenCalledWith({
        where: {userId: 'd74d8fe5-6782-47fa-a292-4f3f6d7da038'},
      });
      expect(result).toEqual(mockpets);
    });
  });

  describe('consultPet',() => {
    it ('should consult pet by id',async () =>{
      const mockPetId = {
        id: '1',        
        name: 'Manchitas',
        species: 'Perro',
        breed: 'Puder',
        age: 7,
        weight: 8.5,
        photoUrl: 'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
        userId: 'd74d8fe5-6782-47fa-a292-4f3f6d7da038',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.pet.findUnique.mockResolvedValue(mockPetId);
      const result = await service.consultPet('1');
      expect(prismaMock.pet.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockPetId);   
    });
  });

  describe('deletePet',() => {
    it ('should delete a pet successfully',async () =>{
      const mockPet = {
        id: '1',        
        name: 'Manchitas',
        species: 'Perro',
        breed: 'Puder',
        age: 7,
        weight: 8.5,
        photoUrl: 'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
        userId: 'd74d8fe5-6782-47fa-a292-4f3f6d7da038',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.pet.findUnique.mockResolvedValue(mockPet);
      prismaMock.pet.delete.mockResolvedValue(mockPet);
      const result = await service.deletePet ('1');
      expect(prismaMock.pet.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
      });
      expect(prismaMock.pet.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(result).toEqual(mockPet);      
    });   
    it('should return null when pet does not exist', async () => {
      prismaMock.pet.findUnique.mockResolvedValue(null);
      const result = await service.deletePet('999');
      expect(prismaMock.pet.findUnique).toHaveBeenCalledWith({
        where: { id: '999' },
      });
      expect(result).toBeNull();
    });
  });

  describe('editPets',() => {
    it ('should edit a pet successfully',async () =>{
      const mockPet = {
        id: '1',
        name: 'Boby',
        species: 'Perro',
        breed: 'Beagle',
        age: 4,
        weight: 14,
        photoUrl: 'https://res.cloudinary.com/dv8vuqvfh/image/upload/v1764787117/mis_imagenes/o6l03tmio9xgub0nen3y.png',
        userId: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.pet.update.mockResolvedValue(mockPet);
      const result = await service.editPets('1', {
        name: mockPet.name,
        species: mockPet.species,
        breed: mockPet.breed,
        age: mockPet.age,
        weight: mockPet.weight,
        photoUrl: mockPet.photoUrl,
      });
      expect(prismaMock.pet.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          name: mockPet.name,
          species: mockPet.species,
          breed: mockPet.breed,
          age: mockPet.age,
          weight: mockPet.weight,
          photoUrl: mockPet.photoUrl,
        },
      });
      expect(result).toEqual(mockPet);      
    });
  });
  
  describe('namePetDuplicate', () =>{
      it('should return pet if name is duplicated', async() => {    
        const mockduplicated = {
          id: '1',
          name: 'Luna',
          species: 'Perro',
          breed: 'Labrador',
          age: 3,
          weight: 20,
          photoUrl: 'http://foto.jpg',
          userId: '123',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        prismaMock.pet.findFirst.mockResolvedValue(mockduplicated);
        const result = await service.namePetDuplicate('Luna', '123');
        expect(prismaMock.pet.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'Luna',
          userId: '123',
        },
      });
      expect(result).toEqual(mockduplicated);
    });    
  });
});






