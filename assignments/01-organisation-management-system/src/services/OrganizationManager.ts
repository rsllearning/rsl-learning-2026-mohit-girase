import { Employee, EmployeeFactory } from '../models';
import { Designation, IEmployeeDTO, IUpdateEmployeeDTO } from '../types';
import { DuplicateError, HierarchyError, NotFoundError, ValidationError } from '../errors';
import { Validators } from '../utils/validators';

/**
 * OrganizationManager - Service managing CRUD operations and organizational integrity
 */
export class OrganizationManager {
  private _employees: Map<string, Employee> = new Map();
  private _ceoId: string | null = null;

  /**
   * Add a new employee into the organization
   */
  public addEmployee(dto: IEmployeeDTO): Employee {
    Validators.validateRequiredString(dto.id, 'id');
    Validators.validateRequiredString(dto.name, 'name');
    Validators.validateDateOfBirth(dto.dateOfBirth);

    const empId = dto.id.trim();

    // 1. Unique ID check
    if (this._employees.has(empId)) {
      throw new DuplicateError(`Employee with ID "${empId}" already exists.`);
    }

    // 2. Single CEO check
    if (dto.designation === Designation.CEO) {
      if (this._ceoId !== null) {
        throw new HierarchyError(
          `Organization already has a CEO (ID: ${this._ceoId}). Only one CEO can exist in the organization.`
        );
      }
      if (dto.reportsTo) {
        throw new HierarchyError('CEO cannot report to anyone. reportsTo must be null or empty.');
      }
    }

    // 3. Hierarchy and Manager validation
    let manager: Employee | null = null;
    if (dto.designation !== Designation.CEO) {
      if (!dto.reportsTo || dto.reportsTo.trim().length === 0) {
        throw new ValidationError(`reportsTo is required for designation "${dto.designation}".`);
      }

      const managerId = dto.reportsTo.trim();
      manager = this._employees.get(managerId) || null;

      if (!manager) {
        throw new NotFoundError(
          `Manager with ID "${managerId}" does not exist in the organization.`
        );
      }
    }

    // 4. Instantiate employee
    const newEmployee = EmployeeFactory.create({
      id: empId,
      name: dto.name,
      dateOfBirth: dto.dateOfBirth,
      designation: dto.designation,
      reportsTo: dto.reportsTo ? dto.reportsTo.trim() : null
    });

    // 5. Validate reporting relationship
    newEmployee.validateReportingTo(manager);

    if (manager) {
      manager.addReportee(newEmployee.id);
    }

    // 6. Save in memory
    this._employees.set(newEmployee.id, newEmployee);
    if (newEmployee.designation === Designation.CEO) {
      this._ceoId = newEmployee.id;
    }

    return newEmployee;
  }

  /**
   * Retrieve a specific employee by ID
   */
  public getEmployeeById(id: string): Employee {
    Validators.validateRequiredString(id, 'id');
    const employee = this._employees.get(id.trim());
    if (!employee) {
      throw new NotFoundError(`Employee with ID "${id}" was not found.`);
    }
    return employee;
  }

  /**
   * Retrieve all employees in the organization
   */
  public getAllEmployees(): Employee[] {
    return Array.from(this._employees.values());
  }

  /**
   * Update an existing employee given their ID
   */
  public updateEmployee(id: string, updates: IUpdateEmployeeDTO): Employee {
    Validators.validateRequiredString(id, 'id');
    const employee = this.getEmployeeById(id);

    // Update name
    if (updates.name !== undefined) {
      employee.setName(updates.name);
    }

    // Update dateOfBirth
    if (updates.dateOfBirth !== undefined) {
      employee.setDateOfBirth(updates.dateOfBirth);
    }

    // Update reportsTo if specified
    if (updates.reportsTo !== undefined && updates.reportsTo !== employee.reportsTo) {
      if (employee.designation === Designation.CEO) {
        throw new HierarchyError('Cannot assign a manager to the CEO. CEO reports to no one.');
      }

      if (!updates.reportsTo || updates.reportsTo.trim().length === 0) {
        throw new ValidationError(`reportsTo is required for designation "${employee.designation}".`);
      }

      const newManagerId = updates.reportsTo.trim();
      if (newManagerId === employee.id) {
        throw new HierarchyError('An employee cannot report to themselves.');
      }

      const newManager = this.getEmployeeById(newManagerId);
      employee.validateReportingTo(newManager);

      // Remove from old manager's reportees
      if (employee.reportsTo) {
        const oldManager = this._employees.get(employee.reportsTo);
        if (oldManager) {
          oldManager.removeReportee(employee.id);
        }
      }

      // Add to new manager's reportees and update reportsTo
      newManager.addReportee(employee.id);
      employee.setReportsTo(newManager.id);
    }

    // Update designation if specified
    if (updates.designation !== undefined && updates.designation !== employee.designation) {
      this._handleDesignationChange(employee, updates.designation, updates.reportsTo);
      return this.getEmployeeById(id);
    }

    return employee;
  }

