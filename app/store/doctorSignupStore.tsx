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
  document: File | null;
  setDocument: (document: File | null) => void;
  profileImage: File | null;
  setProfileImage: (profileImage: File | null) => void;
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
  document: null,
  setDocument: (document) => set({ document }),
  profileImage: null,
  setProfileImage: (profileImage) => set({ profileImage }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  validateStep: (step) => {
    const { formData, isEmailVerified, document, profileImage } = get();

    switch (step) {
      case 1: // Email entry
        return (
          formData.email.trim() !== "" &&
          /\S+@\S+\.\S+/.test(formData.email) &&
          formData.password.trim() !== ""
        );
      case 2: // OTP verification
        return isEmailVerified;
      case 3: // Basic Info
        return (
          formData.firstName.trim() !== "" &&
          formData.lastName.trim() !== "" &&
          formData.dateOfBirth.trim() !== "" &&
          formData.gender.trim() !== "" &&
          formData.languages &&
          formData.languages.length > 0
        );
      case 4: // Contact Info
        return (
          formData.phone.trim() !== "" &&
          formData.address.trim() !== "" &&
          formData.countryCode &&
          formData.countryCode.trim() !== ""
        );
      case 5: // Professional Info
        const hasRequiredFields =
          formData.doctorType.trim() !== "" &&
          formData.experience.trim() !== "" &&
          formData.university.trim() !== "" &&
          formData.acceptedTerms === true &&
          document !== null &&
          profileImage !== null;

        // For specialists, require specialization and license
        if (formData.doctorType === "specialist") {
          return (
            hasRequiredFields &&
            formData.specialization.trim() !== "" &&
            formData.licenseNumber.trim() !== ""
          );
        }

        // For GPs, specialization is set automatically
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
}));
