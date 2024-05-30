"use client";

import { api } from "~/trpc/react";

export const Hello = () => {
  const hello = api.post.hello.useQuery({ text: "Bambi" });
  return <p>{hello.data?.greeting}</p>;
};
