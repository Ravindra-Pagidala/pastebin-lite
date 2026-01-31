import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/mongodb";

type HealthResponse = {
  ok: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  try {
    await getDb();
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Health check DB error:", err);
    res.status(500).json({ ok: false });
  }
}
