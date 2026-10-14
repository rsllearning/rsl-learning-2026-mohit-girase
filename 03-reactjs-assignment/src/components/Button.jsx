function Button({
  children,
  variant = 'teal',
  size = '',
  className = '',
  type = 'button',
  ...restProps
}) {
  const variantClass = variant ? `btn-${variant}` : '';
  const sizeClass = size ? `btn-${size}` : '';
  const combinedClasses = `btn ${variantClass} ${sizeClass} ${className}`.replace(/\s+/g, ' ').trim();

  return (
    <button type={type} className={combinedClasses} {...restProps}>
      {children}
    </button>
  );
}

export default Button;
