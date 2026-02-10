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

    if (loading) return <div>Loading course content...</div>;

    return (
        <div className="space-y-8">
            {/* Create Module Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Add Course Section</h3>
                <div className="flex gap-4">
                    <input
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        placeholder="Section Title (e.g. Chapter 1: Introduction)"
                        className="flex-1 border p-2 rounded"
                    />
                    <Button
                        onClick={handleCreateModule}
                        disabled={creatingModule}
                        variant="primary"
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
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        No modules yet. Start by creating a section above.
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
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 flex justify-between items-center border-b">
                <h4 className="font-bold text-lg text-gray-800">{module.title}</h4>
                <button onClick={() => setExpanded(!expanded)} className="text-sm text-blue-600 hover:underline">
                    {expanded ? "Collapse" : "Edit / Manage"}
                </button>
            </div>

            {expanded && (
                <div className="p-6 space-y-6">
                    {/* Resource Upload */}
                    <div className="bg-blue-50 p-4 rounded border border-blue-100">
                        <h5 className="font-semibold text-blue-900 mb-2">Module Resource File</h5>
                        {module.file ? (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-blue-800 break-all">
                                    Current File: <strong>{module.file.split('/').pop()}</strong>
                                </p>
                                <a href={module.file} target="_blank" className="text-xs bg-blue-200 px-2 py-1 rounded text-blue-800 hover:bg-blue-300">View</a>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic mb-2">No file uploaded (PDF, Video, etc).</p>
                        )}

                        <div className="mt-3 flex gap-2">
                            <input
                                type="file"
                                onChange={e => setFileFile(e.target.files?.[0] || null)}
                                className="text-sm"
                            />
                            <Button size="sm" onClick={handleUpload} disabled={!fileFile || uploading}>
                                {uploading ? "Uploading..." : "Upload New File"}
                            </Button>
                        </div>
                    </div>

                    {/* Lessons List */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h5 className="font-semibold text-gray-800">Lessons</h5>
                            <Button size="sm" variant="outline" onClick={() => setShowAddLesson(!showAddLesson)}>
                                + Add Lesson
                            </Button>
                        </div>

                        {showAddLesson && (
                            <div className="p-4 border rounded bg-gray-50 mb-4 animate-in fade-in slide-in-from-top-2">
                                <h6 className="text-sm font-bold mb-3">New Lesson Details</h6>
                                <div className="grid gap-3">
                                    <input
                                        placeholder="Lesson Title"
                                        value={newLessonTitle}
                                        onChange={e => setNewLessonTitle(e.target.value)}
                                        className="border p-2 rounded text-sm w-full"
                                    />
                                    <div className="flex gap-4">
                                        <label className="flex items-center text-sm gap-1">
                                            <input type="radio" checked={newLessonType === 'READING'} onChange={() => setNewLessonType('READING')} /> Reading
                                        </label>
                                        <label className="flex items-center text-sm gap-1">
                                            <input type="radio" checked={newLessonType === 'VIDEO'} onChange={() => setNewLessonType('VIDEO')} /> Video
                                        </label>
                                        <label className="flex items-center text-sm gap-1">
                                            <input type="radio" checked={newLessonType === 'QUIZ'} onChange={() => setNewLessonType('QUIZ')} /> Quiz
                                        </label>
                                    </div>

                                    {newLessonType !== 'QUIZ' && module.file && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-gray-500 block">Start Marker (e.g. Page 1 or 00:00)</label>
                                                <input value={newLessonStart} onChange={e => setNewLessonStart(e.target.value)} className="border p-1 w-full rounded text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 block">End Marker (e.g. Page 5 or 10:00)</label>
                                                <input value={newLessonEnd} onChange={e => setNewLessonEnd(e.target.value)} className="border p-1 w-full rounded text-sm" />
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

                        <ul className="divide-y border rounded">
                            {module.lessons.map(lesson => (
                                <LessonRow key={lesson.id} lesson={lesson} fileUrl={module.file} />
                            ))}
                            {module.lessons.length === 0 && (
                                <li className="p-4 text-center text-gray-500 text-sm">No lessons yet. Add one to dissect the module content.</li>
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
        <li className="bg-white">
            <div className="p-3 flex justify-between items-center hover:bg-gray-50">
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${lesson.lesson_type === 'QUIZ' ? 'bg-purple-100 text-purple-700' :
                        lesson.lesson_type === 'VIDEO' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {lesson.lesson_type}
                    </span>
                    <span className="font-medium">{lesson.title}</span>
                    {(lesson.start_marker || lesson.end_marker) && (
                        <span className="text-xs text-gray-500">
                            ({lesson.start_marker || 'Start'} - {lesson.end_marker || 'End'})
                        </span>
                    )}
                </div>

                {lesson.lesson_type === 'QUIZ' && (
                    <Button size="sm" variant="outline" onClick={() => setEditingQuiz(!editingQuiz)}>
                        {editingQuiz ? "Done" : "Manage Questions"}
                    </Button>
                )}
            </div>

            {editingQuiz && lesson.lesson_type === 'QUIZ' && (
                <div className="p-4 border-t bg-purple-50">
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
            <h6 className="font-bold text-purple-900">Quiz Questions</h6>

            <div className="space-y-2">
                {questions.map((q, idx) => (
                    <div key={q.id} className="bg-white p-3 rounded border flex justify-between items-start">
                        <div>
                            <p className="font-medium"><span className="text-purple-600 mr-2">Q{idx + 1}</span>{q.text}</p>
                            <ul className="ml-6 text-sm text-gray-600 mt-1 list-disc">
                                <li className={q.correct_option === 'A' ? "text-green-600 font-bold" : ""}>A: {q.option_a}</li>
                                <li className={q.correct_option === 'B' ? "text-green-600 font-bold" : ""}>B: {q.option_b}</li>
                                {q.option_c && <li className={q.correct_option === 'C' ? "text-green-600 font-bold" : ""}>C: {q.option_c}</li>}
                                {q.option_d && <li className={q.correct_option === 'D' ? "text-green-600 font-bold" : ""}>D: {q.option_d}</li>}
                            </ul>
                        </div>
                        <button onClick={() => handleDelete(q.id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                    </div>
                ))}
                {questions.length === 0 && <p className="text-gray-500 text-sm italic">No questions added yet.</p>}
            </div>

            <div className="bg-white p-4 rounded border border-purple-200">
                <p className="text-sm font-semibold mb-2">Add New Question</p>
                <textarea
                    placeholder="Question Text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full border p-2 rounded mb-2 text-sm"
                />
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <input placeholder="Option A" value={optA} onChange={e => setOptA(e.target.value)} className="border p-2 rounded text-sm" />
                    <input placeholder="Option B" value={optB} onChange={e => setOptB(e.target.value)} className="border p-2 rounded text-sm" />
                    <input placeholder="Option C (Optional)" value={optC} onChange={e => setOptC(e.target.value)} className="border p-2 rounded text-sm" />
                    <input placeholder="Option D (Optional)" value={optD} onChange={e => setOptD(e.target.value)} className="border p-2 rounded text-sm" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium">Correct Option:</span>
                    <select value={correct} onChange={e => setCorrect(e.target.value as any)} className="border rounded p-1 text-sm bg-white">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>
                <Button size="sm" onClick={handleAdd} disabled={adding || !text || !optA || !optB}>
                    {adding ? "Adding..." : "Add Question"}
                </Button>
            </div>
        </div>
    );
}
