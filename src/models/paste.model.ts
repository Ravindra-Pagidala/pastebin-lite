import { ObjectId } from "mongodb";

export interface Paste {
  _id?: ObjectId;

  content: string;
  createdAt: number;

  expiresAt: number | null;
  maxViews: number | null;

  views: number;
}
