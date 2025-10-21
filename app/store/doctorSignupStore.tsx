// store/doctorSignupStore.ts
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FormData {
  // Auth step data
  email: string;
  password: string;
  // Basic Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  // Contact Info
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  // Professional Info
  medicalLicense: string;
  specialization: string;
  experience: string;
  licenseNumber: string;
  doctorType: "gp" | "specialist";
  skills: string;
  otp: string;
  acceptedTerms: boolean;
  confirmPassword: string;
  countryCode?: string;
  emergencyNumber?: string;
  languages?: string[];
  specialty?: string;
  document: File | string | null;
  profileImage: File | null;
  join_reason?: string;
  university: string;
}

interface Error {
  [key: string]: string;
}

interface DoctorSignupStore {
  currentStep: number;
  loading: boolean;
  error: string;
  isEmailVerified: boolean;
  otpSent: boolean;
  formData: FormData;
  errors: Error;
  setCurrentStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setEmailVerified: (verified: boolean) => void;
  setOtpSent: (sent: boolean) => void;
  updateFormData: (data: Partial<FormData>) => void;
  validateStep: (step: number) => boolean;
  resetForm: () => void;
  session: Session | undefined;
  setSession: (session: Session) => void;
  document: string | null; // Changed from File to string for base64
  setDocument: (document: string | null) => void;
  profileImage: string | null; // Changed from File to string for base64
  setProfileImage: (profileImage: string | null) => void;
  isPhoneNumbeValid: boolean;
  setIsPhoneNumbeValid: (valid: boolean) => void;
}

const initialFormData: FormData = {
  email: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  medicalLicense: "",
  specialization: "",
  experience: "",
  doctorType: "gp",
  licenseNumber: "",
  password: "",
  acceptedTerms: false,
  otp: "",
  confirmPassword: "",
  skills: "",
  document: null,
  profileImage: null,
  emergencyNumber: "",
  languages: [],
  join_reason: "",
  university: "",
};

export const useDoctorSignupStore = create<DoctorSignupStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      loading: false,
      error: "",
      isEmailVerified: false,
      otpSent: false,
      isPhoneNumbeValid: false,
      formData: initialFormData,
      errors: {},
      session: undefined,
      document: null,
      profileImage: null,

      setCurrentStep: (step) => set({ currentStep: step }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setEmailVerified: (verified) => set({ isEmailVerified: verified }),
      setOtpSent: (sent) => set({ otpSent: sent }),
      setIsPhoneNumbeValid: (valid: boolean) =>
        set({ isPhoneNumbeValid: valid }),
      setSession: (session) => set({ session }),
      setDocument: (document) => set({ document }),
      setProfileImage: (profileImage) => set({ profileImage }),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      validateStep: (step) => {
        const {
          formData,
          isEmailVerified,
          document,
          profileImage,
          otpSent,
          isPhoneNumbeValid,
        } = get();

        switch (step) {
          case 1:
            return (
              formData.email.trim() !== "" &&
              /\S+@\S+\.\S+/.test(formData.email) &&
              formData.password.trim() !== "" &&
              otpSent
            );
          case 2:
            return isEmailVerified;
          case 3:
            return (
              formData.firstName.trim() !== "" &&
              formData.lastName.trim() !== "" &&
              formData.dateOfBirth.trim() !== "" &&
              formData.gender.trim() !== "" &&
              formData.languages &&
              formData.languages.length > 0
            );
          case 4:
            return (
              formData.phone.trim() !== "" &&
              formData.address.trim() !== "" &&
              formData.countryCode &&
              formData.countryCode.trim() !== "" &&
              isPhoneNumbeValid
            );
          case 5:
            const hasRequiredFields =
              formData.doctorType.trim() !== "" &&
              formData.experience.trim() !== "" &&
              formData.university.trim() !== "" &&
              formData.acceptedTerms === true &&
              document !== null &&
              profileImage !== null;

            if (formData.doctorType === "specialist") {
              return (
                hasRequiredFields &&
                formData.specialization.trim() !== "" &&
                formData.licenseNumber.trim() !== ""
              );
            }

            return hasRequiredFields;

          default:
            return false;
        }
      },

      resetForm: () =>
        set({
          currentStep: 1,
          loading: false,
          error: "",
          isEmailVerified: false,
          otpSent: false,
          formData: initialFormData,
          document: null,
          profileImage: null,
        }),
    }),
    {
      name: "doctor-signup-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Persist everything except loading states
        currentStep: state.currentStep,
        formData: state.formData,
        isEmailVerified: state.isEmailVerified,
        otpSent: state.otpSent,
        isPhoneNumbeValid: state.isPhoneNumbeValid,
        document: state.document, // Now it's base64 string, safe to persist
        profileImage: state.profileImage, // Now it's base64 string, safe to persist
        session: state.session,
        errors: state.errors,
        loading: state.loading,
        // Don't persist session for security
        // Don't persist loading/error states
      }),
    }
  )
);
