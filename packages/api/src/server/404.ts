import { Express } from 'express'

class ApiError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = ''
  ) {
    super(message)

    this.statusCode = statusCode
    this.isOperational = isOperational

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export const handleNoRoute = (app: Express) => {
  const isProduction = process.env.NODE_ENV === 'production'

  app.use((req, res) => {
    const err = new ApiError(404, `Route ${req.path} was not found.`)
    const { statusCode, message, stack } = err

    res.locals.errorMessage = message

    const response = {
      code: statusCode,
      message,
      ...(!isProduction && { stack }),
    }

    if (!isProduction) {
      console.error(err)
    }

    res.status(statusCode).send(response)
  })
}
