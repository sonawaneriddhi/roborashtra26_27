import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db/mongodb'

// In-memory fallback if MongoDB connection is unavailable
let memoryMessages = []

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, category, message } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    }
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 })
    }
    if (!category || !category.trim()) {
      return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 })
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 })
    }

    const newDoc = {
      id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category.trim(),
      message: message.trim(),
      status: 'UNREAD', // 'UNREAD' | 'READ' | 'RESOLVED'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      const db = await getDatabase()
      const collection = db.collection('contact_messages')
      await collection.insertOne(newDoc)
    } catch (dbErr) {
      console.warn('[/api/contact] MongoDB insert error, using fallback:', dbErr.message)
      memoryMessages.unshift(newDoc)
    }

    return NextResponse.json({
      success: true,
      message: 'Message delivered to command desk successfully',
      data: newDoc,
    })
  } catch (err) {
    console.error('[/api/contact POST] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    let messages = []
    try {
      const db = await getDatabase()
      const collection = db.collection('contact_messages')
      messages = await collection.find({}).sort({ createdAt: -1 }).toArray()
    } catch (dbErr) {
      console.warn('[/api/contact GET] MongoDB find error, using fallback:', dbErr.message)
      messages = memoryMessages
    }

    return NextResponse.json({
      success: true,
      messages,
      total: messages.length,
      unread: messages.filter((m) => m.status === 'UNREAD').length,
    })
  } catch (err) {
    console.error('[/api/contact GET] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json()
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 })
    }

    try {
      const db = await getDatabase()
      const collection = db.collection('contact_messages')
      await collection.updateOne(
        { id },
        { $set: { status, updatedAt: new Date().toISOString() } }
      )
    } catch (dbErr) {
      const item = memoryMessages.find((m) => m.id === id)
      if (item) item.status = status
    }

    return NextResponse.json({ success: true, message: `Message ${id} marked as ${status}` })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Message ID is required' }, { status: 400 })
    }

    try {
      const db = await getDatabase()
      const collection = db.collection('contact_messages')
      await collection.deleteOne({ id })
    } catch (dbErr) {
      memoryMessages = memoryMessages.filter((m) => m.id !== id)
    }

    return NextResponse.json({ success: true, message: `Message ${id} removed` })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
