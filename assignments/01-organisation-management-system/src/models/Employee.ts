import { Designation, IEmployeeJSON } from '../types';
import { Validators } from '../utils/validators';
import { HierarchyError } from '../errors';

/**
 * Abstract Base Class for all organization employees
 * Demonstrates Abstraction and Encapsulation
 */
export abstract class Employee {
  private readonly _id: string;
  private _name: string;
  private _dateOfBirth: string;
  private readonly _designation: Designation;
  private _reportsTo: string | null;
  private _reportees: Set<string>;

  constructor(
    id: string,
    name: string,
    dateOfBirth: string,
    designation: Designation,
    reportsTo: string | null = null
  ) {
    Validators.validateRequiredString(id, 'id');
    Validators.validateRequiredString(name, 'name');
    Validators.validateDateOfBirth(dateOfBirth);

    this._id = id.trim();
    this._name = name.trim();
    this._dateOfBirth = dateOfBirth.trim();
    this._designation = designation;
    this._reportsTo = reportsTo ? reportsTo.trim() : null;
    this._reportees = new Set<string>();
  }

  // Encapsulated Getters
  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get dateOfBirth(): string {
    return this._dateOfBirth;
  }

  public get designation(): Designation {
    return this._designation;
  }

  public get reportsTo(): string | null {
    return this._reportsTo;
  }

  public get reportees(): string[] {
    return Array.from(this._reportees);
  }

  // Mutators with validation
  public setName(name: string): void {
    Validators.validateRequiredString(name, 'name');
    this._name = name.trim();
  }

  public setDateOfBirth(dob: string): void {
    Validators.validateDateOfBirth(dob);
    this._dateOfBirth = dob.trim();
  }

  public setReportsTo(managerId: string | null): void {
    this._reportsTo = managerId ? managerId.trim() : null;
  }

  public addReportee(reporteeId: string): void {
    if (!this.canHaveReportees()) {
      throw new HierarchyError(
        `Designation ${this.designation} cannot have any reportees.`
      );
    }
    this._reportees.add(reporteeId.trim());
  }

  public removeReportee(reporteeId: string): void {
    this._reportees.delete(reporteeId.trim());
  }

  public hasReportees(): boolean {
    return this._reportees.size > 0;
  }

  // Polymorphic abstract methods to enforce hierarchy rules
  public abstract getAllowedManagerDesignation(): Designation | null;
  public abstract getAllowedReporteeDesignation(): Designation | null;
  public abstract canHaveReportees(): boolean;

  /**
   * Validate if this employee is allowed to report to the given manager instance
   */
  public validateReportingTo(manager: Employee | null): void {
    const allowed = this.getAllowedManagerDesignation();
    if (allowed === null) {
      if (manager !== null) {
        throw new HierarchyError(
          `${this.designation} reports to no one. reportsTo must be null/empty.`
        );
      }
      return;
    }

    if (!manager) {
      throw new HierarchyError(
        `${this.designation} must report to a ${allowed}. No manager provided.`
      );
    }

    if (manager.designation !== allowed) {
      throw new HierarchyError(
        `Invalid Hierarchy: A ${this.designation} can only report to a ${allowed}, but attempted to report to a ${manager.designation} (ID: ${manager.id}).`
      );
    }
  }

  /**
   * Returns a clean JSON representation of the employee
   */
  public toJSON(): IEmployeeJSON {
    return {
      id: this._id,
      name: this._name,
      dateOfBirth: this._dateOfBirth,
      designation: this._designation,
      reportsTo: this._reportsTo,
      reportees: this.reportees
    };
  }
}
