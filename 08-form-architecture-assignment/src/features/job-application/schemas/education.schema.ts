import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const qualificationSchema = z.object({
  degree: z.string().min(1, 'Degree or qualification name is required'),
  institution: z.string().min(1, 'Institution or college name is required'),
  yearOfPassing: z
    .union([z.string(), z.number()])
    .refine((val) => val !== '' && !isNaN(Number(val)), {
      message: 'Year of passing is required and must be a number',
    })
    .transform((val) => Number(val))
    .pipe(
      z
        .number()
        .int('Year of passing must be a whole year')
        .min(1970, 'Year of passing must be 1970 or later')
        .max(currentYear + 5, `Year of passing cannot exceed ${currentYear + 5}`)
    ),
  percentage: z
    .union([z.string(), z.number()])
    .refine((val) => val !== '' && !isNaN(Number(val)), {
      message: 'Percentage is required and must be a number',
    })
    .transform((val) => Number(val))
    .pipe(
      z
        .number()
        .min(0, 'Percentage cannot be less than 0%')
        .max(100, 'Percentage cannot exceed 100%')
    ),
});

export const educationSchema = z.object({
  education: z
    .array(qualificationSchema)
    .min(1, 'At least one qualification entry is required'),
});

export type QualificationValues = z.infer<typeof qualificationSchema>;
export type EducationValues = z.infer<typeof educationSchema>;

