import { describe, it, expect } from "vitest";
import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  dateOfBirthSchema,
  documentFileSchema,
  imageFileSchema,
  basicInfoSchema,
  contactInfoSchema,
  emailStepSchema,
  professionalInfoSchema,
} from "./validation";

// ─── helpers ────────────────────────────────────────────────────────────────

function ok<T>(schema: { parse: (v: unknown) => T }, value: unknown) {
  return expect(() => schema.parse(value)).not.toThrow();
}

function fail(schema: { parse: (v: unknown) => unknown }, value: unknown, msg?: string) {
  const result = (schema as any).safeParse(value);
  expect(result.success).toBe(false);
  if (msg) {
    const messages: string[] = result.error.issues.map((i: any) => i.message);
    expect(messages).toContain(msg);
  }
}

function makeFile(name: string, type: string, sizeBytes: number): File {
  const blob = new Blob([new Uint8Array(sizeBytes)], { type });
  return new File([blob], name, { type });
}

function dob(yearsAgo: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - yearsAgo);
  return d.toISOString().split("T")[0];
}

// ─── emailSchema ────────────────────────────────────────────────────────────

describe("emailSchema", () => {
  it("accepts valid emails", () => {
    ok(emailSchema, "user@example.com");
    ok(emailSchema, "doctor.john+test@hospital.org");
  });

  it("rejects missing @", () => {
    fail(emailSchema, "notanemail", "Please enter a valid email address");
  });

  it("rejects empty string", () => {
    fail(emailSchema, "");
  });
});

// ─── passwordSchema ──────────────────────────────────────────────────────────

describe("passwordSchema", () => {
  it("accepts strong password", () => {
    ok(passwordSchema, "SecureP@ss1");
  });

  it("rejects too short", () => {
    fail(passwordSchema, "Ab1!", "Password must be at least 8 characters long");
  });

  it("rejects no lowercase", () => {
    fail(passwordSchema, "SECURE@PASS1", "Password must contain at least one lowercase letter");
  });

  it("rejects no uppercase", () => {
    fail(passwordSchema, "secure@pass1", "Password must contain at least one uppercase letter");
  });

  it("rejects no digit", () => {
    fail(passwordSchema, "Secure@Pass", "Password must contain at least one number");
  });

  it("rejects no special char", () => {
    fail(passwordSchema, "SecurePass1", "Password must contain at least one special character");
  });
});

// ─── phoneSchema ─────────────────────────────────────────────────────────────

describe("phoneSchema", () => {
  it("accepts 6-digit number", () => {
    ok(phoneSchema, "123456");
  });

  it("accepts 15-digit number", () => {
    ok(phoneSchema, "123456789012345");
  });

  it("accepts typical 10-digit US number", () => {
    ok(phoneSchema, "5551234567");
  });

  it("rejects 5 digits — too short", () => {
    fail(phoneSchema, "12345", "Phone number must be at least 6 digits");
  });

  it("rejects 16 digits — too long", () => {
    fail(phoneSchema, "1234567890123456", "Phone number cannot exceed 15 digits");
  });

  it("rejects non-digits", () => {
    fail(phoneSchema, "055-123456", "Phone number can only contain digits");
  });

  it("rejects letters", () => {
    fail(phoneSchema, "abcdefgh", "Phone number can only contain digits");
  });

  it("rejects empty string", () => {
    fail(phoneSchema, "", "Phone number must be at least 6 digits");
  });
});

// ─── dateOfBirthSchema ───────────────────────────────────────────────────────

describe("dateOfBirthSchema", () => {
  it("accepts 18-year-old", () => {
    ok(dateOfBirthSchema, dob(18));
  });

  it("accepts 45-year-old", () => {
    ok(dateOfBirthSchema, dob(45));
  });

  it("accepts 100-year-old", () => {
    ok(dateOfBirthSchema, dob(100));
  });

  it("rejects 17-year-old", () => {
    fail(dateOfBirthSchema, dob(17), "You must be between 18 and 100 years old");
  });

  it("rejects 101-year-old", () => {
    fail(dateOfBirthSchema, dob(101), "You must be between 18 and 100 years old");
  });

  it("rejects empty string", () => {
    fail(dateOfBirthSchema, "", "You must be between 18 and 100 years old");
  });
});

// ─── documentFileSchema ──────────────────────────────────────────────────────

