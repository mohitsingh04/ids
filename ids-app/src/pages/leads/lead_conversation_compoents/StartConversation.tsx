import { FaPlay } from "react-icons/fa";
import { LuPhone } from "react-icons/lu";

export default function StartConversation({
  hasHistory,
  handleStart,
}: {
  hasHistory: boolean;
  handleStart: () => void;
}) {
  return (
    <div className="text-center max-w-md mt-10">
      <div className="w-20 h-20 bg-(--yp-main-subtle) rounded-full flex items-center justify-center mx-auto mb-6">
        <LuPhone className="w-10 h-10 text-(--yp-main)" />
      </div>
      <h2 className="text-2xl font-bold mb-2">
        {hasHistory ? "Conversation History" : "Ready to Start?"}
      </h2>
      <p className="text-(--yp-muted) mb-8">
        {hasHistory
          ? "Previous answers found. Review existing data or resume the call."
          : "Begin the admission counseling session. Ensure you have the student's details handy."}
      </p>
      <button
        onClick={handleStart}
        className="bg-(--yp-main-subtle) text-(--yp-main) px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 mx-auto"
      >
        <FaPlay className="w-4 h-4" />{" "}
        {hasHistory ? "Resume / Edit" : "Start Call"}
      </button>
    </div>
  );
}
