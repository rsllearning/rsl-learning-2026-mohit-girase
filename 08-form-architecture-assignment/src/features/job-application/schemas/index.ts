import { z } from 'zod';
import { personalDetailsSchema } from './personalDetails.schema';
import { educationSchema } from './education.schema';
import { experienceSchema } from './experience.schema';
import { applicationDetailsSchema } from './applicationDetails.schema';

export * from './personalDetails.schema';
export * from './education.schema';
export * from './experience.schema';
export * from './applicationDetails.schema';

// Composed base object using .shape from modular schemas
const baseSchema = z.object({
  ...personalDetailsSchema.shape,
  ...educationSchema.shape,
  ...applicationDetailsSchema.shape,
});

// Composed root schema with discriminated union via .and()
export const jobApplicationSchema = baseSchema.and(experienceSchema);

export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

export const defaultJobApplicationValues: JobApplicationFormValues = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  currentCity: '',
  education: [
    {
      degree: '',
      institution: '',
      yearOfPassing: '' as unknown as number,
      percentage: '' as unknown as number,
    },
  ],
  experienceType: 'fresher',
  availabilityToJoin: '',
  totalExperience: '' as unknown as number,
  noticePeriod: '' as unknown as number,
  previousCompanies: [],
  positionAppliedFor: '',
  expectedJoiningDate: '',
  portfolioLink: '',
  coverNote: '',
  termsAccepted: false as unknown as true,
};

export const STEP_FIELD_NAMES: Record<number, (keyof JobApplicationFormValues | string)[]> = {
  1: ['fullName', 'email', 'phone', 'dateOfBirth', 'currentCity'],
  2: ['education'],
  3: ['experienceType', 'availabilityToJoin', 'totalExperience', 'noticePeriod', 'previousCompanies'],
  4: ['positionAppliedFor', 'expectedJoiningDate', 'portfolioLink', 'coverNote', 'termsAccepted'],
};
