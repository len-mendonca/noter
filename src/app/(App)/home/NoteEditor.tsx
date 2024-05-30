"use client";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
const NoteEditor = ({
  onSave,
  topicId,
}: {
  onSave: (note: { title: string; content: string }) => void;
  topicId: string;
}) => {
  console.log("topicId ", topicId);

  const [code, setCode] = useState<string>("");
  const [tile, setTile] = useState<string>("");
  useEffect(() => {
    if (topicId === "") {
      setCode("");
      setTile("");
    }
  }, [topicId]);
  return (
    <>
      <input
        type="text"
        value={tile}
        onChange={(e) => {
          setTile(e.currentTarget.value);
        }}
        className="my-2 h-8 w-full border-spacing-2 cursor-auto rounded-lg border bg-white bg-opacity-75
              p-2 text-black shadow-slate-50
               target:border-slate-500 focus:border-slate-500 focus-visible:border-slate-500"
        placeholder="Enter title here"
      />
      <CodeMirror
        value={code}
        width="500px"
        height="30vh"
        minWidth="100%"
        minHeight="30vh"
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
        onChange={(value) => {
          setCode(value);
        }}
        className="border border-gray-300 text-slate-600"
      />
      <Button
        variant={"secondary"}
        disabled={
          tile.trim().length === 0 ||
          code.trim().length === 0 ||
          topicId.trim().length === 0
        }
        onClick={() => {
          onSave({ content: code, title: tile });
          setCode("");
          setTile("");
        }}
      >
        Save
      </Button>
    </>
  );
};
export default NoteEditor;
