
export class AppError extends Error {
  statusCode: number
  constructor(message: string, code: number) {
    super(message)
    this.statusCode = code;
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(msg: string, code: number = 400) {
    super(msg, code);

  }
}
export class ServerError extends AppError {
  constructor(msg: string, code: number = 500) {
    super(msg, code);

  }
}
export class BadRequestError extends AppError {
  constructor(msg: string = 'Bad Request', code: number = 400) {
    super(msg, code);

  }
}