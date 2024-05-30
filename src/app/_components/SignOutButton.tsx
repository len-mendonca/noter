"use client";

import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

const SignOutButton = () => {
  return (
    <Button
      type="submit"
      onClick={async () => {
        await signOut({ callbackUrl: "/" });
      }}
    >
      Sign Out
    </Button>
  );
};
export default SignOutButton;
