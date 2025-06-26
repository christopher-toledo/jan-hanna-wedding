import { createClient, type ResultSet } from "@libsql/client"

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL environment variable is required")
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN environment variable is required")
}

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// Helper function to execute queries with error handling and proper typing
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<ResultSet & { rows: T[] }> {
  try {
    const result = await db.execute({
      sql: query,
      args: params,
    })
    return result as ResultSet & { rows: T[] }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function for transactions
export async function executeTransaction(queries: Array<{ sql: string; args?: any[] }>) {
  try {
    const transaction = await db.transaction()

    for (const query of queries) {
      await transaction.execute({
        sql: query.sql,
        args: query.args || [],
      })
    }

    await transaction.commit()
  } catch (error) {
    console.error("Database transaction error:", error)
    throw error
  }
}

export interface GuestResult {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export async function getGuest(guestId: string): Promise<GuestResult | null> {
  try {
    const result = await executeQuery<GuestResult>(
      "SELECT id, name, email, phone FROM guests WHERE id = ?",
      [guestId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error fetching guest:", error);
    return null;
  }
}