  /**
   * Delete an employee given their ID with safe handling for existing reportees
   */
  public deleteEmployee(id: string, reassignmentManagerId?: string): boolean {
    Validators.validateRequiredString(id, 'id');
    const employee = this.getEmployeeById(id);

    // Handle reportees
    if (employee.hasReportees()) {
      if (!reassignmentManagerId) {
        throw new HierarchyError(
          `Cannot delete employee "${employee.name}" (ID: ${employee.id}) because they have active reportees: [${employee.reportees.join(', ')}]. Please provide a replacement manager ID to reassign reportees.`
        );
      }

      const newManagerId = reassignmentManagerId.trim();
      if (newManagerId === employee.id) {
        throw new HierarchyError('Cannot reassign reportees to the employee being deleted.');
      }

      const newManager = this.getEmployeeById(newManagerId);
      if (newManager.designation !== employee.designation) {
        throw new HierarchyError(
          `Cannot reassign reportees of a ${employee.designation} to a ${newManager.designation}. Reassignment target must have the same designation (${employee.designation}).`
        );
      }

      // Reassign all reportees
      for (const reporteeId of employee.reportees) {
        const reportee = this.getEmployeeById(reporteeId);
        reportee.setReportsTo(newManager.id);
        newManager.addReportee(reportee.id);
      }
    }

    // Remove from their manager's reportee list
    if (employee.reportsTo) {
      const manager = this._employees.get(employee.reportsTo);
      if (manager) {
        manager.removeReportee(employee.id);
      }
    }

    // If CEO is deleted, reset CEO ID
    if (employee.designation === Designation.CEO) {
      this._ceoId = null;
    }

    this._employees.delete(employee.id);
    return true;
  }

  /**
   * Get formatted hierarchical tree structure
   */
  public getOrganizationHierarchyTree(): string {
    if (this._employees.size === 0) {
      return '(Organization is currently empty)';
    }

    if (!this._ceoId || !this._employees.has(this._ceoId)) {
      return '(No CEO present in organization)';
    }

    const ceo = this._employees.get(this._ceoId)!;
    const lines: string[] = [];

    const buildTree = (emp: Employee, prefix: string = '', isLast: boolean = true): void => {
      const marker = prefix === '' ? '🏢 ' : isLast ? '└── ' : '├── ';
      lines.push(`${prefix}${marker}[${emp.designation}] ${emp.name} (ID: ${emp.id}, DOB: ${emp.dateOfBirth})`);

      const childPrefix = prefix + (prefix === '' ? '    ' : isLast ? '    ' : '│   ');
      const reporteeList = emp.reportees;

      reporteeList.forEach((reporteeId, index) => {
        const reportee = this._employees.get(reporteeId);
        if (reportee) {
          buildTree(reportee, childPrefix, index === reporteeList.length - 1);
        }
      });
    };

    buildTree(ceo);
    return lines.join('\n');
  }

  /**
   * Internal helper for transitioning an employee to a new designation
   */
  private _handleDesignationChange(
    employee: Employee,
    newDesignation: Designation,
    newReportsTo?: string | null
  ): void {
    if (newDesignation === Designation.CEO && this._ceoId !== null && this._ceoId !== employee.id) {
      throw new HierarchyError('Only one CEO can exist in the organization.');
    }

    if (employee.hasReportees()) {
      throw new HierarchyError(
        `Cannot change designation of employee "${employee.name}" while they have active reportees. Please reassign their reportees first.`
      );
    }

    // Determine target reportsTo
    const targetReportsTo = newDesignation === Designation.CEO ? null : (newReportsTo || employee.reportsTo);

    // Create new subclass instance
    const updatedInstance = EmployeeFactory.create({
      id: employee.id,
      name: employee.name,
      dateOfBirth: employee.dateOfBirth,
      designation: newDesignation,
      reportsTo: targetReportsTo
    });

    // Validate new reporting line
    let newManager: Employee | null = null;
    if (updatedInstance.reportsTo) {
      newManager = this.getEmployeeById(updatedInstance.reportsTo);
    }
    updatedInstance.validateReportingTo(newManager);

    // Detach from old manager
    if (employee.reportsTo) {
      const oldManager = this._employees.get(employee.reportsTo);
      if (oldManager) {
        oldManager.removeReportee(employee.id);
      }
    }

    // Attach to new manager
    if (newManager) {
      newManager.addReportee(updatedInstance.id);
    }

    // Update CEO tracking
    if (employee.designation === Designation.CEO && newDesignation !== Designation.CEO) {
      this._ceoId = null;
    } else if (newDesignation === Designation.CEO) {
      this._ceoId = updatedInstance.id;
    }

    this._employees.set(updatedInstance.id, updatedInstance);
  }
}
