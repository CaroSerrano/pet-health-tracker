import express from 'express'
import apiRouter from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import cookieParser from 'cookie-parser'
import { csrfProtection } from './middlewares/csrf.js'
import cors from 'cors'

const PORT = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
//app.use(csrfProtection)
apiRouter(app)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`)
})
