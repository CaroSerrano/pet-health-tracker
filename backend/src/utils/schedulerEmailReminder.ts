import { Queue } from 'bullmq'
import { Redis } from 'ioredis'

const redisPort = process.env.REDIS_PORT
const redisHost = process.env.REDIS_HOST
const redisPass = process.env.REDIS_PASSWORD
if (!redisHost || !redisPort || !redisPass) {
  throw new Error('Environment variables missing')
}
const connection = new Redis({
  host: redisHost,
  port: parseInt(redisPort, 10),
  password: redisPass
})

const reminderQueue = new Queue('emailReminders', { connection })

export async function scheduleEmailReminder(
  toEmail: string,
  subject: string,
  message: string,
  eventUrl: string,
  reminderId: string,
  triggerTime: Date
) {
  const now = Date.now()
  const scheduledTime = triggerTime.getTime()

  const delay = scheduledTime - now

  if (delay <= 0) {
    console.warn(
      'El triggerTime es en el pasado o ahora. Enviando inmediatamente.'
    )
  }

  await reminderQueue.add(
    'sendReminder',
    { to: toEmail, subject: subject, body: message, eventUrl, reminderId },
    {
      delay: delay > 0 ? delay : 100,
      jobId: `reminder-${toEmail}-${scheduledTime}`,
      removeOnComplete: true
    }
  )

  console.log(`Recordatorio programado para ${triggerTime.toISOString()}`)
}
