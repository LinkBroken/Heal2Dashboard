import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

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
  file: File | null;
  setFile: (file: File | null) => void;
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
};

export const useDoctorSignupStore = create<DoctorSignupStore>((set, get) => ({
  currentStep: 1,
  loading: false,
  error: "",
  isEmailVerified: false,
  otpSent: false,
  formData: initialFormData,
  errors: {},
  setCurrentStep: (step) => set({ currentStep: step }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setEmailVerified: (verified) => set({ isEmailVerified: verified }),
  setOtpSent: (sent) => set({ otpSent: sent }),
  setSession: (session) => set({ session }),
  session: undefined,
  file: null,
  setFile: (file) => set({ file }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  validateStep: (step) => {
    const { formData, isEmailVerified, otpSent } = get();

    switch (step) {
      case 1: // Email entry
        return (
          formData.email.trim() !== "" && /\S+@\S+\.\S+/.test(formData.email)
        );
      case 2: // OTP verification
        return isEmailVerified;
      case 3: // Basic Info
        return (
          formData.firstName.trim() !== "" && formData.lastName.trim() !== ""
        );
      case 4: // Contact Info
        return formData.phone.trim() !== "" && formData.address.trim() !== "";
      case 5: // Professional Info
        return (
          formData.medicalLicense.trim() !== "" &&
          formData.specialization.trim() !== ""
        );
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
    }),
}));
