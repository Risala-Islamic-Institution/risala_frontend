"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    "w-full px-4 py-2.5 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent";

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
                <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card className="p-6">
                <h3 className="font-serif text-xl text-foreground mb-4">Add a section</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        placeholder="Section title (e.g. Chapter 1: Introduction)"
                        className={`${inputCls} flex-1`}
                    />
                    <Button onClick={handleCreateModule} disabled={creatingModule} variant="primary">
                        {creatingModule ? "Creating..." : "Create section"}
                    </Button>
                </div>
            </Card>

            <div className="space-y-4">
                {modules.map((mod) => (
                    <ModuleEditor key={mod.id} module={mod} onRefresh={refreshModules} />
                ))}
                {modules.length === 0 && (
                    <Card className="p-12 text-center border-dashed">
                        <p className="font-serif text-lg text-foreground">No modules yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Start by creating a section above.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
}

function ModuleEditor({ module, onRefresh }: { module: Module; onRefresh: () => void }) {
    const [expanded, setExpanded] = useState(false);
    const [fileFile, setFileFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const [showAddLesson, setShowAddLesson] = useState(false);
    const [newLessonType, setNewLessonType] = useState<"VIDEO" | "READING" | "QUIZ">("READING");
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
        <Card className="overflow-hidden">
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <span className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-sm font-serif text-muted-foreground bg-background">
                        {String(module.order_index + 1).padStart(2, "0")}
                    </span>
                    <h4 className="font-serif text-lg text-foreground">{module.title}</h4>
                </div>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {expanded ? "Collapse" : "Edit content"}
                </span>
            </button>

            {expanded && (
                <div className="p-6 pt-0 space-y-8 border-t border-border">
                    <div className="pt-6">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                            Module resource file
                        </p>
                        {module.file ? (
                            <div className="flex items-center justify-between gap-3 p-3 rounded-md border border-border bg-muted mb-3">
                                <p className="text-sm text-foreground break-all">
                                    {module.file.split("/").pop()}
                                </p>
                                <a
                                    href={module.file}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-medium text-foreground hover:text-accent transition-colors shrink-0"
                                >
                                    View
                                </a>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic mb-3">
                                No file uploaded.
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <input
                                type="file"
                                onChange={(e) => setFileFile(e.target.files?.[0] || null)}
                                className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-border file:text-xs file:font-medium file:bg-background file:text-foreground hover:file:bg-muted file:cursor-pointer"
                            />
                            <Button
                                size="sm"
                                onClick={handleUpload}
                                disabled={!fileFile || uploading}
                                variant="secondary"
                            >
                                {uploading ? "Uploading..." : "Upload file"}
                            </Button>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                        <div className="flex justify-between items-center mt-6 mb-4">
                            <h5 className="font-serif text-lg text-foreground">Lessons</h5>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowAddLesson(!showAddLesson)}
                            >
                                {showAddLesson ? "Cancel" : "+ Add lesson"}
                            </Button>
                        </div>

                        {showAddLesson && (
                            <div className="p-5 border border-border rounded-md bg-muted mb-4">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                                    New lesson
                                </p>
                                <div className="space-y-3">
                                    <input
                                        placeholder="Lesson title"
                                        value={newLessonTitle}
                                        onChange={(e) => setNewLessonTitle(e.target.value)}
                                        className={inputCls}
                                    />
                                    <div className="flex flex-wrap gap-4">
                                        {(["READING", "VIDEO", "QUIZ"] as const).map((type) => (
                                            <label
                                                key={type}
                                                className="flex items-center text-sm gap-2 text-foreground cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={newLessonType === type}
                                                    onChange={() => setNewLessonType(type)}
                                                    className="accent-foreground"
                                                />
                                                <span className="capitalize">{type.toLowerCase()}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {newLessonType !== "QUIZ" && module.file && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-muted-foreground block mb-1">
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
                                                <label className="text-xs text-muted-foreground block mb-1">
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
                                            {addingLesson ? "Adding..." : "Add lesson"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <ul className="divide-y divide-border border border-border rounded-md overflow-hidden">
                            {module.lessons.map((lesson) => (
                                <LessonRow key={lesson.id} lesson={lesson} fileUrl={module.file} />
                            ))}
                            {module.lessons.length === 0 && (
                                <li className="p-6 text-center text-sm text-muted-foreground italic bg-muted">
                                    No lessons yet.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </Card>
    );
}

function LessonRow({ lesson }: { lesson: Lesson; fileUrl: string | null }) {
    const [editingQuiz, setEditingQuiz] = useState(false);

    return (
        <li className="bg-card transition-colors hover:bg-muted/50">
            <div className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                        {lesson.lesson_type}
                    </Badge>
                    <span className="font-medium text-foreground text-sm">{lesson.title}</span>
                    {(lesson.start_marker || lesson.end_marker) && (
                        <span className="text-xs text-muted-foreground font-mono">
                            {lesson.start_marker || "Start"} &rarr; {lesson.end_marker || "End"}
                        </span>
                    )}
                </div>

                {lesson.lesson_type === "QUIZ" && (
                    <Button size="sm" variant="ghost" onClick={() => setEditingQuiz(!editingQuiz)}>
                        {editingQuiz ? "Done" : "Manage questions"}
                    </Button>
                )}
            </div>

            {editingQuiz && lesson.lesson_type === "QUIZ" && (
                <div className="p-5 border-t border-border bg-muted">
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
            const res = await api.get<QuizQuestion[]>(`/quiz-questions/?lesson_id=${lessonId}`);
            setQuestions(res);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        refreshQuestions();
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
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Quiz questions</p>

            <div className="space-y-3">
                {questions.map((q, idx) => (
                    <div
                        key={q.id}
                        className="bg-card p-4 rounded-md border border-border flex justify-between items-start gap-3"
                    >
                        <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">
                                <span className="text-muted-foreground mr-2">Q{idx + 1}</span>
                                {q.text}
                            </p>
                            <ul className="ml-5 text-xs text-muted-foreground mt-2 list-disc space-y-1">
                                <li className={q.correct_option === "A" ? "text-foreground font-medium" : ""}>
                                    A: {q.option_a}
                                </li>
                                <li className={q.correct_option === "B" ? "text-foreground font-medium" : ""}>
                                    B: {q.option_b}
                                </li>
                                {q.option_c && (
                                    <li
                                        className={
                                            q.correct_option === "C" ? "text-foreground font-medium" : ""
                                        }
                                    >
                                        C: {q.option_c}
                                    </li>
                                )}
                                {q.option_d && (
                                    <li
                                        className={
                                            q.correct_option === "D" ? "text-foreground font-medium" : ""
                                        }
                                    >
                                        D: {q.option_d}
                                    </li>
                                )}
                            </ul>
                        </div>
                        <button
                            onClick={() => handleDelete(q.id)}
                            className="text-xs uppercase tracking-wide text-destructive hover:underline shrink-0"
                        >
                            Delete
                        </button>
                    </div>
                ))}
                {questions.length === 0 && (
                    <p className="text-muted-foreground text-xs italic">No questions added yet.</p>
                )}
            </div>

            <Card className="p-5">
                <p className="text-sm font-medium text-foreground mb-3">Add new question</p>
                <textarea
                    placeholder="Question text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={2}
                    className={`${inputCls} resize-none mb-3`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input placeholder="Option A" value={optA} onChange={(e) => setOptA(e.target.value)} className={inputCls} />
                    <input placeholder="Option B" value={optB} onChange={(e) => setOptB(e.target.value)} className={inputCls} />
                    <input placeholder="Option C (optional)" value={optC} onChange={(e) => setOptC(e.target.value)} className={inputCls} />
                    <input placeholder="Option D (optional)" value={optD} onChange={(e) => setOptD(e.target.value)} className={inputCls} />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm text-foreground">Correct option:</span>
                    <select
                        value={correct}
                        onChange={(e) => setCorrect(e.target.value as "A" | "B" | "C" | "D")}
                        className="border border-border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                        {adding ? "Adding..." : "Add question"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
