export class ValidationError extends Error {
  constructor(message = 'Validation Error') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not found Error') {
    super(message);
    this.name = 'NotFoundError';
  }
}
