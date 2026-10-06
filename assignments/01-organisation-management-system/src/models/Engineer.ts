import { Employee } from './Employee';
import { Designation } from '../types';

/**
 * Engineer Class: Reports to Lead, has no reportees
 */
export class Engineer extends Employee {
  constructor(id: string, name: string, dateOfBirth: string, reportsTo: string) {
    super(id, name, dateOfBirth, Designation.ENGINEER, reportsTo);
  }

  public getAllowedManagerDesignation(): Designation | null {
    return Designation.LEAD; // Engineer reports to Lead
  }

  public getAllowedReporteeDesignation(): Designation | null {
    return null; // Engineer cannot have reportees
  }

  public canHaveReportees(): boolean {
    return false;
  }
}
