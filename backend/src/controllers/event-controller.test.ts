import { vi, describe, it, beforeEach, expect } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { eventController } from './event-controller.js';
import { registerEventSchema} from '../types/event-types.js';
import { EventType } from '../generated/prisma/enums.js';
import type { eventService } from '../services/index.js';

vi.mock('../types/event-types.js', () => ({
  registerEventSchema: { parse: vi.fn() },
}));
describe('event-controller', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('register', () => {
    it ('call eventService.register', async () => {
      const reqBody = {                   
        type: EventType.VACCINE,
        description: 'Vacuna anual',
        date: '2025-01-01',   
      };
      const req: Partial<Request> = {
        params: { id: '1' },
        body: reqBody,
        cloudinaryImage: { url: 'http://img.com/photo.jpg' } ,
      } as any;
      const res: Partial<Response> = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next: Partial<NextFunction> = vi.fn();  
      vi.mocked(registerEventSchema.parse).mockReturnValue(reqBody);
      const mockEvent = {
        id: 10,
        petId: "1",
        ...reqBody,
        attachmentUrl: "http://img.com/photo.jpg",
      };
      const deps = {              
        eventService: {
          prisma: {} as any, 
          register: vi.fn().mockResolvedValue(mockEvent),
          consultEventPet: vi.fn(),
          consultEventTypePet: vi.fn(),                
        },
      };
      const controller = eventController(deps);
      await controller.createEvent(
        req as Request,
        res as Response,
        next as NextFunction
      );
      expect(registerEventSchema.parse).toHaveBeenCalledWith(reqBody);
      expect(deps.eventService.register).toHaveBeenCalledWith({
        petId: '1' ,            
        type: EventType.VACCINE,
        description: 'Vacuna anual',
        date: '2025-01-01',
        attachmentUrl: 'http://img.com/photo.jpg',        
      });
      expect(res.status).toHaveBeenCalledWith(201);  
      expect(res.json).toHaveBeenCalledWith({ 
        menssage: "Evento registrado con exito.",
        data: mockEvent,
      });            
    });
  });

  describe('consultEventTypePet', ()=> {
    it ('call eventService.consultEventTypePet', async () => {
      const mockEvents = [{
        id: 10, 
        petId: '1', 
        type: EventType.VACCINE,
        description: 'Vacuna anual',
        date: '2025-01-01' 
      }];
      const req: Partial<Request> = {
        params: { id: '1' },
        query: { type: EventType.VACCINE }        
      };
      const res: Partial<Response> = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next: Partial<NextFunction> = vi.fn();     
      const deps = {              
        eventService: {
          prisma: {} as any, 
          register: vi.fn(),         
          consultEventPet: vi.fn(),
          consultEventTypePet: vi.fn().mockResolvedValue(mockEvents),                
        },
      };
      const controller = eventController(deps);
      await controller.getPetsEvent(
        req as Request,
        res as Response,
        next as NextFunction
      );   
      expect(deps.eventService.consultEventTypePet).toHaveBeenCalledWith('1', EventType.VACCINE);      
      expect(res.status).toHaveBeenCalledWith(200);  
      expect(res.json).toHaveBeenCalledWith({ 
        menssage: "Eventos de su Mascota.",
        data: mockEvents,
      }); 
    });
  });
 
  describe('consultEventPet', ()=> {
    it ('call eventService.consultEventPet', async () => {
      const mockEvents = [{
        id: 10, 
        petId: '1', 
        type: EventType.VACCINE,
        description: 'Vacuna anual',
        date: "2025-01-01" 
      }];
      const req: Partial<Request> = {
        params: { id: '1' },
        query: { }        
      };
      const res: Partial<Response> = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
      const next: Partial<NextFunction> = vi.fn();     
      const deps = {              
        eventService: {
          prisma: {} as any, 
          register: vi.fn(),         
          consultEventPet: vi.fn().mockResolvedValue(mockEvents),
          consultEventTypePet: vi.fn(),                
        },
      };
      const controller = eventController(deps);
      await controller.getPetsEvent(
        req as Request,
        res as Response,
        next as NextFunction
      );
      expect(deps.eventService.consultEventPet).toHaveBeenCalledWith('1');           
      expect(res.status).toHaveBeenCalledWith(200);  
      expect(res.json).toHaveBeenCalledWith({ 
        menssage: "Eventos de su Mascota.",
        data: mockEvents,
      }); 
    });
  });
});