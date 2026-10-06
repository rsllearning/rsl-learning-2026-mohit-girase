export enum Designation {
  CEO = 'CEO',
  DIRECTOR = 'Director',
  MANAGER = 'Manager',
  LEAD = 'Lead',
  ENGINEER = 'Engineer'
}

export interface IEmployeeDTO {
  id: string;
  name: string;
  dateOfBirth: string; // format: mm/dd/yyyy
  designation: Designation;
  reportsTo?: string | null;
}

export interface IUpdateEmployeeDTO {
  name?: string;
  dateOfBirth?: string;
  designation?: Designation;
  reportsTo?: string | null;
}

export interface IEmployeeJSON {
  id: string;
  name: string;
  dateOfBirth: string;
  designation: Designation;
  reportsTo: string | null;
  reportees: string[];
}
