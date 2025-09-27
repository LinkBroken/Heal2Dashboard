import { useState, useCallback } from "react";
import { z } from "zod";

export interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback(
    (fieldName: string, value: any) => {
      try {
        // Try to parse individual field value with schema
        const fieldSchema = schema.shape?.[fieldName];
        if (fieldSchema) {
          fieldSchema.parse(value);
          setErrors((prev) => ({
            ...prev,
            [fieldName]: "",
          }));
          return true;
        } else {
          // Fallback: validate the whole object but only show error for this field
          const testObject = { [fieldName]: value };
          schema.parse(testObject);
          setErrors((prev) => ({
            ...prev,
            [fieldName]: "",
          }));
          return true;
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(
            (err) => err.path.includes(fieldName) || err.path.length === 0
          );
          setErrors((prev) => ({
            ...prev,
            [fieldName]: fieldError?.message || "Invalid value",
          }));
        }
        return false;
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (data: any) => {
      try {
        schema.parse(data);
        setErrors({});
        return { success: true, data, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: ValidationErrors = {};
          error.errors.forEach((err) => {
            const path = err.path.join(".");
            newErrors[path] = err.message;
          });
          setErrors(newErrors);
          return { success: false, data: null, errors: newErrors };
        }
      }
      return { success: false, data: null, errors: {} };
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setErrors,
  };
}
