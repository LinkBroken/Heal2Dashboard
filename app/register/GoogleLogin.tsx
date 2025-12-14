"use client";

import { useTransition } from "react";

export default function GoogleButton() {
  const [isPending, startTransition] = useTransition();

  const handleGoogleLogin = () => {
    startTransition(async () => {
      const redirectUrl = "/user/delete-account?reauth=true";
      window.location.href = redirectUrl;
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isPending}
      style={{ backgroundColor: "red" }}
    >
      {isPending ? "Loading..." : "Delete Account"}
    </button>
  );
}
