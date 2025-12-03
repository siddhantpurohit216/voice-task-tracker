import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import Board from "../components/Board/Board.jsx";
import "./BoardPage.css";

export default function BoardPage() {
  const { tasks } = useContext(TaskContext);

  return (
    <div className="board-page">
      <header className="board-header">
        <h1>Task Tracker</h1>
        <button className="add-btn">+ Add Task</button>
      </header>

      <Board tasks={tasks} />
    </div>
  );
}
