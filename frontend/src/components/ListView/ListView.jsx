import { useState, useEffect, useLayoutEffect, useRef, useContext } from "react";
import TaskFormModal from "../TaskForm/TaskForm.jsx";
import { fetchTasksQuery } from "../../api/tasks";
import "./ListView.css";
import { TaskContext } from "../../context/TaskContext";


export default function ListView({ search, filterPriority, filterStatus }) {
    const { taskEvents } = useContext(TaskContext);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [editTask, setEditTask] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const didMount = useRef(false);
    const firstReset = useRef(false);
    const resetLock = useRef(false);



    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            loadMore();
        }
    }, []);


    useEffect(() => {
        if (!taskEvents.created) return;

        setData(prev => [taskEvents.created, ...prev]);
    }, [taskEvents.created]);

    useEffect(() => {
        if (!taskEvents.moved) return;

        const t = taskEvents.moved;

        setData(prev =>
            prev.map(i => (i.id === t.id ? t : i))
        );
    }, [taskEvents.moved]);


    useEffect(() => {
        if (!didMount.current) return;
        resetAndLoad();
    }, [search, filterPriority, filterStatus]);

    function resetAndLoad() {
        if (resetLock.current) return;  // prevent duplicate resets
        resetLock.current = true;

        firstReset.current = true;
        setPage(1);
        setData([]);
        setHasMore(true);
    }

    useLayoutEffect(() => {
        if (!firstReset.current) return;

        firstReset.current = false;  
        loadMore(true);             
    }, [data]);




    async function loadMore(isFirst = false) {
    if (!hasMore || loading) return;

    setLoading(true);

    const rows = await fetchTasksQuery({
        page: isFirst ? 1 : page,
        pageSize: 15,
        search: search || "",
        priority: filterPriority || "",
        status: filterStatus || "",
        sortBy: "updated_at",
        sortDir: "desc",
    });

    if (rows.length === 0) {
        setHasMore(false);
        setLoading(false);

        resetLock.current = false;   // <-- IMPORTANT
        return;
    }

    setData(prev => {
        const merged = [...(isFirst ? [] : prev), ...rows];
        return Array.from(new Map(merged.map(t => [t.id, t])).values());
    });

    setPage(prev => prev + 1);
    setLoading(false);

    resetLock.current = false;  // <-- IMPORTANT
}


    function handleScroll(e) {
        if (
            e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 10 &&
            !loading &&
            hasMore
        ) {
            loadMore();
        }
    }
    function getDate(dateString) {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }

    return (
        <div className="list-container">
            <div className="list-scroll" ref={scrollRef} onScroll={handleScroll}>
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
                        {data.map((t) => (
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
                {loading && <div className="list-loading">Loading...</div>}
                {!hasMore && <div className="list-end">No more tasks</div>}
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
