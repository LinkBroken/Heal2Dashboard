"use server";
import { Appointment } from "../types";
import { createClient } from "../utils/supabase/server";

export default async function getAppointmentsData(): Promise<
  Appointment[] | null
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      patients!patient_id (
        id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        address,
        profile_id
      ),
      doctors!doctor_id (
        id,
        name,
        specialty,
        picture,
        location,
        phone,
        email,
        rating,
        experience,
        address
      ),
      cancelled_by_profile:profiles!cancelled_by (
        id,
        first_name,
        last_name,
        role
      )
    `
    )
    .order("appointment_date", { ascending: false });

  if (error) {
    console.error("Error fetching appointments:", error);
    return null;
  }

  console.log(data.length);
  return data;
}
