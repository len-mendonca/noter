"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/trpc/react";

const Title = () => {
  const session = useSession();

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: session.data?.user !== undefined,
    },
  );

  const topic = api.topic.create.useMutation({
    onSuccess: () => {
      refetchTopics();
    },
    onError: () => {
      alert("Unable to create topic");
    },
  });

  return <></>;
};
export default Title;
