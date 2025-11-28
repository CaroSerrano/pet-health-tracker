import { register } from 'module';
import type {ControllerDeps} from '../types/pets-types.js';
import type { Request, Response, NextFunction } from 'express';
import  { registerPetsSchema } from '../types/pets-types.js';
import { z, ZodError } from 'zod';

export const petController = (deps:ControllerDeps) => ({
  registerPet: async (req:Request, res: Response , next: NextFunction ) => {        
    try{            
      const data   = registerPetsSchema.parse(req.body);
      const userId = (req as any).user.id; 
      const photoUrl  = (req as any).cloudinaryImage;         
      const nameDuplicate = await deps.petService.namePetDuplicate(data.name,userId);
     
      if (nameDuplicate){
        return  res.status(400).json({message: "Ya tienes una mascota registrada con ese nombre"});
      }                         
      const newPet = await deps.petService.register({
        userId,
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        weight: data.weight,
        photoUrl: photoUrl.url,  
      });      
        return res.status(201).json({ 
          message:"Su mascota fue registrada con exito.", 
          data: newPet, 
            });
    }catch(error){         
      if(error instanceof ZodError){           
        const errorData = z.treeifyError(error);   
        return res.status (400).json(errorData);
      }            
      return res.status (500).json({error: "Error no esperado." });     
    } 
  },

  consultPet: async (req: Request, res: Response, next: NextFunction) => { 
    try{                                 
      const userId = (req as any).user.id;    
      const consultPetsUser = await deps.petService.consult(userId);    
            
      if ((consultPetsUser.length === 0))  {
        res.status(400).json({message: "No tiene mascotas registradas"});
      }        
      return res.status(200).json({ 
        message:"Listado de mascotas encontradas", 
        data: consultPetsUser, 
      });
    }catch(error){
      return res.status(500).json({ 
        message:"Error no esperado.",                 
      });            
    }        
  },

  consultPetId: async (req: Request, res: Response, next: NextFunction) => {
    try{
      const petId = req.params.id;      
      if (!petId){ 
        return res.status(400).json({ error: "Falta el parámetro id" });
      }
      const consultPetIdId = await deps.petService.consultPet(petId);
      if (!consultPetIdId) {
        return res.status(404).json({
          message: "La mascota no existe" }); 
      }
      return res.status(200).json({
        message:"Mascota Encontrada con exito",
        data: consultPetIdId});
    }catch{
      return res.status(500).json({
        message: "Error no esperado."
      });
    }        
  },

  editPetId: async (req: Request, res: Response, next: NextFunction) => {     
    try{       
      const data   = registerPetsSchema.parse(req.body);  
      const petId = req.params.id; 
      const userId = (req as any).user.id; 

      if (!petId){ 
        return res.status(400).json({ 
          message: "No existe la mascota" });
      }          
      const consultPetIdId = await deps.petService.consultPet(petId);
      if (!consultPetIdId) {
        return res.status(404).json({
          message: "La mascota no existe" }); 
      }
      const editPetsS = await deps.petService.editPets(petId,{      
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        weight: data.weight,        
      });       
      return res.status(200).json({
        message: "Mascota actualizada correctamente",
        data: data
      });
    }catch(error){
      if (error instanceof ZodError){
        const errorData = z.treeifyError(error);
        return res.status (400).json(errorData);
      }          
      return res.status(500).json({
        message: "Error no esperado."
      });    
    }       
  },
    
  eliminatePetId: async (req: Request, res: Response, next: NextFunction) => {
    try{
      const petId = req.params.id;
      if (!petId){ 
        return res.status(400).json({ error: "Falta el parámetro id" });
      }
      const consultRegister = await deps.petService.consultPet(petId);

      if (!consultRegister){
        return res.status(404).json({
        message: "La mascota no existe o ya fue eliminada"});
      }
      const deletePetId = await deps.petService.deletePet (petId)
      return res.status(200).json({
        message:"Mascota Eliminada",
        data: deletePetId });
    }catch{
      return res.status(500).json({message:"Error inesperado."})
    }        
  },

});
