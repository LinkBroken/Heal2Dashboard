import { useState, useCallback } from "react";
import { z } from "zod";

export interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback(
    (fieldName: string, value: any, context?: any) => {
      try {
        // Get the schema shape
        const schemaShape = (schema as any)._def?.shape?.();

        if (!schemaShape || !schemaShape[fieldName]) {
          // If field not in schema, just clear any existing error
          setErrors((prev) => {
            const { [fieldName]: _, ...rest } = prev;
            return rest;
          });
          return true;
        }

        // Validate the specific field
        const fieldSchema = schemaShape[fieldName];

        // For optional fields, allow undefined/null/empty
        if (value === "" || value === null || value === undefined) {
          if (fieldSchema._def.typeName === "ZodOptional") {
            setErrors((prev) => {
              const { [fieldName]: _, ...rest } = prev;
              return rest;
            });
            return true;
          }
        }

        // Validate the field
        fieldSchema.parse(value);

        // Clear error on success
        setErrors((prev) => {
          const { [fieldName]: _, ...rest } = prev;
          return rest;
        });
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0]?.message || "Invalid value";
          setErrors((prev) => ({
            ...prev,
            [fieldName]: errorMessage,
          }));
          return false;
        }
        return false;
      }
    },
    [schema]
  );

  const validateForm = useCallback(
    (data: any) => {
      try {
        const validatedData = schema.parse(data);
        setErrors({});
        return { success: true, data: validatedData, errors: {} };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: ValidationErrors = {};
          error.errors.forEach((err) => {
            const fieldName = err.path[0]?.toString() || "form";
            // Only keep the first error for each field
            if (!newErrors[fieldName]) {
              newErrors[fieldName] = err.message;
            }
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
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
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
