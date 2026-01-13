import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

export default function QuestionSteps({
  currentQIndex,
  ADMISSION_QUESTIONS,
  currentQuestion,
  answers,
  handlePrevious,
  handleNext,
  handleOptionSelect,
  isSaving,
}: {
  currentQIndex: number;
  ADMISSION_QUESTIONS: Question[];
  currentQuestion: Question;
  answers: Record<number, string>;
  handleOptionSelect: (questionId: number, value: string) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2 text-(--yp-main) font-semibold tracking-wide text-sm uppercase">
        Question {currentQIndex + 1} of {ADMISSION_QUESTIONS.length}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-(--yp-text-secondary) mb-3 leading-tight">
        {currentQuestion.title}
      </h1>

      <h3 className="text-lg font-bold text-(--yp-text-primary) mb-3 leading-tight">
        {currentQuestion?.questionText}
      </h3>

      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentQuestion.options.map((option) => {
          const isSelected = answers[currentQuestion.id] === option.value;
          return (
            <div
              key={option.value}
              onClick={() =>
                handleOptionSelect(currentQuestion.id, option.value)
              }
              className={`
              cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group
              ${
                isSelected
                  ? "border-(--yp-main) bg-(--yp-main-subtle) shadow-sm"
                  : "border-(--yp-border-primary) hover:border-transparent hover:bg-(--yp-secondary)"
              }
            `}
            >
              <div
                className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
              ${
                isSelected
                  ? "border-(--yp-main)"
                  : "border-(--yp-muted) group-hover:border-(--yp-main)"
              }
            `}
              >
                {isSelected && (
                  <div className="w-3 h-3 bg-(--yp-main) rounded-full" />
                )}
              </div>
              <span
                className={`font-medium ${
                  isSelected ? "text-(--yp-main)" : "text-(--yp-text-primary)"
                }`}
              >
                {option.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-(--yp-border-primary)">
        <button
          onClick={handlePrevious}
          disabled={currentQIndex === 0}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
            currentQIndex === 0
              ? "text-(--yp-muted) cursor-not-allowed"
              : "text-(--yp-text-primary) hover:bg-(--yp-tertiary)"
          }`}
        >
          <FaChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={handleNext}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium transition-all shadow-sm bg-(--yp-main) text-(--yp-main-subtle)"
        >
          <>
            Next <FaChevronRight className="w-4 h-4" />
          </>
        </button>
      </div>
    </div>
  );
}
