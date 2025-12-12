/**
 * @swagger
 * tags:
 *   - name: Recordatorios
 *     description: Recordatorios de Mascotas
 */

/**
 * @swagger
 * /api/reminders/{eventId}:
 *   get:
 *     summary: Listar recordatorios de un evento
 *     tags: [Recordatorios]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de recordatorios
 *       400:
 *         description: eventId is required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reminders:
 *   post:
 *     summary: Crear recordatorio
 *     tags: [Recordatorios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             - eventId
 *             - triggerTime
 *             properties:
 *               eventId:
 *                 type: string
 *               triggerTime:
 *                 type: string
 *                 description: Activation time (ISO 8601)
 *               description:
 *                 type: string
 *                 description: Optional notes
 *               eventUrl:
 *                 type: string
 *                 description: Optional. To allow the user to navigate to the event page
 *     responses:
 *       201:
 *         description: OK
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reminders/event/{eventId}:
 *   delete:
 *     summary: Eliminar todos los recordatorios de un evento
 *     tags: [Recordatorios]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reminder deleted successfully
 *       400:
 *         description: id is required
 *       500:
 *         description: Internal server error
 *
 */

/**
 * @swagger
 * /api/reminders/{id}:
 *   delete:
 *     summary: Eliminar un recordatorio por ID
 *     tags: [Recordatorios]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:Optional
 *           type: string
 *     responses:
 *       200:
 *         description: Event's reminders deleted successfully
 *       400:
 *         description: eventId is required
 *       500:
 *         description: Internal server error
 */
