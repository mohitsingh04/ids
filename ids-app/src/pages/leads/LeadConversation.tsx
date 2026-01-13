import { useCallback, useEffect, useState, useMemo } from "react";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import { useOutletContext, useParams } from "react-router-dom";
import type { LeadProps } from "../../types/LeadTypes";
import { API } from "../../context/API";
import { getErrorResponse } from "../../context/Callbacks";
import { QuestionList } from "../../common/QuestionList";
import ConversationSidebar from "./lead_conversation_compoents/ConversationSidebar";
import ConversationHeader from "./lead_conversation_compoents/ConversationHeader";
import StartConversation from "./lead_conversation_compoents/StartConversation";
import NoteStep from "./lead_conversation_compoents/NoteStep";
import QuestionSteps from "./lead_conversation_compoents/QuestionSteps";
import FinalSummaryStep from "./lead_conversation_compoents/FinalSummaryStep";
import type { DashboardOutletContextProps } from "../../types/types";

interface QuestionOption {
  value: string;
  label: string;
  point?: number;
}

interface Question {
  id: number;
  title: string;
  questionText: string;
  options: QuestionOption[];
}

// const ADMISSION_QUESTIONS: Question[] = QuestionList;

export default function LeadConversation() {
  const { objectId } = useParams();

  const [lead, setLead] = useState<LeadProps | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [note, setNote] = useState("");

  // Changed to separate states
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [nextFollowUpTime, setNextFollowUpTime] = useState("");

  const [rating, setRating] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [questionsQueue, setQuestionsQueue] =
    useState<Question[]>(QuestionList);
  const { organization } = useOutletContext<DashboardOutletContextProps>();

  const getQuestionByOrganzation = useCallback(async () => {
    if (!organization?._id) return;
    try {
      const response = await API.get(`/question-set/${organization?._id}`);
      const mappedQuestions = (response?.data?.questions || []).map(
        (q: any, index: number) => ({
          ...q,
          id: q.id || index + 1,
        })
      );
      setQuestionsQueue(
        mappedQuestions?.length > 0 ? mappedQuestions : QuestionList
      );
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [organization?._id, QuestionList]);

  useEffect(() => {
    getQuestionByOrganzation();
  }, [getQuestionByOrganzation]);

  // Define Step Indices
  const NOTE_STEP_INDEX = questionsQueue?.length;
  const SUMMARY_STEP_INDEX = questionsQueue?.length + 1;

  const getLead = useCallback(async () => {
    try {
      const response = await API.get(`/leads/${objectId}`);
      setLead(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [objectId]);

  useEffect(() => {
    getLead();
  }, [getLead]);

  const getAnswers = useCallback(async () => {
    if (!lead?._id) return;

    try {
      const response = await API.get(`/lead/conversation/${lead._id}`);
      const questions = response.data?.questions || [];
      const savedNote = response.data?.message || "";
      const savedRating = response.data?.rating || 0;

      const answerList = questions.reduce((acc: any, q: any) => {
        acc[q.question_id] = q.answer ?? "";
        return acc;
      }, {} as Record<string, string>);

      setAnswers(answerList);
      setNote(savedNote);
      setRating(savedRating);

      if (Object.keys(answerList).length > 0) {
        setIsStarted(true);
      }
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [lead?._id]);

  useEffect(() => {
    getAnswers();
  }, [getAnswers]);

  const maxAnsweredIndex = useMemo(() => {
    const answeredIds = Object.keys(answers).map(Number);
    if (answeredIds.length === 0) return -1;
    let maxIdx = -1;
    questionsQueue?.forEach((q, idx) => {
      if (answeredIds.includes(q.id)) {
        maxIdx = Math.max(maxIdx, idx);
      }
    });
    return maxIdx;
  }, [answers]);

  const handleStart = () => setIsStarted(true);

  const handleOptionSelect = (questionId: number, value: string) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const handleNext = () => {
    if (currentQIndex < SUMMARY_STEP_INDEX)
      setCurrentQIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQIndex > 0) setCurrentQIndex((prev) => prev - 1);
  };

  const currentQuestion = questionsQueue?.[currentQIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questionsQueue?.length) * 100;
  const hasHistory = answeredCount > 0;

  const isNoteStep = currentQIndex === NOTE_STEP_INDEX;
  const isSummaryStep = currentQIndex === SUMMARY_STEP_INDEX;

  return (
    <div>
      <Breadcrumbs
        title="Lead Conversation"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Lead", path: "/dashboard/leads" },
          {
            label: lead?.name || "Lead",
            path: `/dashboard/lead/${lead?._id}`,
          },
        ]}
      />

      <div className="bg-[var(--yp-primary)] rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <ConversationSidebar
          answeredCount={answeredCount}
          progressPercentage={progressPercentage}
          ADMISSION_QUESTIONS={questionsQueue}
          maxAnsweredIndex={maxAnsweredIndex}
          answers={answers}
          isStarted={isStarted}
          hasHistory={hasHistory}
          currentQIndex={currentQIndex}
          isNoteStep={isNoteStep}
          isSummaryStep={isSummaryStep}
          note={note}
          setCurrentQIndex={setCurrentQIndex}
          setIsStarted={setIsStarted}
          NOTE_STEP_INDEX={NOTE_STEP_INDEX}
          SUMMARY_STEP_INDEX={SUMMARY_STEP_INDEX}
        />

        <div className="flex-1 flex flex-col relative">
          <ConversationHeader
            lead={lead}
            isStarted={isStarted}
            hasHistory={hasHistory}
          />
          <div className="flex-1 p-8 flex flex-col items-center text-[var(--yp-text-secondary)]">
            {!isStarted ? (
              <StartConversation
                handleStart={handleStart}
                hasHistory={hasHistory}
              />
            ) : isSummaryStep ? (
              <FinalSummaryStep
                answers={answers}
                questions={questionsQueue}
                note={note}
                rating={rating}
                nextFollowUpDate={nextFollowUpDate} // Pass Date
                nextFollowUpTime={nextFollowUpTime} // Pass Time
                handlePrevious={handlePrevious}
                isSaving={isSaving}
                setIsSaving={setIsSaving}
                lead={lead}
              />
            ) : isNoteStep ? (
              <NoteStep
                note={note}
                setNote={setNote}
                rating={rating}
                setRating={setRating}
                nextFollowUpDate={nextFollowUpDate} // Pass Date state
                setNextFollowUpDate={setNextFollowUpDate} // Pass Date setter
                nextFollowUpTime={nextFollowUpTime} // Pass Time state
                setNextFollowUpTime={setNextFollowUpTime} // Pass Time setter
                handleNext={handleNext}
                handlePrevious={handlePrevious}
              />
            ) : (
              <QuestionSteps
                currentQIndex={currentQIndex}
                isSaving={isSaving}
                answers={answers}
                ADMISSION_QUESTIONS={questionsQueue}
                currentQuestion={currentQuestion}
                handleOptionSelect={handleOptionSelect}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
