import type { Note as N } from "@prisma/client";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const Note = ({ note, onDelete }: { note: N; onDelete: () => void }) => {
  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="rounded-lg bg-cyan-50 px-4"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-slate-600 ">
            {note.title}
          </AccordionTrigger>
          <AccordionContent className="flex items-center justify-between rounded-lg bg-black px-2 py-2 text-white">
            <div>{note.content}</div>
            <div>
              <TrashIcon
                className=""
                onClick={() => {
                  onDelete();
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
export default Note;
