import { z } from "zod";

// Basic validation schemas
export const emailSchema = z
  .string()
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const phoneSchema = z
  .string()
  .min(6, "Phone number must be at least 6 digits")
  .max(15, "Phone number cannot exceed 15 digits")
  .regex(/^\d+$/, "Phone number can only contain digits");

export const dateOfBirthSchema = z.string().refine((date) => {
  if (!date) return false;
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 18 && age <= 100;
}, "You must be between 18 and 100 years old");

// File validation schemas
export const documentFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 10 * 1024 * 1024,
    "File size must be less than 10MB"
  )
  .refine(
    (file) => ["application/pdf"].includes(file.type),
    "Only PDF files are allowed for medical licences / CV"
  );

export const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "Image size must be less than 5MB"
  )
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
    "Only JPEG and PNG images are allowed"
  );

// Step schemas
export const basicInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

  dateOfBirth: dateOfBirthSchema,

  gender: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),

  languages: z
    .array(z.string())
    .min(1, "Please select at least one language")
    .max(5, "You can select up to 5 languages"),
});

export const contactInfoSchema = z.object({
  countryCode: z.string().min(1, "Please select a country code"),

  phone: phoneSchema,

  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address cannot exceed 200 characters"),
});

export const emailStepSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const professionalInfoSchema = z.object({
  doctorType: z.enum(["specialist", "gp"], {
    errorMap: () => ({ message: "Please select a doctor type" }),
  }),

  specialization: z
    .string()
    .min(1, "Please select a specialization")
    .optional()
    .or(z.literal("")),

  licenseNumber: z
    .string()
    .min(1, "Please select or enter your medical license program")
    .optional()
    .or(z.literal("")),

  experience: z
    .string()
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val >= 0 && val <= 15,
      "Experience must be between 0 and 15 years"
    ),

  skills: z
    .string()
    .min(10, "Please provide at least 10 characters describing your skills")
    .max(500, "Skills description cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),

  university: z
    .string()
    .min(2, "University name must be at least 2 characters")
    .max(100, "University name cannot exceed 100 characters"),

  join_reason: z
    .string()
    .min(
      20,
      "Please provide at least 20 characters explaining why you want to join"
    )
    .max(1000, "Reason cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),

  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),

  document: documentFileSchema.optional(),
  profileImage: imageFileSchema.optional(),
});

// Combined schema for all steps
export const doctorSignupSchema = z.object({
  ...basicInfoSchema.shape,
  ...contactInfoSchema.shape,
  ...emailStepSchema.shape,
  ...professionalInfoSchema.shape,
});

// Type inference
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
export type EmailStepFormData = z.infer<typeof emailStepSchema>;
export type ProfessionalInfoFormData = z.infer<typeof professionalInfoSchema>;
export type DoctorSignupFormData = z.infer<typeof doctorSignupSchema>;
