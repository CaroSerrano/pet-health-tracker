import nodemailer from 'nodemailer'

export interface SendEmailPayload {
  email: string
  token: string
}

// Aclaración: El entorno de prueba de Mailgun solo permite enviar emails a las direcciones autorizadas (hasta 5). Como estamos utilizando un dominio de prueba, los emails llegan a la carpeta SPAM.

export async function sendPasswordRecoveryEmail(data: SendEmailPayload) {
  const mailgunUser = process.env.MAILGUN_SMTP_USER
  const transporter = nodemailer.createTransport({
    host: process.env.MAILGUN_SMTP,
    port: 587,
    secure: false,
    auth: {
      user: mailgunUser,
      pass: process.env.MAILGUN_SMTP_PASSWORD
    }
  })

  const url = `${process.env.FRONTEND_URL}/reset-password?token=${data.token}`

  await transporter.sendMail({
    from: `"Care Paws" <${mailgunUser}>`,
    to: data.email,
    subject: 'Recuperación de contraseña',
    text: `Ingresá al siguiente enlace para configurar una nueva contraseña. El mismo expira en 15 minutos: \n${url}\nSi no solicitaste la recuperación de tu contraseña, podés ignorar este email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Recuperación de Contraseña de Care Paws</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
        
        <p style="margin: 20px 0;">
          <a href="${url}" style="background-color: #FFBECC; color: black; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-weight: bold;">
            Restablecer Contraseña
          </a>
        </p>
        
        <p><strong>Importante:</strong> Este enlace expira en 15 minutos.</p>
        
        <p>Si tienes problemas para hacer clic en el botón, copia y pega la siguiente URL en tu navegador:</p>
        <p><a href="${url}">${url}</a></p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        
        <p style="font-size: 0.9em; color: #666;">
          Si no solicitaste la recuperación de tu contraseña, puedes ignorar este email. Tu contraseña actual permanecerá sin cambios.
        </p>
      </div>
    `
  })
}
