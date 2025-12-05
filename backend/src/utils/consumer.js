import { Worker } from 'bullmq'
import { Redis } from 'ioredis'
import nodemailer from 'nodemailer'
import { remindersService } from '../../dist/services/index.js'

const mailgunUser = process.env.MAILGUN_SMTP_USER
const mailgunPass = process.env.MAILGUN_SMTP_PASSWORD
const redisPort = process.env.REDIS_PORT
const redisHost = process.env.REDIS_HOST
const redisPass = process.env.REDIS_PASSWORD
const mailgunHost = process.env.MAILGUN_SMTP

if (
  !mailgunUser ||
  !mailgunPass ||
  !redisHost ||
  !redisPort ||
  !mailgunHost ||
  !redisPass
) {
  throw new Error('Environment variables missing')
}
const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(redisPort, 10),
  password: redisPass,
  maxRetriesPerRequest: null
})

const transporter = nodemailer.createTransport({
  host: mailgunHost,
  port: 587,
  secure: false,
  auth: {
    user: mailgunUser,
    pass: mailgunPass
  }
})

const worker = new Worker(
  'emailReminders',
  async (job) => {
    const { to, subject, body, eventUrl, reminderId } = job.data

    console.log(`Procesando recordatorio para: ${to} - Asunto: ${subject}`)
    let html = ''
    if (eventUrl !== '') {
      html = `
        <h1>${subject}</h1>
        <p>${body}</p>
        <p style="margin: 20px 0;">
          <a href="${eventUrl}" style="background-color: #FFBECC; color: black; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-weight: bold;">
            Ir al evento
          </a>
        </p>
        `
    } else {
      html = `<h1>${subject}</h1>
        <p>${body}</p>`
    }

    try {
      const info = await transporter.sendMail({
        from: `"Care Paws" <${mailgunUser}>`,
        to: to,
        subject: subject,
        html: html
      })
      await remindersService.update(reminderId, { status: 'SENT' })
      console.log(`✅ Email enviado a ${to}. Mensaje ID: ${info.messageId}`)
    } catch (error) {
      console.error(`❌ Error al enviar email a ${to}:`, error)
      throw new Error('Fallo en el envío del email')
    }
  },
  { connection }
)

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completado con éxito.`)
})

worker.on('failed', (job, err) => {
  console.error(`Job falló. Error: ${err.message}`)
})

console.log('Worker de recordatorios iniciado. Esperando trabajos...')
