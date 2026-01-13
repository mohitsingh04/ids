import { SimpleTable } from "../../../ui/table/SimpleTable";
import type { Column } from "../../../types/types";
import { LuPenLine, LuTrash2 } from "react-icons/lu";
import TableButton from "../../../ui/button/TableButton";

// --- Interfaces ---
interface Option {
  label: string;
  value: string;
  point: number;
}

interface QuestionData {
  id: number; // Sequential ID (1, 2, 3...)
  _id?: string;
  title: string;
  questionText: string;
  options: Option[];
}

export default function ShowQuestions({
  questionsQueue,
  handleEditFromQueue,
  handleRemoveFromQueue,
}: {
  questionsQueue: QuestionData[];
  handleEditFromQueue: (a: QuestionData) => void;
  handleRemoveFromQueue: (a: number) => void;
}) {
  const columns: Column<QuestionData>[] = [
    {
      label: "Title",
      value: (row) => (
        <span className="font-semibold text-[var(--yp-text-secondary)]">
          {row.title}
        </span>
      ),
    },
    {
      label: "Script",
      value: (row) => (
        <span
          className="text-[var(--yp-text-primary)] truncate block max-w-xs"
          title={row.questionText}
        >
          {row.questionText}
        </span>
      ),
    },
    {
      label: "Options",
      value: (row) => (
        <span className="bg-[var(--yp-tertiary)] text-[var(--yp-text-primary)] px-2 py-1 rounded text-xs font-bold">
          {row.options.length}
        </span>
      ),
    },
    {
      label: "Actions",
      value: (row) => (
        <div className="flex gap-2">
          <TableButton
            Icon={LuPenLine}
            color="blue"
            onClick={() => handleEditFromQueue(row)}
          />
          <TableButton
            Icon={LuTrash2}
            color="red"
            onClick={() => handleRemoveFromQueue(row?.id)}
          />
        </div>
      ),
    },
  ];
  return <SimpleTable data={questionsQueue} columns={columns} />;
}
