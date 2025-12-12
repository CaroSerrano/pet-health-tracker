import express from 'express'
import apiRouter from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import cookieParser from 'cookie-parser'
import { csrfProtection } from './middlewares/csrf.js'
import cors from 'cors'

const PORT = process.env.PORT || 3000

const app = express()
const allowedOrigins = [
  'https://pet-health-tracker-frontend.vercel.app',
  'http://localhost:5173', 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if ( !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']
  })
);
app.use(cookieParser())
app.use(express.json())
//app.use(csrfProtection)
apiRouter(app)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`)
})
