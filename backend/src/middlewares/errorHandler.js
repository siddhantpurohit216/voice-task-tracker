// middlewares/errorHandler.js
import { AppError } from "../utils/AppError.js";

export function errorHandler(err, req, res, next) {
  console.error("ERROR:", err);

  // If it's an AppError → return the custom status + message
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // If it's a JSON.parse error from AI output
  if (err instanceof SyntaxError && err.message.includes("JSON")) {
    return res.status(400).json({
      success: false,
      error: "AI returned invalid JSON format",
    });
  }

  // Otherwise → Internal server error
  return res.status(500).json({
    success: false,
    error: "Something went wrong",
    details: process.env.NODE_ENV === "development" ? err.message : undefined
  });
}