describe("documentFileSchema", () => {
  it("accepts PDF under 10MB", () => {
    ok(documentFileSchema, makeFile("doc.pdf", "application/pdf", 1024));
  });

  it("rejects PDF over 10MB", () => {
    fail(
      documentFileSchema,
      makeFile("big.pdf", "application/pdf", 11 * 1024 * 1024),
      "File size must be less than 10MB"
    );
  });

  it("rejects non-PDF", () => {
    fail(
      documentFileSchema,
      makeFile("doc.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 1024),
      "Only PDF files are allowed for medical licences / CV"
    );
  });

  it("rejects image uploaded as document", () => {
    fail(
      documentFileSchema,
      makeFile("photo.jpg", "image/jpeg", 1024),
      "Only PDF files are allowed for medical licences / CV"
    );
  });
});

// ─── imageFileSchema ─────────────────────────────────────────────────────────

describe("imageFileSchema", () => {
  it("accepts JPEG under 5MB", () => {
    ok(imageFileSchema, makeFile("photo.jpg", "image/jpeg", 1024));
  });

  it("accepts PNG under 5MB", () => {
    ok(imageFileSchema, makeFile("photo.png", "image/png", 1024));
  });

  it("rejects image over 5MB", () => {
    fail(
      imageFileSchema,
      makeFile("large.jpg", "image/jpeg", 6 * 1024 * 1024),
      "Image size must be less than 5MB"
    );
  });

  it("rejects GIF", () => {
    fail(
      imageFileSchema,
      makeFile("anim.gif", "image/gif", 1024),
      "Only JPEG and PNG images are allowed"
    );
  });

  it("rejects PDF as image", () => {
    fail(
      imageFileSchema,
      makeFile("doc.pdf", "application/pdf", 1024),
      "Only JPEG and PNG images are allowed"
    );
  });
});

// ─── basicInfoSchema ─────────────────────────────────────────────────────────

describe("basicInfoSchema", () => {
  const valid = {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: dob(30),
    gender: "Male" as const,
    languages: ["English"],
  };

  it("accepts valid data", () => {
    ok(basicInfoSchema, valid);
  });

  it("rejects first name too short", () => {
    fail(basicInfoSchema, { ...valid, firstName: "J" }, "First name must be at least 2 characters");
  });

  it("rejects first name with numbers", () => {
    fail(basicInfoSchema, { ...valid, firstName: "John2" }, "First name can only contain letters and spaces");
  });

  it("rejects last name too long (51 chars)", () => {
    fail(basicInfoSchema, { ...valid, lastName: "A".repeat(51) }, "Last name cannot exceed 50 characters");
  });

  it("rejects invalid gender", () => {
    fail(basicInfoSchema, { ...valid, gender: "Other" }, "Please select a gender");
  });

  it("rejects empty languages", () => {
    fail(basicInfoSchema, { ...valid, languages: [] }, "Please select at least one language");
  });

  it("rejects more than 5 languages", () => {
    fail(
      basicInfoSchema,
      { ...valid, languages: ["a", "b", "c", "d", "e", "f"] },
      "You can select up to 5 languages"
    );
  });
});

// ─── contactInfoSchema ───────────────────────────────────────────────────────

describe("contactInfoSchema", () => {
  const valid = {
    countryCode: "+1",
    phone: "5551234567",
    address: "123 Main Street, Springfield",
  };

  it("accepts valid data", () => {
    ok(contactInfoSchema, valid);
  });

  it("rejects empty country code", () => {
    fail(contactInfoSchema, { ...valid, countryCode: "" }, "Please select a country code");
  });

  it("rejects phone too short", () => {
    fail(contactInfoSchema, { ...valid, phone: "12345" }, "Phone number must be at least 6 digits");
  });

  it("rejects phone with dashes", () => {
    fail(contactInfoSchema, { ...valid, phone: "055-123456" }, "Phone number can only contain digits");
  });

  it("rejects address too short", () => {
    fail(contactInfoSchema, { ...valid, address: "Short" }, "Address must be at least 10 characters");
  });

  it("rejects address too long", () => {
    fail(contactInfoSchema, { ...valid, address: "A".repeat(201) }, "Address cannot exceed 200 characters");
  });
});

// ─── emailStepSchema ─────────────────────────────────────────────────────────

describe("emailStepSchema", () => {
  const valid = {
    email: "doctor@hospital.com",
    password: "SecureP@ss1",
  };

  it("accepts valid credentials", () => {
    ok(emailStepSchema, valid);
  });

  it("rejects invalid email", () => {
    fail(emailStepSchema, { ...valid, email: "bad-email" }, "Please enter a valid email address");
  });

  it("rejects weak password", () => {
    fail(emailStepSchema, { ...valid, password: "password" }, "Password must contain at least one uppercase letter");
  });
});

// ─── professionalInfoSchema ──────────────────────────────────────────────────

describe("professionalInfoSchema", () => {
  const valid = {
    doctorType: "gp" as const,
    experience: "5",
    university: "Tel Aviv University",
    acceptedTerms: true,
  };

  it("accepts valid GP data", () => {
    ok(professionalInfoSchema, valid);
  });

  it("accepts valid specialist data", () => {
    ok(professionalInfoSchema, { ...valid, doctorType: "specialist" as const });
  });

  it("rejects invalid doctorType", () => {
    fail(professionalInfoSchema, { ...valid, doctorType: "surgeon" }, "Please select a doctor type");
  });

  it("rejects experience > 15", () => {
    fail(professionalInfoSchema, { ...valid, experience: "16" }, "Experience must be between 0 and 15 years");
  });

  it("rejects negative experience", () => {
    fail(professionalInfoSchema, { ...valid, experience: "-1" }, "Experience must be between 0 and 15 years");
  });

  it("rejects non-numeric experience", () => {
    fail(professionalInfoSchema, { ...valid, experience: "abc" }, "Experience must be between 0 and 15 years");
  });

  it("rejects university too short", () => {
    fail(professionalInfoSchema, { ...valid, university: "A" }, "University name must be at least 2 characters");
  });

  it("rejects acceptedTerms false", () => {
    fail(professionalInfoSchema, { ...valid, acceptedTerms: false }, "You must accept the terms and conditions");
  });

  it("accepts empty optional fields", () => {
    ok(professionalInfoSchema, { ...valid, skills: "", join_reason: "", specialization: "", licenseNumber: "" });
  });

  it("rejects skills too short when provided", () => {
    fail(professionalInfoSchema, { ...valid, skills: "short" }, "Please provide at least 10 characters describing your skills");
  });
});
