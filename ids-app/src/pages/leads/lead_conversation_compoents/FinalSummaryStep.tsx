import { useCallback, useMemo } from "react";
import { FaChevronLeft } from "react-icons/fa";
import {
  LuCircleCheck,
  LuLoader,
  LuListChecks,
  LuCalendarClock,
} from "react-icons/lu";
import { useNavigate, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { SimpleTable } from "../../../ui/table/SimpleTable";
import type { DashboardOutletContextProps, Column } from "../../../types/types";
import type { LeadProps } from "../../../types/LeadTypes";
import { API } from "../../../context/API";
import { getErrorResponse, getLeadStatus } from "../../../context/Callbacks";
import { FeedbackData } from "../../../common/FeedbackData";
import Badge from "../../../ui/badge/Badge";

interface QuestionOption {
  value: string;
  label: string;
  point?: number;
}

interface Question {
  id: number;
  title: string;
  options: QuestionOption[];
}

export default function FinalSummaryStep({
  answers,
  questions,
  note,
  handlePrevious,
  isSaving,
  lead,
  setIsSaving,
  rating,
  nextFollowUpDate,
  nextFollowUpTime,
}: {
  lead: LeadProps | null;
  answers: Record<number, string>;
  questions: Question[];
  note: string;
  nextFollowUpDate: string;
  nextFollowUpTime: string;
  handlePrevious: () => void;
  isSaving: boolean;
  setIsSaving: (loading: boolean) => void;
  rating: number;
}) {
  const navigate = useNavigate();
  const { authUser } = useOutletContext<DashboardOutletContextProps>();

  const totalQuestions = questions.length;
  const submittedCount = Object.keys(answers).length;

  const isAdmin =
    authUser?.role === "admin" || authUser?.role === "super admin";

  // --- Score Calculations ---
  const overallAnswerScore = useMemo(() => {
    return Object.entries(answers).reduce((sum, [qId, ans]) => {
      const question = questions.find((q) => q.id === Number(qId));
      const option = question?.options.find((o) => o.value === ans);
      return sum + (option?.point || 0);
    }, 0);
  }, [answers, questions]);

  const overallLeadScore = useMemo(() => {
    const submitPercentage =
      totalQuestions > 0 ? (submittedCount / totalQuestions) * 100 : 0;
    const submitWeighted = submitPercentage * 0.1;

    const ratingPercentage = rating > 0 ? (rating / 5) * 100 : 0;
    const ratingWeighted = ratingPercentage * 0.6;

    const answerPercentage =
      totalQuestions > 0
        ? Math.max(0, (overallAnswerScore / submittedCount) * 100)
        : 0;
    const answerWeighted = answerPercentage * 0.3;

    return Number(
      (submitWeighted + ratingWeighted + answerWeighted).toFixed(2)
    );
  }, [submittedCount, totalQuestions, rating, overallAnswerScore]);

  // --- Helpers ---
  const getAnswerLabel = (questionId: number, value: string) => {
    const question = questions.find((q) => q.id === questionId);
    const option = question?.options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const getAnswerPoint = (questionId: number, value: string) => {
    const question = questions.find((q) => q.id === questionId);
    const option = question?.options.find((opt) => opt.value === value);
    return option?.point ?? 0;
  };

  // --- Submission ---
  const submitConversation = useCallback(async () => {
    try {
      setIsSaving(true);

      const formattedQuestions = Object.entries(answers).map(([qId, ans]) => {
        const questionObj = questions.find((q) => q.id === Number(qId));
        const selectedOption = questionObj?.options.find(
          (opt) => opt.value === ans
        );

        return {
          question_id: qId,
          answer: ans,
          point: selectedOption?.point || 0,
        };
      });

      const payload = {
        lead_id: lead?._id,
        questions: formattedQuestions,
        message: note,
        rating,
        next_follow_up_date: nextFollowUpDate, // Separate Date
        next_follow_up_time: nextFollowUpTime, // Separate Time
        overallAnswerScore,
        overallLeadScore,
        submitQuestion: {
          submitted: submittedCount,
          total: totalQuestions,
        },
      };

      const response = await API.post(`/lead/conversation`, payload);
      toast.success(response?.data?.message);
      navigate("/dashboard/leads");
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setIsSaving(false);
    }
  }, [
    lead?._id,
    answers,
    note,
    rating,
    nextFollowUpDate,
    nextFollowUpTime,
    navigate,
    setIsSaving,
    submittedCount,
    totalQuestions,
    questions,
    overallAnswerScore,
    overallLeadScore,
  ]);

  const FinalRating = FeedbackData?.find((item) => item?.value === rating);
  const FinalRatingIcon = FinalRating?.icon;

  // --- Table Columns ---
  const columns: Column<Question>[] = [
    {
      label: "Question",
      value: (row) => (
        <span className="font-medium text-[var(--yp-text-secondary)]">
          {row.title}
        </span>
      ),
    },
    {
      label: "Selected Answer",
      value: (row) => {
        const answerValue = answers[row.id];
        return answerValue ? (
          <span className="font-medium text-[var(--yp-main)]">
            {getAnswerLabel(row.id, answerValue)}
          </span>
        ) : (
          <span className="text-[var(--yp-muted)] italic">Skipped</span>
        );
      },
    },
  ];

  if (isAdmin) {
    columns.push({
      label: "Sentiment",
      value: (row) => {
        const answerValue = answers[row.id];
        if (!answerValue)
          return <span className="text-[var(--yp-muted)]">-</span>;

        const point = getAnswerPoint(row.id, answerValue);
        const val =
          point === 1
            ? { value: "Positive", color: "green" }
            : point === 0
            ? { value: "Neutral", color: "yellow" }
            : point === -1
            ? { value: "Negative", color: "red" }
            : { value: "Skipped", color: "gray" };

        return <Badge label={val?.value} color={val?.color} />;
      },
    });
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2 text-[var(--yp-main)] font-semibold tracking-wide text-sm uppercase">
        Review & Submit
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--yp-text-secondary)] mb-8 leading-tight">
        Final Summary
      </h1>

      {/* Table Section */}
      <div className="bg-[var(--yp-primary)] border border-[var(--yp-border-primary)] rounded-xl overflow-hidden shadow-sm mb-8">
        <SimpleTable data={questions} columns={columns} />

        {/* Footer Stats Section */}
        <div className="flex border-t border-[var(--yp-border-primary)] bg-[var(--yp-tertiary)]/30">
          <div className="p-4 w-1/3 min-w-[200px] text-[var(--yp-text-secondary)] font-bold border-r border-[var(--yp-border-primary)] md:border-r-0 flex flex-col justify-center">
            Final Details
          </div>

          <div className="p-4 flex-1 text-[var(--yp-text-secondary)] space-y-3">
            <div className="flex flex-wrap gap-6">
              {/* Completion */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-[var(--yp-muted)]">
                  Completion:
                </span>
                <div className="flex items-center gap-2 font-bold">
                  <LuListChecks className="text-[var(--yp-main)]" />
                  {submittedCount} / {totalQuestions}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-[var(--yp-muted)]">
                  Rating:
                </span>
                <div
                  className={`flex items-center gap-2 font-bold ${FinalRating?.color} ${FinalRating?.bg} rounded-xl px-2 py-0.5 text-sm`}
                >
                  {FinalRatingIcon && <FinalRatingIcon />}
                  {FinalRating?.label || "Not Rated"}
                </div>
              </div>

              {/* Next Call */}
              {nextFollowUpDate && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-[var(--yp-muted)]">
                    Next Call:
                  </span>
                  <div className="flex items-center gap-2 font-bold text-[var(--yp-main)]">
                    <LuCalendarClock />
                    {new Date(nextFollowUpDate).toLocaleDateString()}
                    {nextFollowUpTime ? ` at ${nextFollowUpTime}` : ""}
                  </div>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-[var(--yp-muted)] w-24 text-nowrap">
                  System Analysis:
                </span>
                <span
                  className={`font-bold ${
                    overallLeadScore > 50 ? "text-green-600" : "text-orange-500"
                  }`}
                >
                  {getLeadStatus(overallLeadScore)} ({overallLeadScore}%)
                </span>
              </div>
            )}

            <div className="flex items-start gap-2 pt-2 border-t border-[var(--yp-border-primary)]">
              <span className="text-xs font-semibold uppercase text-[var(--yp-muted)] w-24 mt-1">
                Note:
              </span>
              <p className="text-sm">
                {note || (
                  <span className="text-[var(--yp-muted)] italic">
                    No notes added.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-[var(--yp-border-primary)]">
        <button
          onClick={handlePrevious}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-[var(--yp-text-primary)] hover:bg-[var(--yp-tertiary)] transition-colors"
        >
          <FaChevronLeft className="w-4 h-4" /> Edit Details
        </button>

        <button
          onClick={submitConversation}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium transition-all shadow-sm bg-[var(--yp-success)] text-white hover:opacity-90"
        >
          {isSaving ? (
            <>
              Saving <LuLoader className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>
              Confirm & Submit <LuCircleCheck className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
