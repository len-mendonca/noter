import { Session } from "inspector";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

import SignOutButton from "~/app/_components/SignOutButton";
import Title from "~/app/_components/Title";
import { getServerAuthSession } from "~/server/auth";
import ThePage from "./ThePage";

const HomePage = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/auth/login?callbackUrl=/home");
  }

  return (
    <>
      <ThePage />
    </>
  );
};
export default HomePage;
