import express from 'express'
import apiRouter from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import cookieParser from 'cookie-parser'

const PORT = process.env.PORT || 3000

const app = express()
app.use(cookieParser())
app.use(express.json())
apiRouter(app)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`)
})
