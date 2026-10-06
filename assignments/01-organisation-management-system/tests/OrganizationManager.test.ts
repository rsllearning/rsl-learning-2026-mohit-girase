import { OrganizationManager } from '../src/services';
import { Designation } from '../src/types';
import { DuplicateError, HierarchyError, NotFoundError, ValidationError } from '../src/errors';

describe('OrganizationManager Unit Tests', () => {
  let org: OrganizationManager;

  beforeEach(() => {
    org = new OrganizationManager();
  });

  describe('Employee Creation & Validations', () => {
    it('should successfully add a CEO', () => {
      const ceo = org.addEmployee({
        id: 'CEO-1',
        name: 'Alice CEO',
        dateOfBirth: '01/15/1975',
        designation: Designation.CEO
      });

      expect(ceo.id).toBe('CEO-1');
      expect(ceo.name).toBe('Alice CEO');
      expect(ceo.designation).toBe(Designation.CEO);
      expect(ceo.reportsTo).toBeNull();
    });

    it('should reject adding a second CEO', () => {
      org.addEmployee({
        id: 'CEO-1',
        name: 'Alice CEO',
        dateOfBirth: '01/15/1975',
        designation: Designation.CEO
      });

      expect(() => {
        org.addEmployee({
          id: 'CEO-2',
          name: 'Bob CEO',
          dateOfBirth: '02/20/1978',
          designation: Designation.CEO
        });
      }).toThrow(HierarchyError);
    });

    it('should reject employee with duplicate ID', () => {
      org.addEmployee({
        id: 'EMP-1',
        name: 'Alice CEO',
        dateOfBirth: '01/15/1975',
        designation: Designation.CEO
      });

      expect(() => {
        org.addEmployee({
          id: 'EMP-1',
          name: 'Duplicate Alice',
          dateOfBirth: '01/15/1975',
          designation: Designation.DIRECTOR,
          reportsTo: 'EMP-1'
        });
      }).toThrow(DuplicateError);
    });

    it('should reject non-CEO employee without reportsTo', () => {
      expect(() => {
        org.addEmployee({
          id: 'DIR-1',
          name: 'Bob Director',
          dateOfBirth: '02/20/1980',
          designation: Designation.DIRECTOR
        });
      }).toThrow(ValidationError);
    });

    it('should reject invalid hierarchy reporting (Engineer -> CEO)', () => {
      org.addEmployee({
        id: 'CEO-1',
        name: 'Alice CEO',
        dateOfBirth: '01/15/1975',
        designation: Designation.CEO
      });

      expect(() => {
        org.addEmployee({
          id: 'ENG-1',
          name: 'Charlie Engineer',
          dateOfBirth: '03/10/1995',
          designation: Designation.ENGINEER,
          reportsTo: 'CEO-1'
        });
      }).toThrow(HierarchyError);
    });

    it('should enforce proper chain: CEO -> Director -> Manager -> Lead -> Engineer', () => {
      const ceo = org.addEmployee({
        id: 'CEO-1',
        name: 'Alice',
        dateOfBirth: '01/01/1970',
        designation: Designation.CEO
      });

      const dir = org.addEmployee({
        id: 'DIR-1',
        name: 'Bob',
        dateOfBirth: '02/02/1980',
        designation: Designation.DIRECTOR,
        reportsTo: 'CEO-1'
      });

      const mgr = org.addEmployee({
        id: 'MGR-1',
        name: 'Charlie',
        dateOfBirth: '03/03/1985',
        designation: Designation.MANAGER,
        reportsTo: 'DIR-1'
      });

      const lead = org.addEmployee({
        id: 'LEAD-1',
        name: 'David',
        dateOfBirth: '04/04/1990',
        designation: Designation.LEAD,
        reportsTo: 'MGR-1'
      });

      const eng = org.addEmployee({
        id: 'ENG-1',
        name: 'Eve',
        dateOfBirth: '05/05/1995',
        designation: Designation.ENGINEER,
        reportsTo: 'LEAD-1'
      });

      expect(ceo.reportees).toEqual(['DIR-1']);
      expect(dir.reportees).toEqual(['MGR-1']);
      expect(mgr.reportees).toEqual(['LEAD-1']);
      expect(lead.reportees).toEqual(['ENG-1']);
      expect(eng.reportees).toEqual([]);
    });

    it('should validate dateOfBirth in mm/dd/yyyy format strictly', () => {
      expect(() => {
        org.addEmployee({
          id: 'CEO-1',
          name: 'Alice',
          dateOfBirth: '2020-01-01', // ISO format instead of mm/dd/yyyy
          designation: Designation.CEO
        });
      }).toThrow(ValidationError);

      expect(() => {
        org.addEmployee({
          id: 'CEO-1',
          name: 'Alice',
          dateOfBirth: '02/30/1990', // Invalid calendar day for Feb
          designation: Designation.CEO
        });
      }).toThrow(ValidationError);
    });
  });

  describe('Retrieval Operations', () => {
    beforeEach(() => {
      org.addEmployee({
        id: 'CEO-1',
        name: 'Alice CEO',
        dateOfBirth: '01/01/1975',
        designation: Designation.CEO
      });
      org.addEmployee({
        id: 'DIR-1',
        name: 'Bob Director',
        dateOfBirth: '02/02/1980',
        designation: Designation.DIRECTOR,
        reportsTo: 'CEO-1'
      });
    });

    it('should retrieve existing employee by ID', () => {
      const emp = org.getEmployeeById('DIR-1');
      expect(emp.name).toBe('Bob Director');
    });

    it('should throw NotFoundError for non-existent ID', () => {
      expect(() => org.getEmployeeById('INVALID-ID')).toThrow(NotFoundError);
    });

    it('should retrieve all employees', () => {
      const all = org.getAllEmployees();
      expect(all.length).toBe(2);
    });
  });

  describe('Update Operations', () => {
    beforeEach(() => {
      org.addEmployee({
        id: 'CEO-1',
        name: 'Alice CEO',
        dateOfBirth: '01/01/1975',
        designation: Designation.CEO
      });
      org.addEmployee({
        id: 'DIR-1',
        name: 'Bob Director',
        dateOfBirth: '02/02/1980',
        designation: Designation.DIRECTOR,
        reportsTo: 'CEO-1'
      });
    });

    it('should update employee name and DOB', () => {
      const updated = org.updateEmployee('DIR-1', {
        name: 'Robert Director',
        dateOfBirth: '02/03/1980'
      });

      expect(updated.name).toBe('Robert Director');
      expect(updated.dateOfBirth).toBe('02/03/1980');
    });

    it('should throw NotFoundError when updating non-existent ID', () => {
      expect(() => org.updateEmployee('MISSING', { name: 'Test' })).toThrow(NotFoundError);
    });
  });

  describe('Delete Operations & Reassignment', () => {
    beforeEach(() => {
      org.addEmployee({
        id: 'CEO-1',
        name: 'Alice CEO',
        dateOfBirth: '01/01/1975',
        designation: Designation.CEO
      });
      org.addEmployee({
        id: 'DIR-1',
        name: 'Bob Director',
        dateOfBirth: '02/02/1980',
        designation: Designation.DIRECTOR,
        reportsTo: 'CEO-1'
      });
      org.addEmployee({
        id: 'DIR-2',
        name: 'Carol Director',
        dateOfBirth: '03/03/1982',
        designation: Designation.DIRECTOR,
        reportsTo: 'CEO-1'
      });
      org.addEmployee({
        id: 'MGR-1',
        name: 'Dave Manager',
        dateOfBirth: '04/04/1985',
        designation: Designation.MANAGER,
        reportsTo: 'DIR-1'
      });
    });

    it('should reject deleting employee with active reportees without reassignment', () => {
      expect(() => org.deleteEmployee('DIR-1')).toThrow(HierarchyError);
    });

    it('should delete employee with active reportees when valid replacement manager is provided', () => {
      const result = org.deleteEmployee('DIR-1', 'DIR-2');
      expect(result).toBe(true);

      const mgr = org.getEmployeeById('MGR-1');
      expect(mgr.reportsTo).toBe('DIR-2');

      const dir2 = org.getEmployeeById('DIR-2');
      expect(dir2.reportees).toContain('MGR-1');

      expect(() => org.getEmployeeById('DIR-1')).toThrow(NotFoundError);
    });

    it('should delete leaf employee without reportees directly', () => {
      const result = org.deleteEmployee('MGR-1');
      expect(result).toBe(true);
      expect(() => org.getEmployeeById('MGR-1')).toThrow(NotFoundError);

      const dir1 = org.getEmployeeById('DIR-1');
      expect(dir1.reportees).not.toContain('MGR-1');
    });
  });
});
