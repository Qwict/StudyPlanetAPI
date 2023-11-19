const NOT_FOUND = 'NOT_FOUND';
const VALIDATION_FAILED = 'VALIDATION_FAILED';
const UNAUTHORIZED = 'UNAUTHORIZED';
const FORBIDDEN = 'FORBIDDEN';
const DUPLICATE_ENTRY = 'DUPLICATE_ENTRY';

class ServiceError extends Error {

  constructor(code, message, details = {}) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'ServiceError';
  }

  static notFound(message, details) {
    return new ServiceError(NOT_FOUND, message, details);
  }

  static duplicateEntry(message, details) {
    return new ServiceError(DUPLICATE_ENTRY, message, details);
  }

  static validationFailed(message, details) {
    return new ServiceError(VALIDATION_FAILED, message, details);
  }

  static unauthorized(message, details) {
    return new ServiceError(UNAUTHORIZED, message, details);
  }

  static forbidden(message, details) {
    return new ServiceError(FORBIDDEN, message, details);
  }

  static notImplemented(message, details) {
    return new ServiceError(NOT_IMPLEMENTED, message, details);
  }

  get isDuplicate() {
    return this.code === DUPLICATE_ENTRY;
  }

  get isNotFound() {
    return this.code === NOT_FOUND;
  }

  get isValidationFailed() {
    return this.code === VALIDATION_FAILED;
  }

  get isUnauthorized() {
    return this.code === UNAUTHORIZED;
  }

  get isForbidden() {
    return this.code === FORBIDDEN;
  }

  get isNotImplemented() {
    return this.code === NOT_IMPLEMENTED;
  }
}

module.exports = ServiceError;
