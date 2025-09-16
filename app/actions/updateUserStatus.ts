"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../utils/supabase/server";

export default async function updateUserStatus(userId: string, status: string) {
  const supabase = await createClient();
  const myprofile = await supabase.auth.getUser();
  console.log(myprofile);
  const { data: insertData, error: insertError } = await supabase
    .from("doctors")
    .update({ status })
    .eq("id", userId);

  if (insertError) {
    throw insertError;
  }
  console.log(insertData, insertError);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", userId);
    if (error) {
      throw error;
    }

    revalidatePath("/users");
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new Error("Error updating user status");
  }
}
