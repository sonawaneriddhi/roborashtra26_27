'use client'

import React, { useState, useEffect } from 'react'
import { websiteStore } from '@/lib/store/websiteStore'
import { Radio, X, Bell } from 'lucide-react'

export default function AnnouncementBanner() {
  const [settings, setSettings] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setSettings(websiteStore.getSiteSettings())
    const unsubscribe = websiteStore.subscribe(() => {
      setSettings(websiteStore.getSiteSettings())
    })
    return () => unsubscribe()
  }, [])

  if (!settings || !settings.announcementActive || !settings.announcementText || dismissed) {
    return null
  }

  const borderStyles = {
    info: 'border-amber/40 bg-[#070B19]/95 text-amber',
    warning: 'border-orange-500/40 bg-[#120B07]/95 text-orange-400',
    urgent: 'border-red-500/50 bg-[#14070A]/95 text-red-400 animate-pulse',
    live: 'border-green-500/40 bg-[#07140B]/95 text-green-400',
  }

  const styleClass = borderStyles[settings.announcementType] || borderStyles.info

  return (
    <div
      role="alert"
      className={`fixed top-0 left-0 right-0 z-[60] border-b backdrop-blur-md px-3 py-1.5 flex items-center justify-between text-xs font-mono shadow-[0_2px_15px_rgba(0,0,0,0.5)] ${styleClass}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 flex-1 text-center truncate px-2">
        <span className="w-2 h-2 rounded-full bg-current shrink-0 animate-ping" />
        <span className="text-[11px] font-bold tracking-wider uppercase truncate">
          {settings.announcementText}
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        className="p-1 opacity-60 hover:opacity-100 transition-opacity shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
