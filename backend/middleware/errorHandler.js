
// --- Custom Error Class ---
export class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// --- Central Error Handler Middleware ---
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(" Error:", err);

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with ID: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue);
    const message = `Duplicate field value entered for: ${field}`;
    error = new ErrorResponse(message, 400);
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(messages.join(", "), 400);
  }

  // Handle invalid JWT
  if (err.name === "JsonWebTokenError") {
    error = new ErrorResponse("Invalid token. Please log in again.", 401);
  }

  // Handle expired JWT
  if (err.name === "TokenExpiredError") {
    error = new ErrorResponse("Your token has expired. Please log in again.", 401);
  }

  // Send JSON response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
