"use server";

import { revalidatePath } from "next/cache";
import { DoctorProfile, PatientProfile } from "../types";
import { createClient } from "../utils/supabase/server";

export async function getUsersData() {
  const supabase = await createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const { data: doctors, error: doctorsError } = await supabase
    .from("doctors")
    .select(`*, profiles!profile_id(languages,first_name,last_name,status)`)
    .order("created_at", { ascending: false });

  // console.log(data);
  if (doctorsError) {
    console.error("Error fetching combined user data:", doctorsError);
  } else {
    // Filter by type if needed
    //   const doctors = data.filter(
    //     (user: User) => user.user_type === "doctor"
    //   );

    //   const patients: User[] = data.filter(
    //     (user: User) => user.user_type === "patient"
    //   );
    //   const admins: User[] = data.filter(
    //     (user: User) => user.user_type === "profile"
    //   );
    // }
    const transformedDoctors: DoctorProfile[] = (doctors || []).map(
      (doctor: any) => ({
        id: doctor.id,
        first_name: doctor.profiles?.first_name || doctor?.first_name,
        last_name: doctor.profiles?.last_name || doctor?.last_name,
        role: doctor.profiles?.role || "doctor",
        status: doctor?.profiles?.status,
        created_at: doctor?.created_at,
        updated_at: doctor?.updated_at,
        name: doctor?.name,
        specialty: doctor?.specialty,
        picture: doctor?.picture,
        location: doctor?.location,
        phone: doctor?.phone,
        email: doctor?.email,
        rating: doctor?.rating || 0,
        experience: doctor?.experience,
        address: doctor?.address,
        certificate_url: doctor?.certificate_url,
        license_number: doctor?.license_number,
        languages: doctor?.profiles?.languages,
        gender: doctor?.gender,
        date_of_birth: doctor?.date_of_birth,
      })
    );

    const { data: patients, error: patientsError } = await supabase
      .from("patients")
      .select(`*, profiles!profile_id(languages,first_name,last_name,status)`)
      .order("created_at", { ascending: false });

    if (patientsError) {
      console.error("Error fetching combined user data:", patientsError);
    }

    const transformedPatients: PatientProfile[] = (patients || []).map(
      (patient: any) => ({
        id: patient.profile_id,
        first_name: patient.profiles?.first_name || patient?.first_name,
        last_name: patient.profiles?.last_name || patient?.last_name,
        role: "patient",
        status: patient?.profiles?.status,
        created_at: patient?.created_at,
        updated_at: patient?.updated_at,
        name: patient?.name,
        blood_type: patient?.blood_type,
        phone: patient?.phone,
        email: patient?.email,
        rating: patient?.rating || 0,
        experience: patient?.experience,
        address: patient?.address,

        languages: patient?.profiles?.languages,
        gender: patient?.gender,
        date_of_birth: patient?.date_of_birth,
      })
    );

    revalidatePath("/users");
    return {
      doctors: transformedDoctors,
      patients: transformedPatients || [],
    };
  }
}
