import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db/mongodb'
import { teamData } from '@/data/teamData'
import { facultyMembers } from '@/data/faculty'
import { INITIAL_REGISTRATIONS } from '@/data/tournamentSeeds'

export async function POST(request) {
  try {
    const db = await getDatabase()
    let payload = {}
    try {
      payload = await request.json()
    } catch {
      payload = {}
    }

    const leads = Array.isArray(payload.leads) && payload.leads.length > 0 ? payload.leads : teamData.leads
    const faculty = Array.isArray(payload.faculty) && payload.faculty.length > 0 ? payload.faculty : facultyMembers
    const squads = Array.isArray(payload.squads) && payload.squads.length > 0 ? payload.squads : teamData.teams
    const registrations = Array.isArray(payload.registrations) && payload.registrations.length > 0 ? payload.registrations : INITIAL_REGISTRATIONS
    const siteSettings = payload.siteSettings || {
      registrationStatus: 'OPEN',
      announcementActive: true,
      announcementText: 'ROBORASHTRA 2027 REGISTRATIONS ARE ACTIVE • UNSTOP ARENA COMBAT PASSES LIVE',
      announcementType: 'info',
      liveStreamActive: false,
      liveStreamUrl: '',
      updatedAt: new Date().toISOString(),
    }

    // 1. Sync Leads collection
    const leadsCollection = db.collection('leads')
    for (const lead of leads) {
      await leadsCollection.updateOne(
        { id: lead.id },
        { $set: { ...lead, updatedAt: new Date().toISOString() } },
        { upsert: true }
      )
    }

    // 2. Sync Faculty collection
    const facultyCollection = db.collection('faculty')
    for (const fac of faculty) {
      await facultyCollection.updateOne(
        { id: fac.id },
        { $set: { ...fac, updatedAt: new Date().toISOString() } },
        { upsert: true }
      )
    }

    // 3. Sync Squads collection
    const squadsCollection = db.collection('squads')
    for (const squad of squads) {
      await squadsCollection.updateOne(
        { id: squad.id },
        { $set: { ...squad, updatedAt: new Date().toISOString() } },
        { upsert: true }
      )
    }

    // 4. Sync Registrations collection
    const regCollection = db.collection('registrations')
    for (const reg of registrations) {
      await regCollection.updateOne(
        { id: reg.id },
        { $set: { ...reg, updatedAt: new Date().toISOString() } },
        { upsert: true }
      )
    }

    // 5. Sync Site Settings collection
    const settingsCollection = db.collection('site_settings')
    await settingsCollection.updateOne(
      { type: 'general' },
      { $set: { ...siteSettings, type: 'general', updatedAt: new Date().toISOString() } },
      { upsert: true }
    )

    const counts = {
      leads: await leadsCollection.countDocuments(),
      faculty: await facultyCollection.countDocuments(),
      squads: await squadsCollection.countDocuments(),
      registrations: await regCollection.countDocuments(),
      site_settings: await settingsCollection.countDocuments(),
    }

    return NextResponse.json({
      success: true,
      message: `Successfully populated MongoDB Atlas database "${db.databaseName}" with all collections and documents!`,
      database: db.databaseName,
      counts,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[/api/db/sync] Error:', err)
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to sync data to MongoDB Atlas',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Support GET request to sync or fetch all documents
  try {
    const db = await getDatabase()
    const [leads, faculty, squads, registrations, settings] = await Promise.all([
      db.collection('leads').find({}).toArray(),
      db.collection('faculty').find({}).toArray(),
      db.collection('squads').find({}).toArray(),
      db.collection('registrations').find({}).toArray(),
      db.collection('site_settings').findOne({ type: 'general' }),
    ])

    return NextResponse.json({
      success: true,
      database: db.databaseName,
      data: {
        leads,
        faculty,
        squads,
        registrations,
        settings,
      },
    })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to fetch data from MongoDB Atlas',
      },
      { status: 500 }
    )
  }
}
