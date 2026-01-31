export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFound(message = "Not found") {
  return new HttpError(404, message);
}

export function badRequest(message: string) {
  return new HttpError(400, message);
}
