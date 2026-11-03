import React from 'react';
import { baseBadge, badgeVariants } from './Badge.css';

export type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'brand',
  className: extraClassName,
  children,
  ...rest
}) => {
  const combinedClassName = [
    baseBadge,
    badgeVariants[variant],
    extraClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={combinedClassName} {...rest}>
      {children}
    </span>
  );
};
