import { useCallback, useEffect, useState, useMemo } from "react";
import {
  LuListChecks,
  LuStickyNote,
  LuStar,
  LuTrendingUp,
} from "react-icons/lu";
import { useOutletContext } from "react-router-dom";
import type { LeadProps } from "../../../../types/LeadTypes";
import type {
  DashboardOutletContextProps,
  Column,
} from "../../../../types/types";
import { API } from "../../../../context/API";
import {
  getErrorResponse,
  getLeadStatus,
  getLeadStatusColor,
} from "../../../../context/Callbacks";
import { QuestionList } from "../../../../common/QuestionList";
import { FeedbackData } from "../../../../common/FeedbackData";
import Badge from "../../../../ui/badge/Badge";
import { SimpleTable } from "../../../../ui/table/SimpleTable";

interface QuestionOption {
  value: string;
  label: string;
  point?: number;
}

interface Question {
  id: number;
  title: string;
  shortTitle: string;
  options: QuestionOption[];
}

export default function Summary({ lead }: { lead: LeadProps | null }) {
  const { authUser } = useOutletContext<DashboardOutletContextProps>();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [note, setNote] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin =
    authUser?.role === "admin" || authUser?.role === "super admin";

  // --- 1. Fetch Conversation Data ---
  const getAnswers = useCallback(async () => {
    if (!lead?._id) return;

    try {
      setIsLoading(true);
      const response = await API.get(`/lead/conversation/${lead._id}`);

      const questions = response.data?.questions || [];
      const savedNote = response.data?.message || "";
      const savedRating = response.data?.rating || 0;

      // Convert array back to object map for easy lookup
      const answerList = questions.reduce((acc: any, q: any) => {
        acc[q.question_id] = q.answer ?? "";
        return acc;
      }, {} as Record<string, string>);

      setAnswers(answerList);
      setNote(savedNote);
      setRating(savedRating);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setIsLoading(false);
    }
  }, [lead?._id]);

  useEffect(() => {
    getAnswers();
  }, [getAnswers]);

  // --- 2. Calculation Helpers ---
  const totalQuestions = QuestionList.length;
  const submittedCount = Object.keys(answers).length;

  const getAnswerLabel = (questionId: number, value: string) => {
    const question = QuestionList.find((q) => q.id === questionId);
    const option = question?.options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const getAnswerPoint = (questionId: number, value: string) => {
    const question = QuestionList.find((q) => q.id === questionId);
    const option = question?.options.find((opt) => opt.value === value);
    return option?.point ?? 0;
  };

  // --- Score Logic (Replicated for View Mode) ---
  const overallAnswerScore = useMemo(() => {
    return Object.entries(answers).reduce((sum, [qId, ans]) => {
      const question = QuestionList.find((q) => q.id === Number(qId));
      const option = question?.options.find((o) => o.value === ans);
      return sum + (option?.point || 0);
    }, 0);
  }, [answers]);

  const overallLeadScore = useMemo(() => {
    const submitPercentage =
      totalQuestions > 0 ? (submittedCount / totalQuestions) * 100 : 0;
    const submitWeighted = submitPercentage * 0.1;

    const ratingPercentage = rating > 0 ? rating : 0;
    const ratingWeighted = ratingPercentage * 0.6;

    const answerPercentage =
      totalQuestions > 0
        ? Math.max(0, (overallAnswerScore / totalQuestions) * 100)
        : 0;
    const answerWeighted = answerPercentage * 0.3;

    return Number(
      (submitWeighted + ratingWeighted + answerWeighted).toFixed(2)
    );
  }, [submittedCount, totalQuestions, rating, overallAnswerScore]);

  const FinalRating = FeedbackData?.find((item) => item?.value === rating);
  const FinalRatingIcon = FinalRating?.icon || LuStar;

  // --- 3. Table Configuration ---
  const columns: Column<Question>[] = [
    {
      label: "Question",
      value: (row) => (
        <span className="font-medium text-[var(--yp-text-secondary)]">
          {row.shortTitle}
        </span>
      ),
    },
    {
      label: "Response",
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

  // Only show Analysis column to Admins
  if (isAdmin) {
    columns.push({
      label: "Analysis",
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
            : { value: "N/A", color: "gray" };

        return <Badge label={val?.value} color={val?.color} />;
      },
    });
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-[var(--yp-text-secondary)]">
        Loading summary...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--yp-secondary)] rounded-xl p-5 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[var(--yp-main-subtle)] text-[var(--yp-main)]">
            <LuListChecks className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[var(--yp-muted)] font-medium mb-1">
              Completion
            </p>
            <h3 className="text-xl font-bold text-[var(--yp-text-secondary)]">
              {submittedCount}{" "}
              <span className="text-sm text-[var(--yp-muted)]">
                / {totalQuestions} Questions
              </span>
            </h3>
          </div>
        </div>

        <div className="bg-[var(--yp-secondary)] rounded-xl p-5 shadow-sm flex items-start gap-4">
          <div
            className={`p-3 rounded-lg ${
              FinalRating
                ? `${FinalRating.bg} ${FinalRating.color}`
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <FinalRatingIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[var(--yp-muted)] font-medium mb-1">
              Rating
            </p>
            <h3 className="text-xl font-bold text-[var(--yp-text-secondary)]">
              {FinalRating?.label || "Not Rated"}
            </h3>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-[var(--yp-secondary)] rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div
              className={`p-3 rounded-lg ${
                getLeadStatusColor(overallLeadScore) === "red"
                  ? "bg-[var(--yp-danger-subtle)] text-[var(--yp-danger-emphasis)]"
                  : getLeadStatusColor(overallLeadScore) === "gray"
                  ? "bg-[var(--yp-gray-subtle)] text-[var(--yp-gray-emphasis)]"
                  : getLeadStatusColor(overallLeadScore) === "blue"
                  ? "bg-[var(--yp-blue-subtle)] text-[var(--yp-blue-emphasis)]"
                  : getLeadStatusColor(overallLeadScore) === "green"
                  ? "bg-[var(--yp-success-subtle)] text-[var(--yp-success-emphasis)]"
                  : "bg-[var(--yp-warning-subtle)] text-[var(--yp-warning-emphasis)]"
              }`}
            >
              <LuTrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--yp-muted)] font-medium mb-1">
                Systen Analysis
              </p>
              <h3 className="text-xl font-bold text-[var(--yp-text-secondary)]">
                {getLeadStatus(overallLeadScore)}
                <span className="text-sm ml-2 font-normal text-[var(--yp-text-muted)]">
                  ({overallLeadScore}%)
                </span>
              </h3>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[var(--yp-secondary)] rounded-xl p-5 shadow-sm flex items-start gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-lg bg-[var(--yp-main-subtle)] text-[var(--yp-main)]">
            <LuStickyNote className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--yp-muted)] mb-1">
              Counselor Note
            </h4>
            <p className="text-sm text-[var(--yp-text-secondary)] leading-relaxed">
              {note || (
                <span className="text-[var(--yp-text-muted)] italic">
                  No notes were added for this conversation.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <SimpleTable data={QuestionList} columns={columns} />
    </div>
  );
}
