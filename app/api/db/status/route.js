import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db/mongodb'

// With `output: 'export'` Next.js renders this GET handler once at build time.
// Never touch MongoDB during that pass: it would bake database names and
// document counts into a public JSON file. This guard is false at runtime
// (next dev / Node server), so the real status is still returned there.
const IS_STATIC_BUILD = process.env.NEXT_PHASE === 'phase-production-build'

export async function GET() {
  if (IS_STATIC_BUILD) {
    return NextResponse.json(
      {
        success: false,
        status: 'UNAVAILABLE',
        error:
          'Database status is unavailable in the static export build. Run a Node server to enable MongoDB.',
      },
      { status: 503 }
    )
  }

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
