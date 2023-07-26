import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'
import { gmUsers } from 'db/schema'

const dbConnectionString = process.env.DB_POOLING_URL

if (!dbConnectionString) {
  throw new ReferenceError('process.env.DB_POOLING_URL is missing in environment variables')
}

const pool = new Pool({
  connectionString: dbConnectionString,
})

const db = drizzle(pool)

// eslint-disable-next-line consistent-return
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Method Not Allowed
    res.status(405).json({ success: false })
  }

  const { event, account } = req.body

  if (!account || !event) {
    return res.status(400).json({ success: false })
  }

  if (event === 'subscribed') {
    const existingUser = await db.select().from(gmUsers).where(eq(gmUsers.account, account))

    if (existingUser.length > 0) {
      return res.status(200).json({ success: true })
    }

    try {
      await db.insert(gmUsers).values({
        account,
      })
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error(`Subscribing account ${account} failed: `, error)
      // if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error })
      // }
    }
  } else if (event === 'unsubscribed') {
    try {
      await db.delete(gmUsers).where(eq(gmUsers.account, account))
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error(`Unsubscribing account ${account} failed: `, error)
      // if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error })
      // }
    }
  } else {
    res.status(400).json({
      success: false,
      message: `Unknown event ${event}. Expected "subscribed" or "unsubscribed".`,
    })
  }

  res.status(200).json({ success: true })
}
