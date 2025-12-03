import TaskCard from "./TaskCard";
import "./Column.css";

export default function Column({ title, tasks }) {
  return (
    <div className="column">
      <h2>{title}</h2>

      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
