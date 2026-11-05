import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getNestedError } from './formUtils';

export interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  helperText?: string;
}

export function TextareaField({
  name,
  label,
  id,
  helperText,
  required,
  rows = 4,
  ...rest
}: TextareaFieldProps) {
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

      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
        aria-required={required}
        className={`field-input field-textarea ${error ? 'input-error' : ''}`}
        {...register(name)}
        {...rest}
      />

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

