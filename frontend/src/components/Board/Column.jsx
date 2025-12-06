import { useState, useContext, useEffect, useRef } from "react";
import TaskCard from "./TaskCard";
import TaskFormModal from "../TaskForm/TaskForm.jsx";
import { TaskContext } from "../../context/TaskContext";
import { fetchTasksQuery, updateTask } from "../../api/tasks";
import "./Column.css";

export default function Column({ title }) {

  const [open, setOpen] = useState(false);
  const { setTasks } = useContext(TaskContext);

  const [items, setItems] = useState([]);  // tasks for this column
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false); // ← IMPORTANT
const didMount = useRef(false);

  const scrollRef = useRef(null);

  // Load first page
  
useEffect(() => {
  if (!didMount.current) {
    didMount.current = true;
    loadMore();       // runs only ONCE even in StrictMode
  }
}, []);

  async function loadMore() {
    if (loading || !hasMore) return; 
setLoading(true);
    const newData = await fetchTasksQuery({
      status: title,
      page,
      pageSize: 15,
      sortBy: "updated_at",
      sortDir: "desc",
    });

    if (newData.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    setItems(prev => {
  const merged = [...prev, ...newData];
  const unique = Array.from(new Map(merged.map(t => [t.id, t])).values());
  return unique;
});

    setPage(prev => prev + 1);
  }

  function handleScroll(e) {
    const el = e.target;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      loadMore();
    }
  }

  // DRAG + DROP behavior (unchanged)
  function handleDrop(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    // Update UI globally
    setTasks(prev =>
      prev.map(t =>
        t.id == taskId ? { ...t, status: title } : t
      )
    );

    // Backend update
    updateTask(taskId, { status: title });
  }

  const iconMap = {
    "To Do": "⭕",
    "In Progress": "🟡",
    "Done": "🟢",
  };

  return (
    <div
      className="column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <span className="column-icon">{iconMap[title]}</span>
        <h2>{title}</h2>
        <span className="column-count">{items.length}</span>
      </div>

      <div
        className="column-tasks"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {items.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <button className="add-task-btn" onClick={() => setOpen(true)}>
        +
      </button>

      {open && (
        <TaskFormModal
          status={title}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
