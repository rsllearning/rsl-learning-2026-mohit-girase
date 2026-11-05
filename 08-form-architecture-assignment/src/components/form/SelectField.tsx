import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getNestedError } from './formUtils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
}

export function SelectField({
  name,
  label,
  options,
  placeholder = 'Select an option',
  id,
  helperText,
  required,
  ...rest
}: SelectFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldId = id || name;
  const error = getNestedError(errors, name);
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const describedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="form-field">
      <label htmlFor={fieldId} className="field-label">
        {label}
        {required && <span className="required-indicator" aria-hidden="true"> *</span>}
      </label>

      <select
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
        aria-required={required}
        className={`field-input ${error ? 'input-error' : ''}`}
        {...register(name)}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

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
    </div>
  );
}

