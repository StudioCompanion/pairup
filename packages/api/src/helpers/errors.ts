export class NoUserError extends Error {
  constructor(message: string) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
    this.name = 'NoUserError'
    this.message = message

    // this is required so the instance is NoUserError
    Object.setPrototypeOf(this, NoUserError.prototype)
  }
}
