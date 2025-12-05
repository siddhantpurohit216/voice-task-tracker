import TaskFormModal from "../TaskForm/TaskForm.jsx";
import { useState } from "react";
import "./ListView.css";

export default function ListView({ tasks }) {
    const [editTask, setEditTask] = useState(null);

    function getDate(dateString) {
        if (!dateString) return "-";

        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        });
    }

    return (
        <div className="list-container">
            <div className="list-scroll">
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Due</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((t) => (
                            <tr key={t.id}>
                                <td>{t.title}</td>
                                <td className={`pri pri-${t.priority.toLowerCase()}`}>
                                    {t.priority}
                                </td>
                                <td>{t.status}</td>
                                <td>{getDate(t.due_date)}</td>

                                <td className="actions">
                                    <button onClick={() => setEditTask(t)}>✏️</button>
                                    <button className="del">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {editTask && (
                <TaskFormModal
                    mode="edit"
                    existingTask={editTask}
                    onClose={() => setEditTask(null)}
                />
            )}
        </div>
    );
}
