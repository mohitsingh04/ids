import { useState, useCallback, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import { Breadcrumbs } from "../../ui/breadcrumbs/Breadcrumbs";
import { API } from "../../context/API";
import {
  generateSlug,
  getErrorResponse,
  getFormikError,
} from "../../context/Callbacks";
import toast from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";
import HeadingLine from "../../ui/heading/HeadingLine";
import ShowQuestions from "./questionset-components/ShowQuestions";
import { QuestionSchema } from "../../context/ValidationSchema";
import { useOutletContext } from "react-router-dom";
import type { DashboardOutletContextProps } from "../../types/types";
import { QuestionList } from "../../common/QuestionList";

interface Option {
  label: string;
  value: string;
  point: number;
}

interface QuestionData {
  id: number;
  _id?: string;
  title: string;
  questionText: string;
  options: Option[];
}

export default function CreateQuestions() {
  const [isSaving, setIsSaving] = useState(false);
  const [questionsQueue, setQuestionsQueue] = useState<QuestionData[]>(QuestionList);
  const [originalQueue, setOriginalQueue] = useState<QuestionData[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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
      setQuestionsQueue(mappedQuestions);
      setOriginalQueue(mappedQuestions);
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, [organization?._id]);

  useEffect(() => {
    getQuestionByOrganzation();
  }, [getQuestionByOrganzation]);

  useEffect(() => {
    if (questionsQueue.length !== originalQueue.length) {
      setIsDirty(true);
    } else {
      const isModified =
        JSON.stringify(questionsQueue) !== JSON.stringify(originalQueue);
      setIsDirty(isModified);
    }
  }, [questionsQueue, originalQueue]);

  const initialValues = useMemo(
    () => ({
      organization_id: organization?._id,
      title: "",
      questionText: "",
      options: [
        { label: "", value: "", point: 0 },
        { label: "", value: "", point: 0 },
      ],
    }),
    [organization?._id]
  );

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: QuestionSchema,
    onSubmit: (values, { resetForm }) => {
      let targetId = editingId;
      if (!targetId) {
        const maxId =
          questionsQueue.length > 0
            ? Math.max(...questionsQueue.map((q) => q.id))
            : 0;
        targetId = maxId + 1;
      }

      const questionPayload: QuestionData = {
        id: targetId,
        title: values.title,
        questionText: values.questionText,
        options: values.options,
      };

      if (editingId) {
        setQuestionsQueue((prev) =>
          prev.map((q) =>
            q.id === editingId ? { ...questionPayload, _id: q._id } : q
          )
        );
        toast.success("Question updated in queue");
        setEditingId(null);
      } else {
        setQuestionsQueue((prev) => [...prev, questionPayload]);
        toast.success("Question added to queue");
      }

      resetForm({ values: initialValues });
    },
  });

  const handleEditFromQueue = (q: QuestionData) => {
    formik.setValues({
      organization_id: organization?._id,
      title: q.title,
      questionText: q.questionText,
      options: q.options.map((o) => ({ ...o })),
    });
    setEditingId(q.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveFromQueue = (idToRemove: number) => {
    setQuestionsQueue((prev) => prev.filter((q) => q.id !== idToRemove));

    if (editingId === idToRemove) {
      handleCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    formik.resetForm();
  };

  const handleOptionChange = (index: number, field: keyof Option, val: any) => {
    const newOptions = formik.values.options.map((opt, i) => {
      if (i === index) {
        const updatedOpt = { ...opt, [field]: val };
        if (field === "label") {
          updatedOpt.value = generateSlug(val as string);
        }
        return updatedOpt;
      }
      return opt;
    });
    formik.setFieldValue("options", newOptions);
  };

  const addOptionField = () => {
    const newOptions = [
      ...formik.values.options,
      { label: "", value: "", point: 0 },
    ];
    formik.setFieldValue("options", newOptions);
  };

  const removeOptionField = (index: number) => {
    if (formik.values.options.length <= 2) {
      toast.error("Minimum 2 options required.");
      return;
    }
    const newOptions = formik.values.options.filter((_, i) => i !== index);
    formik.setFieldValue("options", newOptions);
  };

  const handleFinalSave = useCallback(async () => {
    if (questionsQueue.length === 0) {
      toast.error("Queue is empty.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        organization_id: organization?._id,
        questions: questionsQueue,
      };

      const response = await API.post("/create/question-set", payload);
      toast.success(response?.data?.message || "Questions saved successfully!");
      setOriginalQueue([...questionsQueue]);
      setIsDirty(false);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setIsSaving(false);
    }
  }, [questionsQueue, organization?._id]);

  return (
    <div className="pb-24">
      <Breadcrumbs
        title="Question Set"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Questions" },
        ]}
      />

      <div className="bg-[var(--yp-primary)] mt-5 rounded-xl shadow-sm p-4">
        <div className="space-y-8">
          <div className="bg-[var(--yp-primary)] border border-[var(--yp-border-primary)] rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--yp-border-primary)]">
              <div className="flex items-center gap-3">
                <HeadingLine
                  title={editingId ? "Edit Question" : "Add New Question"}
                  className="mb-0! text-[var(--yp-text-primary)] font-bold"
                />
              </div>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-danger-emphasis)] bg-[var(--yp-danger-subtle)]"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                    Internal Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Budget Check"
                    className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getFormikError(formik, "title")}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--yp-text-secondary)] mb-2">
                    Question Script <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="questionText"
                    placeholder="What is your planned budget?"
                    className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                    value={formik.values.questionText}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {getFormikError(formik, "questionText")}
                </div>
              </div>

              <div className="bg-[var(--yp-tertiary)]/30 rounded-lg p-4 border border-[var(--yp-border-primary)]">
                <div className="flex items-center justify-between mb-4">
                  <HeadingLine
                    title="Answer Options"
                    className="mb-0! text-[var(--yp-text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={addOptionField}
                    className="text-xs font-bold text-[var(--yp-main)] flex items-center gap-1 hover:underline"
                  >
                    + Add Option
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formik.values.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                          value={opt.label}
                          onChange={(e) =>
                            handleOptionChange(idx, "label", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <select
                          className="w-full px-3 py-2 border border-[var(--yp-border-primary)] rounded-lg bg-[var(--yp-input-primary)] text-[var(--yp-text-primary)]"
                          value={opt.point}
                          onChange={(e) =>
                            handleOptionChange(
                              idx,
                              "point",
                              Number(e.target.value)
                            )
                          }
                        >
                          <option value={1}>Positive</option>
                          <option value={0}>Neutral</option>
                          <option value={-1}>Negative</option>
                        </select>
                      </div>
                      {formik?.values?.options?.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOptionField(idx)}
                          className="p-2 text-[var(--yp-danger)] hover:text-red-500"
                        >
                          <LuTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {getFormikError(formik, "options")}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)] hover:opacity-80 transition-all"
                >
                  {editingId ? "Update Question" : "Add to Queue"}
                </button>
              </div>
            </form>
          </div>

          {questionsQueue.length > 0 && (
            <ShowQuestions
              questionsQueue={questionsQueue}
              handleEditFromQueue={handleEditFromQueue}
              handleRemoveFromQueue={handleRemoveFromQueue}
            />
          )}
        </div>

        {isDirty && questionsQueue.length > 0 && (
          <div className="flex justify-end py-4">
            <button
              onClick={handleFinalSave}
              disabled={isSaving}
              className="px-6 py-2 rounded-lg text-sm font-medium text-[var(--yp-blue-emphasis)] bg-[var(--yp-blue-subtle)]"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
