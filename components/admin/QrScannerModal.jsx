'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { tournamentStore } from '@/lib/store/tournamentStore'
import { Camera, CheckCircle2, AlertTriangle, XCircle, Volume2, RefreshCw, X, ShieldAlert } from 'lucide-react'

// Web Audio API beep synthesizer for audio feedback
function playSuccessBeep() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime) // A5 note
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  } catch (e) {
    // Audio context may require prior user interaction
  }
}

export default function QrScannerModal({ isOpen, onClose, onCheckInComplete }) {
  const [scannerActive, setScannerActive] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [manualCode, setManualCode] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const html5QrCodeRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      stopScanner()
      return
    }

    startScanner()

    return () => {
      stopScanner()
    }
  }, [isOpen])

  const startScanner = async () => {
    setErrorMsg('')
    try {
      if (html5QrCodeRef.current) {
        await stopScanner()
      }

      const qrCode = new Html5Qrcode('tactical-qr-reader')
      html5QrCodeRef.current = qrCode

      await qrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          handleScanSuccess(decodedText)
        },
        (errorMessage) => {
          // Ignore transient frame read errors
        }
      )
      setScannerActive(true)
    } catch (err) {
      console.warn('QR camera startup error:', err)
      setErrorMsg('Camera access failed or permission denied. You can use manual token entry below.')
      setScannerActive(false)
    }
  }

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop()
      }
      setScannerActive(false)
    } catch (e) {
      // Ignore cleanup error
    }
  }

  const handleScanSuccess = async (rawCode) => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      let teamId = rawCode.trim()

      // Handle full URL scanned from QR code e.g. https://.../id/RR27-YO-101
      if (teamId.includes('/id/')) {
        const parts = teamId.split('/id/')
        teamId = parts[parts.length - 1].split('?')[0].split('#')[0]
      }

      // Check in with tournament store
      const result = tournamentStore.checkInTeam(teamId)

      if (result.success) {
        playSuccessBeep()
        setScanResult({
          success: true,
          team: result.team,
          message: result.message,
          alreadyCheckedIn: result.alreadyCheckedIn,
        })
        if (onCheckInComplete) {
          onCheckInComplete(result.team)
        }
      } else {
        setScanResult({
          success: false,
          message: result.message || 'Invalid or unregistered team security token.',
        })
      }
    } catch (err) {
      setScanResult({
        success: false,
        message: 'Decryption or verification error.',
      })
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
      }, 1500)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    handleScanSuccess(manualCode.trim())
    setManualCode('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#060c1d] border border-cyan-500/35 rounded-3xl text-slate-100 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.2)]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-cyan-500/25">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Camera className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-orbitron font-extrabold text-base text-white uppercase tracking-wider">
                TACTICAL QR GATE SCANNER
              </h3>
              <p className="font-mono text-[9px] text-cyan-400 tracking-wider">ON-SPOT DESK CHECK-IN PROTOCOL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors border border-white/10 hover:border-cyan-400/50 bg-slate-950/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport Area */}
        <div className="relative w-full aspect-square max-h-[290px] bg-slate-950 border border-cyan-500/40 mb-4 overflow-hidden rounded-2xl flex items-center justify-center shadow-inner">
          <div id="tactical-qr-reader" className="w-full h-full" />

          {/* HUD Target Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-56 border-2 border-dashed border-cyan-500/60 relative animate-pulse">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

              {/* Laser Scanline */}
              <div
                className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute shadow-[0_0_10px_#22d3ee]"
                style={{
                  animation: 'laserSweep 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          <style jsx>{`
            @keyframes laserSweep {
              0% {
                top: 0%;
                opacity: 0.2;
              }
              50% {
                top: 98%;
                opacity: 1;
              }
              100% {
                top: 0%;
                opacity: 0.2;
              }
            }
          `}</style>
        </div>

        {/* Scan Status Toast Result */}
        {scanResult && (
          <div
            className={`p-3.5 mb-4 rounded-xl border font-mono text-xs flex items-start gap-2.5 ${
              scanResult.success
                ? scanResult.alreadyCheckedIn
                  ? 'border-orange-500/50 bg-orange-950/40 text-orange-300'
                  : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                : 'border-red-500/50 bg-red-950/40 text-red-300'
            }`}
          >
            {scanResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            )}
            <div className="flex-1">
              <div className="font-orbitron font-bold uppercase tracking-wider">
                {scanResult.success
                  ? scanResult.alreadyCheckedIn
                    ? 'ALREADY VERIFIED'
                    : 'CHECK-IN CONFIRMED'
                  : 'AUTHENTICATION FAILED'}
              </div>
              <div className="text-[11px] opacity-90 mt-0.5 font-mono">{scanResult.message}</div>
              {scanResult.team && (
                <div className="mt-2 text-[10px] p-2.5 rounded-lg bg-black/60 border border-white/10 space-y-0.5">
                  <div>TEAM: <span className="text-white font-bold">{scanResult.team.teamName}</span> ({scanResult.team.id})</div>
                  <div>TRACK: <span className="text-cyan-300">{scanResult.team.trackName}</span></div>
                  <div>PIT ALLOCATION: <span className="text-white">{scanResult.team.pitNumber || 'UNASSIGNED'}</span></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Camera error notification if any */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl border border-orange-500/40 bg-orange-950/30 text-orange-300 font-mono text-[11px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Manual Fallback Input Form */}
        <form onSubmit={handleManualSubmit} className="pt-2 border-t border-white/10">
          <label className="block text-[10px] font-orbitron text-slate-400 uppercase tracking-wider mb-1.5">
            MANUAL ID / TOKEN OVERRIDE ENTRY
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. RR27-YO-101 or RR-VERIFIED-..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!manualCode.trim() || isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white font-orbitron font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(234,88,12,0.4)] disabled:opacity-50"
            >
              VERIFY
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
