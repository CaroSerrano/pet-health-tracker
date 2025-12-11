/**
 * @swagger 
 * tags:
 *   - name: Autenticación
 *     description: Operaciones relacionadas con usuario
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string                
 *                        
 *     responses:
 *       201:
 *         description: User registered.
 *       400:
 *         description: expected string to have >=6 characters.
 *       500: 
 *         description: Internal server error.      
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@gmail.com 
 *               password:
 *                 type: string 
 *                 example: 123456              
 *                        
 *     responses:
 *       200:
 *         description: ok.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX
 *       400:
 *         description: Invalid credentials.   
 *       500: 
 *         description: Internal server error.    
 */

/**
 * @swagger
 * /api/auth/currentUser:
 *   get:
 *     summary: Obtener usuario actual
 *     tags: [Autenticación]    
 *     responses:
 *       200:
 *         description: ok.
 *       401:
 *         description: No token.   
 *       500: 
 *         description: Internal server error.  
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []     
 *                       
 *     responses:
 *       200:       
 *         description: Logged out.  
 *       500: 
 *         description: Internal server error.                 
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Olvidé contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string                            
 *                        
 *     responses:
 *       200:
 *         description: Recovery password email sent to caroserrano297@gmail.com  
 *       400:
 *         description: Invalid email address.
 *       500: 
 *         description: Internal server error.  
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   put:
 *     summary: Recetear contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string  
 *               newPassword:
 *                 type: string        
 *                        
 *     responses:
 *       200:
 *         description: Password updated.  
 *       401:
 *         description: jwt expired. 
 *       400:
 *         description: "Invalid input: expected string, received undefined." 
 *       500: 
 *         description: Internal server error.      
 */


