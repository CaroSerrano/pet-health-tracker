import type { Request, Response } from 'express'
import { ValidationError, NotFoundError } from '../types/errors.js'
import { ZodError, z } from 'zod'

export function errorHandler(err: unknown, _req: Request, res: Response) {
  if (err && typeof err === 'object' && 'name' in err) {
    if (
      err.name === 'TokenExpiredError' ||
      err.name === 'JsonWebTokenError' ||
      err.name === 'NotBeforeError'
    ) {
      return res.status(401).json({
        message: 'message' in err ? err.message : 'Authentication error'
      })
    }
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ errors: z.flattenError(err) })
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ message: err.message })
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: err.message })
  }
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message })
  }
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
}
