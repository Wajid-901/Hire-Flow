const isProd = process.env.NODE_ENV === "production";

const errorMiddleware = (err, req, res, next) => {
  // Log full error internally always
  console.error("[ErrorMiddleware]", err);

  // Use status attached to error (e.g. from controllers calling next(error))
  // or fall back to 500
  const status = err.status || err.statusCode || 500;

  // In production, never leak raw error messages for 5xx errors
  // (they may contain stack traces, DB details, etc.)
  const message =
    isProd && status >= 500
      ? "An internal server error occurred. Please try again later."
      : err.message || "Internal Server Error";

  res.status(status).json({ success: false, message });
};

export default errorMiddleware;