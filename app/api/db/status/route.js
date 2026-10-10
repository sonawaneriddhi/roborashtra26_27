import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    // Ping cluster
    await db.command({ ping: 1 })

    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    const stats = {}
    for (const name of collectionNames) {
      stats[name] = await db.collection(name).countDocuments()
    }

    return NextResponse.json({
      success: true,
      status: 'CONNECTED',
      database: db.databaseName,
      collections: collectionNames,
      documentCounts: stats,
      message: `Connected to MongoDB Atlas database "${db.databaseName}" successfully.`,
    })
  } catch (err) {
    console.error('[/api/db/status] Error:', err)
    return NextResponse.json(
      {
        success: false,
        status: 'ERROR',
        error: err.message || 'Failed to connect to MongoDB Atlas',
      },
      { status: 500 }
    )
  }
}
