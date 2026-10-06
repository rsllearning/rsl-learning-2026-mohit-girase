export class ValidationError extends Error {
  constructor(message: string) {
    super(`[Validation Error] ${message}`);
    this.name = 'ValidationError';
  }
}

export class HierarchyError extends Error {
  constructor(message: string) {
    super(`[Hierarchy Error] ${message}`);
    this.name = 'HierarchyError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(`[Not Found Error] ${message}`);
    this.name = 'NotFoundError';
  }
}

export class DuplicateError extends Error {
  constructor(message: string) {
    super(`[Duplicate Error] ${message}`);
    this.name = 'DuplicateError';
  }
}
