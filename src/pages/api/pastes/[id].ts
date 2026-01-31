import { NextApiRequest, NextApiResponse } from "next";
import { handleFetch } from "@/controllers/paste.controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  await handleFetch(req, res);
}
