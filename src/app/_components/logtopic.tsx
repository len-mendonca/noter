"use client";

import { api } from "~/trpc/react";

export const LogBob = () => {
  const latestPost = api.post.getLatest.useQuery();

  if (latestPost.isLoading) return <p>Loading...</p>;
  if (latestPost.isError) return <p>Error: {latestPost.error.message}</p>;

  return <p>{latestPost.data?.name || "No posts yet"}</p>;
};
