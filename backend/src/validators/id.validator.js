export function validateIdParam(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      error: "Invalid task ID",
    });
  }
  next();
}
