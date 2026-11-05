import React from 'react';
import { useFormContext } from 'react-hook-form';
import { getNestedError } from './formUtils';

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: React.ReactNode;
  helperText?: string;
}

export function CheckboxField({
  name,
  label,
  id,
  helperText,
  required,
  ...rest
}: CheckboxFieldProps) {
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
    <div className="form-field form-field-checkbox">
      <div className="checkbox-row">
        <input
          id={fieldId}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={describedBy || undefined}
          aria-required={required}
          className={`checkbox-input ${error ? 'input-error' : ''}`}
          {...register(name)}
          {...rest}
        />
        <label htmlFor={fieldId} className="checkbox-label">
          {label}
          {required && <span className="required-indicator" aria-hidden="true"> *</span>}
        </label>
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
    </div>
  );
}

