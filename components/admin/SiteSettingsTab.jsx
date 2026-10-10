'use client'

import React, { useState, useEffect } from 'react'
import { websiteStore } from '@/lib/store/websiteStore'
import {
  Sliders,
  Radio,
  Bell,
  Video,
  AlertTriangle,
  Check,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react'

export default function SiteSettingsTab() {
  const [settings, setSettings] = useState({
    registrationStatus: 'OPEN',
    announcementActive: true,
    announcementText: 'ROBORASHTRA 2027 REGISTRATIONS ARE ACTIVE • UNSTOP ARENA COMBAT PASSES LIVE',
    announcementType: 'info',
    liveStreamActive: false,
    liveStreamUrl: '',
    maintenanceMode: false,
  })

  const [savedNotice, setSavedNotice] = useState(false)

  useEffect(() => {
    setSettings(websiteStore.getSiteSettings())
    const unsubscribe = websiteStore.subscribe(() => {
      setSettings(websiteStore.getSiteSettings())
    })
    return () => unsubscribe()
  }, [])

  const handleSave = (e) => {
    e.preventDefault()
    websiteStore.updateSiteSettings(settings)
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 3500)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {savedNotice && (
        <div className="p-3 bg-green-500/15 border border-green-500/40 text-green-400 font-mono text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Site settings updated and broadcasted across live sessions.</span>
        </div>
      )}

      {/* Header */}
      <div className="tick-frame p-5 border border-amber/30 bg-[#070B19]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-orbitron font-extrabold text-xl text-ivory uppercase tracking-wider">
              WEBSITE OPERATIONS & BROADCAST CONTROLS
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 border border-amber/50 bg-amber/15 text-amber font-bold">
              PORTAL CONFIG
            </span>
          </div>
          <p className="font-mono text-xs text-ivory/60 mt-1">
            Toggle global announcement banners, event registration status, and live arena broadcasts.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        {/* 1. Global Announcement Ticker */}
        <div className="tick-frame p-6 border border-white/10 bg-[#070B19]/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber" />
              <h3 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider">
                BROADCAST ANNOUNCEMENT BANNER
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-[11px] text-ivory/70">
                {settings.announcementActive ? 'ACTIVE' : 'MUTED'}
              </span>
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="w-4 h-4 accent-amber cursor-pointer"
              />
            </label>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-ivory/70 uppercase mb-1.5">BANNER SEVERITY / COLOR</label>
              <select
                value={settings.announcementType}
                onChange={(e) => setSettings({ ...settings, announcementType: e.target.value })}
                className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
              >
                <option value="info">Info Accent (Amber Glow)</option>
                <option value="warning">High Priority (Orange Alert)</option>
                <option value="urgent">Emergency Notice (Red Pulse)</option>
                <option value="live">Live Tournament (Emerald Green)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Registration Status Control */}
        <div className="tick-frame p-6 border border-white/10 bg-[#070B19]/80 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
            <Radio className="w-4 h-4 text-amber" />
            <h3 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider">
              TOURNAMENT REGISTRATION STATUS GATEWAY
            </h3>
          </div>

          <p className="text-ivory/60 text-xs">
            Controls the Unstop / Direct Entry status shown across the landing page and registration forms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              {
                id: 'OPEN',
                title: 'OPEN FOR ENTRIES',
                desc: 'Teams can freely submit Unstop registrations and on-the-day passes.',
                border: 'border-green-500/40',
                color: 'text-green-400',
              },
              {
                id: 'WAITLIST',
                title: 'WAITLIST ONLY',
                desc: 'Track quota is reached; teams are placed on standby for spot drops.',
                border: 'border-amber/40',
                color: 'text-amber',
              },
              {
                id: 'CLOSED',
                title: 'CLOSED / LIVE ARENA',
                desc: 'Registration period has ended. Gate passes and check-in scanner only.',
                border: 'border-red-500/40',
                color: 'text-red-400',
              },
            ].map((st) => (
              <label
                key={st.id}
                onClick={() => setSettings({ ...settings, registrationStatus: st.id })}
                className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${settings.registrationStatus === st.id
                    ? `${st.border} bg-[#0B132B]/80 shadow-[0_0_15px_rgba(255,159,28,0.15)]`
                    : 'border-white/10 bg-[#060A12]/50 hover:border-white/20'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-orbitron font-bold text-xs uppercase ${st.color}`}>
                      {st.title}
                    </span>
                    <input
                      type="radio"
                      name="registrationStatus"
                      checked={settings.registrationStatus === st.id}
                      onChange={() => { }}
                      className="accent-amber"
                    />
                  </div>
                  <p className="text-[10px] text-ivory/50">{st.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 3. Live Stream Broadcast */}
        <div className="tick-frame p-6 border border-white/10 bg-[#070B19]/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4 text-amber" />
              <h3 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider">
                ARENA LIVESTREAM BROADCAST
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-[11px] text-ivory/70">
                {settings.liveStreamActive ? 'STREAM LIVE' : 'OFFLINE'}
              </span>
              <input
                type="checkbox"
                checked={settings.liveStreamActive}
                onChange={(e) => setSettings({ ...settings, liveStreamActive: e.target.checked })}
                className="w-4 h-4 accent-amber cursor-pointer"
              />
            </label>
          </div>

          <div>
            <label className="block text-ivory/70 uppercase mb-1.5">
              YOUTUBE / TWITCH BROADCAST STREAM URL
            </label>
            <input
              type="url"
              value={settings.liveStreamUrl}
              onChange={(e) => setSettings({ ...settings, liveStreamUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-amber text-blueprintDeep font-orbitron font-bold text-xs uppercase tracking-wider hover:bg-amberDim transition-all shadow-[0_0_20px_rgba(255,159,28,0.3)] active:scale-98"
          >
            <Check className="w-4 h-4" />
            SAVE & BROADCAST CHANGES
          </button>
        </div>
      </form>
    </div>
  )
}
