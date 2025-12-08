import {describe, it, expect, vi, beforeEach} from 'vitest';
import {EventService} from './event-services.js';
import prismaMock from '../__mocks__/client.js';
import { EventType } from '../generated/prisma/enums.js';
//import type { id } from 'zod/locales';
 
const service = new EventService(prismaMock);

vi.mock('../src/client');

describe('event-services', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  describe('register', () => {
    it('should register an event successfully.', async () => {
      const mockEvent = { 
        id: '1',
        type: EventType.VACCINE,
        description: "Control anual",
        date: new Date(),
        attachmentUrl: "https://res.cloudinary.com/dv8vuqvfh/raw/upload/v1764616929/mis_documentos/Pets.docx",
        petId:"2",        
      };
      prismaMock.event.create.mockResolvedValue (mockEvent);      
      const result = await service.register({
        type: EventType.VACCINE,
        description: "Control anual",
        date: "2024-01-01",
        attachmentUrl: "https://res.cloudinary.com/dv8vuqvfh/raw/upload/v1764616929/mis_documentos/Pets.docx",
        petId:"2",   
      })    
      expect(prismaMock.event.create).toHaveBeenCalledWith({ 
        data: { 
          type: EventType.VACCINE, 
          description: "Control anual", 
          date: "2024-01-01", 
          attachmentUrl: "https://res.cloudinary.com/dv8vuqvfh/raw/upload/v1764616929/mis_documentos/Pets.docx",
          petId: "2", 
        },
      }); 
      expect(result).toEqual(mockEvent);
    }); 
  });
  
  describe('consultEventPet',() => {
    it ('should return events for a pet', async () => {
      const events = ([
        { id: "1",
          type: EventType.VACCINE,
          description: "Test",
          date: new Date(),
          attachmentUrl: "https://url.com/test",
          petId: "2",
        },
      ]);    
      prismaMock.event.findMany.mockResolvedValue(events);
      const result = await service.consultEventPet("10");
      expect(prismaMock.event.findMany).toHaveBeenCalledWith({
        where: {petId: "10"},
        orderBy: {date: "desc"},
      });
      expect(result).toEqual(events);
    });
  });

  describe('consultEventTypePet',() => {
    it ('should return events filtered by type',async () =>{
      const events =  ([
       { id: "1",
         type: EventType.VACCINE,
         description: "Test",
         date: new Date(),
         attachmentUrl: "https://res.cloudinary.com/dv8vuqvfh/raw/upload/v1764616929/mis_documentos/Pets.docx",
         petId: "2",
        },
      ]);        
      prismaMock.event.findMany.mockResolvedValue(events);
      const result = await service.consultEventTypePet("10", EventType.VACCINE);
      expect(prismaMock.event.findMany).toHaveBeenCalledWith({
        where: { petId: "10", type: EventType.VACCINE },
        orderBy: { date: "desc" },
      });
      expect(result).toEqual(events);   
    });
  });
});


