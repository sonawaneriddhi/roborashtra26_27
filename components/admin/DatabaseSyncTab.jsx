'use client'

import React, { useState, useEffect } from 'react'
import { websiteStore } from '@/lib/store/websiteStore'
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  DownloadCloud,
  Key,
  Globe,
  Layers,
  Eye,
  EyeOff,
  RefreshCw,
  Server,
  Zap,
  Check,
} from 'lucide-react'

export default function DatabaseSyncTab() {
  const [config, setConfig] = useState({
    apiKey: '',
    endpoint: 'https://data.mongodb-api.com/app/data-roborashtra/endpoint/data/v1',
    cluster: 'Cluster0',
    database: 'roborashtra',
  })

  const [showKey, setShowKey] = useState(false)
  const [connStatus, setConnStatus] = useState('UNTESTED') // 'UNTESTED' | 'TESTING' | 'CONNECTED' | 'ERROR' | 'NOT_CONFIGURED'
  const [statusMessage, setStatusMessage] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [lastSynced, setLastSynced] = useState(null)

  // Server Driver Status (via /api/db/status)
  const [driverStatus, setDriverStatus] = useState(null)
  const [isCheckingDriver, setIsCheckingDriver] = useState(false)

  const checkServerDriver = async () => {
    setIsCheckingDriver(true)
    try {
      const res = await fetch('/api/db/status')
      const data = await res.json()
      setDriverStatus(data)
      if (data.success && data.status === 'CONNECTED') {
        setConnStatus('CONNECTED')
        setStatusMessage(`Connected to MongoDB Atlas cluster via driver: Database "${data.database}"`)
      }
    } catch (e) {
      console.warn('Driver status check failed:', e)
    } finally {
      setIsCheckingDriver(false)
    }
  }

  useEffect(() => {
    const current = websiteStore.getAtlasConfig()
    setConfig({
      apiKey: current.apiKey || '',
      endpoint: current.endpoint || 'https://data.mongodb-api.com/app/data-roborashtra/endpoint/data/v1',
      cluster: current.cluster || 'Cluster0',
      database: current.database || 'roborashtra',
    })

    // Check server MongoDB driver connection first (runs via npm run dev)
    checkServerDriver()
  }, [])

  const handlePopulateViaServer = async () => {
    setSyncing(true)
    setSyncResult(null)

    try {
      const localState = {
        leads: websiteStore.getLeads(),
        faculty: websiteStore.getFaculty(),
        squads: websiteStore.getSquads(),
        siteSettings: websiteStore.getSiteSettings(),
      }

      const res = await fetch('/api/db/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localState),
      })

      const data = await res.json()
      setSyncing(false)
      setSyncResult(data)

      if (data.success) {
        setConnStatus('CONNECTED')
        setStatusMessage(`Successfully populated database "${data.database}" in MongoDB Atlas!`)
        setLastSynced(new Date().toLocaleTimeString())
        // Refresh driver stats
        checkServerDriver()
      }
    } catch (err) {
      setSyncing(false)
      setSyncResult({
        success: false,
        error: err.message || 'Failed to communicate with sync endpoint',
      })
    }
  }

  const handleTestConnection = async () => {
    setConnStatus('TESTING')
    setStatusMessage('Initiating handshake with MongoDB Atlas cluster...')
    await checkServerDriver()
    const res = await websiteStore.testAtlasConnection()

    if (res.success) {
      setConnStatus('CONNECTED')
      setStatusMessage(res.message || 'Connected to MongoDB Atlas cluster successfully.')
    } else if (driverStatus?.success) {
      setConnStatus('CONNECTED')
      setStatusMessage(`Connected to MongoDB Atlas via server driver: Database "${driverStatus.database}".`)
    } else {
      if (res.reason === 'NOT_CONFIGURED') {
        setConnStatus('NOT_CONFIGURED')
        setStatusMessage(res.message || 'API key missing. Running on local data store.')
      } else {
        setConnStatus('ERROR')
        setStatusMessage(res.message || res.error || 'Failed to authenticate with MongoDB Atlas.')
      }
    }
  }

  const handleSaveConfig = (e) => {
    e.preventDefault()
    websiteStore.saveAtlasConfig(config)
    handleTestConnection()
  }

  return (
    <div className="space-y-6">
      {/* Header & Status Card */}
      <div className="tick-frame p-6 border border-amber/30 bg-[#070B19]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-orbitron font-extrabold text-xl text-ivory uppercase tracking-wider">
              MONGODB ATLAS DATABASE GATEWAY
            </h2>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 border font-bold ${
                connStatus === 'CONNECTED' || driverStatus?.success
                  ? 'border-green-500/50 bg-green-500/15 text-green-400'
                  : 'border-amber/50 bg-amber/15 text-amber'
              }`}
            >
              {connStatus === 'CONNECTED' || driverStatus?.success
                ? 'ATLAS CLUSTER ONLINE'
                : 'LOCAL FALLBACK ACTIVE'}
            </span>
          </div>
          <p className="font-mono text-xs text-ivory/60 mt-1">
            Zero-breakage dual-mode architecture: runs locally out-of-the-box and synchronizes live with MongoDB Atlas cluster.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestConnection}
            disabled={connStatus === 'TESTING' || isCheckingDriver}
            className="flex items-center gap-1.5 px-4 py-2 border border-amber/60 bg-amber/10 text-amber hover:bg-amber/20 font-mono text-xs uppercase transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${connStatus === 'TESTING' || isCheckingDriver ? 'animate-spin' : ''}`}
            />
            TEST CLUSTER
          </button>
        </div>
      </div>

      {/* Primary Cloud Seeding Banner */}
      <div className="tick-frame p-6 border-2 border-amber/60 bg-[#0B132B]/90 shadow-[0_0_35px_rgba(255,159,28,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber animate-pulse" />
            <span className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider">
              SEED &amp; POPULATE MONGODB ATLAS
            </span>
          </div>
          <p className="font-mono text-xs text-ivory/70 max-w-2xl">
            Click this button to immediately connect to your MongoDB Atlas cluster (`cluster0.oalk8fx.mongodb.net`) and write all Executive Leads, Faculty Mentors, Club Squads, and Site Settings into the `roborashtra` database.
          </p>
          {driverStatus?.documentCounts && (
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-ivory/60">
              <span className="text-amber">Live Atlas Counts:</span>
              <span>Leads: {driverStatus.documentCounts.leads || 0}</span> •
              <span>Faculty: {driverStatus.documentCounts.faculty || 0}</span> •
              <span>Squads: {driverStatus.documentCounts.squads || 0}</span> •
              <span>Settings: {driverStatus.documentCounts.site_settings || 0}</span>
            </div>
          )}
        </div>

        <button
          onClick={handlePopulateViaServer}
          disabled={syncing}
          className="px-6 py-3 bg-amber text-blueprintDeep font-orbitron font-extrabold text-xs uppercase tracking-wider hover:bg-amberDim transition-all shadow-[0_0_25px_rgba(255,159,28,0.35)] shrink-0 active:scale-98 flex items-center gap-2"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              WRITING TO ATLAS...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              POPULATE MONGODB ATLAS NOW
            </>
          )}
        </button>
      </div>

      {/* Sync Success / Error Notification */}
      {syncResult && (
        <div
          className={`p-4 border font-mono text-xs flex items-start gap-3 ${
            syncResult.success
              ? 'border-green-500/50 bg-green-500/15 text-green-300'
              : 'border-red-500/50 bg-red-500/15 text-red-300'
          }`}
        >
          {syncResult.success ? (
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-bold uppercase mb-1">
              {syncResult.success ? 'SUCCESSFULLY POPULATED MONGODB ATLAS!' : 'SYNC ERROR'}
            </div>
            <div>{syncResult.message || syncResult.error}</div>
            {syncResult.counts && (
              <div className="mt-2 text-[11px] text-ivory/80 flex flex-wrap gap-3">
                <span>Leads in Atlas: {syncResult.counts.leads}</span>
                <span>Faculty: {syncResult.counts.faculty}</span>
                <span>Squads: {syncResult.counts.squads}</span>
                <span>Settings: {syncResult.counts.site_settings}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid: Credentials Form & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Atlas Data API Credentials (7 Cols) */}
        <div className="lg:col-span-7 tick-frame p-6 border border-white/10 bg-[#070B19]/80">
          <h3 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider mb-2 flex items-center gap-2">
            <Key className="w-4 h-4 text-amber" />
            ATLAS DATA API / KEY CONFIGURATION
          </h3>
          <p className="font-mono text-xs text-ivory/60 mb-4">
            Optional HTTPS Data API Key configuration for pure client-side static environments.
          </p>

          <form onSubmit={handleSaveConfig} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-ivory/70 uppercase mb-1">ATLAS DATA API KEY</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Paste your MongoDB Atlas Data API Key (if using Data API)"
                  className="w-full pl-3 pr-10 py-2.5 bg-[#060A12] border border-amber/40 text-ivory focus:border-amber focus:outline-none tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/50 hover:text-amber"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-ivory/70 uppercase mb-1">DATA API ENDPOINT URL</label>
              <input
                type="text"
                value={config.endpoint}
                onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                placeholder="https://data.mongodb-api.com/app/.../endpoint/data/v1"
                className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none text-[11px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-ivory/70 uppercase mb-1">CLUSTER NAME</label>
                <input
                  type="text"
                  value={config.cluster}
                  onChange={(e) => setConfig({ ...config, cluster: e.target.value })}
                  placeholder="Cluster0"
                  className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-ivory/70 uppercase mb-1">DATABASE NAME</label>
                <input
                  type="text"
                  value={config.database}
                  onChange={(e) => setConfig({ ...config, database: e.target.value })}
                  placeholder="roborashtra"
                  className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-amber text-blueprintDeep font-bold uppercase hover:bg-amberDim transition-all shadow-[0_0_15px_rgba(255,159,28,0.25)]"
              >
                SAVE DATA API CONFIG
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Cluster Telemetry Details (5 Cols) */}
        <div className="lg:col-span-5 tick-frame p-6 border border-amber/30 bg-[#0B132B]/80 flex flex-col justify-between">
          <div>
            <h3 className="font-orbitron font-bold text-sm text-ivory uppercase tracking-wider mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-amber" />
              CLUSTER TELEMETRY
            </h3>
            <p className="font-mono text-xs text-ivory/60 mb-5">
              Live connection telemetry from your Atlas cluster instance.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 border border-white/10 bg-[#060A12]">
                <div className="text-ivory/50 text-[10px] uppercase">CLUSTER HOST</div>
                <div className="text-ivory font-bold truncate">cluster0.oalk8fx.mongodb.net</div>
              </div>

              <div className="p-3 border border-white/10 bg-[#060A12]">
                <div className="text-ivory/50 text-[10px] uppercase">DATABASE NAME</div>
                <div className="text-amber font-bold truncate">roborashtra</div>
              </div>

              <div className="p-3 border border-white/10 bg-[#060A12]">
                <div className="text-ivory/50 text-[10px] uppercase">STATUS</div>
                <div className="text-green-400 font-bold truncate">
                  {driverStatus?.status || 'READY FOR SEEDING'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-ivory/40">
            {lastSynced ? `LAST SYNCED AT ${lastSynced}` : 'AWAITING INITIAL CLOUD SEED'}
          </div>
        </div>
      </div>
    </div>
  )
}
