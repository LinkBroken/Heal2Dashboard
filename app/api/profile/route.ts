import { getUserById } from "@/app/actions/getUserById";
import { createClient } from "@/app/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log(request);
  if (request.method == "GET") {
    console.log("GET");
  }
  const supabase = await createClient();

  const { data, error } = await supabase.from("doctors").select("*");

  console.log(data, error);
  const userId = request.nextUrl.searchParams.get("id");
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
