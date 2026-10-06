import { Employee } from './Employee';
import { Designation } from '../types';

/**
 * Lead Class: Reports to Manager, reportees are Engineers
 */
export class Lead extends Employee {
  constructor(id: string, name: string, dateOfBirth: string, reportsTo: string) {
    super(id, name, dateOfBirth, Designation.LEAD, reportsTo);
  }

  public getAllowedManagerDesignation(): Designation | null {
    return Designation.MANAGER; // Lead reports to Manager
  }

  public getAllowedReporteeDesignation(): Designation | null {
    return Designation.ENGINEER; // Lead manages Engineers
  }

  public canHaveReportees(): boolean {
    return true;
  }
}
