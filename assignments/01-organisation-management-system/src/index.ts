import { OrganizationManager } from './services';
import { Designation } from './types';

function printHeader(title: string): void {
  console.log('\n' + '='.repeat(70));
  console.log(`${title.toUpperCase()}`);
  console.log('='.repeat(70));
}

function printSection(title: string): void {
  console.log(`\n [Scenario] ${title}`);
}

function main(): void {
  printHeader('Organization Management System - TypeScript OOP Showcase');

  const org = new OrganizationManager();

  // ==========================================
  // 1. CREATE OPERATIONS & VALID HIERARCHY
  // ==========================================
  printSection('1. Adding valid employees across all levels of hierarchy');

  try {
    const ceo = org.addEmployee({
      id: 'EMP-001',
      name: 'Elena Vance',
      dateOfBirth: '05/14/1980',
      designation: Designation.CEO
    });
    console.log(`Added CEO: ${ceo.name} (${ceo.id})`);

    const dir1 = org.addEmployee({
      id: 'EMP-002',
      name: 'Marcus Holloway',
      dateOfBirth: '11/20/1984',
      designation: Designation.DIRECTOR,
      reportsTo: 'EMP-001'
    });
    console.log(`Added Director: ${dir1.name} (${dir1.id}) -> Reports to: ${dir1.reportsTo}`);

    const dir2 = org.addEmployee({
      id: 'EMP-003',
      name: 'Sarah Connor',
      dateOfBirth: '08/12/1986',
      designation: Designation.DIRECTOR,
      reportsTo: 'EMP-001'
    });
    console.log(`Added Director: ${dir2.name} (${dir2.id}) -> Reports to: ${dir2.reportsTo}`);

    const mgr1 = org.addEmployee({
      id: 'EMP-004',
      name: 'David Bowman',
      dateOfBirth: '03/09/1989',
      designation: Designation.MANAGER,
      reportsTo: 'EMP-002'
    });
    console.log(`Added Manager: ${mgr1.name} (${mgr1.id}) -> Reports to: ${mgr1.reportsTo}`);

    const lead1 = org.addEmployee({
      id: 'EMP-005',
      name: 'Ada Lovelace',
      dateOfBirth: '12/10/1992',
      designation: Designation.LEAD,
      reportsTo: 'EMP-004'
    });
    console.log(`Added Lead: ${lead1.name} (${lead1.id}) -> Reports to: ${lead1.reportsTo}`);

    const eng1 = org.addEmployee({
      id: 'EMP-006',
      name: 'Alan Turing',
      dateOfBirth: '06/23/1995',
      designation: Designation.ENGINEER,
      reportsTo: 'EMP-005'
    });
    console.log(`Added Engineer: ${eng1.name} (${eng1.id}) -> Reports to: ${eng1.reportsTo}`);

    const eng2 = org.addEmployee({
      id: 'EMP-007',
      name: 'Grace Hopper',
      dateOfBirth: '12/09/1996',
      designation: Designation.ENGINEER,
      reportsTo: 'EMP-005'
    });
    console.log(`Added Engineer: ${eng2.name} (${eng2.id}) -> Reports to: ${eng2.reportsTo}`);
  } catch (error) {
    console.error('Unexpected error during valid employee creation:', error);
  }

  // ==========================================
  // 2. RETRIEVE OPERATIONS
  // ==========================================
  printSection('2. Retrieving Employee Details and Organization Hierarchy');

  console.log('\n--- Retrieve specific employee (EMP-005) ---');
  const emp5 = org.getEmployeeById('EMP-005');
  console.log(JSON.stringify(emp5.toJSON(), null, 2));

  console.log('\n--- Current Organization Hierarchy Tree ---');
  console.log(org.getOrganizationHierarchyTree());

  // ==========================================
  // 3. EDGE CASES & VALIDATIONS (REJECTIONS)
  // ==========================================
  printSection('3. Edge Cases & Validation Testing');

  // Edge case 1: Multiple CEOs
  try {
    console.log('\n Attempting to add a second CEO:');
    org.addEmployee({
      id: 'EMP-999',
      name: 'Imposter CEO',
      dateOfBirth: '01/01/1975',
      designation: Designation.CEO
    });
  } catch (error: any) {
    console.log(`Correctly Rejected: ${error.message}`);
  }

  // Edge case 2: Duplicate ID
  try {
    console.log('\n Attempting to add employee with existing ID (EMP-001):');
    org.addEmployee({
      id: 'EMP-001',
      name: 'Duplicate Elena',
      dateOfBirth: '05/14/1980',
      designation: Designation.DIRECTOR,
      reportsTo: 'EMP-001'
    });
  } catch (error: any) {
    console.log(`Correctly Rejected: ${error.message}`);
  }

  // Edge case 3: Invalid Hierarchy (Engineer attempting to report directly to Director)
  try {
    console.log('\n Attempting invalid hierarchy (Engineer reports to Director):');
    org.addEmployee({
      id: 'EMP-008',
      name: 'Bypassing Engineer',
      dateOfBirth: '04/04/1998',
      designation: Designation.ENGINEER,
      reportsTo: 'EMP-002' // Director ID
    });
  } catch (error: any) {
    console.log(`Correctly Rejected: ${error.message}`);
  }

  // Edge case 4: Invalid Date of Birth format
  try {
    console.log('\n Attempting invalid date format (2020/01/01 instead of mm/dd/yyyy):');
    org.addEmployee({
      id: 'EMP-008',
      name: 'Bad Date Emp',
      dateOfBirth: '2020/01/01',
      designation: Designation.ENGINEER,
      reportsTo: 'EMP-005'
    });
  } catch (error: any) {
    console.log(`Correctly Rejected: ${error.message}`);
  }

  // Edge case 5: Updating non-existent ID
  try {
    console.log('\nAttempting update on non-existent employee ID:');
    org.updateEmployee('EMP-9999', { name: 'Ghost' });
  } catch (error: any) {
    console.log(`Correctly Rejected: ${error.message}`);
  }

  // ==========================================
  // 4. UPDATE OPERATIONS
  // ==========================================
  printSection('4. Update Employee Operations');

  console.log('Updating EMP-007 (Grace Hopper) name and DOB...');
  const updatedEmp = org.updateEmployee('EMP-007', {
    name: 'Rear Admiral Grace Hopper',
    dateOfBirth: '12/09/1990'
  });
  console.log('Updated Employee:', JSON.stringify(updatedEmp.toJSON(), null, 2));

  // ==========================================
  // 5. DELETE OPERATIONS & REASSIGNMENT
  // ==========================================
  printSection('5. Delete Employee Handling (Active reportees vs Safe Reassignment)');

  // Deleting lead EMP-005 without reassigning Engineers
  try {
    console.log('\nAttempting to delete Lead EMP-005 while they have active reportees:');
    org.deleteEmployee('EMP-005');
  } catch (error: any) {
    console.log(`Correctly Rejected: ${error.message}`);
  }

  // Add a new replacement lead
  console.log('\n Adding replacement Lead (EMP-010) under Manager EMP-004:');
  org.addEmployee({
    id: 'EMP-010',
    name: 'Katherine Johnson',
    dateOfBirth: '08/26/1988',
    designation: Designation.LEAD,
    reportsTo: 'EMP-004'
  });

  // Safely delete EMP-005 and reassign reportees to EMP-010
  console.log('Deleting Lead EMP-005 and reassigning engineers to Katherine Johnson (EMP-010):');
  org.deleteEmployee('EMP-005', 'EMP-010');
  console.log('Successfully deleted EMP-005 with reassignment.');

  console.log('\n--- Final Organization Hierarchy Tree ---');
  console.log(org.getOrganizationHierarchyTree());

  printHeader('All Demonstrations & Validations Completed Successfully');
}

main();
