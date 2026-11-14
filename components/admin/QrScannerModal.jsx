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
        (decodedText) => {
          handleCodeDetected(decodedText)
        },
        (errorMessage) => {
          // ignore low-level frame parse errors
        }
      )
      setScannerActive(true)
    } catch (err) {
      console.warn('Camera initiation issue:', err)
      setErrorMsg('Camera access unavailable or permission denied. Use Manual Entry below.')
      setScannerActive(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop()
        }
        html5QrCodeRef.current.clear()
      } catch (err) {
        console.warn('Stop scanner cleanup:', err)
      }
      html5QrCodeRef.current = null
    }
    setScannerActive(false)
  }

  const handleCodeDetected = (code) => {
    if (isProcessing) return
    setIsProcessing(true)

    const outcome = tournamentStore.verifyAndCheckInQr(code)
    setScanResult(outcome)

    if (outcome.success) {
      playSuccessBeep()
      if (onCheckInComplete) onCheckInComplete(outcome.team)
    }

    setTimeout(() => {
      setIsProcessing(false)
    }, 1800)
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    handleCodeDetected(manualCode.trim())
    setManualCode('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="tick-frame relative w-full max-w-lg bg-[#070B19] border-2 border-amber/60 text-ivory p-6 shadow-[0_0_40px_rgba(255,159,28,0.25)]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber/30">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber animate-pulse" />
            <div>
              <h3 className="font-orbitron font-bold text-base text-ivory uppercase tracking-wider">
                TACTICAL QR GATE SCANNER
              </h3>
              <p className="font-mono text-[9px] text-ivory/50">ON-SPOT DESK CHECK-IN PROTOCOL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ivory/50 hover:text-amber transition-colors border border-white/10 hover:border-amber/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport Area */}
        <div className="relative w-full aspect-square max-h-[300px] bg-black border border-amber/40 mb-4 overflow-hidden rounded-sm flex items-center justify-center">
          <div id="tactical-qr-reader" className="w-full h-full" />

          {/* HUD Target Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-56 border-2 border-dashed border-amber/60 relative animate-pulse">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber" />

              {/* Laser Scanline */}
              <div
                className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber to-transparent absolute"
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
            className={`p-3 mb-4 border font-mono text-xs flex items-start gap-2.5 ${
              scanResult.success
                ? scanResult.alreadyCheckedIn
                  ? 'border-amber/50 bg-amber/10 text-amber'
                  : 'border-green-500/50 bg-green-500/10 text-green-400'
                : 'border-red-500/50 bg-red-500/10 text-red-400'
            }`}
          >
            {scanResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="font-bold uppercase">
                {scanResult.success
                  ? scanResult.alreadyCheckedIn
                    ? 'ALREADY VERIFIED'
                    : 'CHECK-IN CONFIRMED'
                  : 'AUTHENTICATION FAILED'}
              </div>
              <div className="text-[11px] opacity-90 mt-0.5">{scanResult.message}</div>
              {scanResult.team && (
                <div className="mt-2 text-[10px] p-2 bg-black/40 border border-white/10 space-y-0.5">
                  <div>TEAM: <span className="text-ivory font-bold">{scanResult.team.teamName}</span> ({scanResult.team.id})</div>
                  <div>TRACK: <span className="text-amber">{scanResult.team.trackName}</span></div>
                  <div>PIT ALLOCATION: <span className="text-ivory">{scanResult.team.pitNumber || 'UNASSIGNED'}</span></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Camera error notification if any */}
        {errorMsg && (
          <div className="p-2.5 mb-4 border border-amber/40 bg-amber/10 text-amber font-mono text-[11px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Manual Fallback Input Form */}
        <form onSubmit={handleManualSubmit} className="pt-2 border-t border-white/10">
          <label className="block text-[10px] font-mono text-ivory/60 uppercase mb-1">
            MANUAL ID / TOKEN OVERRIDE ENTRY
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="e.g. RR27-YO-101 or RR-VERIFIED-..."
              className="flex-1 px-3 py-2 bg-[#060A12] border border-amber/30 text-ivory font-mono text-xs focus:border-amber focus:outline-none"
            />
            <button
              type="submit"
              disabled={!manualCode.trim() || isProcessing}
              className="px-4 py-2 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase hover:bg-amberDim transition-colors disabled:opacity-50"
            >
              VERIFY
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
