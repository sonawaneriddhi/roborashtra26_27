'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { contactStore } from '@/lib/store/contactStore'
import {
  Mail,
  MailOpen,
  Send,
  Trash2,
  CheckCircle,
  Clock,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([])
  const [activeFilter, setActiveFilter] = useState('ALL') // ALL | UNREAD | General Enquiry | Partnership / Sponsorship | Technical Support | Media / Press | Other
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const update = () => {
      setMessages(contactStore.getMessages())
    }
    update()
    contactStore.syncWithServer()

    const unsub = contactStore.subscribe(update)
    return () => unsub()
  }, [])

  const handleRefresh = async () => {
    setSyncing(true)
    await contactStore.syncWithServer()
    setSyncing(false)
  }

  const handleCopyEmail = (email, id) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(email)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const handleToggleRead = (msg) => {
    if (msg.status === 'UNREAD') {
      contactStore.markAsRead(msg.id)
    } else {
      contactStore.markAsUnread(msg.id)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this inquiry permanently?')) {
      contactStore.deleteMessage(id)
      if (selectedMsg?.id === id) setSelectedMsg(null)
    }
  }

  const unreadCount = messages.filter((m) => m.status === 'UNREAD').length
  const sponsorCount = messages.filter((m) =>
    (m.category || '').toLowerCase().includes('partner') || (m.category || '').toLowerCase().includes('sponsor')
  ).length
  const techCount = messages.filter((m) =>
    (m.category || '').toLowerCase().includes('tech')
  ).length

  // Filter & Search Logic
  const filteredMessages = messages.filter((m) => {
    // Tab filter
    if (activeFilter === 'UNREAD' && m.status !== 'UNREAD') return false
    if (
      activeFilter !== 'ALL' &&
      activeFilter !== 'UNREAD' &&
      m.category !== activeFilter
    ) {
      return false
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = (m.name || '').toLowerCase().includes(q)
      const matchEmail = (m.email || '').toLowerCase().includes(q)
      const matchMsg = (m.message || '').toLowerCase().includes(q)
      const matchCat = (m.category || '').toLowerCase().includes(q)
      return matchName || matchEmail || matchMsg || matchCat
    }

    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="tick-frame p-5 border border-amber/30 bg-[#0B132B]/70">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/50 mb-2 uppercase">
              <span>TOTAL INBOX INQUIRIES</span>
              <MessageSquare className="w-4 h-4 text-amber" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-ivory">{messages.length}</div>
            <div className="text-[10px] font-mono text-ivory/50 mt-1 flex gap-2">
              <span className="text-amber">{unreadCount} Unread</span>
              <span>•</span>
              <span className="text-green-400">{messages.length - unreadCount} Processed</span>
            </div>
          </div>

          <div className="tick-frame p-5 border border-amber/50 bg-[#0B132B]/70 shadow-[0_0_15px_rgba(255,159,28,0.15)]">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/50 mb-2 uppercase">
              <span>ACTION REQUIRED (UNREAD)</span>
              <Mail className="w-4 h-4 text-amber animate-pulse" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-amber">{unreadCount}</div>
            <div className="text-[10px] font-mono text-ivory/50 mt-1">
              Awaiting PR &amp; Coordination Response
            </div>
          </div>

          <div className="tick-frame p-5 border border-cyan-500/30 bg-[#0B132B]/70">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/50 mb-2 uppercase">
              <span>SPONSORSHIP LEADS</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-cyan-400">{sponsorCount}</div>
            <div className="text-[10px] font-mono text-ivory/50 mt-1">
              Partnership &amp; Brand Inquiries
            </div>
          </div>

          <div className="tick-frame p-5 border border-white/10 bg-[#0B132B]/70">
            <div className="flex items-center justify-between text-xs font-mono text-ivory/50 mb-2 uppercase">
              <span>TECH SUPPORT TICKETS</span>
              <Clock className="w-4 h-4 text-ivory/50" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-ivory">{techCount}</div>
            <div className="text-[10px] font-mono text-ivory/50 mt-1">
              Rules, Arena &amp; Bot Specs
            </div>
          </div>
        </div>

        {/* Action Controls & Search Bar */}
        <div className="tick-frame p-4 bg-[#070B19]/80 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-[#060A12] border border-white/15 px-3 py-2">
            <Search className="w-4 h-4 text-ivory/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sender, email, keyword..."
              className="bg-transparent border-none text-xs font-mono text-ivory placeholder:text-ivory/30 focus:outline-none w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] font-mono text-ivory/40 hover:text-ivory"
              >
                CLEAR
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => contactStore.markAllAsRead()}
              className="px-3 py-2 border border-white/15 bg-white/5 hover:bg-white/10 text-ivory font-mono text-xs uppercase transition-colors"
            >
              Mark All Read
            </button>

            <button
              onClick={handleRefresh}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-2 border border-amber/50 bg-amber/10 text-amber hover:bg-amber/20 font-mono text-xs uppercase transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'SYNCING...' : 'SYNC WITH DB'}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'ALL', label: `ALL (${messages.length})` },
            { id: 'UNREAD', label: `UNREAD (${unreadCount})` },
            { id: 'Partnership / Sponsorship', label: `SPONSORS (${sponsorCount})` },
            { id: 'Technical Support', label: `TECH SUPPORT (${techCount})` },
            { id: 'General Enquiry', label: 'GENERAL' },
            { id: 'Media / Press', label: 'PRESS' },
            { id: 'Other', label: 'OTHER' },
          ].map((tab) => {
            const isActive = activeFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase whitespace-nowrap transition-all border ${
                  isActive
                    ? 'border-amber bg-amber/15 text-amber font-bold shadow-[0_0_8px_rgba(255,159,28,0.2)]'
                    : 'border-white/10 bg-[#0B132B]/40 text-ivory/60 hover:text-ivory hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Messages List & Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List Column */}
          <div className="lg:col-span-7 space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="tick-frame p-12 text-center border border-white/10 bg-[#070B19]/50">
                <MailOpen className="w-10 h-10 text-ivory/20 mx-auto mb-3" />
                <p className="font-mono text-xs uppercase tracking-wider text-ivory/40">
                  NO INQUIRIES FOUND MATCHING FILTER
                </p>
                <p className="font-mono text-[10px] text-ivory/30 mt-1">
                  New submissions from the contact page will automatically land here.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMsg?.id === msg.id
                const isUnread = msg.status === 'UNREAD'
                const isSponsor = (msg.category || '').toLowerCase().includes('sponsor')

                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMsg(msg)
                      if (isUnread) contactStore.markAsRead(msg.id)
                    }}
                    className={`tick-frame p-4 border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-amber bg-[#0B132B] shadow-[0_0_15px_rgba(255,159,28,0.15)]'
                        : isUnread
                        ? 'border-amber/40 bg-[#070B19]/90 hover:border-amber/60'
                        : 'border-white/10 bg-[#070B19]/50 hover:border-white/25 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {isUnread ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber shadow-[0_0_8px_#ff9f1c]" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        )}
                        <h4 className="font-mono text-sm font-bold text-ivory tracking-wide">
                          {msg.name}
                        </h4>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 border uppercase ${
                          isSponsor
                            ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-bold'
                            : isUnread
                            ? 'border-amber/40 bg-amber/10 text-amber font-bold'
                            : 'border-white/10 text-ivory/40'
                        }`}
                      >
                        {msg.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-ivory/60 mb-2">
                      <span>{msg.email}</span>
                      <span>•</span>
                      <span className="text-[10px] text-ivory/40">
                        {new Date(msg.createdAt).toLocaleDateString()}{' '}
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="font-mono text-xs text-ivory/80 line-clamp-2 leading-relaxed bg-[#060A12]/50 p-2 border border-white/5">
                      {msg.message}
                    </p>
                  </div>
                )
              })
            )}
          </div>

          {/* Message Detail Inspector Column */}
          <div className="lg:col-span-5">
            {selectedMsg ? (
              <div className="tick-frame p-6 border-2 border-amber/40 bg-[#070B19] sticky top-28 space-y-5 shadow-[0_0_20px_rgba(255,159,28,0.1)]">
                {/* Header */}
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-amber uppercase">
                      INQUIRY DOSSIER • {selectedMsg.id}
                    </span>
                    <button
                      onClick={() => handleToggleRead(selectedMsg)}
                      className="text-[10px] font-mono px-2 py-0.5 border border-white/20 hover:border-amber hover:text-amber transition-colors"
                    >
                      {selectedMsg.status === 'UNREAD' ? 'MARK READ' : 'MARK UNREAD'}
                    </button>
                  </div>

                  <h3 className="font-orbitron font-extrabold text-xl text-ivory tracking-wide mb-1">
                    {selectedMsg.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2">
                    <a
                      href={`mailto:${selectedMsg.email}`}
                      className="font-mono text-xs text-cyan-400 hover:underline"
                    >
                      {selectedMsg.email}
                    </a>
                    <button
                      onClick={() => handleCopyEmail(selectedMsg.email, selectedMsg.id)}
                      title="Copy Email"
                      className="p-1 text-ivory/40 hover:text-ivory"
                    >
                      {copiedId === selectedMsg.id ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-[#0B132B]/60 border border-white/10">
                    <span className="text-[10px] text-ivory/40 block mb-1 uppercase">CATEGORY</span>
                    <span className="text-amber font-semibold">{selectedMsg.category}</span>
                  </div>
                  <div className="p-2.5 bg-[#0B132B]/60 border border-white/10">
                    <span className="text-[10px] text-ivory/40 block mb-1 uppercase">DATE RECEIVED</span>
                    <span className="text-ivory">
                      {new Date(selectedMsg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-ivory/40 block mb-2 uppercase">
                    MESSAGE TRANSMISSION BODY:
                  </span>
                  <div className="p-4 bg-[#060A12] border border-white/15 text-xs font-mono text-ivory/90 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                    {selectedMsg.message}
                  </div>
                </div>

                {/* Response Actions */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                  <a
                    href={`mailto:${selectedMsg.email}?subject=${encodeURIComponent(
                      `Re: [RoboRashtra 2027] ${selectedMsg.category} Inquiry`
                    )}&body=${encodeURIComponent(
                      `Hi ${selectedMsg.name},\n\nThank you for reaching out to RoboRashtra PR & Coordination Team regarding: "${selectedMsg.category}".\n\n[Write your response here]\n\nBest regards,\nRoboRashtra PR Lead\nPCCOER, Pune\nroborashtra_pr@pccoer.in`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber text-blueprintDeep font-mono font-bold text-xs uppercase hover:bg-amberDim transition-all shadow-[0_0_12px_rgba(255,159,28,0.25)]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>REPLY VIA EMAIL</span>
                  </a>

                  <button
                    onClick={() => handleDelete(selectedMsg.id)}
                    className="p-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="tick-frame p-8 text-center border border-white/10 bg-[#070B19]/30 sticky top-28">
                <MessageSquare className="w-8 h-8 text-ivory/20 mx-auto mb-2" />
                <p className="font-mono text-xs uppercase tracking-wider text-ivory/40">
                  SELECT AN INQUIRY TO INSPECT DOSSIER &amp; REPLY
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
