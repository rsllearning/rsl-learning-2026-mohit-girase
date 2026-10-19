import { useActionState } from 'react';
import { SubmitButton } from './SubmitButton';

export function RegistrationForm({ onRegisterSuccess }) {
  async function registerAction(previousState, formData) {
    const name = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const password = formData.get("password")?.trim();

    const fieldErrors = {};
    if (!name) {
      fieldErrors.name = "Full name is required.";
    }
    if (!email) {
      fieldErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fieldErrors.email = "Please enter a valid email format (e.g., user@example.com).";
    }
    if (!password) {
      fieldErrors.password = "Password is required.";
    } else if (password.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters long.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        fieldErrors,
        generalError: "Please fix the errors below before submitting.",
        message: null,
      };
    }

    // Simulate asynchronous server API request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser = {
      name,
      email,
      registeredAt: new Date().toLocaleTimeString(),
    };

    if (onRegisterSuccess) {
      onRegisterSuccess(newUser);
    }

    return {
      success: true,
      fieldErrors: {},
      generalError: null,
      message: `Welcome, ${name}! Your account has been successfully created.`,
      user: newUser,
    };
  }

  const [state, formAction, isPending] = useActionState(registerAction, {
    success: false,
    fieldErrors: {},
    generalError: null,
    message: null,
    user: null,
  });

  return (
    <section className="registration-section">
      <div className="registration-card">
        <h2>User Registration</h2>
        <p className="section-subtitle">
          Please register to unlock member perks and place orders.
        </p>

        {state.generalError && (
          <div className="alert alert-error" role="alert">
            {state.generalError}
          </div>
        )}

        {state.success && state.message && (
          <div className="alert alert-success" role="status">
            {state.message}
          </div>
        )}

        <form action={formAction} className="registration-form">
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              placeholder="e.g. Sarah Connor"
              disabled={isPending}
              className={state.fieldErrors?.name ? "input-error" : ""}
            />
            {state.fieldErrors?.name && (
              <span className="error-text">{state.fieldErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              placeholder="e.g. sarah@example.com"
              disabled={isPending}
              className={state.fieldErrors?.email ? "input-error" : ""}
            />
            {state.fieldErrors?.email && (
              <span className="error-text">{state.fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              disabled={isPending}
              className={state.fieldErrors?.password ? "input-error" : ""}
            />
            {state.fieldErrors?.password && (
              <span className="error-text">{state.fieldErrors.password}</span>
            )}
          </div>

          <div className="form-actions">
            <SubmitButton defaultLabel="Register Now" />
          </div>
        </form>
      </div>
    </section>
  );
}
