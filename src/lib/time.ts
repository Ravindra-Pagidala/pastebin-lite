import { IncomingMessage } from "http";

export function nowMs(req?: IncomingMessage): number {
  if (process.env.TEST_MODE === "1") {
    const header = req?.headers["x-test-now-ms"];
    if (typeof header === "string") {
      const parsed = Number(header);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return Date.now();
}
