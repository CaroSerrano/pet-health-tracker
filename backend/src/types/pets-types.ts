import { z } from 'zod';
import type { PetService } from "../services/pets-service.js";

export interface ControllerDeps {
    petService: InstanceType<typeof PetService>; 
    
}

export const registerPetsSchema = z.object({
    name: z.string().regex(/^[a-zA-Z\s]+$/, { message: "El nombre solo puede contener letras y espacios" }).min(3,{message:"El nombre debe tener al menos 3 caracteres"}),
    species:z.string().min(1,{message: "La especie es obligatoria"}),
    breed: z.string ().min(1,{message:"La raza es obligatoria"}),
    age: z.coerce.number({message:"La edad debe ser un número"}).int({message: "La edad debe ser un número entero"}).positive({message: "La edad debe ser mayor a cero"}),
    weight: z.coerce.number({message:"El peso debe ser un número"}).positive({message: "El peso debe ser positivo y mayor a cero"}),     
    //photoUrl: z.url({message:"Se espera una URL válida"})

});

export type RegisterPetsSchema = z.infer<typeof registerPetsSchema>;