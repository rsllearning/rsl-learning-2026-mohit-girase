import { useEffect } from 'react';
import { Control, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { RadioGroupField, TextField } from '../../../components/form';
import { JobApplicationFormValues } from '../schemas';

/**
 * Subcomponent for Fresher candidate fields.
 * Uncontrolled native inputs register with useFormContext without triggering re-renders.
 */
function FresherFields() {
  return (
    <div className="experience-subgroup">
      <h3 className="card-subtitle">Fresher Candidate Details</h3>
      <TextField
        name="availabilityToJoin"
        label="Availability to Join"
        placeholder="e.g. Immediately, 15 days, 1 month"
        helperText="State when you can start if an offer is extended."
        required
      />
    </div>
  );
}

/**
 * Subcomponent for Experienced candidate fields.
 * Includes total experience, notice period, and dynamic repeating previous companies list.
 */
function ExperiencedFields({ control }: { control: Control<JobApplicationFormValues> }) {
  const {
    formState: { errors },
  } = useFormContext<JobApplicationFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'previousCompanies',
  });

  // Automatically ensure at least 1 previous company row is present for experienced candidates
  useEffect(() => {
    if (fields.length === 0) {
      append({
        companyName: '',
        role: '',
        fromDate: '',
        toDate: '',
      });
    }
  }, [fields.length, append]);

  const arrayError =
    errors.previousCompanies?.message ||
    (errors.previousCompanies as { root?: { message?: string } })?.root?.message;

  const handleAddCompany = () => {
    append({
      companyName: '',
      role: '',
      fromDate: '',
      toDate: '',
    });
  };

  return (
    <div className="experience-subgroup">
      <h3 className="card-subtitle">Experience & Previous Employment</h3>

      <div className="fields-grid fields-grid-2">
        <TextField
          name="totalExperience"
          label="Total Experience (in years)"
          type="number"
          step="0.1"
          min={0.1}
          placeholder="e.g. 3.5"
          required
        />

        <TextField
          name="noticePeriod"
          label="Notice Period (in days)"
          type="number"
          min={0}
          placeholder="e.g. 30"
          helperText="Enter 0 if currently serving or available immediately."
          required
        />
      </div>

      <div className="companies-section">
        <h4 className="section-minor-heading">Previous Companies</h4>
        <p className="helper-text">
          List your previous roles. Start and end dates are required, and the &quot;To&quot; date must be after the &quot;From&quot; date.
        </p>

        {arrayError && typeof arrayError === 'string' && (
          <div role="alert" className="form-alert-error">
            {arrayError}
          </div>
        )}

        <div className="repeating-list">
          {fields.map((field, index) => (
            <div key={field.id} className="repeating-card">
              <div className="repeating-card-header">
                <h5 className="card-subtitle">Company #{index + 1}</h5>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="btn-danger btn-sm"
                    aria-label={`Remove company #${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="fields-grid fields-grid-2">
                <TextField
                  name={`previousCompanies.${index}.companyName`}
                  label="Company Name"
                  placeholder="e.g. Acme Corp"
                  required
                />

                <TextField
                  name={`previousCompanies.${index}.role`}
                  label="Role / Designation"
                  placeholder="e.g. Senior Software Engineer"
                  required
                />

                <TextField
                  name={`previousCompanies.${index}.fromDate`}
                  label="From Date (Start)"
                  type="date"
                  required
                />

                <TextField
                  name={`previousCompanies.${index}.toDate`}
                  label="To Date (End)"
                  type="date"
                  required
                  helperText="Must be after the From Date."
                />
              </div>
            </div>
          ))}
        </div>

        <div className="step-action-row">
          <button
            type="button"
            onClick={handleAddCompany}
            className="btn-secondary"
          >
            + Add Another Company
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Isolated dynamic container that subscribes only to `experienceType`.
 * Placing useWatch here isolates the subscription so toggling or typing
 * does not re-render the parent ExperienceSection component or wizard.
 */
function ExperienceDynamicSection({
  control,
}: {
  control: Control<JobApplicationFormValues>;
}) {
  const experienceType = useWatch({
    control,
    name: 'experienceType',
    defaultValue: 'fresher',
  });

  return experienceType === 'fresher' ? (
    <FresherFields />
  ) : (
    <ExperiencedFields control={control} />
  );
}

export function ExperienceSection() {
  const { control } = useFormContext<JobApplicationFormValues>();

  return (
    <section aria-labelledby="experience-heading" className="wizard-step-section">
      <h2 id="experience-heading" className="step-title">
        Work Experience
      </h2>
      <p className="step-description">
        Indicate your experience level. The fields below will adapt based on your selection.
      </p>

      <RadioGroupField
        name="experienceType"
        legend="Are you applying as a Fresher or Experienced professional?"
        options={[
          { label: 'Fresher (0 years / Recent Graduate)', value: 'fresher' },
          { label: 'Experienced Professional', value: 'experienced' },
        ]}
        required
      />

      <ExperienceDynamicSection control={control} />
    </section>
  );
}

