"use server";
import { AppointmentWithDetails } from "../types";
import { createClient } from "../utils/supabase/server";

export const getAppointmentsByDoctor = async function (
  doctorId: string
): Promise<AppointmentWithDetails[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
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
    .eq("doctor_id", doctorId)
    .order("appointment_date", { ascending: true });

  if (error) throw error;
  return data || [];
};
