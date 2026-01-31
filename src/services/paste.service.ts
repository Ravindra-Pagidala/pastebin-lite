import { Paste } from "@/models/paste.model";
import {
  findPasteById,
  incrementViews,
  insertPaste,
} from "@/repositories/paste.repository";
import { nowMs } from "@/lib/time";
import { notFound } from "@/utils/errors";
import { NextApiRequest } from "next";
import { IncomingMessage } from "http";

/**
 * Create a new paste
 */
export async function createPaste(
  content: string,
  ttlSeconds?: number,
  maxViews?: number
): Promise<string> {
  const createdAt = Date.now();

  const paste: Paste = {
    content,
    createdAt,
    expiresAt: ttlSeconds ? createdAt + ttlSeconds * 1000 : null,
    maxViews: maxViews ?? null,
    views: 0,
  };

  return insertPaste(paste);
}

/**
 * Fetch a paste by ID (API contract)
 * Each successful fetch counts as ONE view
 */
export async function fetchPaste(id: string, req?: IncomingMessage)
: Promise<{
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
  max_views: number | null;
  created_at: number;
  usedViews: number;
}> {
  const paste = await findPasteById(id);
  if (!paste) throw notFound();

  const now = nowMs(req);

  const expiredByTTL =
    paste.expiresAt !== null && now >= paste.expiresAt;

  const exceededViews =
    paste.maxViews !== null && paste.views >= paste.maxViews;

  if (expiredByTTL || exceededViews) {
    throw notFound();
  }

  await incrementViews(id);

  const usedViews = paste.views + 1;

  const remainingViews =
    paste.maxViews === null
      ? null
      : Math.max(0, paste.maxViews - usedViews);

  return {
    content: paste.content,
    remaining_views: remainingViews,
    expires_at:
      paste.expiresAt === null
        ? null
        : new Date(paste.expiresAt).toISOString(),
    max_views: paste.maxViews,
    created_at: paste.createdAt,
    usedViews,
  };
}
