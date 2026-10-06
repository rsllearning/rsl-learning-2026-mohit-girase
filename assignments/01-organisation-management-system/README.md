# Organization Management System (TypeScript OOP)

An in-memory Organization Management System implemented in **TypeScript** using **Object-Oriented Programming (OOP)** principles (Inheritance, Polymorphism, Encapsulation, Abstraction, and Factory Pattern).

---

## Deliverables & Submission Information

- **Git Branch:** `assignment/01-typescript-assignment`
- **Video Demonstration Link:** [Google Drive](https://drive.google.com/file/d/1asTQIBXsJSvYbihjnO4dgvpyew2g77Fw/view?usp=sharing)

---

## Multiple Choice Questions

| Question | Question Snippet | Selected Option | Explanation |
| :--- | :--- | :--- | :--- |
| **Q1** | `const arr = [1, "two", 3] as const; const value = arr[1];` | **B. `"two"`** | The `as const` assertion narrows the tuple elements to literal types. Accessing index `1` yields the literal type `"two"`. |
| **Q2** | `interface A { x: number; y?: number; } class C implements A { x = 0; } const c = new C(); c.y = 10;` | **B. Error: Property 'y' does not exist on type 'C'...** | Implementing an interface with an optional property does not automatically generate or declare that property on the class instance. |
| **Q3** | `enum Status { Active = "ACTIVE" ... } enum Level { Active = "ACTIVE" ... } check(Level.Active)` | **B. Compile-time error, string enum members are nominally typed...** | TypeScript string enums are nominally typed rather than structurally typed, so `Level.Active` cannot be assigned to `Status`. |
| **Q4** | `type A = { id: number } & { id: string };` | **C. `never`** | The intersection of primitive incompatible types `number & string` for property `id` resolves to `never`. |
| **Q5** | `function getArea(shape: Shape): number { switch (shape.kind) ... }` | **B. Compile-time error, not all code paths return a value...** | The discriminated union case `"triangle"` is unhandled in the switch statement and there is no default/exhaustiveness fallback return. |

---

## Project Setup & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Tested with `v22.x`)
- **npm**: `v9.0.0` or higher

### Installation
Clone the repository, switch to the assignment branch, and install dependencies:

```bash
cd assignments/01-organisation-management-system
npm install
```

---

## Execution Commands

| Command | Action |
| :--- | :--- |
| `npm start` | Runs the demonstration script with mock data and test scenarios via `ts-node` |
| `npm test` | Runs the complete automated Jest test suite (unit tests & edge cases) |
| `npm run build` | Compiles TypeScript source files to JavaScript in `./dist` |
| `npm run start:prod` | Runs the compiled JavaScript application (`node dist/index.js`) |
| `npm run lint` | Runs type-checking without emitting files (`tsc --noEmit`) |

---

## Project Structure

```
01-organisation-management-system/
├── src/
│   ├── errors/
│   │   └── index.ts                 # Domain-specific custom error classes
│   ├── models/
│   │   ├── Employee.ts              # Abstract base class (encapsulation & abstraction)
│   │   ├── CEO.ts                   # CEO subclass (top of hierarchy, manages Directors)
│   │   ├── Director.ts              # Director subclass (reports to CEO, manages Managers)
│   │   ├── Manager.ts               # Manager subclass (reports to Director, manages Leads)
│   │   ├── Lead.ts                  # Lead subclass (reports to Manager, manages Engineers)
│   │   ├── Engineer.ts              # Engineer subclass (reports to Lead, no reportees)
│   │   ├── EmployeeFactory.ts       # Factory pattern for polymorphic employee creation
│   │   └── index.ts                 # Models export barrel
│   ├── services/
│   │   ├── OrganizationManager.ts   # Core service managing CRUD, hierarchy, & tree visualization
│   │   └── index.ts                 # Services export barrel
│   ├── types/
│   │   └── index.ts                 # Enums (Designation), interfaces & DTOs
│   ├── utils/
│   │   └── validators.ts            # Date of birth (mm/dd/yyyy) & string validators
│   └── index.ts                     # Executable mock demonstration runner
├── tests/
│   └── OrganizationManager.test.ts  # Jest unit tests covering all CRUD & edge cases
├── jest.config.js                   # Jest configuration with ts-jest
├── package.json                     # Project manifest and npm scripts
├── tsconfig.json                    # Strict TypeScript configuration
└── README.md                        # Documentation and architecture guide
```

---

## Design Approach & OOP Principles

### 1. Hierarchy & Domain Modeling
The organization follows a strict single-root tree structure:
$$\text{CEO} \longrightarrow \text{Director} \longrightarrow \text{Manager} \longrightarrow \text{Lead} \longrightarrow \text{Engineer}$$

| Designation | Allowed `reportsTo` | Allowed `reportees` |
| :--- | :--- | :--- |
| **CEO** | `None` (`null`) | `Director` IDs only |
| **Director** | `CEO` | `Manager` IDs only |
| **Manager** | `Director` | `Lead` IDs only |
| **Lead** | `Manager` | `Engineer` IDs only |
| **Engineer** | `Lead` | `None` (empty list) |

### 2. OOP Principles Applied
- **Abstraction:** The abstract class `Employee` specifies the contract for all employees and declares abstract methods `getAllowedManagerDesignation()`, `getAllowedReporteeDesignation()`, and `canHaveReportees()`.
- **Inheritance & Polymorphism:** Subclasses (`CEO`, `Director`, `Manager`, `Lead`, `Engineer`) inherit common behavior and polymorphically enforce designation-specific reporting constraints.
- **Encapsulation:** Employee properties are private (`_id`, `_name`, `_dateOfBirth`, `_designation`, `_reportsTo`, `_reportees`) and accessed/modified via validated getters and methods (`setName`, `setDateOfBirth`, `addReportee`, `removeReportee`).
- **Factory Pattern:** `EmployeeFactory.create(...)` decouples the creation logic from the calling service.

---

## Edge Cases & Validations Handled

1. **Unique Employee ID:** Duplicate IDs are rejected with `DuplicateError`.
2. **Single CEO Constraint:** Only one CEO can exist. Subsequent attempts to add or promote another CEO trigger `HierarchyError`.
3. **Strict Hierarchy Enforcement:** Attempting to assign an invalid manager (e.g., Engineer directly under Director or Manager under Lead) is rejected with `HierarchyError`.
4. **Strict Date Format Validation:** `dateOfBirth` must strictly be in `mm/dd/yyyy` format with valid calendar days (e.g., `02/30/1990` is rejected) and cannot be in the future.
5. **Safe Deletion & Reassignment:**
   - Attempting to delete an employee with active reportees without providing a replacement is rejected to prevent orphaned employees.
   - When a valid replacement manager ID is provided, all reportees are automatically reassigned to the new manager.
6. **Non-Existent Employee References:** Updating, retrieving, or assigning a manager to a non-existent ID throws `NotFoundError`.
