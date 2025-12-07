import { Worker } from 'bullmq'
import { Redis } from 'ioredis'
import nodemailer from 'nodemailer'
import { remindersService } from '../../dist/services/index.js'

// Aclaración: El entorno de prueba de Mailgun solo permite enviar emails a las direcciones autorizadas (hasta 5). Como estamos utilizando un dominio de prueba, los emails llegan a la carpeta SPAM.

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
    const { to, subject, body, eventUrl, reminderId, eventDate } = job.data

    let html = ''
    if (eventUrl !== '') {
      html = `
        <h1>${subject}</h1>
        <p>Día y hora: ${eventDate}</p>
        <p>${body}</p>
        <p style="margin: 20px 0;">
          <a href="${eventUrl}" style="background-color: #FFBECC; color: black; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-weight: bold;">
            Ir al evento
          </a>
        </p>
        `
    } else {
      html = `<h1>${subject}</h1>
      <p>Día y hora: ${eventDate}</p>
        <p>${body}</p>`
    }

    try {
      await transporter.sendMail({
        from: `"Care Paws" <${mailgunUser}>`,
        to: to,
        subject: subject,
        html: html
      })
      await remindersService.update(reminderId, { status: 'SENT' })
    } catch (error) {
      throw new Error('Error sending email')
    }
  },
  { connection }
)

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully.`)
})

worker.on('failed', (job, err) => {
  console.error(`Job failed. Error: ${err.message}`)
})

console.log('Reminders worker started. Waiting for jobs...')
