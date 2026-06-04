export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
  }
}

export const forbidden = (message = "Forbidden") => new AppError("FORBIDDEN", message, 403);
export const unauthorized = (message = "Unauthorized") => new AppError("UNAUTHORIZED", message, 401);
export const badRequest = (message = "Invalid request", details?: Record<string, unknown>) =>
  new AppError("BAD_REQUEST", message, 400, details);
export const rateLimited = () => new AppError("RATE_LIMITED", "Too many requests", 429);
