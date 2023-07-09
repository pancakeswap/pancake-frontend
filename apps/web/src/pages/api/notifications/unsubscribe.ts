import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { gmUsers } from "db/schema";

const dbConnectionString = process.env.DB_POOLING_URL;

if (!dbConnectionString) {
  throw new ReferenceError(
    "process.env.DB_POOLING_URL is missing in environment variables"
  );
}

const pool = new Pool({
  connectionString: dbConnectionString,
});

const db = drizzle(pool);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    throw new ReferenceError("Method not allowed");
  }

  const { account } = req.body;

  if (!account) {
    return res.status(400).json({ success: false });
  }

  try {
    await db.delete(gmUsers).where(eq(gmUsers.account, account));
    return res.status(200).json({ success: true });
  } catch (error) {
//     if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error });
//     }
  }
}
