import "./TaskCard.css";

export default function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      {task.due_date && <p className="due">Due: {task.due_date}</p>}
      <span className={`priority ${task.priority.toLowerCase()}`}>
        {task.priority}
      </span>
    </div>
  );
}
