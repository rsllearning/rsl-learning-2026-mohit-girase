import { Employee } from './Employee';
import { Designation } from '../types';

/**
 * Director Class: Reports to CEO, reportees are Managers
 */
export class Director extends Employee {
  constructor(id: string, name: string, dateOfBirth: string, reportsTo: string) {
    super(id, name, dateOfBirth, Designation.DIRECTOR, reportsTo);
  }

  public getAllowedManagerDesignation(): Designation | null {
    return Designation.CEO; // Director reports to CEO
  }

  public getAllowedReporteeDesignation(): Designation | null {
    return Designation.MANAGER; // Director manages Managers
  }

  public canHaveReportees(): boolean {
    return true;
  }
}
