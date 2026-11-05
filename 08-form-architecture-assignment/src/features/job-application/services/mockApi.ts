import { JobApplicationFormValues } from '../schemas';

export type MockOutcomeType = 'success' | 'field_error' | 'server_error';

export interface SuccessApiResponse {
  ok: true;
  status: 200;
  data: {
    applicationId: string;
    candidateName: string;
    position: string;
    submittedAt: string;
  };
}

export interface FieldErrorApiResponse {
  ok: false;
  status: 400;
  errors: Record<string, string>;
}

export interface ServerErrorApiResponse {
  ok: false;
  status: 500;
  message: string;
}

export type MockApiResponse =
  | SuccessApiResponse
  | FieldErrorApiResponse
  | ServerErrorApiResponse;

/**
 * Simulates a server API submission with an artificial 1.5 second delay.
 * Evaluates the chosen outcome scenario or dynamically triggers a validation error
 * if the candidate uses a reserved test email (e.g. error@example.com).
 */
export async function submitJobApplication(
  data: JobApplicationFormValues,
  forcedOutcome?: MockOutcomeType
): Promise<MockApiResponse> {
  // Pause for ~1.5 seconds as specified in requirements
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Determine outcome based on selector or email keyword
  let outcome = forcedOutcome || 'success';
  if (data.email?.toLowerCase().includes('fail@') || data.email?.toLowerCase().includes('duplicate@')) {
    outcome = 'field_error';
  } else if (data.email?.toLowerCase().includes('500@') || data.email?.toLowerCase().includes('crash@')) {
    outcome = 'server_error';
  }

  if (outcome === 'field_error') {
    return {
      ok: false,
      status: 400,
      errors: {
        email: 'Server Validation Error: This email address is already registered for an open position within the last 6 months.',
      },
    };
  }

  if (outcome === 'server_error') {
    return {
      ok: false,
      status: 500,
      message: 'Server Error (500): The career portal database is temporarily unreachable. Your entered data has been preserved. Please retry.',
    };
  }

  return {
    ok: true,
    status: 200,
    data: {
      applicationId: `APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      candidateName: data.fullName,
      position: data.positionAppliedFor,
      submittedAt: new Date().toISOString(),
    },
  };
}

