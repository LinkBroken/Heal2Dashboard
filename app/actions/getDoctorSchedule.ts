"use server";
import { createClient } from "../utils/supabase/server";

export default async function getDoctorSchedules() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("doctor_working_schedule")
    .select(
      `
      *,
      profiles!doctor_working_schedule_doctor_id_fkey (
        id,
        first_name,
        last_name
      )
    `
    )
    .order("doctor_id", { ascending: true })
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("Error fetching doctor schedules:", error);
    return null;
  }

  console.log("Doctor schedules with relations:", data);
  return data;
}
