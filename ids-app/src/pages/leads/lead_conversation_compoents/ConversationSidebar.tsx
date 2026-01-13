import HeadingLine from "../../../ui/heading/HeadingLine";
import {
  LuCircle,
  LuCircleAlert,
  LuCircleCheck,
  LuStickyNote,
  LuFileText,
} from "react-icons/lu";

interface QuestionOption {
  value: string;
  label: string;
}

interface Question {
  id: number;
  title: string;
  questionText: string;
  options: QuestionOption[];
}

export default function ConversationSidebar({
  progressPercentage,
  answeredCount,
  ADMISSION_QUESTIONS,
  answers,
  maxAnsweredIndex,
  currentQIndex,
  isStarted,
  hasHistory,
  isNoteStep,
  isSummaryStep,
  note,
  setIsStarted,
  setCurrentQIndex,
  NOTE_STEP_INDEX,
  SUMMARY_STEP_INDEX,
}: {
  answeredCount: number;
  progressPercentage: number;
  note: string;
  isNoteStep: boolean;
  isSummaryStep: boolean;
  hasHistory: boolean;
  isStarted: boolean;
  currentQIndex: number;
  maxAnsweredIndex: number;
  answers: Record<number, string>;
  ADMISSION_QUESTIONS: Question[];
  setIsStarted: any;
  setCurrentQIndex: any;
  NOTE_STEP_INDEX: number;
  SUMMARY_STEP_INDEX: number;
}) {
  return (
    <div className="w-full md:w-1/4 border-r border-(--yp-border-primary) flex flex-col">
      <div className="p-5 border-b border-(--yp-border-primary)">
        <HeadingLine title="Checklist" />
        <div className="mt-3 w-full bg-(--yp-tertiary) rounded-full h-2">
          <div
            className="bg-(--yp-main) h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-(--yp-muted) mt-1 text-right">
          {answeredCount}/{ADMISSION_QUESTIONS.length} Completed
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[calc(100vh-250px)]">
        {ADMISSION_QUESTIONS.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isSkipped = !isAnswered && idx < maxAnsweredIndex;

          const isActive = isStarted && currentQIndex === idx;
          const isClickable = isStarted || hasHistory;

          return (
            <button
              key={q.id}
              disabled={!isClickable}
              onClick={() => {
                setIsStarted(true);
                setCurrentQIndex(idx);
              }}
              className={`w-full text-left p-3 rounded-lg text-sm flex text-(--yp-text-secondary) items-center justify-between transition-all ${
                isActive
                  ? "bg-(--yp-secondary) shadow-sm border-l-4 border-(--yp-main)"
                  : "hover:bg-(--yp-tertiary)"
              } ${!isClickable ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`font-medium truncate mr-2 ${
                  isSkipped ? "opacity-70 text-(--yp-muted)" : ""
                }`}
              >
                {idx + 1}. {q.title}
              </span>

              {isAnswered ? (
                <LuCircleCheck className="w-4 h-4 text-(--yp-success) shrink-0" />
              ) : isSkipped ? (
                <LuCircleAlert
                  className="w-4 h-4 text-orange-400 shrink-0"
                  title="Skipped"
                />
              ) : (
                <LuCircle
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-(--yp-main)" : "text-(--yp-muted)"
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* Note Step in Sidebar */}
        <button
          disabled={!isStarted && !hasHistory}
          onClick={() => {
            setIsStarted(true);
            setCurrentQIndex(NOTE_STEP_INDEX);
          }}
          className={`w-full text-left p-3 rounded-lg text-sm flex text-(--yp-text-secondary) items-center justify-between transition-all ${
            isNoteStep
              ? "bg-(--yp-secondary) shadow-sm border-l-4 border-(--yp-main)"
              : "hover:bg-(--yp-tertiary)"
          } ${
            !isStarted && !hasHistory ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="font-medium truncate mr-2">Final Notes</span>
          {note ? (
            <LuCircleCheck className="w-4 h-4 text-(--yp-success) shrink-0" />
          ) : (
            <LuStickyNote
              className={`w-4 h-4 shrink-0 ${
                isNoteStep ? "text-(--yp-main)" : "text-(--yp-muted)"
              }`}
            />
          )}
        </button>

        {/* Summary Step in Sidebar */}
        <button
          disabled={!isStarted && !hasHistory}
          onClick={() => {
            setIsStarted(true);
            setCurrentQIndex(SUMMARY_STEP_INDEX);
          }}
          className={`w-full text-left p-3 rounded-lg text-sm flex text-(--yp-text-secondary) items-center justify-between transition-all ${
            isSummaryStep
              ? "bg-(--yp-secondary) shadow-sm border-l-4 border-(--yp-main)"
              : "hover:bg-(--yp-tertiary)"
          } ${
            !isStarted && !hasHistory ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="font-medium truncate mr-2">Summary</span>
          <LuFileText
            className={`w-4 h-4 shrink-0 ${
              isSummaryStep ? "text-(--yp-main)" : "text-(--yp-muted)"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
