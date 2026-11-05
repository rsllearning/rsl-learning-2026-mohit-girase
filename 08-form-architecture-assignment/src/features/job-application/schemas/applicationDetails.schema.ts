import { z } from 'zod';

export const applicationDetailsSchema = z.object({
  positionAppliedFor: z
    .string()
    .min(1, 'Please select or enter the position applied for'),
  expectedJoiningDate: z
    .string()
    .min(1, 'Expected joining date is required')
    .refine(
      (dateStr) => {
        if (!dateStr) return false;
        const selectedDate = new Date(dateStr);
        if (isNaN(selectedDate.getTime())) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
      },
      {
        message: 'Expected joining date must be in the future',
      }
    ),
  portfolioLink: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        try {
          const parsed = new URL(val);
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      },
      {
        message: 'Please enter a valid URL (starting with http:// or https://)',
      }
    ),
  coverNote: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions to proceed' }),
  }),
});

export type ApplicationDetailsValues = z.infer<typeof applicationDetailsSchema>;

