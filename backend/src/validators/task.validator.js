export function validateTaskQuery(req, res, next) {
  let { page, pageSize, priority, status, search, sortBy, sortDir } = req.query;

  const errors = [];

  const validPriorities = ["High", "Medium", "Low"];
  const validStatuses = ["To Do", "In Progress", "Done"];
  const validSortBy = ["updated_at", "title", "priority", "due_date"];
  const validSortDir = ["asc", "desc"];

  // NORMALIZATION
  priority = priority ? priority.trim() : "";
  if (priority)
    priority = priority[0].toUpperCase() + priority.slice(1).toLowerCase();

  status = status ? status.trim() : "";

  // PAGE VALIDATIONS
  if (page && isNaN(Number(page))) errors.push("page must be a number");
  if (pageSize && isNaN(Number(pageSize))) errors.push("pageSize must be a number");

  // PRIORITY VALIDATION
  if (priority && !validPriorities.includes(priority)) {
    errors.push(`Invalid priority: ${priority}`);
  }

  // STATUS VALIDATION
  if (status && !validStatuses.includes(status)) {
    errors.push(`Invalid status: ${status}`);
  }

  // SORT VALIDATION
  if (sortBy && !validSortBy.includes(sortBy)) {
    errors.push(`Invalid sortBy: ${sortBy}`);
  }

  if (sortDir && !validSortDir.includes(sortDir.toLowerCase())) {
    errors.push(`Invalid sortDir: ${sortDir}`);
  }

  // SEARCH VALIDATION
  if (search && /['";()]/.test(search))
    errors.push("Invalid characters in search");

  if (errors.length) return res.status(400).json({ errors });

  // SANITIZATION
  req.query.page = Number(page) || 1;
  req.query.pageSize = Number(pageSize) || 15;
  req.query.priority = priority || "";
  req.query.status = status || "";
  req.query.sortDir = sortDir?.toLowerCase() || "desc";

  next();
}



export function validateTaskBody(req, res, next) {
  const { title, description, priority, status, due_date } = req.body;
  const errors = [];

  const validPriorities = ["High", "Medium", "Low"];
  const validStatuses = ["To Do", "In Progress", "Done"];

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (priority && !validPriorities.includes(priority)) {
    errors.push(`Invalid priority: ${priority}`);
  }

  if (status && !validStatuses.includes(status)) {
    errors.push(`Invalid status: ${status}`);
  }

  if (due_date && isNaN(Date.parse(due_date))) {
    errors.push("Invalid due_date format");
  }

  if (errors.length) return res.status(400).json({ success: false, errors });

  next();
}
