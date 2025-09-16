export interface DoctorProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  // Doctor-specific fields
  name: string;
  specialty: string;
  picture: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  rating: number;
  experience: string | null;
  address: string | null;
  certificate_url: string | null;
  license_number: string | null;
}

export interface PatientProfile {
  id: string;
  first_name: string;
  last_name: string;
  role: "patient";
  status?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  name?: string;
  blood_type?: string;
  phone?: string;
  email?: string;
  rating?: number;
  experience?: string | number;
  address?: string;
  languages?: string[];
  gender?: string;
  date_of_birth?: string | Date;
  profiles?: {
    first_name?: string;
    last_name?: string;
    status?: string;
    languages?: string[];
  };
}

export type User = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "doctor" | "patient" | "admin"; // Adjust based on your actual roles
  status: string; // Or more specific: 'approved' | 'pending' | 'rejected' etc.
  created_at: string; // or Date if you'll parse it
  updated_at: string; // or Date if you'll parse it
  user_type: "doctor" | "patient" | "admin" | "profile";

  // Doctor-specific fields (nullable)
  specialty: string | null;
  license_number: string | null;
  certificate_url: string | null;
  doctor_phone: string | null;
  doctor_picture: string | null;

  // Patient-specific fields (nullable)
  date_of_birth: string | null; // or Date if you'll parse it
  blood_type: string | null;
  patient_phone: string | null;
  patient_gender: string | null; // or more specific: 'male' | 'female' | 'other' | null

  // Common fields
  strikes: number;
};

export type Doctor = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rating: number;
  address: string | null;
  picture: string | null;
  location: string | null;
  specialty: string;
  experience: string | null;
};

export type Appointment = {
  id: string;
  patient_id: string | null;
  appointment_date: string; // or Date if you'll parse it
  duration_minutes: number;
  type: string; // or a union of specific types like 'followup' | 'checkup' | etc.
  notes: string;
  created_at: string; // or Date
  doctor_id: string;
  status: string; // or a union of specific statuses like 'completed' | 'cancelled' | etc.
  cancelled_by: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null; // or Date | null
  patients: any | null; // Replace 'any' with a proper Patient type if you have it
  doctors: Doctor;
  cancelled_by_profile: any | null; // Replace 'any' with a proper profile type if you have it
};

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: "doctor" | "patient" | "admin";
  created_at: string;
  updated_at: string;
  status: "pending" | "approved" | "rejected";
  strikes: number;
}

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female" | "other" | null;
  blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  profile_id: string;
}

export interface DoctorWorkingSchedule {
  id: string;
  doctor_id: string;
  day_of_week: number;
  is_available: boolean;
  time_slots: any[];
  consultation_fee: number;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithDetails extends Appointment {
  patient?: PatientWithProfile;
  doctor?: DoctorWithProfile;
}

export interface DoctorWithProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  specialty?: string;
  experience?: string;
  rating?: number;
  location?: string;
  address?: string;
  created_at: string;
  profile?: {
    role: string;
    status: string;
    strikes?: number;
  };
  specialties?: string[];
  name?: string;
}

export interface PatientWithProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  emergency_contact?: string;
  medical_history?: string;
  created_at: string;
  profile?: {
    role: string;
    status: string;
    strikes?: number;
  };
  profile_id: string;
  name?: string;
}

export interface CombinedUserProfile {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  userType: "doctor" | "patient";
  profile?: {
    role: string;
    status: string;
    strikes?: number;
  };
  // Doctor-specific fields
  specialty?: string;
  specialties?: string[];
  experience?: string;
  rating?: number;
  location?: string;
  // Patient-specific fields
  date_of_birth?: string;
  gender?: string;
  emergency_contact?: string;
  medical_history?: string;
  profile_id?: string;
  address?: string;
}
