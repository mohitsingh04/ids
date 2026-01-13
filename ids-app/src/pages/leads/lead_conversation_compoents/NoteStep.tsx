import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FeedbackData } from "../../../common/FeedbackData";

export default function NoteStep({
  note,
  setNote,
  rating,
  setRating,
  nextFollowUpDate,
  setNextFollowUpDate,
  nextFollowUpTime,
  setNextFollowUpTime,
  handlePrevious,
  handleNext,
}: {
  note: string;
  rating: number;
  nextFollowUpDate: string;
  setNextFollowUpDate: React.Dispatch<React.SetStateAction<string>>;
  nextFollowUpTime: string;
  setNextFollowUpTime: React.Dispatch<React.SetStateAction<string>>;
  handlePrevious: () => void;
  handleNext: () => void;
  setNote: React.Dispatch<React.SetStateAction<string>>;
  setRating: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2 text-[var(--yp-main)] font-semibold tracking-wide text-sm uppercase">
        Almost Done
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--yp-text-secondary)] mb-8 leading-tight">
        Rate & Schedule
      </h1>

      {/* --- Rating Section --- */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-4 text-[var(--yp-text-primary)]">
          How would you rate the lead potential?
        </label>
        <div className="flex flex-wrap gap-4 md:gap-8">
          {FeedbackData.map((opt) => {
            const Icon = opt.icon;
            const isSelected = rating === opt.value;

            return (
              <button
                key={opt.value}
                onClick={() => setRating(opt.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 border-2 ${
                  isSelected
                    ? `${opt?.bg} ${opt?.color} border-current scale-110 shadow-md`
                    : "border-transparent hover:bg-[var(--yp-tertiary)]"
                }`}
              >
                <Icon className={`w-10 h-10`} />
                <span className={`text-xs font-semibold`}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* --- Next Follow Up Date --- */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--yp-text-primary)]">
            Next Follow-up Date
          </label>
          <input
            type="date"
            className="w-full p-4 rounded-xl border border-[var(--yp-border-primary)] bg-transparent focus:ring-2 focus:ring-[var(--yp-main)] focus:border-transparent outline-none text-[var(--yp-text-secondary)]"
            value={nextFollowUpDate}
            onChange={(e) => setNextFollowUpDate(e.target.value)}
          />
        </div>

        {/* --- Next Follow Up Time --- */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--yp-text-primary)]">
            Next Follow-up Time
          </label>
          <input
            type="time"
            className="w-full p-4 rounded-xl border border-[var(--yp-border-primary)] bg-transparent focus:ring-2 focus:ring-[var(--yp-main)] focus:border-transparent outline-none text-[var(--yp-text-secondary)]"
            value={nextFollowUpTime}
            onChange={(e) => setNextFollowUpTime(e.target.value)}
            disabled={!nextFollowUpDate} // Optional: disable time if no date
          />
        </div>

        {/* --- Note Section --- */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2 text-[var(--yp-text-primary)]">
            Add a note about this conversation
          </label>
          <textarea
            className="w-full p-4 rounded-xl border border-[var(--yp-border-primary)] bg-transparent focus:ring-2 focus:ring-[var(--yp-main)] focus:border-transparent outline-none h-32 resize-none"
            placeholder="E.g., Student is very interested but waiting for loan approval..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-[var(--yp-border-primary)]">
        <button
          onClick={handlePrevious}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-[var(--yp-text-primary)] hover:bg-[var(--yp-tertiary)] transition-colors"
        >
          <FaChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium transition-all shadow-sm bg-[var(--yp-main)] text-[var(--yp-main-subtle)] hover:opacity-90"
        >
          Review Summary <FaChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}