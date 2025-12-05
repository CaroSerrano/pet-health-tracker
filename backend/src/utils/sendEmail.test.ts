import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import nodemailer from 'nodemailer'
import {
  sendPasswordRecoveryEmail,
  type SendEmailPayload
} from './sendEmail.js'

vi.mock('nodemailer')

describe('sendPasswordRecoveryEmail', () => {
  const mockSendMail = vi.fn()
  const mockTransporter = {
    sendMail: mockSendMail
  }

  const mockEnv = {
    MAILGUN_SMTP: 'smtp.mailgun.org',
    MAILGUN_SMTP_USER: 'test@carepaws.com',
    MAILGUN_SMTP_PASSWORD: 'test-password',
    FRONTEND_URL: 'https://carepaws.com'
  }

  beforeEach(() => {
    process.env = { ...process.env, ...mockEnv }
    vi.clearAllMocks()
    vi.mocked(nodemailer.createTransport).mockReturnValue(
      mockTransporter as any
    )
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create transporter with correct configuration', async () => {
    const payload: SendEmailPayload = {
      email: 'usuario@example.com',
      token: 'test-token-123'
    }

    await sendPasswordRecoveryEmail(payload)

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: mockEnv.MAILGUN_SMTP,
      port: 587,
      secure: false,
      auth: {
        user: mockEnv.MAILGUN_SMTP_USER,
        pass: mockEnv.MAILGUN_SMTP_PASSWORD
      }
    })
  })

  it('should send email with correct data', async () => {
    const payload: SendEmailPayload = {
      email: 'usuario@example.com',
      token: 'abc123token'
    }

    await sendPasswordRecoveryEmail(payload)

    expect(mockSendMail).toHaveBeenCalledWith({
      from: `"Care Paws" <${mockEnv.MAILGUN_SMTP_USER}>`,
      to: payload.email,
      subject: 'Recuperación de contraseña',
      text: expect.stringContaining('Ingresá al siguiente enlace'),
      html: expect.stringContaining(
        'href="https://carepaws.com/reset-password?token=abc123token"'
      )
    })
  })

  it('should include token in email url', async () => {
    const payload: SendEmailPayload = {
      email: 'usuario@example.com',
      token: 'token-especial-456'
    }

    await sendPasswordRecoveryEmail(payload)

    const expectedUrl = `${mockEnv.FRONTEND_URL}/reset-password?token=${payload.token}`

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining(expectedUrl)
      })
    )
  })

  it('should include message about expiration time', async () => {
    const payload: SendEmailPayload = {
      email: 'usuario@example.com',
      token: 'test-token'
    }

    await sendPasswordRecoveryEmail(payload)

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('expira en 15 minutos')
      })
    )
  })

  it('should send to the correct email', async () => {
    const payload: SendEmailPayload = {
      email: 'test.user@example.com',
      token: 'test-token'
    }

    await sendPasswordRecoveryEmail(payload)

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test.user@example.com'
      })
    )
  })

  it('should call to sendMail one time', async () => {
    const payload: SendEmailPayload = {
      email: 'usuario@example.com',
      token: 'test-token'
    }

    await sendPasswordRecoveryEmail(payload)

    expect(mockSendMail).toHaveBeenCalledTimes(1)
  })
})
