import { useRef, useState, useContext } from "react";
import { TaskContext } from "../../context/TaskContext";
import PriorityPicker from "./PriorityPicker.jsx";
import StatusPicker from "./StatusPicker.jsx";
import "./TaskForm.css";
import { createTask, updateTask } from "../../api/tasks.js";
import VoiceRecorder from "../VoiceInput/VoiceRecorder.jsx";

import { parseVoiceCreate, parseVoiceEdit } from "../../api/ai.js";



export default function TaskFormModal({ status, onClose, existingTask, mode = "create" }) {
    const { setTasks } = useContext(TaskContext);

    const [title, setTitle] = useState(existingTask?.title || "");
    const [priority, setPriority] = useState(existingTask?.priority || "Low");
    const [dueDate, setDueDate] = useState(existingTask?.due_date || "");
    const [description, setDescription] = useState(existingTask?.description || "");

    const [selectedStatus, setSelectedStatus] = useState(status);

    const [liveTranscript, setLiveTranscript] = useState("");

    const [showPriority, setShowPriority] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    const priorityBtnRef = useRef(null);
    const statusBtnRef = useRef(null);

    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            title,
            description,
            status: selectedStatus,
            priority,
            due_date: dueDate || null,
        };

        let saved;

        if (mode === "edit") {
            saved = await updateTask(existingTask.id, payload);

            // Update TaskContext
            setTasks((prev) =>
                prev.map((t) => (t.id === saved.id ? saved : t))
            );
        }
        else {
            saved = await createTask(payload);

            setTasks((prev) =>
                [...prev, saved].sort(
                    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                )
            );
        }

        onClose();
    }

    async function handleAIParsing(text) {
        try {
            let ai;

            if (mode === "create") {
                // FULL extraction
                ai = await parseVoiceCreate(text);

                setTitle(ai.title || "");
                setDescription(ai.description || "");
                setPriority(ai.priority || "Medium");
                setSelectedStatus(ai.status || "To Do");
                setDueDate(ai.due_date || "");
            }

            if (mode === "edit") {
                // PARTIAL extraction
                ai = await parseVoiceEdit(text, existingTask);

                if (ai.title) setTitle(ai.title);
                if (ai.description) setDescription(ai.description);
                if (ai.priority) setPriority(ai.priority);
                if (ai.status) setSelectedStatus(ai.status);
                if (ai.due_date) setDueDate(ai.due_date);
            }

        } catch (err) {
            console.error("AI parsing error:", err);
            alert("AI parsing failed");
        }
    }



    function simulateAIParsing(finalTranscript) {
        return {
            title: "Dummy title from AI",
            description: finalTranscript,
            priority: "High",
            status: "In Progress",
            due_date: "2025-12-10",
        };
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="issue-modal" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <h3>New issue</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="issue-form">

                    <input
                        className="issue-title"
                        placeholder="Issue title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <textarea
                        className="issue-desc"
                        placeholder="Add description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />



                    <div className="issue-tags">
                        <button
                            ref={priorityBtnRef}
                            type="button"
                            className="tag-btn"
                            onClick={() => {
                                setShowPriority(true);
                                setShowStatus(false);
                            }}
                        >
                            Priority: {priority}
                        </button>

                        <button
                            ref={statusBtnRef}
                            type="button"
                            className="tag-btn"
                            onClick={() => {
                                setShowStatus(true);
                                setShowPriority(false);
                            }}
                        >
                            Status: {selectedStatus}
                        </button>

                        <input
                            type="date"
                            className="tag-date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="modal-footer">
                        <button className="create-btn">{mode === "edit" ? "Update Issue" : "Create Issue"}</button>
                    </div>
                </form>


                <div className="live-box">
                    <label>Live Transcription:</label>
                    <div className="live-text">
                        {liveTranscript || "Start speaking…"}
                    </div>

                    <div className="voice-box" onClick={(e) => e.stopPropagation()}>

                        <VoiceRecorder
                            onTranscription={async (text, isFinal) => {
                                if (!isFinal) {
                                    setLiveTranscript(text);
                                    return;
                                }

                                setLiveTranscript(text);

                                handleAIParsing(text);
                            }}
                        />


                    </div>


                </div>
            </div>

            {showPriority && (
                <PriorityPicker
                    anchorRef={priorityBtnRef}
                    selected={priority}
                    onSelect={(p) => {
                        setPriority(p);
                        setShowPriority(false);
                    }}
                    onClose={() => setShowPriority(false)}
                />
            )}

            {showStatus && (
                <StatusPicker
                    anchorRef={statusBtnRef}
                    selected={selectedStatus}
                    onSelect={(s) => {
                        setSelectedStatus(s);
                        setShowStatus(false);
                    }}
                    onClose={() => setShowStatus(false)}
                />
            )}
        </div>
    );
}
