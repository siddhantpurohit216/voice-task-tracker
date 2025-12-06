const BASE_URL = "http://localhost:5003/tasks";

export async function fetchTasks() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function createTask(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTask(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",    
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function fetchTasksQuery(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/query?${query}`);
  return res.json();
}


