import { CheckboxField, SelectField, TextareaField, TextField } from '../../../components/form';

const POSITION_OPTIONS = [
  { label: 'Frontend Engineer (React / TypeScript)', value: 'Frontend Engineer' },
  { label: 'Backend Engineer (Node.js / Python / Go)', value: 'Backend Engineer' },
  { label: 'Full Stack Engineer', value: 'Full Stack Engineer' },
  { label: 'QA / Automation Test Engineer', value: 'QA Automation Engineer' },
  { label: 'DevOps / Platform Engineer', value: 'DevOps Engineer' },
  { label: 'UI / UX Product Designer', value: 'UI/UX Designer' },
];

export function ApplicationDetailsSection() {
  return (
    <section aria-labelledby="application-details-heading" className="wizard-step-section">
      <h2 id="application-details-heading" className="step-title">
        Application Details
      </h2>
      <p className="step-description">
        Specify the role you are applying for and your availability details.
      </p>

      <div className="fields-grid">
        <SelectField
          name="positionAppliedFor"
          label="Position Applied For"
          options={POSITION_OPTIONS}
          placeholder="-- Select an open position --"
          required
        />

        <TextField
          name="expectedJoiningDate"
          label="Expected Joining Date"
          type="date"
          helperText="Must be a future date."
          required
        />

        <TextField
          name="portfolioLink"
          label="Portfolio / GitHub / LinkedIn Link (Optional)"
          type="url"
          placeholder="https://github.com/username or https://portfolio.com"
          helperText="Include the full URL starting with https://"
        />

        <TextareaField
          name="coverNote"
          label="Cover Note / Why do you want to join us? (Optional)"
          placeholder="Briefly highlight your strengths, relevant achievements, or why you are excited about this position..."
          rows={4}
        />

        <CheckboxField
          name="termsAccepted"
          label="I certify that the information provided in this application is accurate and complete to the best of my knowledge."
          required
        />
      </div>
    </section>
  );
}

