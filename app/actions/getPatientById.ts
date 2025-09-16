"use server";
import { PatientWithProfile } from "../types";
import { createClient } from "../utils/supabase/server";

export const getPatientById = async function (
  profileId: string
): Promise<PatientWithProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patients")
    .select(
      `
        *,
        profile:profiles(*)
      `
    )
    .eq("profile_id", profileId)
    .single();

  if (error) throw error;
  console.log(error);
  return data;
};
