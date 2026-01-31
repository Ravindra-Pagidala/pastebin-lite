import { NextApiRequest, NextApiResponse } from "next";
import { handleCreate } from "@/controllers/paste.controller";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  await handleCreate(req, res);
}
