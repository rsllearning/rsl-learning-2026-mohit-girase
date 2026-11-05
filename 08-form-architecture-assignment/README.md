# Job Application Form (Form Architecture & Runtime Schema Validation)

This repository contains the implementation of a 5-step Job Application wizard for a company careers portal, built strictly using **React**, **TypeScript (Strict Mode)**, **React Hook Form**, and **Zod**.

---

## 1. How to Run the Project

### Prerequisites
- Node.js (v18.x or later recommended; tested on v24.x)
- npm (v9.x or later)

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production and verify type safety
npm run build

# 4. Preview the production build locally
npm run preview
```

Open [http://localhost:3000](http://localhost:3000) (or the URL printed in the terminal) in your browser.

---

## 2. How the Schema Files are Organized

Schemas are organized by feature domain under `src/features/job-application/schemas/`, following the architectural guidelines in Module 5 and Module 9 of the training material:

```
src/features/job-application/schemas/
├── personalDetails.schema.ts     # Step 1: name, email, phone, age >= 18 check, city
├── education.schema.ts           # Step 2: repeating qualifications (degree, college, year, %)
├── experience.schema.ts          # Step 3: Discriminated union (Fresher vs Experienced)
├── applicationDetails.schema.ts  # Step 4: role, expected joining date in future, portfolio, terms
└── index.ts                      # Composed root schema, inferred types, and default values
```

### Schema Architecture & Composition
- **Single Source of Truth**: All validation rules reside strictly in Zod schemas. Zero validation logic exists inside React components, and TypeScript types are inferred automatically using `z.infer<typeof schema>`.
- **Discriminated Union**: The Fresher / Experienced requirement is modeled as `z.discriminatedUnion('experienceType', [fresherExperienceSchema, experiencedExperienceSchema])`.
- **Composition via `.shape` and `.and()`**: As demonstrated in Module 5.4 and Module 9.3 of the training guide, schemas are composed without duplication:
  ```ts
  const baseSchema = z.object({
    ...personalDetailsSchema.shape,
    ...educationSchema.shape,
    ...applicationDetailsSchema.shape,
  });

  export const jobApplicationSchema = baseSchema.and(experienceSchema);
  export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;
  ```

### Multi-Field & Cross-Field Validation Rules
1. **Age Requirement ($\ge 18$ years)**: In `personalDetails.schema.ts`, a `.refine()` validator compares the candidate's `dateOfBirth` against the current date, accounting for day and month boundaries.
2. **Employment Date Order (`toDate` after `fromDate`)**: In `experience.schema.ts`, each previous company object verifies that `toDate > fromDate` and maps the error specifically to `path: ['toDate']`.
3. **Future Joining Date**: In `applicationDetails.schema.ts`, `.refine()` ensures `expectedJoiningDate` is strictly greater than today's midnight timestamp.
4. **Discriminated Branch Requirements**: Freshers must provide `availabilityToJoin`. Experienced candidates must provide `totalExperience (> 0)`, `noticePeriod (>= 0)`, and at least one previous company record.

---

## 3. Which Validation Mode Was Chosen and Why

**Validation Mode Chosen:** `mode: "onTouched"`

### Justification:
- `onSubmit` waits until the user clicks submit. In a multi-step form, discovering all errors at the very end creates unnecessary frustration and requires tedious backtracking.
- `onChange` triggers validation on every single keystroke. While typing an email or date of birth, users are aggressively greeted with red error messages before finishing input.
- `onTouched` provides the ideal user experience (Module 2.5 of training):
  - Fields are not validated while the user is actively typing for the first time.
  - Validation triggers the moment the field loses focus (`blur`).
  - Once touched, if an error exists, subsequent edits validate immediately on change so the user receives instant positive feedback once corrected.

---

## 4. Where Form State Lives and How Steps Share It

### Architecture:
- **Zero Global Stores**: As required, form state is **not** duplicated into Redux, Zustand, or custom React Context.
- **Single Root `useForm` Instance**: A single `useForm<JobApplicationFormValues>` instance lives at the root `JobApplicationWizard` component.
- **`FormProvider` Distribution**: The wizard wraps all steps in `<FormProvider {...methods}>`. Child step components and shared field primitives read register functions and errors directly using `useFormContext()`.
- **Step Validation via `trigger()`**:
  When transitioning forward ("Next Step"), the wizard calls `trigger(currentStepFields, { shouldFocus: true })`. If valid, the local step index advances; if invalid, focus automatically moves to the first invalid field.
- **Preserved State**: Because all field values reside inside the single React Hook Form instance, moving back and forth between steps preserves all input values without data loss or synchronization bugs.

---

## 5. Deliberate Performance Optimizations (Avoiding Unnecessary Re-renders)

1. **Uncontrolled Native Inputs via `register` (Zero Keystroke Re-renders)**:
   Shared field components (`TextField`, `SelectField`, `TextareaField`, `CheckboxField`, `RadioGroupField`) use native DOM elements and hook form's ref-based `register(name)` rather than controlled `Controller` wrappers. Typing in inputs does not re-render step components or parent containers.
2. **Isolated `useWatch` in Experience Dynamic Section**:
   Instead of calling `watch()` at the step or wizard level (which would re-render the entire component tree on any change), `useWatch({ control, name: 'experienceType' })` is isolated inside a dedicated subcomponent (`ExperienceDynamicSection`). Toggling between Fresher and Experienced re-renders only that child section.
3. **Read-only Snapshot via `getValues()` in Review & Submit**:
   `ReviewAndSubmitSection` avoids subscribing to form updates with `watch()`. It simply reads a snapshot of the current form values using `getValues()`, completely avoiding any background form re-renders.
4. **Stable `useFieldArray` Keying**:
   Repeating qualification and company lists are keyed strictly on `field.id` (never the array index). Adding, removing, or reordering entries avoids unnecessary DOM re-creation of unaffected rows.

---

## 6. Accessibility (A11y) Implementation

- **Explicit Label Association**: All inputs have unique `id`s linked to `<label htmlFor={id}>`.
- **ARIA Attributes**:
  - `aria-invalid={true}` applied dynamically when an error exists.
  - `aria-describedby` links inputs to their respective error message IDs and helper text.
  - Errors rendered inside `<span role="alert">` for immediate screen-reader announcement.
- **Automated Focus**: `trigger(fields, { shouldFocus: true })` and server-validation error redirection automatically move keyboard focus to the first invalid input.
- **Keyboard Operability**: The entire wizard, including tab traversal, date inputs, radios, checkboxes, repeating list add/remove buttons, and step navigation, is completable using only the keyboard.

---

## 7. Mock API & Tri-Outcome Simulation

Submission calls `submitJobApplication(data, forcedOutcome)` with an artificial 1.5-second delay.

The UI includes an interactive **Mock API Test Controls** panel at the top to let reviewers test all three outcomes:
1. **Success (HTTP 200)**: Simulates successful application creation. Displays confirmation screen with generated Application ID and a reset button.
2. **Field-level Validation Error (HTTP 400)**: Simulates backend business failure (e.g. email already registered in the past 6 months). Sets form error via `setError('email', { type: 'server', message: '...' })`, navigates the user back to Step 1, and focuses the email input.
3. **Server Error (HTTP 500)**: Simulates a database outage. Displays an alert banner on Step 5 with a "Retry Submission" option while preserving all candidate data.

*(Alternatively, entering `fail@example.com` or `500@example.com` in the email field triggers the respective server error automatically).*