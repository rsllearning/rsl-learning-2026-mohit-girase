import { TextField } from '../../../components/form';

export function PersonalDetailsSection() {
  return (
    <section aria-labelledby="personal-details-heading" className="wizard-step-section">
      <h2 id="personal-details-heading" className="step-title">
        Personal Details
      </h2>
      <p className="step-description">
        Please provide your contact information and basic personal details.
      </p>

      <div className="fields-grid">
        <TextField
          name="fullName"
          label="Full Name"
          placeholder="e.g. Jane Doe"
          required
          autoComplete="name"
        />

        <TextField
          name="email"
          label="Email Address"
          type="email"
          placeholder="e.g. jane.doe@example.com"
          required
          autoComplete="email"
        />

        <TextField
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="e.g. +1 555-0199 or 9876543210"
          required
          autoComplete="tel"
        />

        <TextField
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          required
          helperText="You must be at least 18 years old to apply."
        />

        <TextField
          name="currentCity"
          label="Current City"
          placeholder="e.g. Pune, Bangalore, San Jose"
          required
          autoComplete="address-level2"
        />
      </div>
    </section>
  );
}

