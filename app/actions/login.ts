"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/app/utils/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email,
    password,
  };

  if (data.email !== "heal2gether@admin.com") {
    return {
      message: "Invalid credentials",
      status: 401,
    };
  }
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      message: "Invalid credentials",
      status: 401,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");

  return {
    message: "Logged in successfully",
    status: 200,
  };
}
