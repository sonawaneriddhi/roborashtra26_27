'use client'

import { INITIAL_REGISTRATIONS, DEFAULT_RUBRICS, INITIAL_SCORES, TOURNAMENT_TRACKS } from '@/data/tournamentSeeds'
import { teamData as INITIAL_TEAM_DATA } from '@/data/teamData'

const STORAGE_KEYS = {
  REGISTRATIONS: 'roborashtra_registrations_v2',
  INTERNAL_TEAMS: 'roborashtra_internal_teams_v2',
  SCORES: 'roborashtra_scores_v2',
  ADMIN_AUTH: 'roborashtra_admin_session_v2',
  JUDGE_AUTH: 'roborashtra_judge_session_v2',
}

class TournamentStore {
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
        console.error('Store subscriber error:', err)
      }
    })
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Participant Registrations (Unstop Pre-registered + On-Spot Desk Arrivals)
  // ─────────────────────────────────────────────────────────────────────────────

  getRegistrations() {
    if (typeof window === 'undefined') return INITIAL_REGISTRATIONS
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS))
      return INITIAL_REGISTRATIONS
    }
    try {
      return JSON.parse(raw)
    } catch {
      return INITIAL_REGISTRATIONS
    }
  }

  saveRegistrations(list) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(list))
    this.notify()
  }

  getRegistrationById(id) {
    const list = this.getRegistrations()
    return list.find((r) => r.id === id || r.unstopId === id || r.qrToken === id) || null
  }

  /**
   * On-spot desk registration for teams arriving on the day
   */
  addOnSpotRegistration(formData) {
    const list = this.getRegistrations()
    const trackCode = formData.trackCode || '01'
    const trackObj = TOURNAMENT_TRACKS.find((t) => t.code === trackCode) || TOURNAMENT_TRACKS[0]
    const trackPrefix = trackCode === '01' ? 'YO' : trackCode === '02' ? 'RO' : 'OC'
    const randomNum = Math.floor(100 + Math.random() * 900)
    const id = `RR27-${trackPrefix}-${randomNum}`
    const qrToken = `RR-VERIFIED-${id}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    const newRecord = {
      id,
      unstopId: formData.unstopId || `DESK-SPOT-${randomNum}`,
      regType: formData.regType || (formData.unstopId ? 'UNSTOP_ONLINE' : 'ON_SPOT_DESK'),
      teamName: formData.teamName,
      trackCode,
      trackName: trackObj.name,
      college: formData.college || 'Direct Entry',
      botName: formData.botName || 'TBD / In Pit',
      pitNumber: formData.pitNumber || `PIT-${Math.floor(1 + Math.random() * 40)}`,
      leader: {
        name: formData.leaderName,
        email: formData.leaderEmail,
        phone: formData.leaderPhone,
        role: formData.leaderRole || 'Team Captain',
      },
      members: Array.isArray(formData.members)
        ? formData.members
        : (formData.memberNames || '')
            .split(',')
            .map((name) => name.trim())
            .filter(Boolean)
            .map((name) => ({ name, role: 'Crew Member', phone: '' })),
      status: formData.markCheckedInImmediately ? 'CHECKED_IN' : 'VERIFIED',
      checkedInAt: formData.markCheckedInImmediately ? new Date().toISOString() : null,
      registeredAt: new Date().toISOString(),
      qrToken,
      notes: formData.notes || 'Registered at event desk on arrival day.',
    }

    const updated = [newRecord, ...list]
    this.saveRegistrations(updated)
    return newRecord
  }

  updateRegistrationStatus(id, newStatus) {
    const list = this.getRegistrations()
    let target = null
    const updated = list.map((item) => {
      if (item.id === id || item.qrToken === id) {
        target = {
          ...item,
          status: newStatus,
          checkedInAt: newStatus === 'CHECKED_IN' ? (item.checkedInAt || new Date().toISOString()) : item.checkedInAt,
        }
        return target
      }
      return item
    })
    this.saveRegistrations(updated)
    return target
  }

  updateRegistrationDetails(id, changes) {
    const list = this.getRegistrations()
    const updated = list.map((item) => (item.id === id ? { ...item, ...changes } : item))
    this.saveRegistrations(updated)
    return updated.find((r) => r.id === id)
  }

  deleteRegistration(id) {
    const list = this.getRegistrations()
    const filtered = list.filter((item) => item.id !== id)
    this.saveRegistrations(filtered)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. QR Token Verification & Check-in
  // ─────────────────────────────────────────────────────────────────────────────

  verifyAndCheckInQr(qrString) {
    const list = this.getRegistrations()
    const cleanStr = (qrString || '').trim()

    // Find by QR token, Team ID, or Unstop ID
    const match = list.find(
      (r) => r.qrToken === cleanStr || r.id.toLowerCase() === cleanStr.toLowerCase() || (r.unstopId && r.unstopId.toLowerCase() === cleanStr.toLowerCase())
    )

    if (!match) {
      return { success: false, reason: 'INVALID_TOKEN', message: 'No registered team found with this QR or ID.' }
    }

    if (match.status === 'CHECKED_IN') {
      return {
        success: true,
        alreadyCheckedIn: true,
        team: match,
        message: `Team "${match.teamName}" was already checked in at ${new Date(match.checkedInAt).toLocaleTimeString()}.`,
      }
    }

    // Mark checked in
    const updatedTeam = this.updateRegistrationStatus(match.id, 'CHECKED_IN')
    return {
      success: true,
      alreadyCheckedIn: false,
      team: updatedTeam,
      message: `Successfully checked in "${match.teamName}"! Tactical ID verified.`,
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Internal Club Team Management (Heads & Members per Squad)
  // ─────────────────────────────────────────────────────────────────────────────

  getInternalTeams() {
    if (typeof window === 'undefined') return INITIAL_TEAM_DATA
    const raw = localStorage.getItem(STORAGE_KEYS.INTERNAL_TEAMS)
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INTERNAL_TEAMS, JSON.stringify(INITIAL_TEAM_DATA))
      return INITIAL_TEAM_DATA
    }
    try {
      return JSON.parse(raw)
    } catch {
      return INITIAL_TEAM_DATA
    }
  }

  saveInternalTeams(teams) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.INTERNAL_TEAMS, JSON.stringify(teams))
    this.notify()
  }

  addInternalMember(squadSlug, memberData, isHead = false) {
    const teams = this.getInternalTeams()
    const squad = teams[squadSlug]
    if (!squad) return null

    const memberId = `${squadSlug}-${Date.now().toString(36)}`
    const newMember = {
      id: memberId,
      name: memberData.name,
      role: memberData.role,
      image: memberData.image || '',
      socials: memberData.socials || {},
    }

    if (isHead) {
      squad.heads = [...(squad.heads || []), newMember]
    } else {
      squad.members = [...(squad.members || []), newMember]
    }

    this.saveInternalTeams(teams)
    return newMember
  }

  removeInternalMember(squadSlug, memberId, isHead = false) {
    const teams = this.getInternalTeams()
    const squad = teams[squadSlug]
    if (!squad) return

    if (isHead) {
      squad.heads = (squad.heads || []).filter((h) => h.id !== memberId)
    } else {
      squad.members = (squad.members || []).filter((m) => m.id !== memberId)
    }

    this.saveInternalTeams(teams)
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. Judge Scoring & Leaderboard
  // ─────────────────────────────────────────────────────────────────────────────

  getScores(trackCode = null) {
    if (typeof window === 'undefined') return INITIAL_SCORES
    const raw = localStorage.getItem(STORAGE_KEYS.SCORES)
    const list = raw ? JSON.parse(raw) : INITIAL_SCORES
    return trackCode ? list.filter((s) => s.trackCode === trackCode) : list
  }

  submitScore(evaluationData) {
    if (typeof window === 'undefined') return null
    const list = this.getScores()

    // Calculate totals
    const criteriaScores = evaluationData.criteriaScores || {}
    const baseScore = Object.values(criteriaScores).reduce((acc, val) => acc + (Number(val) || 0), 0)
    const penalty = Number(evaluationData.penalty) || 0
    const finalScore = Math.max(0, baseScore - penalty)

    const newScore = {
      id: `SCORE-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      teamId: evaluationData.teamId,
      teamName: evaluationData.teamName,
      trackCode: evaluationData.trackCode,
      trackName: evaluationData.trackName,
      judgeName: evaluationData.judgeName || 'Anonymous Judge',
      judgeAffiliation: evaluationData.judgeAffiliation || 'Advisory Committee',
      criteriaScores,
      baseScore,
      penalty,
      penaltyReason: evaluationData.penaltyReason || '',
      finalScore,
      feedback: evaluationData.feedback || '',
      submittedAt: new Date().toISOString(),
    }

    // Replace previous evaluation if same judge & team, or append
    const updated = [newScore, ...list.filter((s) => !(s.teamId === newScore.teamId && s.judgeName === newScore.judgeName))]
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(updated))
    this.notify()
    return newScore
  }

  getLeaderboard(trackCode = null) {
    const allScores = this.getScores(trackCode)
    const allRegistrations = this.getRegistrations()

    // Aggregate by teamId
    const teamScoreMap = new Map()

    allScores.forEach((score) => {
      if (!teamScoreMap.has(score.teamId)) {
        const teamInfo = allRegistrations.find((r) => r.id === score.teamId) || {
          teamName: score.teamName,
          college: 'External Team',
          botName: 'Bot',
        }
        teamScoreMap.set(score.teamId, {
          teamId: score.teamId,
          teamName: score.teamName,
          trackCode: score.trackCode,
          trackName: score.trackName,
          college: teamInfo.college,
          botName: teamInfo.botName,
          scores: [],
          highestScore: 0,
          averageScore: 0,
          penaltiesTotal: 0,
        })
      }

      const teamEntry = teamScoreMap.get(score.teamId)
      teamEntry.scores.push(score)
      teamEntry.penaltiesTotal += score.penalty
      teamEntry.highestScore = Math.max(teamEntry.highestScore, score.finalScore)
    })

    // Compute averages and sort descending
    const leaderboard = Array.from(teamScoreMap.values()).map((entry) => {
      const sum = entry.scores.reduce((acc, s) => acc + s.finalScore, 0)
      entry.averageScore = entry.scores.length ? Math.round((sum / entry.scores.length) * 10) / 10 : 0
      return entry
    })

    leaderboard.sort((a, b) => b.highestScore - a.highestScore || b.averageScore - a.averageScore)
    return leaderboard
  }

  getRubric(trackCode) {
    return DEFAULT_RUBRICS[trackCode] || DEFAULT_RUBRICS['01']
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. Auth / Access Controls
  // ─────────────────────────────────────────────────────────────────────────────

  isAdminLoggedIn() {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'ACTIVE'
  }

  loginAdmin(pin) {
    if (typeof window === 'undefined') return false
    // Master access PIN: "2027" or "admin"
    if (pin === '2027' || pin === 'admin' || pin === 'roborashtra') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'ACTIVE')
      this.notify()
      return true
    }
    return false
  }

  logoutAdmin() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH)
    this.notify()
  }

  getJudgeSession() {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(STORAGE_KEYS.JUDGE_AUTH)
    return raw ? JSON.parse(raw) : null
  }

  loginJudge(judgeData) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.JUDGE_AUTH, JSON.stringify(judgeData))
    this.notify()
  }

  logoutJudge() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.JUDGE_AUTH)
    this.notify()
  }
}

export const tournamentStore = new TournamentStore()
