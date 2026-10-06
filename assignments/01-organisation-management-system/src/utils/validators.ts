import { Designation } from '../types';
import { ValidationError } from '../errors';

export class Validators {
  /**
   * Validates date string in strict mm/dd/yyyy format and calendar validity
   */
  public static validateDateOfBirth(dateStr: string): void {
    if (!dateStr || typeof dateStr !== 'string') {
      throw new ValidationError('Date of birth is required and must be a string.');
    }

    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(\d{4})$/;
    const match = regex.exec(dateStr.trim());

    if (!match) {
      throw new ValidationError(`Invalid dateOfBirth format: "${dateStr}". Expected format is mm/dd/yyyy.`);
    }

    const month = parseInt(match[1], 10);
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    const parsedDate = new Date(year, month - 1, day);
    if (
      parsedDate.getFullYear() !== year ||
      parsedDate.getMonth() !== month - 1 ||
      parsedDate.getDate() !== day
    ) {
      throw new ValidationError(`Invalid calendar date: "${dateStr}". Check month/day boundaries.`);
    }

    const today = new Date();
    if (parsedDate > today) {
      throw new ValidationError(`dateOfBirth cannot be a future date: "${dateStr}".`);
    }
  }

  /**
   * Validates that non-empty string fields are supplied
   */
  public static validateRequiredString(fieldValue: string | undefined | null, fieldName: string): void {
    if (!fieldValue || typeof fieldValue !== 'string' || fieldValue.trim().length === 0) {
      throw new ValidationError(`${fieldName} is required and cannot be empty.`);
    }
  }

  /**
   * Validates designation against allowed Designation enum
   */
  public static validateDesignation(designation: string): Designation {
    const values = Object.values(Designation) as string[];
    if (!values.includes(designation)) {
      throw new ValidationError(
        `Invalid designation: "${designation}". Allowed values: ${values.join(', ')}.`
      );
    }
    return designation as Designation;
  }
}
