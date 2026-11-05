import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getNestedError } from './formUtils';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  helperText?: string;
}

export function TextField({
  name,
  label,
  id,
  type = 'text',
  helperText,
  required,
  ...rest
}: TextFieldProps) {
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

      <input
        id={fieldId}
        type={type}
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
        aria-required={required}
        className={`field-input ${error ? 'input-error' : ''}`}
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

