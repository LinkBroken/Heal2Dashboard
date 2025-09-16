"use server";
import { DoctorWithProfile } from "../types";
import { createClient } from "../utils/supabase/server";

export const getDoctorById = async function (
  id: string
): Promise<DoctorWithProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("doctors")
    .select(
      `
    *
  `
    )
    .eq("id", id)
    .single();
  if (error) throw error;

  if (data) {
    return {
      ...data,
      specialties: data.specialties?.map((s: any) => s.specialty) || [],
    };
  }

  return null;
};
