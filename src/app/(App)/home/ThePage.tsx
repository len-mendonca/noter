"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import SignOutButton from "../../_components/SignOutButton";
import { useEffect, useState } from "react";
import type { Topic } from "@prisma/client";
import type { NextPage } from "next";
import { TrashIcon } from "@radix-ui/react-icons";

import NoteEditor from "./NoteEditor";
import Note from "./Note";

const ThePage: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  if (!session) {
    router.push("/auth/login?callbackUrl=/home");
  }

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const notes = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },
    {
      enabled: session.data?.user !== undefined && selectedTopic !== undefined,
    },
  );

  const { data: Notes, refetch: refetchNotes } = notes;

  const createdNote = api.note.create.useMutation({
    onSuccess: () => void refetchNotes(),
    onError: () => alert("Couldnt create a note"),
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const deleteTopic = api.topic.delete.useMutation({
    onSuccess: () => {
      void refetchTopics();
      void refetchNotes();
    },
  });

  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: session.data?.user !== undefined,
    },
  );

  useEffect(() => {
    if (!topics || topics.length === 0) {
      setSelectedTopic(null);
    }
  }, [topics]);

  const topic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    },
    onError: () => {
      alert("Unable to create topic");
    },
  });

  return (
    <main className=" min-h-screen   bg-white text-white">
      <section className="flex h-[60px] items-center justify-between rounded-b-md bg-black pb-2">
        <h1 className=" px-4 text-6xl font-extrabold tracking-tight text-white sm:text-[4.5rem]">
          {session.data?.user.name} <span>&apos; s Notes</span>
        </h1>
        <SignOutButton />
      </section>
      <div className="my-4 grid grid-cols-4 pl-5 pr-5">
        <div className="col-span-1">
          <div className="w-10/12  border-b-2  pb-4">
            <ul className="my-2  ">
              {topics?.map((topic) => (
                <li
                  onClick={() => {
                    setSelectedTopic(topic);
                    void refetchNotes();
                  }}
                  className={`mx-1 my-2 grid w-4/5 grid-cols-12 items-center  justify-between rounded-lg border  bg-white px-2 py-1 text-slate-500 hover:bg-slate-200 ${onclick === null ? `bg-white` : `bg-slate-200`}`}
                  key={topic.id}
                >
                  <div className="col-span-10 text-wrap break-words ">
                    {" "}
                    {topic.title}
                  </div>
                  <div className="col-span-2 rounded-xl p-2 hover:bg-slate-300">
                    <TrashIcon
                      onClick={() => {
                        void deleteTopic.mutateAsync({ id: topic.id });
                      }}
                      className="  h-5 w-5   "
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mt-2">
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void topic.mutateAsync({
                      title: e.currentTarget.value,
                    });
                    e.currentTarget.value = "";
                  }
                }}
                className=" h-8 w-5/6 border-spacing-2 cursor-auto rounded-lg border bg-white bg-opacity-75
              p-2 text-black shadow-slate-50
               target:border-slate-500 focus:border-slate-500 focus-visible:border-slate-500"
                placeholder="Enter title here"
              />
            </div>
          </div>
        </div>
        <div className="col-span-3 mx-2">
          {Notes?.map((note) => (
            <div className="mt-5" key={note.id}>
              <Note
                note={note}
                onDelete={() => {
                  void deleteNote.mutateAsync({ id: note.id });
                }}
              />
            </div>
          ))}
          <div>
            <NoteEditor
              topicId={selectedTopic?.id ?? ""}
              onSave={({ content, title }) => {
                void createdNote.mutateAsync({
                  title,
                  content,
                  topicId: selectedTopic?.id ?? "",
                });
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThePage;
