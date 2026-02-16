"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";

// -- Types --
interface Lesson {
    id: string;
    title: string;
    lesson_type: 'VIDEO' | 'READING' | 'QUIZ';
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
    correct_option: 'A' | 'B' | 'C' | 'D';
}

// -- Main Component --
export default function ModuleManager({ courseId }: { courseId: string }) {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [creatingModule, setCreatingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");

    // Helpers to refresh data
    const refreshModules = async () => {
        try {
            const res = await api.get<Module[]>(`/modules/?course_id=${courseId}`);
            // Sort by order_index
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
                order_index: modules.length // Append to end
            });
            setNewModuleTitle("");
            await refreshModules();
        } catch (error) {
            console.error(error);
            alert("Failed to create module.");
        } finally {
            setCreatingModule(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Create Module Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral/20">
                <h3 className="text-secondary font-bold text-lg mb-4">Add Course Section</h3>
                <div className="flex gap-4">
                    <input
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        placeholder="Section Title (e.g. Chapter 1: Introduction)"
                        className="flex-1 border border-neutral/30 p-3 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                    <Button
                        onClick={handleCreateModule}
                        disabled={creatingModule}
                        variant="primary"
                        className="rounded-xl shadow-lg shadow-primary/20"
                    >
                        {creatingModule ? "Creating..." : "Create Section"}
                    </Button>
                </div>
            </div>

            {/* Modules List */}
            <div className="space-y-6">
                {modules.map((mod) => (
                    <ModuleEditor key={mod.id} module={mod} onRefresh={refreshModules} />
                ))}
                {modules.length === 0 && (
                    <div className="text-center py-12 bg-neutral/5 rounded-3xl border border-dashed border-neutral/20">
                        <p className="text-secondary/40 font-medium">No modules yet</p>
                        <p className="text-sm text-secondary/30 mt-1">Start by creating a section above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// -- Sub-Component: Module Editor --
function ModuleEditor({ module, onRefresh }: { module: Module; onRefresh: () => void }) {
    const [expanded, setExpanded] = useState(false);
    const [fileFile, setFileFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Lesson Creation State
    const [showAddLesson, setShowAddLesson] = useState(false);
    const [newLessonType, setNewLessonType] = useState<'VIDEO' | 'READING' | 'QUIZ'>('READING');
    const [newLessonTitle, setNewLessonTitle] = useState("");
    const [newLessonStart, setNewLessonStart] = useState(""); // For dissection
    const [newLessonEnd, setNewLessonEnd] = useState(""); // For dissection
    const [addingLesson, setAddingLesson] = useState(false);

    const handleUpload = async () => {
        if (!fileFile) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", fileFile);
        try {
            await api.put(`/modules/${module.id}/`, formData);
            alert("File uploaded successfully.");
            setFileFile(null);
            onRefresh();
        } catch (e) {
            console.error(e);
            alert("Upload failed.");
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
                order: module.lessons.length
            });
            setShowAddLesson(false);
            setNewLessonTitle("");
            setNewLessonStart("");
            setNewLessonEnd("");
            onRefresh();
        } catch (e) {
            console.error(e);
            alert("Failed to add lesson.");
        } finally {
            setAddingLesson(false);
        }
    };

    return (
        <div className="bg-white border border-neutral/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="p-4 bg-neutral/5 flex justify-between items-center border-b border-neutral/10 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white border border-neutral/10 flex items-center justify-center text-sm font-bold text-secondary/60">
                        {module.order_index + 1}
                    </span>
                    <h4 className="font-bold text-lg text-secondary">{module.title}</h4>
                </div>
                <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                    {expanded ? "Collapse" : "Edit Content"}
                </button>
            </div>

            {expanded && (
                <div className="p-6 space-y-6 bg-white animate-in slide-in-from-top-2 duration-300">
                    {/* Resource Upload */}
                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                        <h5 className="font-bold text-primary text-sm uppercase tracking-wider mb-3">Module Resource File</h5>
                        {module.file ? (
                            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-primary/10 mb-3">
                                <p className="text-sm text-secondary font-medium break-all flex items-center gap-2">
                                    <span className="text-primary">📄</span>
                                    {module.file.split('/').pop()}
                                </p>
                                <a href={module.file} target="_blank" className="text-xs bg-primary/10 px-3 py-1.5 rounded-lg text-primary font-bold hover:bg-primary/20 transition-colors">View</a>
                            </div>
                        ) : (
                            <p className="text-sm text-secondary/40 italic mb-3 pl-1">No file uploaded (PDF, Video, etc).</p>
                        )}

                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                onChange={e => setFileFile(e.target.files?.[0] || null)}
                                className="text-sm text-secondary/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            <Button size="sm" onClick={handleUpload} disabled={!fileFile || uploading} variant="outline" className="rounded-xl">
                                {uploading ? "Uploading..." : "Upload New File"}
                            </Button>
                        </div>
                    </div>

                    {/* Lessons List */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="font-bold text-secondary text-lg">Lessons</h5>
                            <Button size="sm" variant="outline" onClick={() => setShowAddLesson(!showAddLesson)} className="rounded-xl">
                                + Add Lesson
                            </Button>
                        </div>

                        {showAddLesson && (
                            <div className="p-5 border border-neutral/20 rounded-2xl bg-neutral/5 mb-4 animate-in fade-in slide-in-from-top-2">
                                <h6 className="text-sm font-bold text-secondary mb-3">New Lesson Details</h6>
                                <div className="grid gap-3">
                                    <input
                                        placeholder="Lesson Title"
                                        value={newLessonTitle}
                                        onChange={e => setNewLessonTitle(e.target.value)}
                                        className="border border-neutral/30 p-3 rounded-xl text-sm w-full outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                    <div className="flex gap-4 p-1">
                                        <label className="flex items-center text-sm gap-2 text-secondary cursor-pointer">
                                            <input type="radio" checked={newLessonType === 'READING'} onChange={() => setNewLessonType('READING')} className="accent-primary" /> Reading
                                        </label>
                                        <label className="flex items-center text-sm gap-2 text-secondary cursor-pointer">
                                            <input type="radio" checked={newLessonType === 'VIDEO'} onChange={() => setNewLessonType('VIDEO')} className="accent-primary" /> Video
                                        </label>
                                        <label className="flex items-center text-sm gap-2 text-secondary cursor-pointer">
                                            <input type="radio" checked={newLessonType === 'QUIZ'} onChange={() => setNewLessonType('QUIZ')} className="accent-primary" /> Quiz
                                        </label>
                                    </div>

                                    {newLessonType !== 'QUIZ' && module.file && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-bold text-secondary/40 block mb-1">Start Marker (e.g. Page 1 or 00:00)</label>
                                                <input value={newLessonStart} onChange={e => setNewLessonStart(e.target.value)} className="border border-neutral/30 p-2 w-full rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-secondary/40 block mb-1">End Marker (e.g. Page 5 or 10:00)</label>
                                                <input value={newLessonEnd} onChange={e => setNewLessonEnd(e.target.value)} className="border border-neutral/30 p-2 w-full rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 mt-2">
                                        <Button size="sm" variant="secondary" onClick={() => setShowAddLesson(false)}>Cancel</Button>
                                        <Button size="sm" variant="primary" onClick={handleAddLesson} disabled={!newLessonTitle || addingLesson}>
                                            {addingLesson ? "Adding..." : "Add Lesson"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <ul className="divide-y divide-neutral/10 border border-neutral/20 rounded-2xl overflow-hidden">
                            {module.lessons.map(lesson => (
                                <LessonRow key={lesson.id} lesson={lesson} fileUrl={module.file} />
                            ))}
                            {module.lessons.length === 0 && (
                                <li className="p-6 text-center text-secondary/40 text-sm italic bg-neutral/5">
                                    No lessons yet. Add one to dissect the module content.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

// -- Sub-Component: Lesson Row & Quiz Builder --
function LessonRow({ lesson, fileUrl }: { lesson: Lesson; fileUrl: string | null }) {
    const [editingQuiz, setEditingQuiz] = useState(false);

    return (
        <li className="bg-white group transition-colors hover:bg-neutral/5">
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${lesson.lesson_type === 'QUIZ' ? 'bg-accent/15 text-accent' :
                            lesson.lesson_type === 'VIDEO' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
                        }`}>
                        {lesson.lesson_type}
                    </span>
                    <span className="font-bold text-secondary text-sm">{lesson.title}</span>
                    {(lesson.start_marker || lesson.end_marker) && (
                        <span className="text-xs text-secondary/40 font-mono bg-neutral/10 px-2 py-0.5 rounded-md">
                            {lesson.start_marker || 'Start'} - {lesson.end_marker || 'End'}
                        </span>
                    )}
                </div>

                {lesson.lesson_type === 'QUIZ' && (
                    <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs" onClick={() => setEditingQuiz(!editingQuiz)}>
                        {editingQuiz ? "Done" : "Manage Questions"}
                    </Button>
                )}
            </div>

            {editingQuiz && lesson.lesson_type === 'QUIZ' && (
                <div className="p-5 border-t border-neutral/10 bg-accent/5">
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
    const [correct, setCorrect] = useState<'A' | 'B' | 'C' | 'D'>('A');
    const [adding, setAdding] = useState(false);

    const refreshQuestions = async () => {
        try {
            const res = await api.get<QuizQuestion[]>(`/quiz-questions/?lesson_id=${lessonId}`);
            setQuestions(res);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { refreshQuestions(); }, [lessonId]);

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
                correct_option: correct
            });
            setText(""); setOptA(""); setOptB(""); setOptC(""); setOptD(""); setCorrect('A');
            await refreshQuestions();
        } catch (e) {
            console.error(e);
            alert("Failed to add question.");
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete question?")) return;
        try {
            await api.delete(`/quiz-questions/${id}/`);
            refreshQuestions();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-4">
            <h6 className="font-bold text-accent text-sm uppercase tracking-wider">Quiz Questions</h6>

            <div className="space-y-3">
                {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-4 rounded-xl border border-neutral/20 shadow-sm flex justify-between items-start">
                        <div>
                            <p className="font-bold text-secondary text-sm"><span className="text-accent mr-2">Q{idx + 1}</span>{q.text}</p>
                            <ul className="ml-6 text-xs text-secondary/60 mt-2 list-disc space-y-1">
                                <li className={q.correct_option === 'A' ? "text-primary font-bold" : ""}>A: {q.option_a}</li>
                                <li className={q.correct_option === 'B' ? "text-primary font-bold" : ""}>B: {q.option_b}</li>
                                {q.option_c && <li className={q.correct_option === 'C' ? "text-primary font-bold" : ""}>C: {q.option_c}</li>}
                                {q.option_d && <li className={q.correct_option === 'D' ? "text-primary font-bold" : ""}>D: {q.option_d}</li>}
                            </ul>
                        </div>
                        <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:text-red-700 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-2 py-1 rounded">Delete</button>
                    </div>
                ))}
                {questions.length === 0 && <p className="text-secondary/30 text-xs italic">No questions added yet.</p>}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-accent/20 shadow-lg shadow-accent/5">
                <p className="text-sm font-bold text-secondary mb-3">Add New Question</p>
                <textarea
                    placeholder="Question Text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full border border-neutral/30 p-3 rounded-xl mb-3 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                />
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <input placeholder="Option A" value={optA} onChange={e => setOptA(e.target.value)} className="border border-neutral/30 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/20" />
                    <input placeholder="Option B" value={optB} onChange={e => setOptB(e.target.value)} className="border border-neutral/30 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/20" />
                    <input placeholder="Option C (Optional)" value={optC} onChange={e => setOptC(e.target.value)} className="border border-neutral/30 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/20" />
                    <input placeholder="Option D (Optional)" value={optD} onChange={e => setOptD(e.target.value)} className="border border-neutral/30 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent/20" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-bold text-secondary">Correct Option:</span>
                    <select value={correct} onChange={e => setCorrect(e.target.value as any)} className="border border-neutral/30 rounded-lg p-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-accent/20">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>
                <Button size="sm" onClick={handleAdd} disabled={adding || !text || !optA || !optB} variant="accent" className="w-full rounded-xl">
                    {adding ? "Adding..." : "Add Question"}
                </Button>
            </div>
        </div>
    );
}
