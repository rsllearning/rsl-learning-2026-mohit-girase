import { Employee } from './Employee';
import { Designation } from '../types';

/**
 * CEO Class: Top of the hierarchy, reports to no one, reportees are Directors
 */
export class CEO extends Employee {
  constructor(id: string, name: string, dateOfBirth: string) {
    super(id, name, dateOfBirth, Designation.CEO, null);
  }

  public getAllowedManagerDesignation(): Designation | null {
    return null; // CEO reports to no one
  }

  public getAllowedReporteeDesignation(): Designation | null {
    return Designation.DIRECTOR; // CEO manages Directors
  }

  public canHaveReportees(): boolean {
    return true;
  }
}
