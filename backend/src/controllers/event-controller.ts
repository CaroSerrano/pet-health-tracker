import { register } from 'module';
import type {ControllerDeps} from '../types/event-types.js';
import type {Response, Request, NextFunction} from 'express';
import { registerEventSchema } from '../types/event-types.js';
import { error } from 'console';
import type { EventType } from '../generated/prisma/enums.js';
import { NotFoundError, ValidationError } from '../types/errors.js';

export const eventController = (deps: ControllerDeps) => ({
  createEvent: async (req: Request, res: Response, next: NextFunction ) => {    
    try{
      const data = registerEventSchema.parse(req.body);       
      const petId = req.params.id;     
      const attachmentUrl  = (req as any).cloudinaryImage;   

      if (!petId){         
        throw new ValidationError ("Falta el parámetro id");      
      }      
      const newEvent = await deps.eventService.register({ 
        petId,            
        type: data.type,
        description: data.description,
        date: data.date,
        attachmentUrl:  attachmentUrl ? attachmentUrl.url : "", 
      });
      return res.status(201).json({
        menssage: "Evento registrado con exito.", 
        data: newEvent
      });
    }catch(error){  
      next(error) 
    }
  },

  getPetsEvent: async(req: Request, res: Response, next: NextFunction) => { 
    try{
      const petId = req.params.id;   
      const type =  req.query.type as EventType | undefined;

      if (!petId){        
        throw new ValidationError ("Falta el parámetro id");
      }        
      let newGetEvent;
      if (type){        
        newGetEvent = await deps.eventService.consultEventTypePet(petId,type);    
      }else{     
        newGetEvent = await deps.eventService.consultEventPet(petId);       
      }   
      if (!newGetEvent || newGetEvent.length === 0) {            
        throw new NotFoundError ("No hay eventos registrados.");
      }
      return res.status(200).json({
        menssage:"Eventos de su Mascota.", 
        data: newGetEvent
      });
    }catch(error){      
      next(error)
    }  
  },   
});


