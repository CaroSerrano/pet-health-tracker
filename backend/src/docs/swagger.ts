import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const swaggerDocuments = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Health Tracker',
      version: '1.0.0',
      description: 'API para gestionar mascotas, salud y eventos.',
      contact: {
        name: 'Equipo Dev',
      },
    },
    servers: 
    [{
        url: 'http://localhost:3000',
        description: 'Local Server',
        
      },
      {
        url: 'https://pet-health-tracker-backend.onrender.com',
        description: 'Servidor Render',
        
      },
      {
        url: 'https://pet-health-tracker-backend.onrender.com',
        description: 'Production Server'
      }
    ],
  },
  apis: ['./src/routes/*.ts',"./src/docs/*.ts"],
    
};
export const swaggerSpec = swaggerJsdoc(swaggerDocuments);
export { swaggerUi };