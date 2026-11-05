import { z } from 'zod';

export const previousCompanySchema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    role: z.string().min(1, 'Role or designation is required'),
    fromDate: z.string().min(1, 'Start date is required'),
    toDate: z.string().min(1, 'End date is required'),
  })
  .refine(
    (data) => {
      if (!data.fromDate || !data.toDate) return true;
      const from = new Date(data.fromDate);
      const to = new Date(data.toDate);
      if (isNaN(from.getTime()) || isNaN(to.getTime())) return true;
      return to > from;
    },
    {
      message: '"To" date must be after "from" date',
      path: ['toDate'],
    }
  );

export const fresherExperienceSchema = z.object({
  experienceType: z.literal('fresher'),
  availabilityToJoin: z
    .string()
    .min(1, 'Availability to join is required (e.g. Immediately, 15 days, 1 month)'),
  totalExperience: z.any().optional(),
  noticePeriod: z.any().optional(),
  previousCompanies: z.any().optional(),
});

export const experiencedExperienceSchema = z.object({
  experienceType: z.literal('experienced'),
  availabilityToJoin: z.any().optional(),
  totalExperience: z
    .union([z.string(), z.number()])
    .refine((val) => val !== '' && val !== undefined && !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Total experience must be a valid number of years greater than 0',
    })
    .transform((val) => Number(val)),
  noticePeriod: z
    .union([z.string(), z.number()])
    .refine((val) => val !== '' && val !== undefined && !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Notice period must be a valid number of days (0 or more)',
    })
    .transform((val) => Number(val)),
  previousCompanies: z
    .array(previousCompanySchema)
    .min(1, 'At least one previous company record is required for experienced candidates'),
});

export const experienceSchema = z.discriminatedUnion('experienceType', [
  fresherExperienceSchema,
  experiencedExperienceSchema,
]);

export type PreviousCompanyValues = z.infer<typeof previousCompanySchema>;
export type ExperienceValues = z.infer<typeof experienceSchema>;
export type FresherExperienceValues = z.infer<typeof fresherExperienceSchema>;
export type ExperiencedExperienceValues = z.infer<typeof experiencedExperienceSchema>;
