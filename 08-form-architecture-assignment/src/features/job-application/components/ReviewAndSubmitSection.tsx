import { useFormContext } from 'react-hook-form';
import { JobApplicationFormValues } from '../schemas';

interface ReviewAndSubmitSectionProps {
  onGoToStep: (stepNumber: number) => void;
  serverError: string | null;
}

export function ReviewAndSubmitSection({ onGoToStep, serverError }: ReviewAndSubmitSectionProps) {
  // getValues() reads values without subscribing, avoiding any unnecessary re-renders!
  const { getValues } = useFormContext<JobApplicationFormValues>();
  const values = getValues();

  return (
    <section aria-labelledby="review-submit-heading" className="wizard-step-section">
      <h2 id="review-submit-heading" className="step-title">
        Review & Submit
      </h2>
      <p className="step-description">
        Please verify your information before final submission. Click &quot;Edit&quot; on any section to make corrections.
      </p>

      {serverError && (
        <div role="alert" className="server-alert-banner">
          <strong>Submission Failed:</strong> {serverError}
        </div>
      )}

      {/* Section 1: Personal Details */}
      <div className="review-section">
        <div className="review-header">
          <h3 className="review-title">Personal Details</h3>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="btn-edit"
            aria-label="Edit Personal Details"
          >
            Edit
          </button>
        </div>
        <dl className="review-list">
          <div className="review-item">
            <dt>Full Name:</dt>
            <dd>{values.fullName || '—'}</dd>
          </div>
          <div className="review-item">
            <dt>Email:</dt>
            <dd>{values.email || '—'}</dd>
          </div>
          <div className="review-item">
            <dt>Phone:</dt>
            <dd>{values.phone || '—'}</dd>
          </div>
          <div className="review-item">
            <dt>Date of Birth:</dt>
            <dd>{values.dateOfBirth || '—'}</dd>
          </div>
          <div className="review-item">
            <dt>Current City:</dt>
            <dd>{values.currentCity || '—'}</dd>
          </div>
        </dl>
      </div>

      {/* Section 2: Education */}
      <div className="review-section">
        <div className="review-header">
          <h3 className="review-title">Educational Qualifications ({values.education?.length || 0} entries)</h3>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="btn-edit"
            aria-label="Edit Educational Qualifications"
          >
            Edit
          </button>
        </div>
        <div className="review-table-container">
          <table className="review-table">
            <thead>
              <tr>
                <th scope="col">Degree</th>
                <th scope="col">Institution</th>
                <th scope="col">Year</th>
                <th scope="col">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {values.education && values.education.length > 0 ? (
                values.education.map((edu, idx) => (
                  <tr key={idx}>
                    <td>{edu.degree || '—'}</td>
                    <td>{edu.institution || '—'}</td>
                    <td>{edu.yearOfPassing || '—'}</td>
                    <td>{edu.percentage ? `${edu.percentage}%` : '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No qualifications recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Experience */}
      <div className="review-section">
        <div className="review-header">
          <h3 className="review-title">
            Work Experience ({values.experienceType === 'fresher' ? 'Fresher' : 'Experienced'})
          </h3>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="btn-edit"
            aria-label="Edit Work Experience"
          >
            Edit
          </button>
        </div>

        {values.experienceType === 'fresher' ? (
          <dl className="review-list">
            <div className="review-item">
              <dt>Candidate Level:</dt>
              <dd>Fresher / Entry Level</dd>
            </div>
            <div className="review-item">
              <dt>Availability to Join:</dt>
              <dd>{values.availabilityToJoin || '—'}</dd>
            </div>
          </dl>
        ) : (
          <div>
            <dl className="review-list">
              <div className="review-item">
                <dt>Total Experience:</dt>
                <dd>{values.totalExperience ? `${values.totalExperience} years` : '—'}</dd>
              </div>
              <div className="review-item">
                <dt>Notice Period:</dt>
                <dd>{values.noticePeriod !== undefined ? `${values.noticePeriod} days` : '—'}</dd>
              </div>
            </dl>

            <h4 className="section-minor-heading" style={{ marginTop: '0.75rem' }}>Previous Companies</h4>
            <div className="review-table-container">
              <table className="review-table">
                <thead>
                  <tr>
                    <th scope="col">Company</th>
                    <th scope="col">Role</th>
                    <th scope="col">From Date</th>
                    <th scope="col">To Date</th>
                  </tr>
                </thead>
                <tbody>
                  {values.previousCompanies && values.previousCompanies.length > 0 ? (
                    values.previousCompanies.map((comp, idx) => (
                      <tr key={idx}>
                        <td>{comp.companyName || '—'}</td>
                        <td>{comp.role || '—'}</td>
                        <td>{comp.fromDate || '—'}</td>
                        <td>{comp.toDate || '—'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>No previous companies recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Application Details */}
      <div className="review-section">
        <div className="review-header">
          <h3 className="review-title">Application Details</h3>
          <button
            type="button"
            onClick={() => onGoToStep(4)}
            className="btn-edit"
            aria-label="Edit Application Details"
          >
            Edit
          </button>
        </div>
        <dl className="review-list">
          <div className="review-item">
            <dt>Position Applied For:</dt>
            <dd>{values.positionAppliedFor || '—'}</dd>
          </div>
          <div className="review-item">
            <dt>Expected Joining Date:</dt>
            <dd>{values.expectedJoiningDate || '—'}</dd>
          </div>
          <div className="review-item">
            <dt>Portfolio / Links:</dt>
            <dd>
              {values.portfolioLink ? (
                <a href={values.portfolioLink} target="_blank" rel="noopener noreferrer">
                  {values.portfolioLink}
                </a>
              ) : (
                'None provided'
              )}
            </dd>
          </div>
          <div className="review-item">
            <dt>Cover Note:</dt>
            <dd>{values.coverNote || 'None provided'}</dd>
          </div>
          <div className="review-item">
            <dt>Terms Accepted:</dt>
            <dd>{values.termsAccepted ? 'Yes (Accepted)' : 'No'}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

