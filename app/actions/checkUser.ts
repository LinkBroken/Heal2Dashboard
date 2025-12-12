"use server";

import { createClient } from "../utils/supabase/server";

export default async function checkUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    console.log(user);
    return true;
  }

  console.log("User not found");
  return false;
}
