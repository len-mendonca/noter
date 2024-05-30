"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { LoginSchema } from "~/server/schemas/zod-schema";
import Socials from "../Socials";

import { useTransition } from "react";
import { redirect, useRouter } from "next/navigation";
import { getUserByEmail } from "~/utils/auth";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);
    if (!validateFields.success) {
      console.log("OOOOPS");
    }

    const { email, password } = values;

    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/home",
        });

        if (res?.ok) {
          router.push("/home");
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex w-[350px] flex-col items-center justify-center gap-4 rounded-lg border px-4 py-2 shadow-md shadow-neutral-400">
        <div className="my-0 py-0">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Noter.
          </h1>
        </div>
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-800"
                disabled={isPending}
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
        <div></div>
        <div className="w-full">
          <Socials />
        </div>
        <div></div>
      </div>
    </main>
  );
};
export default LoginForm;
