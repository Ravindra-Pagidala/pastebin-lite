// src/utils/validation.ts
import { badRequest } from "./errors";

export function validateCreatePaste(body: any) {
  const { content, ttl_seconds, max_views } = body;

  if (typeof content !== "string" || content.trim().length === 0) {
    throw badRequest("content must be a non-empty string");
  }

  if (ttl_seconds !== undefined) {
    if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
      throw badRequest("ttl_seconds must be an integer >= 1");
    }
  }

  if (max_views !== undefined) {
    if (!Number.isInteger(max_views) || max_views < 1) {
      throw badRequest("max_views must be an integer >= 1");
    }
  }

  return {
    content: content.trim(),
    ttl_seconds,
    max_views,
  };
}