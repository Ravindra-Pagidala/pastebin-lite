import { getDb } from "@/lib/mongodb";
import { Paste } from "@/models/paste.model";
import { ObjectId, WithId } from "mongodb";

const COLLECTION = "pastes";

export async function insertPaste(paste: Paste): Promise<string> {
  const db = await getDb();

  const result = await db
    .collection<Paste>(COLLECTION)
    .insertOne(paste);

  return result.insertedId.toString();
}

export async function findPasteById(
  id: string
): Promise<WithId<Paste> | null> {
  const db = await getDb();

  return db
    .collection<Paste>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
}

export async function incrementViews(id: string): Promise<void> {
  const db = await getDb();

  await db.collection<Paste>(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $inc: { views: 1 } }
  );
}
