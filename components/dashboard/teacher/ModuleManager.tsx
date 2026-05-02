"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Lesson {
  id: string;
  title: string;
  lesson_type: "VIDEO" | "READING" | "QUIZ";
  content_reference?: string;
  duration_minutes: number;
  start_marker?: string;
  end_marker?: string;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  file: string | null;
  lessons: Lesson[];
  order_index: number;
}

interface QuizQuestion {
  id: string;
  text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm transition placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ring";

export default function ModuleManager({ courseId }: { courseId: string }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingModule, setCreatingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const refreshModules = async () => {
    try {
      const res = await api.get<Module[]>(`/modules/?course_id=${courseId}`);
      const sorted = res.sort((a, b) => a.order_index - b.order_index);
      setModules(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim()) return;
    setCreatingModule(true);
    try {
      await api.post("/modules/", {
        course: courseId,
        title: newModuleTitle,
        order_index: modules.length,
      });
      setNewModuleTitle("");
      await refreshModules();
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingModule(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add a section */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border bg-[color:var(--primary)]/[0.04] px-6 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            New section
          </p>
          <h3 className="mt-1 font-display text-base font-semibold leading-tight text-foreground">
            Add a section
          </h3>
        </div>
        <div className="flex flex-col gap-3 p-6 sm:flex-row">
          <input
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="Section title (e.g. Chapter 1: Introduction)"
            className={`${inputCls} flex-1`}
          />
          <Button
            onClick={handleCreateModule}
            disabled={creatingModule}
            variant="primary"
          >
            {creatingModule ? "Creating…" : "Create section"}
          </Button>
        </div>
      </div>

      {/* Modules list */}
      <div className="space-y-4">
        {modules.map((mod) => (
          <ModuleEditor key={mod.id} module={mod} onRefresh={refreshModules} />
        ))}
        {modules.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-lg font-semibold text-foreground">
              No modules yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start by creating a section above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ModuleEditor({
  module,
  onRefresh,
}: {
  module: Module;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [fileFile, setFileFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLessonType, setNewLessonType] = useState<"VIDEO" | "READING" | "QUIZ">(
    "READING"
  );
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonStart, setNewLessonStart] = useState("");
  const [newLessonEnd, setNewLessonEnd] = useState("");
  const [addingLesson, setAddingLesson] = useState(false);

  const handleUpload = async () => {
    if (!fileFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileFile);
    try {
      await api.put(`/modules/${module.id}/`, formData);
      setFileFile(null);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle) return;
    setAddingLesson(true);
    try {
      await api.post("/lessons/", {
        module: module.id,
        title: newLessonTitle,
        lesson_type: newLessonType,
        start_marker: newLessonStart,
        end_marker: newLessonEnd,
        order: module.lessons.length,
      });
      setShowAddLesson(false);
      setNewLessonTitle("");
      setNewLessonStart("");
      setNewLessonEnd("");
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setAddingLesson(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Module header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[color:var(--primary)]/[0.03]"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background font-display text-sm font-semibold tabular-nums text-foreground">
            {String(module.order_index + 1).padStart(2, "0")}
          </span>
          <div>
            <h4 className="font-display text-base font-semibold leading-tight text-foreground">
              {module.title}
            </h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {module.lessons.length}{" "}
              {module.lessons.length === 1 ? "lesson" : "lessons"}
              {module.file ? " · file uploaded" : ""}
            </p>
          </div>
        </div>
        <span className="hidden rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/70 sm:inline-flex">
          {expanded ? "Collapse" : "Edit content"}
        </span>
      </button>

      {expanded && (
        <div className="space-y-8 border-t border-border px-6 pb-6 pt-6">
          {/* Resource file */}
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Resource file
            </p>
            <h5 className="mt-1 font-display text-base font-semibold leading-tight text-foreground">
              Module material
            </h5>

            <div className="mt-4">
              {module.file ? (
                <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/60 p-3">
                  <p className="break-all text-sm text-foreground">
                    {module.file.split("/").pop()}
                  </p>
                  <a
                    href={module.file}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs font-medium text-foreground transition-colors hover:text-accent"
                  >
                    View
                  </a>
                </div>
              ) : (
                <p className="mb-3 text-sm italic text-muted-foreground">
                  No file uploaded.
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="file"
                  onChange={(e) => setFileFile(e.target.files?.[0] || null)}
                  className="text-sm text-muted-foreground file:mr-4 file:cursor-pointer file:rounded-md file:border file:border-border file:bg-background file:px-4 file:py-2 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted"
                />
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={!fileFile || uploading}
                  variant="secondary"
                >
                  {uploading ? "Uploading…" : "Upload file"}
                </Button>
              </div>
            </div>
          </section>

          {/* Lessons */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Lessons
                </p>
                <h5 className="mt-1 font-display text-base font-semibold leading-tight text-foreground">
                  {module.lessons.length}{" "}
                  {module.lessons.length === 1 ? "lesson" : "lessons"}
                </h5>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAddLesson(!showAddLesson)}
              >
                {showAddLesson ? "Cancel" : "+ Add lesson"}
              </Button>
            </div>

            {showAddLesson && (
              <div className="mb-4 rounded-2xl border border-border bg-muted/40 p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  New lesson
                </p>
                <div className="space-y-3">
                  <input
                    placeholder="Lesson title"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    className={inputCls}
                  />
                  <div className="flex flex-wrap gap-3">
                    {(["READING", "VIDEO", "QUIZ"] as const).map((type) => {
                      const checked = newLessonType === type;
                      return (
                        <label
                          key={type}
                          className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                            checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:border-foreground/40"
                          }`}
                        >
                          <input
                            type="radio"
                            checked={checked}
                            onChange={() => setNewLessonType(type)}
                            className="sr-only"
                          />
                          {type.toLowerCase()}
                        </label>
                      );
                    })}
                  </div>

                  {newLessonType !== "QUIZ" && module.file && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          Start marker
                        </label>
                        <input
                          value={newLessonStart}
                          onChange={(e) => setNewLessonStart(e.target.value)}
                          placeholder="e.g. Page 1 or 00:00"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          End marker
                        </label>
                        <input
                          value={newLessonEnd}
                          onChange={(e) => setNewLessonEnd(e.target.value)}
                          placeholder="e.g. Page 5 or 10:00"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowAddLesson(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleAddLesson}
                      disabled={!newLessonTitle || addingLesson}
                    >
                      {addingLesson ? "Adding…" : "Add lesson"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
              {module.lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  fileUrl={module.file}
                />
              ))}
              {module.lessons.length === 0 && (
                <li className="bg-muted/40 p-6 text-center text-sm italic text-muted-foreground">
                  No lessons yet.
                </li>
              )}
            </ul>
          </section>
        </div>
      )}
    </article>
  );
}

function LessonRow({ lesson }: { lesson: Lesson; fileUrl: string | null }) {
  const [editingQuiz, setEditingQuiz] = useState(false);

  return (
    <li className="bg-card transition-colors hover:bg-[color:var(--primary)]/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            label={lesson.lesson_type}
            className="text-[10px] uppercase tracking-[0.14em]"
          />
          <span className="text-sm font-medium text-foreground">
            {lesson.title}
          </span>
          {(lesson.start_marker || lesson.end_marker) && (
            <span className="font-mono text-xs text-muted-foreground">
              {lesson.start_marker || "Start"} &rarr; {lesson.end_marker || "End"}
            </span>
          )}
        </div>

        {lesson.lesson_type === "QUIZ" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditingQuiz(!editingQuiz)}
          >
            {editingQuiz ? "Done" : "Manage questions"}
          </Button>
        )}
      </div>

      {editingQuiz && lesson.lesson_type === "QUIZ" && (
        <div className="border-t border-border bg-muted/40 p-5">
          <QuizBuilder lessonId={lesson.id} />
        </div>
      )}
    </li>
  );
}

function QuizBuilder({ lessonId }: { lessonId: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [text, setText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correct, setCorrect] = useState<"A" | "B" | "C" | "D">("A");
  const [adding, setAdding] = useState(false);

  const refreshQuestions = async () => {
    try {
      const res = await api.get<QuizQuestion[]>(
        `/quiz-questions/?lesson_id=${lessonId}`
      );
      setQuestions(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const handleAdd = async () => {
    if (!text || !optA || !optB) return;
    setAdding(true);
    try {
      await api.post("/quiz-questions/", {
        lesson: lessonId,
        text,
        option_a: optA,
        option_b: optB,
        option_c: optC,
        option_d: optD,
        correct_option: correct,
      });
      setText("");
      setOptA("");
      setOptB("");
      setOptC("");
      setOptD("");
      setCorrect("A");
      await refreshQuestions();
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await api.delete(`/quiz-questions/${id}/`);
      refreshQuestions();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Quiz questions
      </p>

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                <span className="mr-2 font-display tabular-nums text-muted-foreground">
                  Q{idx + 1}
                </span>
                {q.text}
              </p>
              <ul className="mt-2 ml-5 list-disc space-y-1 text-xs text-muted-foreground">
                <li
                  className={
                    q.correct_option === "A" ? "font-medium text-foreground" : ""
                  }
                >
                  A: {q.option_a}
                </li>
                <li
                  className={
                    q.correct_option === "B" ? "font-medium text-foreground" : ""
                  }
                >
                  B: {q.option_b}
                </li>
                {q.option_c && (
                  <li
                    className={
                      q.correct_option === "C"
                        ? "font-medium text-foreground"
                        : ""
                    }
                  >
                    C: {q.option_c}
                  </li>
                )}
                {q.option_d && (
                  <li
                    className={
                      q.correct_option === "D"
                        ? "font-medium text-foreground"
                        : ""
                    }
                  >
                    D: {q.option_d}
                  </li>
                )}
              </ul>
            </div>
            <button
              onClick={() => handleDelete(q.id)}
              className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-destructive transition-colors hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
        {questions.length === 0 && (
          <p className="text-xs italic text-muted-foreground">
            No questions added yet.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-3 font-display text-sm font-semibold text-foreground">
          Add new question
        </p>
        <textarea
          placeholder="Question text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className={`${inputCls} mb-3 resize-none`}
        />
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            placeholder="Option A"
            value={optA}
            onChange={(e) => setOptA(e.target.value)}
            className={inputCls}
          />
          <input
            placeholder="Option B"
            value={optB}
            onChange={(e) => setOptB(e.target.value)}
            className={inputCls}
          />
          <input
            placeholder="Option C (optional)"
            value={optC}
            onChange={(e) => setOptC(e.target.value)}
            className={inputCls}
          />
          <input
            placeholder="Option D (optional)"
            value={optD}
            onChange={(e) => setOptD(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-foreground">Correct option:</span>
          <select
            value={correct}
            onChange={(e) =>
              setCorrect(e.target.value as "A" | "B" | "C" | "D")
            }
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={adding || !text || !optA || !optB}
            variant="primary"
          >
            {adding ? "Adding…" : "Add question"}
          </Button>
        </div>
      </div>
    </div>
  );
}
