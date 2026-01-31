import { NextApiRequest, NextApiResponse } from "next";
import { createPaste, fetchPaste } from "@/services/paste.service";
import { validateCreatePaste } from "@/utils/validation";
import { HttpError } from "@/utils/errors";
import { logError } from "@/lib/logger";

export async function handleCreate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { content, ttl_seconds, max_views } =
      validateCreatePaste(req.body);

    const id = await createPaste(content, ttl_seconds, max_views);

    res.status(201).json({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    });
  } catch (err) {
    handleError(err, res);
  }
}

export async function handleFetch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;
    const data = await fetchPaste(id, req);
    res.status(200).json(data);
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: NextApiResponse) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  logError("Unhandled error", err);
  res.status(500).json({ error: "Internal server error" });
}
