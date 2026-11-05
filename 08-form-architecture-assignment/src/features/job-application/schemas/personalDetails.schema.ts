import { z } from 'zod';

export const personalDetailsSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9+\s()-]{7,15}$/, 'Please enter a valid phone number (7-15 digits)'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(
      (dob) => {
        if (!dob) return false;
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) return false;

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age >= 18;
      },
      {
        message: 'Candidate must be at least 18 years old',
      }
    ),
  currentCity: z
    .string()
    .min(1, 'Current city is required')
    .min(2, 'City name must be at least 2 characters'),
});

export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;

