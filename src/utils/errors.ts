export class CustomError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(statusCode: number, errorCode: string) {
    super();

    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export class BadRequestError extends CustomError {
  constructor(errorCode: string) {
    super(400, errorCode);
  }
}

export class NotFoundError extends CustomError {
  constructor(errorCode: string) {
    super(404, errorCode);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(errorCode: string) {
    super(401, errorCode);
  }
}

export class ForbiddenError extends CustomError {
  constructor(errorCode: string) {
    super(403, errorCode);
  }
}

export class InternalServerError extends CustomError {
  constructor(errorCode: string) {
    super(500, errorCode);
  }
}
