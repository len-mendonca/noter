"use client";

import { CheckCircledIcon } from "@radix-ui/react-icons";

interface SuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: SuccessProps) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-2 text-emerald-500 ">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
