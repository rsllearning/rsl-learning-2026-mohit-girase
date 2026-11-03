import React, { forwardRef } from 'react';
import {
  baseButton,
  buttonVariants,
  buttonSizes,
  fullWidthStyle,
} from './Button.css';

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Type-Safe Reusable Button Component
 * Built with Vanilla Extract zero-runtime static CSS
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled = false,
      className: extraClassName,
      children,
      ...rest
    },
    ref
  ) => {
    // Style composition: base + variant + size + fullWidth
    const combinedClassName = [
      baseButton,
      buttonVariants[variant],
      buttonSizes[size],
      fullWidth ? fullWidthStyle : undefined,
      extraClassName,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={combinedClassName}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

