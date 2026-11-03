import React from 'react';
import {
  baseCard,
  cardVariants,
  cardHeader,
  cardTitle,
  cardSubtitle,
  cardBody,
  cardFooter,
} from './Card.css';

export type CardVariant = keyof typeof cardVariants;

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  className: extraClassName,
  children,
  ...rest
}) => {
  const combinedClassName = [
    baseCard,
    cardVariants[variant],
    extraClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={combinedClassName} {...rest}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className: extraClassName,
  children,
  ...rest
}) => (
  <div className={[cardHeader, extraClassName].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className: extraClassName,
  children,
  ...rest
}) => (
  <h3 className={[cardTitle, extraClassName].filter(Boolean).join(' ')} {...rest}>
    {children}
  </h3>
);

export const CardSubtitle: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className: extraClassName,
  children,
  ...rest
}) => (
  <p className={[cardSubtitle, extraClassName].filter(Boolean).join(' ')} {...rest}>
    {children}
  </p>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className: extraClassName,
  children,
  ...rest
}) => (
  <div className={[cardBody, extraClassName].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className: extraClassName,
  children,
  ...rest
}) => (
  <div className={[cardFooter, extraClassName].filter(Boolean).join(' ')} {...rest}>
    {children}
  </div>
);

