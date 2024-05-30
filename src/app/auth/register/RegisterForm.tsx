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
import { RegisterSchema } from "~/server/schemas/zod-schema";

import { useState, useTransition } from "react";
import { FormSuccess } from "~/components/form-success";
import { api } from "~/trpc/react";

const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });
  const user = api.auth.signup.useMutation({
    onError: (error) => {
      setError(error.message);
    },
    onSuccess: () => {
      setSuccess("User Created");
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      user.mutateAsync(values);
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        <div className=" flex flex-row items-center justify-center py-0">
          <p>OR</p>
        </div>
        <FormSuccess message={success} />
        <div className="w-full">
          <Button className="w-full">
            <FaGithub />
          </Button>
        </div>
        <div></div>
      </div>
    </main>
  );
};
export default RegisterForm;
