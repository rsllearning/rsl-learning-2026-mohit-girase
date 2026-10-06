import { Employee } from './Employee';
import { CEO } from './CEO';
import { Director } from './Director';
import { Manager } from './Manager';
import { Lead } from './Lead';
import { Engineer } from './Engineer';
import { Designation, IEmployeeDTO } from '../types';
import { ValidationError } from '../errors';

/**
 * Factory Pattern implementation to construct instances of Employee subclasses
 */
export class EmployeeFactory {
  public static create(dto: IEmployeeDTO): Employee {
    switch (dto.designation) {
      case Designation.CEO:
        return new CEO(dto.id, dto.name, dto.dateOfBirth);

      case Designation.DIRECTOR:
        if (!dto.reportsTo) {
          throw new ValidationError('Director must have a valid reportsTo ID (CEO).');
        }
        return new Director(dto.id, dto.name, dto.dateOfBirth, dto.reportsTo);

      case Designation.MANAGER:
        if (!dto.reportsTo) {
          throw new ValidationError('Manager must have a valid reportsTo ID (Director).');
        }
        return new Manager(dto.id, dto.name, dto.dateOfBirth, dto.reportsTo);

      case Designation.LEAD:
        if (!dto.reportsTo) {
          throw new ValidationError('Lead must have a valid reportsTo ID (Manager).');
        }
        return new Lead(dto.id, dto.name, dto.dateOfBirth, dto.reportsTo);

      case Designation.ENGINEER:
        if (!dto.reportsTo) {
          throw new ValidationError('Engineer must have a valid reportsTo ID (Lead).');
        }
        return new Engineer(dto.id, dto.name, dto.dateOfBirth, dto.reportsTo);

      default:
        throw new ValidationError(`Unsupported designation: ${dto.designation}`);
    }
  }
}
