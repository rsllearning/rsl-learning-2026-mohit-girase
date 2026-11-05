import React, { useState } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  defaultJobApplicationValues,
  jobApplicationSchema,
  JobApplicationFormValues,
} from '../schemas';
import { MockOutcomeType, submitJobApplication, SuccessApiResponse } from '../services/mockApi';
import { PersonalDetailsSection } from './PersonalDetailsSection';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { ApplicationDetailsSection } from './ApplicationDetailsSection';
import { ReviewAndSubmitSection } from './ReviewAndSubmitSection';

const TOTAL_STEPS = 5;

const STEP_TITLES = [
  'Personal Details',
  'Education',
  'Experience',
  'Application Details',
  'Review & Submit',
];

export function JobApplicationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [mockScenario, setMockScenario] = useState<MockOutcomeType>('success');
  const [serverError, setServerError] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<SuccessApiResponse['data'] | null>(null);
  const [serverValidationAlert, setServerValidationAlert] = useState<string | null>(null);

  /**
   * One form instance for the entire wizard.
   * mode: "onTouched" validates after first blur and on subsequent change.
   * defaultValues provided for all fields to avoid uncontrolled/controlled warnings.
   */
  const methods = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: defaultJobApplicationValues,
    mode: 'onTouched',
    shouldFocusError: true,
  });

  const {
    handleSubmit,
    trigger,
    setError,
    reset,
    getValues,
    formState: { isSubmitting },
  } = methods;

  /**
   * Validates only the current step's fields using trigger().
   * Automatically moves focus to the first invalid field on failure.
   */
  const handleNext = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setServerError(null);
    setServerValidationAlert(null);

    let fieldsToValidate: (keyof JobApplicationFormValues | string)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'email', 'phone', 'dateOfBirth', 'currentCity'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['education'];
    } else if (currentStep === 3) {
      const expType = getValues('experienceType');
      if (expType === 'fresher') {
        fieldsToValidate = ['experienceType', 'availabilityToJoin'];
      } else {
        fieldsToValidate = ['experienceType', 'totalExperience', 'noticePeriod', 'previousCompanies'];
      }
    } else if (currentStep === 4) {
      fieldsToValidate = [
        'positionAppliedFor',
        'expectedJoiningDate',
        'portfolioLink',
        'coverNote',
        'termsAccepted',
      ];
    }

    const isStepValid = await trigger(fieldsToValidate as any, { shouldFocus: true });
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setServerError(null);
    setServerValidationAlert(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToStep = (stepNumber: number) => {
    setServerError(null);
    setServerValidationAlert(null);
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Final submission handler:
   * Called only when the full schema passes client-side validation on Step 5.
   * Handles 3 server outcomes: field error (400), server crash (500), success (200).
   */
  const onSubmit = async (data: JobApplicationFormValues) => {
    setServerError(null);
    setServerValidationAlert(null);

    // Clean up fields if candidate is fresher
    const payload = { ...data };
    if (payload.experienceType === 'fresher') {
      delete (payload as any).totalExperience;
      delete (payload as any).noticePeriod;
      delete (payload as any).previousCompanies;
    }

    const response = await submitJobApplication(payload, mockScenario);

    if (response.ok) {
      // 1. HTTP 200: Success
      setSuccessReceipt(response.data);
    } else if (response.status === 400) {
      // 2. HTTP 400: Field-level validation error returned by backend
      const message = response.errors.email || 'Validation error returned by server.';
      setError('email', {
        type: 'server',
        message: message,
      });

      setServerValidationAlert(
        'Server rejected application: A field-level error was returned. Redirecting to Step 1 to correct.'
      );
      setCurrentStep(1);

      // Focus email field
      setTimeout(() => {
        const emailInput = document.getElementById('email');
        if (emailInput) {
          emailInput.focus();
        }
      }, 100);
    } else if (response.status === 500) {
      // 3. HTTP 500: Server failure
      setServerError(response.message);
    }
  };

  /**
   * If validation fails on Step 5 submit, redirect to the step containing
   * the first invalid field and show an actionable message.
   */
  const onInvalid = (errors: FieldErrors<JobApplicationFormValues>) => {
    console.warn('Form validation failed on final submit:', errors);

    const stepFieldsMap: { step: number; name: string; keys: (keyof JobApplicationFormValues | string)[] }[] = [
      { step: 1, name: 'Personal Details', keys: ['fullName', 'email', 'phone', 'dateOfBirth', 'currentCity'] },
      { step: 2, name: 'Education', keys: ['education'] },
      { step: 3, name: 'Experience', keys: ['experienceType', 'availabilityToJoin', 'totalExperience', 'noticePeriod', 'previousCompanies'] },
      { step: 4, name: 'Application Details', keys: ['positionAppliedFor', 'expectedJoiningDate', 'portfolioLink', 'coverNote', 'termsAccepted'] },
    ];

    for (const group of stepFieldsMap) {
      const hasError = group.keys.some((k) => !!errors[k as keyof JobApplicationFormValues]);
      if (hasError) {
        setServerError(`Please review and correct errors in ${group.name} before submitting.`);
        setCurrentStep(group.step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setServerError('Please review all fields. Some required information is missing or invalid.');
  };

  /**
   * Explicit form submit controller:
   * Prevents premature submission when pressing Enter in inputs during earlier steps.
   * Only allows final submission when explicitly on the review step.
   */
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentStep < TOTAL_STEPS) {
      // If user presses Enter key inside an input during earlier steps, advance step instead of submitting
      handleNext();
      return;
    }

    // Only on the final step do we invoke React Hook Form's handleSubmit
    handleSubmit(onSubmit, onInvalid)(e);
  };

  const handleResetApplication = () => {
    reset(defaultJobApplicationValues);
    setSuccessReceipt(null);
    setServerError(null);
    setServerValidationAlert(null);
    setCurrentStep(1);
  };

  // If application was successfully submitted, display confirmation screen
  if (successReceipt) {
    return (
      <main className="wizard-container" role="main">
        <div className="success-card" role="region" aria-labelledby="success-title">
          <div className="success-badge" aria-hidden="true">
            ✓
          </div>
          <h2 id="success-title" className="step-title">
            Application Submitted Successfully!
          </h2>
          <p className="step-description">
            Thank you, <strong>{successReceipt.candidateName}</strong>. Your application for the position of{' '}
            <strong>{successReceipt.position}</strong> has been received.
          </p>

          <div className="receipt-box">
            <p>
              <strong>Application Reference:</strong> {successReceipt.applicationId}
            </p>
            <p>
              <strong>Submission Timestamp:</strong> {new Date(successReceipt.submittedAt).toLocaleString()}
            </p>
            <p className="helper-text">
              A confirmation email has been dispatched with next steps and interview scheduling details.
            </p>
          </div>

          <div className="step-action-row" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={handleResetApplication}
              className="btn-primary"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wizard-container" role="main">
      {/* Mock scenario tester for evaluator convenience */}
      <section className="mock-control-panel" aria-label="Mock API Test Controls">
        <span className="mock-label">
          <strong>Mock API Test Outcome:</strong>
        </span>
        <div className="mock-options" role="radiogroup" aria-label="Mock server outcome">
          <label className="mock-radio-label">
            <input
              type="radio"
              name="mockScenario"
              value="success"
              checked={mockScenario === 'success'}
              onChange={() => setMockScenario('success')}
            />
            Success (200)
          </label>
          <label className="mock-radio-label">
            <input
              type="radio"
              name="mockScenario"
              value="field_error"
              checked={mockScenario === 'field_error'}
              onChange={() => setMockScenario('field_error')}
            />
            Server Validation Error (400)
          </label>
          <label className="mock-radio-label">
            <input
              type="radio"
              name="mockScenario"
              value="server_error"
              checked={mockScenario === 'server_error'}
              onChange={() => setMockScenario('server_error')}
            />
            Server Failure (500)
          </label>
        </div>
      </section>

      {/* Server validation banner if redirected from Review step */}
      {serverValidationAlert && (
        <div role="alert" className="server-alert-banner">
          {serverValidationAlert}
        </div>
      )}

      {/* Accessible Stepper */}
      <nav aria-label="Form Progress" className="stepper-nav">
        <ol className="stepper-list">
          {STEP_TITLES.map((title, index) => {
            const stepNum = index + 1;
            const isCurrent = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <li
                key={title}
                className={`stepper-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="stepper-bubble">{isCompleted ? '✓' : stepNum}</span>
                <span className="stepper-label">{title}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* FormProvider exposes form instance to all sections without prop drilling */}
      <FormProvider {...methods}>
        <form onSubmit={handleFormSubmit} noValidate>
          {currentStep === 1 && <PersonalDetailsSection />}
          {currentStep === 2 && <EducationSection />}
          {currentStep === 3 && <ExperienceSection />}
          {currentStep === 4 && <ApplicationDetailsSection />}
          {currentStep === 5 && (
            <ReviewAndSubmitSection onGoToStep={handleGoToStep} serverError={serverError} />
          )}

          {/* Wizard Navigation Footer */}
          <footer className="wizard-footer">
            <div className="footer-left">
              {currentStep > 1 && (
                <button
                  key="btn-back"
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="btn-secondary"
                >
                  ← Back
                </button>
              )}
            </div>

            <div className="footer-right">
              {currentStep < TOTAL_STEPS ? (
                <button
                  key="btn-next"
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  key="btn-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary btn-submit"
                >
                  {isSubmitting ? 'Submitting Application (1.5s)...' : 'Submit Application'}
                </button>
              )}
            </div>
          </footer>
        </form>
      </FormProvider>
    </main>
  );
}
