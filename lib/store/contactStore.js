'use client'

const STORAGE_KEYS = {
  CONTACT_MESSAGES: 'roborashtra_contact_messages_v1',
}

// Sample starter inquiries if none exist yet
const SEED_MESSAGES = [
  {
    id: 'MSG-SEED-01',
    name: 'Vikramaditya Shinde',
    email: 'vikram.robotics@coep.ac.in',
    phone: '+91 98220 11442',
    category: 'Partnership / Sponsorship',
    message: 'Greetings RoboRashtra Team! We represent COEP Robotics Club and would like to explore institutional sponsorship and arena booth displays for the 2027 championship. Please connect us with your PR lead.',
    status: 'UNREAD',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'MSG-SEED-02',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@vjti.ac.in',
    phone: '+91 94231 88920',
    category: 'Technical Support',
    message: 'Hello, our team has a query regarding the Robowar 15kg weight class weapon speed rpm limits mentioned in the rulebook. Could technical coordinators clarify weapon safety cutoffs?',
    status: 'UNREAD',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
]

class ContactStore {
  constructor() {
    this.listeners = new Set()
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn()
      } catch (err) {
        console.error('ContactStore listener error:', err)
      }
    })
  }

  getMessages() {
    if (typeof window === 'undefined') return SEED_MESSAGES
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(SEED_MESSAGES))
      return SEED_MESSAGES
    }
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : SEED_MESSAGES
    } catch {
      return SEED_MESSAGES
    }
  }

  saveMessages(list) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(list))
    this.notify()
  }

  getUnreadCount() {
    const messages = this.getMessages()
    return messages.filter((m) => m.status === 'UNREAD').length
  }

  addMessage(msg) {
    const list = this.getMessages()
    const updated = [msg, ...list]
    this.saveMessages(updated)
    return msg
  }

  markAsRead(id) {
    const list = this.getMessages()
    const updated = list.map((m) =>
      m.id === id ? { ...m, status: 'READ', updatedAt: new Date().toISOString() } : m
    )
    this.saveMessages(updated)

    // Sync with API
    if (typeof fetch !== 'undefined') {
      fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'READ' }),
      }).catch((e) => console.warn('Sync patch failed:', e))
    }
  }

  markAsUnread(id) {
    const list = this.getMessages()
    const updated = list.map((m) =>
      m.id === id ? { ...m, status: 'UNREAD', updatedAt: new Date().toISOString() } : m
    )
    this.saveMessages(updated)

    // Sync with API
    if (typeof fetch !== 'undefined') {
      fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'UNREAD' }),
      }).catch((e) => console.warn('Sync patch failed:', e))
    }
  }

  deleteMessage(id) {
    const list = this.getMessages()
    const updated = list.filter((m) => m.id !== id)
    this.saveMessages(updated)

    // Sync with API
    if (typeof fetch !== 'undefined') {
      fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      }).catch((e) => console.warn('Sync delete failed:', e))
    }
  }

  markAllAsRead() {
    const list = this.getMessages()
    const updated = list.map((m) => ({ ...m, status: 'READ', updatedAt: new Date().toISOString() }))
    this.saveMessages(updated)
  }

  async syncWithServer() {
    if (typeof window === 'undefined') return
    try {
      const res = await fetch('/api/contact')
      if (res.ok) {
        const json = await res.json()
        if (json.success && Array.isArray(json.messages) && json.messages.length > 0) {
          const current = this.getMessages()
          const map = new Map()
          // Add local items
          current.forEach((item) => map.set(item.id, item))
          // Overlay server items
          json.messages.forEach((item) => map.set(item.id, item))
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
          this.saveMessages(merged)
        }
      }
    } catch (e) {
      console.warn('ContactStore server sync error:', e)
    }
  }
}

export const contactStore = new ContactStore()
