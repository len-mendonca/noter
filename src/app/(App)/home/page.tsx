import { redirect } from "next/navigation";

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
