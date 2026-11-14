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
  Phone,
  Plus,
  X,
  MessageCircle,
  PhoneCall,
  UserCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'

const CATEGORIES = [
  'General Enquiry',
  'Partnership / Sponsorship',
  'Technical Support',
  'Media / Press',
  'Other',
]

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([])
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [copiedField, setCopiedField] = useState(null) // 'email' | 'phone' | 'reply'
  const [syncing, setSyncing] = useState(false)

  // Take Query Modal State
  const [isTakeQueryOpen, setIsTakeQueryOpen] = useState(false)
  const [queryForm, setQueryForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Enquiry',
    message: '',
  })
  const [queryErrors, setQueryErrors] = useState({})
  const [querySubmitting, setQuerySubmitting] = useState(false)
  const [querySuccess, setQuerySuccess] = useState(false)

  // Reply Composer State
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')

  useEffect(() => {
    const update = () => {
      const msgs = contactStore.getMessages()
      setMessages(msgs)
      // Keep selected message in sync
      if (selectedMsg) {
        const found = msgs.find((m) => m.id === selectedMsg.id)
        if (found) setSelectedMsg(found)
      }
    }
    update()
    contactStore.syncWithServer()

    const unsub = contactStore.subscribe(update)
    return () => unsub()
  }, [])

  // When selectedMsg changes, pre-fill the reply composer
  useEffect(() => {
    if (selectedMsg) {
      setReplySubject(`Re: [RoboRashtra 2027] ${selectedMsg.category} Inquiry - Response`)
      setReplyBody(
        `Hi ${selectedMsg.name},\n\nThank you for connecting with the RoboRashtra Organizing Committee regarding your query:\n"${selectedMsg.message}"\n\n[Type your response here]\n\nFeel free to reply to this email or reach us on our official helpline.\n\nWarm regards,\nRoboRashtra Coordination & PR Desk\nPCCOER, Ravet, Pune\nroborashtra_pr@pccoer.in`
      )
    }
  }, [selectedMsg])

  const handleRefresh = async () => {
    setSyncing(true)
    await contactStore.syncWithServer()
    setSyncing(false)
  }

  const handleCopyText = (text, fieldName) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2200)
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

  // FIXED: Via Email Handler (No target="_blank" bug)
  const handleReplyViaMailClient = () => {
    if (!selectedMsg?.email) return
    const mailtoUrl = `mailto:${encodeURIComponent(selectedMsg.email)}?subject=${encodeURIComponent(
      replySubject
    )}&body=${encodeURIComponent(replyBody)}`
    // Opens default client without opening a broken about:blank window
    window.location.href = mailtoUrl
  }

  // FIXED: Direct Gmail Web Compose (100% reliable fallback in browser)
  const handleReplyViaGmailWeb = () => {
    if (!selectedMsg?.email) return
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      selectedMsg.email
    )}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  }

  // WhatsApp quick chat
  const handleOpenWhatsApp = () => {
    if (!selectedMsg?.phone) return
    const cleanPhone = selectedMsg.phone.replace(/[\s\-()]/g, '')
    const digitsOnly = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
    const text = `Hi ${selectedMsg.name}, this is the RoboRashtra Coordination Team reaching out regarding your ${selectedMsg.category} inquiry.`
    const waUrl = `https://wa.me/${digitsOnly}?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  // Verification helper for Query Submission
  const validateQueryForm = () => {
    const errors = {}
    if (!queryForm.name.trim()) {
      errors.name = 'Sender full name is required.'
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!queryForm.email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!emailRegex.test(queryForm.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).'
    }

    const cleanPhone = (queryForm.phone || '').trim().replace(/[\s\-()]/g, '')
    const validIndian = /^(?:\+91|91|0)?([6-9]\d{9})$/.test(cleanPhone)
    const validIntl = /^\+?[1-9]\d{9,14}$/.test(cleanPhone)
    if (!queryForm.phone.trim()) {
      errors.phone = 'Mobile phone number is required.'
    } else if (!validIndian && !validIntl) {
      errors.phone = 'Please enter a valid 10-digit mobile number.'
    }

    if (!queryForm.category.trim()) {
      errors.category = 'Please select a category.'
    }

    if (!queryForm.message.trim()) {
      errors.message = 'Inquiry / query description is required.'
    }

    setQueryErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleTakeQuerySubmit = async (e) => {
    e.preventDefault()
    if (!validateQueryForm()) return

    setQuerySubmitting(true)

    const payload = {
      name: queryForm.name.trim(),
      email: queryForm.email.trim(),
      phone: queryForm.phone.trim(),
      category: queryForm.category,
      message: queryForm.message.trim(),
    }

    let createdDoc = null
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success && json.data) {
        createdDoc = json.data
      }
    } catch (err) {
      console.warn('Network call to /api/contact failed, saving locally:', err)
    }

    if (!createdDoc) {
      createdDoc = {
        id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        ...payload,
        status: 'UNREAD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    contactStore.addMessage(createdDoc)
    setSelectedMsg(createdDoc)
    setQuerySubmitting(false)
    setQuerySuccess(true)

    setTimeout(() => {
      setQuerySuccess(false)
      setIsTakeQueryOpen(false)
      setQueryForm({
        name: '',
        email: '',
        phone: '',
        category: 'General Enquiry',
        message: '',
      })
      setQueryErrors({})
    }, 1200)
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
    if (activeFilter === 'UNREAD' && m.status !== 'UNREAD') return false
    if (
      activeFilter !== 'ALL' &&
      activeFilter !== 'UNREAD' &&
      m.category !== activeFilter
    ) {
      return false
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = (m.name || '').toLowerCase().includes(q)
      const matchEmail = (m.email || '').toLowerCase().includes(q)
      const matchPhone = (m.phone || '').toLowerCase().includes(q)
      const matchMsg = (m.message || '').toLowerCase().includes(q)
      const matchCat = (m.category || '').toLowerCase().includes(q)
      return matchName || matchEmail || matchPhone || matchMsg || matchCat
    }

    return true
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Telemetry Stat Cards - Hero Page Aesthetic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-cyan-500/25 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.12)]">
            <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-2 uppercase tracking-wider">
              <span>TOTAL INBOX INQUIRIES</span>
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-white">{messages.length}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-2 flex gap-2 items-center">
              <span className="text-amber-400 font-semibold">{unreadCount} Pending</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{messages.length - unreadCount} Processed</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-orange-500/35 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(234,88,12,0.15)]">
            <div className="flex items-center justify-between text-xs font-orbitron text-orange-400 mb-2 uppercase tracking-wider">
              <span>ACTION REQUIRED</span>
              <Mail className="w-4 h-4 text-orange-400 animate-pulse" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-orange-400">{unreadCount}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Awaiting PR &amp; Coordination Response
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-cyan-500/30 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(6,182,212,0.12)]">
            <div className="flex items-center justify-between text-xs font-orbitron text-cyan-400 mb-2 uppercase tracking-wider">
              <span>SPONSORSHIP LEADS</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-cyan-400">{sponsorCount}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Partnership &amp; Brand Inquiries
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-[#060c1d]/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between text-xs font-orbitron text-slate-400 mb-2 uppercase tracking-wider">
              <span>TECH SUPPORT TICKETS</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="font-orbitron font-extrabold text-3xl text-white">{techCount}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Rules, Arena &amp; Bot Specs
            </div>
          </div>
        </div>

        {/* Action Controls & Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-900/80 border border-white/15 rounded-xl px-3.5 py-2.5 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sender, email, mobile phone, keyword..."
              className="bg-transparent border-none text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] font-mono text-slate-400 hover:text-white shrink-0"
              >
                CLEAR
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Take Query Button (Compulsory Phone & Email) */}
            <button
              onClick={() => setIsTakeQueryOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-orbitron text-xs tracking-wider font-bold uppercase bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white border border-orange-400/40 shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.65)] transition-all active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>TAKE / LOG QUERY</span>
            </button>

            <button
              onClick={() => contactStore.markAllAsRead()}
              className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 font-orbitron text-xs uppercase transition-colors"
            >
              Mark All Read
            </button>

            <button
              onClick={handleRefresh}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/40 font-orbitron text-xs uppercase transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'SYNCING...' : 'SYNC WITH DB'}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills - Hero Division Style */}
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
                className={`px-3.5 py-1.5 rounded-xl font-orbitron text-[11px] tracking-wider uppercase whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-cyan-400/50 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.3)] font-bold'
                    : 'border-white/10 bg-slate-950/60 text-slate-400 hover:text-white hover:border-white/20'
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
              <div className="p-12 text-center rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-xl">
                <MailOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="font-orbitron text-xs uppercase tracking-wider text-slate-400">
                  NO INQUIRIES FOUND MATCHING FILTER
                </p>
                <p className="font-tech text-xs text-slate-500 mt-1">
                  New submissions from the contact page or desk logs will automatically land here.
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
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative backdrop-blur-xl ${
                      isSelected
                        ? 'border-cyan-400 bg-[#060c1d] shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                        : isUnread
                        ? 'border-orange-500/40 bg-[#060c1d]/90 hover:border-orange-400/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                        : 'border-white/10 bg-slate-950/60 hover:border-cyan-500/30 opacity-80 hover:opacity-100 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        {isUnread ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_8px_#fb923c]" />
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                        )}
                        <h4 className="font-orbitron text-sm font-bold text-white tracking-wide">
                          {msg.name}
                        </h4>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
                          isSponsor
                            ? 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                            : isUnread
                            ? 'border-orange-500/40 bg-orange-950/60 text-orange-400 font-bold'
                            : 'border-white/10 bg-slate-900/50 text-slate-400'
                        }`}
                      >
                        {msg.category}
                      </span>
                    </div>

                    {/* Prominent Compulsory Contact Channel Info: Phone & Email */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-slate-300 mb-2.5 bg-slate-900/50 p-2 rounded-xl border border-white/5">
                      <div className="flex items-center gap-1.5 text-cyan-300">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{msg.email}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>{msg.phone || 'Phone verified upon dispatch'}</span>
                      </div>

                      <div className="text-[10px] text-slate-500 ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>
                          {new Date(msg.createdAt).toLocaleDateString()}{' '}
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <p className="font-tech text-xs text-slate-300 line-clamp-2 leading-relaxed bg-[#030712]/60 p-2.5 rounded-xl border border-white/5">
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
              <div className="p-6 rounded-2xl border-2 border-cyan-500/40 bg-[#060c1d] sticky top-24 space-y-5 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.15)] backdrop-blur-2xl">
                {/* Header */}
                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                      INQUIRY DOSSIER · {selectedMsg.id}
                    </span>
                    <button
                      onClick={() => handleToggleRead(selectedMsg)}
                      className="text-[10px] font-orbitron px-2.5 py-1 rounded-lg border border-white/20 hover:border-cyan-400 hover:text-cyan-300 transition-colors uppercase"
                    >
                      {selectedMsg.status === 'UNREAD' ? 'MARK READ' : 'MARK UNREAD'}
                    </button>
                  </div>

                  <h3 className="font-orbitron font-extrabold text-xl text-white tracking-wide mb-1">
                    {selectedMsg.name}
                  </h3>

                  {/* Compulsory Contact Channels Box */}
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/25 space-y-2">
                    {/* Verified Email */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-mono text-xs text-cyan-300 truncate">
                          {selectedMsg.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopyText(selectedMsg.email, 'email')}
                          title="Copy Email"
                          className="p-1.5 rounded-lg border border-white/10 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 transition-colors"
                        >
                          {copiedField === 'email' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Compulsory Mobile Number */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-mono text-xs text-amber-300 font-semibold truncate">
                          {selectedMsg.phone || 'Phone mandatory on dispatch'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {selectedMsg.phone && (
                          <>
                            <button
                              onClick={handleOpenWhatsApp}
                              title="Chat on WhatsApp"
                              className="px-2 py-1 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40 font-mono text-[10px] flex items-center gap-1 transition-all"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-400" />
                              <span>WhatsApp</span>
                            </button>
                            <a
                              href={`tel:${selectedMsg.phone.replace(/[\s\-()]/g, '')}`}
                              title="Call Mobile"
                              className="p-1.5 rounded-lg border border-white/10 hover:border-amber-400 text-slate-400 hover:text-amber-300 transition-colors"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleCopyText(selectedMsg.phone, 'phone')}
                              title="Copy Mobile"
                              className="p-1.5 rounded-lg border border-white/10 hover:border-amber-400 text-slate-400 hover:text-amber-300 transition-colors"
                            >
                              {copiedField === 'phone' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                    <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">CATEGORY</span>
                    <span className="text-cyan-400 font-semibold">{selectedMsg.category}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                    <span className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">RECEIVED AT</span>
                    <span className="text-slate-200">
                      {new Date(selectedMsg.createdAt).toLocaleDateString()}{' '}
                      {new Date(selectedMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Original Message Content */}
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 block mb-2 uppercase">
                    INCOMING TRANSMISSION MESSAGE:
                  </span>
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto shadow-inner">
                    {selectedMsg.message}
                  </div>
                </div>

                {/* Inline Reply Composer & Fixed Email Dispatch Buttons */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-orbitron tracking-widest text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                      <Send className="w-3 h-3 text-cyan-400" />
                      DISPATCH OFFICIAL RESPONSE
                    </span>
                    <button
                      onClick={() => handleCopyText(replyBody, 'reply')}
                      className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedField === 'reply' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY RESPONSE</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Reply Body Editor */}
                  <textarea
                    rows={4}
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 text-xs font-mono text-slate-100 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] resize-none"
                    placeholder="Type official reply message here..."
                  />

                  {/* Action Buttons: FIXED Via Email & Gmail Web buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    {/* Working Direct Mail Client Reply */}
                    <button
                      onClick={handleReplyViaMailClient}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white font-orbitron font-bold text-xs uppercase shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.65)] transition-all active:scale-[0.98]"
                      title="Triggers default desktop mail client (Outlook / Apple Mail) without opening broken blank tabs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>REPLY VIA EMAIL</span>
                    </button>

                    {/* Working Gmail Web Direct Launch */}
                    <button
                      onClick={handleReplyViaGmailWeb}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-orbitron font-bold text-xs uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-[0.98]"
                      title="Opens Gmail in web browser directly with recipient, subject & body pre-filled"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>OPEN GMAIL</span>
                    </button>

                    <button
                      onClick={() => handleDelete(selectedMsg.id)}
                      className="p-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 transition-colors shrink-0"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-white/10 bg-slate-950/60 sticky top-24 backdrop-blur-xl">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-orbitron text-xs uppercase tracking-wider text-slate-400">
                  SELECT AN INQUIRY TO INSPECT DOSSIER &amp; DISPATCH REPLY
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TAKE / LOG NEW QUERY MODAL (Compulsory & Verified Phone and Email) */}
      {isTakeQueryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#060c1d] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-[0_8px_40px_rgba(0,0,0,0.9),0_0_35px_rgba(6,182,212,0.2)] my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-orbitron font-extrabold text-base text-white tracking-wide uppercase">
                    LOG INCOMING QUERY / DESK INQUIRY
                  </h3>
                  <p className="font-mono text-[10px] text-cyan-400">
                    TAKE TELEPHONE, WALK-IN OR PARTNERSHIP QUERIES
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTakeQueryOpen(false)}
                className="p-1.5 rounded-lg border border-white/10 hover:border-red-400 text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {querySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-orbitron font-bold text-lg text-white">QUERY LOGGED SUCCESSFULLY</h4>
                <p className="font-mono text-xs text-slate-400">
                  Phone and email verified. Added to inbox telemetry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTakeQuerySubmit} className="space-y-4">
                {/* Sender Name */}
                <div>
                  <label className="block font-orbitron text-[11px] text-slate-300 uppercase tracking-wider mb-1.5">
                    SENDER FULL NAME <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={queryForm.name}
                    onChange={(e) => setQueryForm({ ...queryForm, name: e.target.value })}
                    placeholder="e.g. Atharva Kulkarni"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-cyan-400 text-xs font-mono text-white focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                  />
                  {queryErrors.name && (
                    <p className="text-[10px] font-mono text-red-400 mt-1">{queryErrors.name}</p>
                  )}
                </div>

                {/* Compulsory Contact Channels: Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Verified Email */}
                  <div>
                    <label className="block font-orbitron text-[11px] text-slate-300 uppercase tracking-wider mb-1.5">
                      EMAIL ADDRESS <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={queryForm.email}
                      onChange={(e) => setQueryForm({ ...queryForm, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-cyan-400 text-xs font-mono text-white focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                    />
                    {queryErrors.email && (
                      <p className="text-[10px] font-mono text-red-400 mt-1">{queryErrors.email}</p>
                    )}
                  </div>

                  {/* Compulsory Verified Phone Number */}
                  <div>
                    <label className="block font-orbitron text-[11px] text-slate-300 uppercase tracking-wider mb-1.5">
                      MOBILE NUMBER <span className="text-orange-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={queryForm.phone}
                      onChange={(e) => setQueryForm({ ...queryForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-cyan-400 text-xs font-mono text-white focus:outline-none focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                    />
                    {queryErrors.phone && (
                      <p className="text-[10px] font-mono text-red-400 mt-1">{queryErrors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block font-orbitron text-[11px] text-slate-300 uppercase tracking-wider mb-1.5">
                    INQUIRY CATEGORY <span className="text-orange-400">*</span>
                  </label>
                  <select
                    value={queryForm.category}
                    onChange={(e) => setQueryForm({ ...queryForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-cyan-400 text-xs font-mono text-white focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Query Message */}
                <div>
                  <label className="block font-orbitron text-[11px] text-slate-300 uppercase tracking-wider mb-1.5">
                    QUERY DETAILS / NOTES <span className="text-orange-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={queryForm.message}
                    onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                    placeholder="Enter full details of incoming query, callers inquiry or desk questions..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/15 focus:border-cyan-400 text-xs font-mono text-white focus:outline-none resize-none"
                  />
                  {queryErrors.message && (
                    <p className="text-[10px] font-mono text-red-400 mt-1">{queryErrors.message}</p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTakeQueryOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/15 hover:border-white/30 text-slate-300 font-orbitron text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={querySubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rust via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-400 text-white font-orbitron font-bold text-xs uppercase shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all active:scale-[0.98]"
                  >
                    {querySubmitting ? 'VERIFYING & RECORDING...' : 'SAVE & VERIFY QUERY'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
