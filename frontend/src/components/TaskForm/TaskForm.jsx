import { useRef, useState, useContext } from "react";
import { TaskContext } from "../../context/TaskContext";
import PriorityPicker from "./PriorityPicker.jsx";
import StatusPicker from "./StatusPicker.jsx";
import "./TaskForm.css";
import { createTask } from "../../api/tasks.js";
import VoiceRecorder from "../VoiceInput/VoiceRecorder.jsx";

import { parseVoice } from "../../api/ai.js";


export default function TaskFormModal({ status, onClose }) {
    const { setTasks } = useContext(TaskContext);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(status);

    const [liveTranscript, setLiveTranscript] = useState(""); 

    const [showPriority, setShowPriority] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    const priorityBtnRef = useRef(null);
    const statusBtnRef = useRef(null);

    async function handleSubmit(e) {
        e.preventDefault();

        const newTask = {
            title,
            description,
            status: selectedStatus,
            priority,
            due_date: dueDate,
        };

        const saved = await createTask(newTask);

        setTasks((prev) =>
            [...prev, saved].sort(
                (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
            )
        );

        onClose();
    }

    async function handleAIParsing(text) {
  try {
    const ai = await parseVoice(text);

    setTitle(ai.title || "");
    setDescription(ai.description || "");
    setPriority(ai.priority || "Medium");
    setSelectedStatus(ai.status || "To Do");
    setDueDate(ai.due_date || "");

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
                        <button className="create-btn">Create issue</button>
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

    // ⭐ Now simply call your helper!
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
