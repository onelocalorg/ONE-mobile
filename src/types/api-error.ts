export class ApiError extends Error {
  constructor(public code: number, message: string, public data?: unknown) {
    super(message);
  }
}
