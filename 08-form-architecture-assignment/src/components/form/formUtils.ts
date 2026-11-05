import { FieldErrors } from 'react-hook-form';

/**
 * Resolves a nested error object from React Hook Form's errors object
 * given a dot/bracket path like 'education.0.degree' or 'fullName'.
 */
export function getNestedError(
  errors: FieldErrors | undefined,
  path: string
): { message?: string } | undefined {
  if (!errors || !path) return undefined;

  const segments = path.replace(/\[(\w+)\]/g, '.$1').split('.');
  let current: unknown = errors;

  for (const segment of segments) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  if (current && typeof current === 'object' && 'message' in current) {
    return current as { message?: string };
  }

  return undefined;
}

