'use client'

import React from 'react'
import { Trophy, Award, Flame, Crown } from 'lucide-react'

export default function Podium({ topTeams }) {
  if (!topTeams || topTeams.length === 0) return null

  const first = topTeams[0]
  const second = topTeams[1]
  const third = topTeams[2]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-10">
      {/* 2nd Place (Silver) */}
      {second && (
        <div className="tick-frame order-2 md:order-1 p-5 border border-slate-400/50 bg-[#070B19]/90 relative overflow-hidden text-center md:h-[260px] flex flex-col justify-between">
          <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-400 font-bold">
            RANK #02 // SILVER
          </div>
          <div>
            <div className="w-10 h-10 mx-auto mb-2 border border-slate-400/50 bg-slate-400/10 flex items-center justify-center text-slate-300 rounded-sm">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono uppercase text-ivory/50 block tracking-widest">
              {second.trackName}
            </span>
            <h3 className="font-orbitron font-bold text-lg text-ivory uppercase truncate mt-0.5">
              {second.teamName}
            </h3>
            <p className="text-xs font-sans text-ivory/60 truncate mt-0.5">{second.college}</p>
          </div>

          <div className="pt-3 border-t border-white/10">
            <span className="text-[9px] font-mono uppercase text-ivory/40 block">SCORE TALLY</span>
            <div className="font-orbitron font-extrabold text-2xl text-slate-300">
              {second.highestScore}{' '}
              <span className="text-xs font-mono text-ivory/40">PTS</span>
            </div>
          </div>
        </div>
      )}

      {/* 1st Place (Gold / Glowing Amber) */}
      {first && (
        <div className="tick-frame order-1 md:order-2 p-6 border-2 border-amber bg-[#0B132B] relative overflow-hidden text-center md:h-[300px] flex flex-col justify-between shadow-[0_0_35px_rgba(255,159,28,0.25)]">
          <div className="absolute top-0 right-0 left-0 bg-amber/20 text-amber font-mono text-[9px] py-0.5 uppercase tracking-widest font-bold border-b border-amber/40">
            ★ TOURNAMENT LEADER // GOLD ★
          </div>
          <div className="mt-3">
            <div className="w-12 h-12 mx-auto mb-2 border-2 border-amber bg-amber/20 flex items-center justify-center text-amber rounded-sm animate-pulse">
              <Crown className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-mono uppercase text-amber tracking-widest block font-bold">
              {first.trackName}
            </span>
            <h3 className="font-orbitron font-extrabold text-xl text-ivory uppercase truncate mt-1">
              {first.teamName}
            </h3>
            <p className="text-xs font-sans text-ivory/70 truncate mt-0.5">{first.college}</p>
          </div>

          <div className="pt-3 border-t border-amber/30">
            <span className="text-[9px] font-mono uppercase text-ivory/50 block">CHAMPIONSHIP SCORE</span>
            <div className="font-orbitron font-extrabold text-3xl text-amber">
              {first.highestScore}{' '}
              <span className="text-sm font-mono text-ivory/50">PTS</span>
            </div>
          </div>
        </div>
      )}

      {/* 3rd Place (Bronze / Rust) */}
      {third && (
        <div className="tick-frame order-3 md:order-3 p-5 border border-amberDim/50 bg-[#070B19]/90 relative overflow-hidden text-center md:h-[230px] flex flex-col justify-between">
          <div className="absolute top-2 right-2 text-[10px] font-mono text-amberDim font-bold">
            RANK #03 // BRONZE
          </div>
          <div>
            <div className="w-10 h-10 mx-auto mb-2 border border-amberDim/50 bg-amberDim/10 flex items-center justify-center text-amberDim rounded-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono uppercase text-ivory/50 block tracking-widest">
              {third.trackName}
            </span>
            <h3 className="font-orbitron font-bold text-base text-ivory uppercase truncate mt-0.5">
              {third.teamName}
            </h3>
            <p className="text-xs font-sans text-ivory/60 truncate mt-0.5">{third.college}</p>
          </div>

          <div className="pt-3 border-t border-white/10">
            <span className="text-[9px] font-mono uppercase text-ivory/40 block">SCORE TALLY</span>
            <div className="font-orbitron font-extrabold text-2xl text-amberDim">
              {third.highestScore}{' '}
              <span className="text-xs font-mono text-ivory/40">PTS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
