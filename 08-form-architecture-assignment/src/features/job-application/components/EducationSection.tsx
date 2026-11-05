import { useFieldArray, useFormContext } from 'react-hook-form';
import { TextField } from '../../../components/form';
import { JobApplicationFormValues } from '../schemas';

export function EducationSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<JobApplicationFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  // Array-level error (e.g., minimum 1 item required)
  const arrayError = errors.education?.message || (errors.education as { root?: { message?: string } })?.root?.message;

  const handleAddQualification = () => {
    append({
      degree: '',
      institution: '',
      yearOfPassing: '' as unknown as number,
      percentage: '' as unknown as number,
    });
  };

  return (
    <section aria-labelledby="education-heading" className="wizard-step-section">
      <h2 id="education-heading" className="step-title">
        Educational Qualifications
      </h2>
      <p className="step-description">
        Add your academic qualifications in reverse chronological order. At least one qualification is required.
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
              <h3 className="card-subtitle">Qualification #{index + 1}</h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="btn-danger btn-sm"
                  aria-label={`Remove qualification ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="fields-grid fields-grid-2">
              <TextField
                name={`education.${index}.degree`}
                label="Degree / Qualification"
                placeholder="e.g. B.Tech Computer Science"
                required
              />

              <TextField
                name={`education.${index}.institution`}
                label="Institution / University"
                placeholder="e.g. National Institute of Technology"
                required
              />

              <TextField
                name={`education.${index}.yearOfPassing`}
                label="Year of Passing"
                type="number"
                placeholder="e.g. 2024"
                min={1970}
                max={new Date().getFullYear() + 5}
                required
              />

              <TextField
                name={`education.${index}.percentage`}
                label="Percentage / Aggregate (%)"
                type="number"
                placeholder="e.g. 82.5"
                step="0.01"
                min={0}
                max={100}
                required
              />
            </div>
          </div>
        ))}
      </div>

      <div className="step-action-row">
        <button
          type="button"
          onClick={handleAddQualification}
          className="btn-secondary"
        >
          + Add Another Qualification
        </button>
      </div>
    </section>
  );
}

