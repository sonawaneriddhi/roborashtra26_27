'use client'

import { teamData as INITIAL_TEAM_DATA } from '@/data/teamData'
import { facultyMembers as INITIAL_FACULTY_DATA } from '@/data/faculty'
import { mongoAtlasClient } from '@/lib/db/mongoAtlasClient'

const STORAGE_KEYS = {
  WEBSITE_CMS: 'roborashtra_website_cms_v1',
  ATLAS_CONFIG: 'roborashtra_atlas_config_v1',
}

const DEFAULT_SITE_SETTINGS = {
  registrationStatus: 'OPEN', // OPEN | CLOSED | WAITLIST
  announcementActive: true,
  announcementText: 'ROBORASHTRA 2027 REGISTRATIONS ARE ACTIVE • UNSTOP ARENA COMBAT PASSES LIVE',
  announcementType: 'info', // info | warning | urgent
  liveStreamActive: false,
  liveStreamUrl: '',
  maintenanceMode: false,
}

class WebsiteStore {
  constructor() {
    this.listeners = new Set()
    this._initAtlasClient()
  }

  _initAtlasClient() {
    if (typeof window === 'undefined') return
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEYS.ATLAS_CONFIG)
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        mongoAtlasClient.configure(parsed)
      }
    } catch (e) {
      console.warn('Failed to restore Atlas config:', e)
    }
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
        console.error('WebsiteStore listener error:', err)
      }
    })
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Root State Access & Persistence
  // ─────────────────────────────────────────────────────────────────────────────

  _getState() {
    const fallback = {
      leads: INITIAL_TEAM_DATA.leads || [],
      faculty: INITIAL_FACULTY_DATA || [],
      squads: INITIAL_TEAM_DATA.teams || [],
      siteSettings: DEFAULT_SITE_SETTINGS,
      lastUpdated: Date.now(),
    }

    if (typeof window === 'undefined') return fallback

    const raw = localStorage.getItem(STORAGE_KEYS.WEBSITE_CMS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WEBSITE_CMS, JSON.stringify(fallback))
      return fallback
    }

    try {
      const parsed = JSON.parse(raw)
      return {
        leads: parsed.leads || fallback.leads,
        faculty: parsed.faculty || fallback.faculty,
        squads: parsed.squads || fallback.squads,
        siteSettings: { ...DEFAULT_SITE_SETTINGS, ...(parsed.siteSettings || {}) },
        lastUpdated: parsed.lastUpdated || Date.now(),
      }
    } catch {
      return fallback
    }
  }

  _saveState(state) {
    if (typeof window === 'undefined') return
    const updated = {
      ...state,
      lastUpdated: Date.now(),
    }
    localStorage.setItem(STORAGE_KEYS.WEBSITE_CMS, JSON.stringify(updated))
    this.notify()
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Executive Leads Management
  // ─────────────────────────────────────────────────────────────────────────────

  getLeads() {
    return this._getState().leads
  }

  addLead(leadData) {
    const state = this._getState()
    const id = `lead-${Date.now().toString(36)}`
    const newLead = {
      id,
      name: leadData.name || 'Unnamed Lead',
      role: leadData.role || 'Council Member',
      image: leadData.image || '',
      phone: leadData.phone || '',
      email: leadData.email || '',
      socials: {
        linkedin: leadData.linkedin || (leadData.socials && leadData.socials.linkedin) || '',
        github: leadData.github || (leadData.socials && leadData.socials.github) || '',
        instagram: leadData.instagram || (leadData.socials && leadData.socials.instagram) || '',
      },
    }

    state.leads = [...state.leads, newLead]
    this._saveState(state)
    return newLead
  }

  updateLead(id, updatedFields) {
    const state = this._getState()
    const index = state.leads.findIndex((l) => l.id === id)
    if (index === -1) return null

    const current = state.leads[index]
    const updated = {
      ...current,
      ...updatedFields,
      socials: {
        ...current.socials,
        ...(updatedFields.socials || {}),
        linkedin: updatedFields.linkedin !== undefined ? updatedFields.linkedin : (updatedFields.socials?.linkedin ?? current.socials?.linkedin),
        github: updatedFields.github !== undefined ? updatedFields.github : (updatedFields.socials?.github ?? current.socials?.github),
        instagram: updatedFields.instagram !== undefined ? updatedFields.instagram : (updatedFields.socials?.instagram ?? current.socials?.instagram),
      },
    }

    state.leads[index] = updated
    this._saveState(state)
    return updated
  }

  deleteLead(id) {
    const state = this._getState()
    state.leads = state.leads.filter((l) => l.id !== id)
    this._saveState(state)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Faculty Advisory Mentors Management
  // ─────────────────────────────────────────────────────────────────────────────

  getFaculty() {
    return this._getState().faculty
  }

  addFaculty(facultyData) {
    const state = this._getState()
    const id = `faculty-${Date.now().toString(36)}`
    const newFaculty = {
      id,
      name: facultyData.name || 'Unnamed Faculty',
      designation: facultyData.designation || 'Faculty Coordinator',
      department: facultyData.department || 'Department of Computer Science Engineering',
      badge: facultyData.badge || 'FACULTY ADVISOR',
      credentials: facultyData.credentials || '',
      email: facultyData.email || '',
      description: facultyData.description || '',
      image: facultyData.image || '',
    }

    state.faculty = [...state.faculty, newFaculty]
    this._saveState(state)
    return newFaculty
  }

  updateFaculty(id, updatedFields) {
    const state = this._getState()
    const index = state.faculty.findIndex((f) => f.id === id)
    if (index === -1) return null

    state.faculty[index] = {
      ...state.faculty[index],
      ...updatedFields,
    }

    this._saveState(state)
    return state.faculty[index]
  }

  deleteFaculty(id) {
    const state = this._getState()
    state.faculty = state.faculty.filter((f) => f.id !== id)
    this._saveState(state)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Club Squads & Crew Members Management
  // ─────────────────────────────────────────────────────────────────────────────

  getSquads() {
    return this._getState().squads
  }

  getSquad(squadId) {
    const squads = this.getSquads()
    return squads.find((s) => s.id === squadId) || null
  }

  addSquadMember(squadId, memberData, isHead = false) {
    const state = this._getState()
    const squad = state.squads.find((s) => s.id === squadId)
    if (!squad) return null

    const memberId = `${squadId}-${isHead ? 'head' : 'member'}-${Date.now().toString(36)}`
    const newMember = {
      id: memberId,
      name: memberData.name || 'Unnamed Crew',
      role: memberData.role || (isHead ? 'Squad Head' : 'Crew Member'),
      image: memberData.image || '',
      socials: {
        linkedin: memberData.linkedin || (memberData.socials && memberData.socials.linkedin) || '',
        github: memberData.github || (memberData.socials && memberData.socials.github) || '',
        instagram: memberData.instagram || (memberData.socials && memberData.socials.instagram) || '',
      },
    }

    if (isHead) {
      squad.heads = [...(squad.heads || []), newMember]
    } else {
      squad.members = [...(squad.members || []), newMember]
    }

    this._saveState(state)
    return newMember
  }

  updateSquadMember(squadId, memberId, updatedFields, isHead = false) {
    const state = this._getState()
    const squad = state.squads.find((s) => s.id === squadId)
    if (!squad) return null

    const list = isHead ? squad.heads : squad.members
    const index = (list || []).findIndex((m) => m.id === memberId)
    if (index === -1) return null

    const current = list[index]
    const updated = {
      ...current,
      ...updatedFields,
      socials: {
        ...current.socials,
        ...(updatedFields.socials || {}),
        linkedin: updatedFields.linkedin !== undefined ? updatedFields.linkedin : (updatedFields.socials?.linkedin ?? current.socials?.linkedin),
        github: updatedFields.github !== undefined ? updatedFields.github : (updatedFields.socials?.github ?? current.socials?.github),
        instagram: updatedFields.instagram !== undefined ? updatedFields.instagram : (updatedFields.socials?.instagram ?? current.socials?.instagram),
      },
    }

    list[index] = updated
    this._saveState(state)
    return updated
  }

  deleteSquadMember(squadId, memberId, isHead = false) {
    const state = this._getState()
    const squad = state.squads.find((s) => s.id === squadId)
    if (!squad) return

    if (isHead) {
      squad.heads = (squad.heads || []).filter((h) => h.id !== memberId)
    } else {
      squad.members = (squad.members || []).filter((m) => m.id !== memberId)
    }

    this._saveState(state)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. Site Settings & Broadcast Controls
  // ─────────────────────────────────────────────────────────────────────────────

  getSiteSettings() {
    return this._getState().siteSettings
  }

  updateSiteSettings(newSettings) {
    const state = this._getState()
    state.siteSettings = {
      ...state.siteSettings,
      ...newSettings,
    }
    this._saveState(state)
    return state.siteSettings
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. MongoDB Atlas Config & Synchronization Gateway
  // ─────────────────────────────────────────────────────────────────────────────

  getAtlasConfig() {
    if (typeof window === 'undefined') return mongoAtlasClient.getConfig()

    const raw = localStorage.getItem(STORAGE_KEYS.ATLAS_CONFIG)
    if (!raw) return mongoAtlasClient.getConfig()
    try {
      const parsed = JSON.parse(raw)
      return {
        ...mongoAtlasClient.getConfig(),
        ...parsed,
        apiKeyMasked: parsed.apiKey ? `••••••••${parsed.apiKey.slice(-4)}` : '',
      }
    } catch {
      return mongoAtlasClient.getConfig()
    }
  }

  saveAtlasConfig(config) {
    if (typeof window === 'undefined') return
    const cleanConfig = {
      endpoint: config.endpoint || 'https://data.mongodb-api.com/app/data-roborashtra/endpoint/data/v1',
      cluster: config.cluster || 'Cluster0',
      database: config.database || 'roborashtra',
      apiKey: config.apiKey || '',
      lastTested: Date.now(),
    }

    localStorage.setItem(STORAGE_KEYS.ATLAS_CONFIG, JSON.stringify(cleanConfig))
    mongoAtlasClient.configure(cleanConfig)
    this.notify()
    return cleanConfig
  }

  async testAtlasConnection() {
    return mongoAtlasClient.testConnection()
  }

  /**
   * One-click Migration: Push current local leads, faculty, squads, and settings to MongoDB Atlas
   */
  async pushLocalToAtlas() {
    const state = this._getState()

    // 1. Leads
    const leadsRes = await mongoAtlasClient.updateOne(
      'site_content',
      { type: 'leads_registry' },
      { type: 'leads_registry', data: state.leads, updatedAt: new Date().toISOString() },
      true
    )

    // 2. Faculty
    const facultyRes = await mongoAtlasClient.updateOne(
      'site_content',
      { type: 'faculty_registry' },
      { type: 'faculty_registry', data: state.faculty, updatedAt: new Date().toISOString() },
      true
    )

    // 3. Squads
    const squadsRes = await mongoAtlasClient.updateOne(
      'site_content',
      { type: 'squads_registry' },
      { type: 'squads_registry', data: state.squads, updatedAt: new Date().toISOString() },
      true
    )

    // 4. Site Settings
    const settingsRes = await mongoAtlasClient.updateOne(
      'site_content',
      { type: 'site_settings' },
      { type: 'site_settings', data: state.siteSettings, updatedAt: new Date().toISOString() },
      true
    )

    const allSuccessful = [leadsRes, facultyRes, squadsRes, settingsRes].every((r) => r.success)

    return {
      success: allSuccessful,
      details: {
        leads: leadsRes,
        faculty: facultyRes,
        squads: squadsRes,
        settings: settingsRes,
      },
    }
  }

  /**
   * Pull latest data from MongoDB Atlas and update local state
   */
  async pullAtlasToLocal() {
    const state = this._getState()

    const [leadsDoc, facultyDoc, squadsDoc, settingsDoc] = await Promise.all([
      mongoAtlasClient.findOne('site_content', { type: 'leads_registry' }),
      mongoAtlasClient.findOne('site_content', { type: 'faculty_registry' }),
      mongoAtlasClient.findOne('site_content', { type: 'squads_registry' }),
      mongoAtlasClient.findOne('site_content', { type: 'site_settings' }),
    ])

    let pulledCount = 0

    if (leadsDoc.success && leadsDoc.document?.data) {
      state.leads = leadsDoc.document.data
      pulledCount++
    }

    if (facultyDoc.success && facultyDoc.document?.data) {
      state.faculty = facultyDoc.document.data
      pulledCount++
    }

    if (squadsDoc.success && squadsDoc.document?.data) {
      state.squads = squadsDoc.document.data
      pulledCount++
    }

    if (settingsDoc.success && settingsDoc.document?.data) {
      state.siteSettings = {
        ...state.siteSettings,
        ...settingsDoc.document.data,
      }
      pulledCount++
    }

    if (pulledCount > 0) {
      this._saveState(state)
    }

    return {
      success: pulledCount > 0,
      pulledCount,
    }
  }

  /**
   * Reset all data back to factory seed fixtures
   */
  resetToDefaults() {
    const state = {
      leads: INITIAL_TEAM_DATA.leads || [],
      faculty: INITIAL_FACULTY_DATA || [],
      squads: INITIAL_TEAM_DATA.teams || [],
      siteSettings: DEFAULT_SITE_SETTINGS,
      lastUpdated: Date.now(),
    }
    this._saveState(state)
    return state
  }
}

export const websiteStore = new WebsiteStore()
