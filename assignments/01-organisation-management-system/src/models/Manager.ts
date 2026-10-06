import { Employee } from './Employee';
import { Designation } from '../types';

/**
 * Manager Class: Reports to Director, reportees are Leads
 */
export class Manager extends Employee {
  constructor(id: string, name: string, dateOfBirth: string, reportsTo: string) {
    super(id, name, dateOfBirth, Designation.MANAGER, reportsTo);
  }

  public getAllowedManagerDesignation(): Designation | null {
    return Designation.DIRECTOR; // Manager reports to Director
  }

  public getAllowedReporteeDesignation(): Designation | null {
    return Designation.LEAD; // Manager manages Leads
  }

  public canHaveReportees(): boolean {
    return true;
  }
}
