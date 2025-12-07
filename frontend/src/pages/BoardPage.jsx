import { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import Board from "../components/Board/Board.jsx";
import ListView from "../components/ListView/ListView.jsx";
import "./BoardPage.css";
import useDebounce from "../hooks/useDebounce";



export default function BoardPage() {
  const { tasks } = useContext(TaskContext);

  const [view, setView] = useState("board"); // board | list
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const debouncedSearch = useDebounce(search, 400);


  return (
    <div className="board-page">

      {/* HEADER */}
      <header className="board-header">
        <h1>Task Tracker</h1>

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={view === "board" ? "active" : ""}
            onClick={() => setView("board")}
          >
            📌 Board View
          </button>

          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            📄 List View
          </button>
        </div>
      </header>


      {view === "list" && (
        <div className="filters">
          <input
            className="search-bar"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="">Priority (All)</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select
            className="filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Status (All)</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      )}


      {/* ACTUAL VIEW */}
      {view === "board" ? (
        <Board />
      ) : (
        <ListView
          search={search}
          filterPriority={filterPriority}
          filterStatus={filterStatus}
        />
      )}

    </div>
  );
}
