import { useFormContext } from 'react-hook-form';
import { getNestedError } from './formUtils';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupFieldProps {
  name: string;
  legend: string;
  options: RadioOption[];
  helperText?: string;
  required?: boolean;
}

export function RadioGroupField({
  name,
  legend,
  options,
  helperText,
  required,
}: RadioGroupFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = getNestedError(errors, name);
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <fieldset
      className="form-fieldset"
      aria-invalid={!!error}
      aria-describedby={error ? errorId : helperText ? helperId : undefined}
    >
      <legend className="fieldset-legend">
        {legend}
        {required && <span className="required-indicator" aria-hidden="true"> *</span>}
      </legend>

      <div className="radio-group-options">
        {options.map((opt) => {
          const radioId = `${name}-${opt.value}`;
          return (
            <div key={opt.value} className="radio-option">
              <input
                id={radioId}
                type="radio"
                value={opt.value}
                className="radio-input"
                {...register(name)}
              />
              <label htmlFor={radioId} className="radio-label">
                {opt.label}
              </label>
            </div>
          );
        })}
      </div>

      {helperText && !error && (
        <span id={helperId} className="helper-text">
          {helperText}
        </span>
      )}

      {error && (
        <span id={errorId} role="alert" className="error-text">
          {error.message}
        </span>
      )}
    </fieldset>
  );
}

