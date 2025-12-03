import Column from "./Column";
import "./Board.css";

export default function Board({ tasks }) {
  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div className="board">
      {columns.map((col) => (
        <Column
          key={col}
          title={col}
          tasks={tasks.filter((t) => t.status === col)}
        />
      ))}
    </div>
  );
}
