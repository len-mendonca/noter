import { FaGithub } from "react-icons/fa";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
const Socials = () => {
  const onSubmit = (provider: "github") => {
    void signIn(provider, {
      callbackUrl: "/home",
    });
  };

  return (
    <Button
      className="w-full bg-purple-900"
      onClick={() => {
        onSubmit("github");
      }}
    >
      <FaGithub />
    </Button>
  );
};
export default Socials;
