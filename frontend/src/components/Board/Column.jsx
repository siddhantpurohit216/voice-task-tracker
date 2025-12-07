import { useState, useContext, useEffect, useRef } from "react";
import TaskCard from "./TaskCard";
import TaskFormModal from "../TaskForm/TaskForm.jsx";
import { TaskContext } from "../../context/TaskContext";
import { fetchTasksQuery, updateTask } from "../../api/tasks";
import "./Column.css";


export default function Column({ title }) {

  const [open, setOpen] = useState(false);
  const { setTasks } = useContext(TaskContext);
  const { taskEvents, setTaskEvents } = useContext(TaskContext);

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const didMount = useRef(false);

  const scrollRef = useRef(null);
  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    if (taskEvents.created && taskEvents.created.status === title) {
      setItems(prev => [taskEvents.created, ...prev]);
    }
  }, [taskEvents.created]);

  useEffect(() => {
    if (!taskEvents.updated) return;

    const t = taskEvents.updated;


    if (t.status === title) {
      setItems(prev =>
        prev.map(i => (i.id === t.id ? t : i))
      );
    }
  }, [taskEvents.updated]);

  useEffect(() => {
    if (!taskEvents.moved) return;

    const t = taskEvents.moved;

    if (t.status === title) {

      setItems(prev => [t, ...prev]);
    } else {

      setItems(prev => prev.filter(i => i.id !== t.id));
    }
  }, [taskEvents.moved]);

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
      return Array.from(new Map(merged.map(t => [t.id, t])).values());
    });


    setTasks(prev => {
      const merged = [...prev, ...newData];
      return Array.from(new Map(merged.map(t => [t.id, t])).values());
    });

    setPage(prev => prev + 1);
  }

  function handleScroll(e) {
    const el = e.target;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      loadMore();
    }
  }

  function handleDrop(e) {
    e.preventDefault();

    const data = e.dataTransfer.getData("task");
    if (!data) return;

    const task = JSON.parse(data);
    if (task.status === title) return;
    const updatedTask = {
      ...task,
      status: title
    };

    setTaskEvents((ev) => ({ ...ev, moved: updatedTask }));


    updateTask(task.id, {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: title,
      due_date: task.due_date
    });

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
