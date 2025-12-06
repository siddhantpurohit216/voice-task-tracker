import Column from "./Column";
import "./Board.css";

export default function Board() {
  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div className="board">
      {columns.map((col) => (
        <Column
          key={col}
          title={col}
        />
      ))}
    </div>
  );
}
