"use server";

import { AppointmentWithDetails } from "../types";
import { createClient } from "../utils/supabase/server";
import { getAppointmentsByDoctor } from "./getAppointmentsByDoctor";

export async function getAppointmentsByUser(
  userId: string
): Promise<AppointmentWithDetails[]> {
  try {
    const supabase = await createClient();

    // First try to get appointments as a doctor
    try {
      const doctorAppointments = await getAppointmentsByDoctor(userId);
      if (doctorAppointments && doctorAppointments.length > 0) {
        return doctorAppointments;
      }
    } catch (doctorError) {
      // Not a doctor or no appointments, continue
    }

    // Try to get appointments as a patient
    try {
      const { data: patientAppointments, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          patient:patients!appointments_patient_id_fkey(
            *,
            profile:profiles(*)
          ),
          doctor:doctors!appointments_doctor_id_fkey(*)
        `
        )
        .eq("patient_id", userId)
        .order("appointment_date", { ascending: false });

      if (error) throw error;
      return patientAppointments || [];
    } catch (patientError) {
      console.error("Error fetching patient appointments:", patientError);
    }

    return [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}
