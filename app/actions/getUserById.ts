"use server";
import { CombinedUserProfile } from "../types";
import { getDoctorById } from "./getDoctorById";
import { getPatientById } from "./getPatientById";

export async function getUserById(
  userId: string
): Promise<CombinedUserProfile | null> {
  try {
    // First try to get user as a doctor
    const doctor = await getDoctorById(userId);
    console.log(doctor);
    if (doctor) {
      return {
        ...doctor,
        name: `${doctor.name}`,
        userType: "doctor" as const,
        email: doctor.email,
        phone: doctor.phone,
        specialty: doctor.specialty,
        experience: doctor.experience,
        rating: doctor.rating,
        location: doctor.location,
      };
    }
  } catch (error) {
    console.log("User not found as doctor, trying patient...");
  }

  try {
    // If not found as doctor, try as patient
    const patient = await getPatientById(userId);
    if (patient) {
      return {
        ...patient,
        name: `${patient.first_name} ${patient.last_name}`,
        userType: "patient" as const,
      };
    }
  } catch (error) {
    console.log("User not found as patient either");
  }

  return null;
}
