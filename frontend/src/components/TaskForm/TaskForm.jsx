import { useRef, useState, useContext } from "react";
import { TaskContext } from "../../context/TaskContext";
import PriorityPicker from "./PriorityPicker.jsx";
import StatusPicker from "./StatusPicker.jsx";
import "./TaskForm.css";
import { createTask } from "../../api/tasks.js";
import VoiceRecorder from "../VoiceInput/VoiceRecorder.jsx";

export default function TaskFormModal({ status, onClose }) {
  const { setTasks } = useContext(TaskContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(status);

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

  // Save to backend
  const saved = await createTask(newTask);
console.log("📤 Sending to backend:", newTask); 
  // Update context state
  setTasks((prev) =>
    [...prev, saved].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    )
  );

  onClose();
}

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="modal-header">
          <h3>New issue</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="issue-form">

          {/* TITLE */}
          <input
            className="issue-title"
            placeholder="Issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* DESCRIPTION */}
          <textarea
            className="issue-desc"
            placeholder="Add description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="voice-box">
  <VoiceRecorder
    onTranscription={(text) => setDescription(text)}
  />
</div>


          {/* FILTER TAG BUTTONS */}
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
      </div>

      {/* PRIORITY DROPDOWN */}
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

      {/* STATUS DROPDOWN */}
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
