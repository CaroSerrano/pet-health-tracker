/**
 * @swagger 
 * tags:
 *   - name: Pets
 *     description: Operaciones relacionadas con mascotas
 */

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Listar mascotas
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Listado de mascotas encontradas
 *       400:
 *         description: No tiene mascotas registradas
 *       500: 
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:        
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: string
 *               weight:
 *                 type: string 
 *               photoUrl:
 *                 type: string
 *                 format: binary
 *                        
 *     responses:
 *       201:
 *         description: Mascota creada
 *       400: 
 *        description: Ya tienes una mascota registrada con ese nombre   
 *       500: 
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Listar una mascota por ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la mascota
 *         schema:
 *         type: string     
 *     responses:
 *       200:
 *         description: Mascota Encontrada con exito
 *       404:
 *         description: La mascota no existe
 *       500: 
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/pets/{id}/events:
 *   post:
 *     summary: Crear evento
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la mascota
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               attachmentUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Evento registrado con exito
 *       500:
 *         description: Error
 */

/**
 * @swagger
 * /api/pets/{id}/events:
 *   get:
 *     summary: Obtener eventos de una mascota
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la mascota
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: false
 *         description: Filtrar eventos por tipo
 *         schema:
 *           type: string
 *           enum: [VACCINE, VET_VISIT, FEEDING]
 *     responses:
 *       200:
 *         description: Eventos de su Mascota
 *       404:
 *         description: No hay eventos registrados
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Editar datos de una mascota
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la mascota a editar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:        
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *               breed:
 *                 type: string
 *               age:
 *                 type: string
 *               weight:
 *                 type: string 
 *               photoUrl:
 *                 type: string
 *                 format: binary
 *                        
 *     responses:
 *       200:
 *         description: Mascota actualizada correctamente
 *       404: 
 *        description: La mascota no existe   
 *       500: 
 *        description: Internal server error
 */

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Eliminar una mascota por ID 
 *     tags: [Pets]    
 *     parameters:
 *       - name: id
 *         in: path         
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mascota Eliminada
 *       404: 
 *        description: La mascota no existe o ya fue eliminada
 *       500: 
 *        description: Internal server error      
 */ 