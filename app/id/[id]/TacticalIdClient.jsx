'use client'

import React, { useEffect, useState } from 'react'
import { tournamentStore } from '@/lib/store/tournamentStore'
import TacticalIdCard from '@/components/id/TacticalIdCard'
import { Loader2 } from 'lucide-react'

export default function TacticalIdClient({ initialId }) {
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTeam = () => {
      const found = tournamentStore.getRegistrationById(initialId)
      setTeam(found)
      setLoading(false)
    }

    loadTeam()
    const unsubscribe = tournamentStore.subscribe(loadTeam)
    return () => unsubscribe()
  }, [initialId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-ivory/60 font-mono text-xs gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-amber" />
        <span>DECRYPTING TELEMETRY PASS...</span>
      </div>
    )
  }

  return <TacticalIdCard team={team} />
}
