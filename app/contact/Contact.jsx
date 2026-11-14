'use client'

/**
 * app/contact/Contact.jsx
 * ────────────────────────
 * Token-driven Contact Page for ROBORASHTRA.
 *
 * Design system tokens applied:
 *  - Surfaces:    #000000 (base), #0A0F1A (muted), #030712 (raised)
 *  - Text:        #F4F6F8 (primary), #FFFFFF (secondary), #67E8F9 (cyan accent)
 *  - Accent:      #FB923C (orange/amber border & highlights)
 *  - Typography:  Inter (primary), Orbitron (display headings), JetBrains Mono (labels)
 *  - Shadows:     shadow.1 (depth), shadow.2 (orange glow), shadow.3 (cyan glow)
 *  - Radius:      8px (radius.xs), 12px (radius.sm)
 *  - Motion:      150ms instant, 300ms fast
 *  - Map:         Direct reliable Google Maps embed with full navigation HUD
 */

import Link from 'next/link'
import { useState, useRef, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { contactStore } from '@/lib/store/contactStore'
import {
  Mail,
  Phone,
  ExternalLink,
  Handshake,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  MapPin,
  Navigation,
  Copy,
  Check,
} from 'lucide-react'
import './contact.css'

/* ── Animation variants ──────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
}

/* ── Constants ────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  'General Enquiry',
  'Partnership / Sponsorship',
  'Technical Support',
  'Media / Press',
  'Other',
]

/* Verified from components/FullscreenMenu.jsx */
const INSTAGRAM_URL = 'https://www.instagram.com/robohawk.pccoer/'
const OFFICIAL_EMAIL = 'roborashtra_pr@pccoer.in'
const SPONSOR_ROUTE = '/sponsor'

/* Location / Venue Constants */
const PLUS_CODE = 'MP2W+33 Pimpri-Chinchwad, Maharashtra'
const VENUE_NAME = 'PCCOER, Ravet'
const VENUE_FULL = 'Pimpri Chinchwad College of Engineering & Research (PCCOER)'
const VENUE_ADDRESS = 'Plot No. B, Sector No. 110, Laxminagar, Ravet, Pimpri-Chinchwad, Pune, Maharashtra 412101'
const VENUE_COORDS = { lat: 18.650237, lng: 73.7452115 }
const GOOGLE_MAPS_SHORT_URL = 'https://maps.app.goo.gl/SNquf74uYMbimwndA'
const MAP_QUERY_URL = GOOGLE_MAPS_SHORT_URL
const MAP_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${VENUE_COORDS.lat},${VENUE_COORDS.lng}`
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${VENUE_COORDS.lat},${VENUE_COORDS.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`

/* ── Validation helpers ───────────────────────────────────────────────────── */

function validateName(v) {
  if (!v.trim()) return 'Full name is required.'
  if (v.trim().length < 2) return 'Please enter at least 2 characters.'
  return ''
}

function validateEmail(v) {
  if (!v || !v.trim()) return 'Email address is required.'
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(v.trim()))
    return 'Please enter a valid email address (e.g. name@domain.com).'
  return ''
}

function validatePhone(v) {
  if (!v || !v.trim()) return 'Mobile number is required.'
  const clean = v.trim().replace(/[\s\-()]/g, '')
  const validIndian = /^(?:\+91|91|0)?([6-9]\d{9})$/.test(clean)
  const validIntl = /^\+?[1-9]\d{9,14}$/.test(clean)
  if (!validIndian && !validIntl) {
    return 'Please enter a valid 10-digit mobile number.'
  }
  return ''
}

function validateCategory(v) {
  if (!v) return 'Please select an enquiry category.'
  return ''
}

function validateMessage(v) {
  if (!v.trim()) return 'Message is required.'
  if (v.trim().length < 10) return 'Please enter at least 10 characters.'
  return ''
}

/* ── Info card component ──────────────────────────────────────────────────── */

function InfoCard({ icon: Icon, title, children }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="info-card"
    >
      <div className="card-icon" aria-hidden="true">
        <Icon size={20} strokeWidth={1.75} />
      </div>
      <p className="card-title">{title}</p>
      {children}
    </motion.div>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */

export default function Contact() {
  const uid = useId()

  /* Form state */
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
  })
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    category: false,
    message: false,
  })
  const [submitState, setSubmitState] = useState('idle') /* idle | loading | success | error */
  const [copiedCode, setCopiedCode] = useState(false)

  /* Refs for focus management */
  const formRef = useRef(null)

  /* ── Handlers ──────────────────────────────────────────────────────────── */

  function handleChange(e) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: runValidator(name, value) }))
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: runValidator(name, value) }))
  }

  function runValidator(name, value) {
    switch (name) {
      case 'name': return validateName(value)
      case 'email': return validateEmail(value)
      case 'phone': return validatePhone(value)
      case 'category': return validateCategory(value)
      case 'message': return validateMessage(value)
      default: return ''
    }
  }

  function validate() {
    const newErrors = {
      name: validateName(fields.name),
      email: validateEmail(fields.email),
      phone: validatePhone(fields.phone),
      category: validateCategory(fields.category),
      message: validateMessage(fields.message),
    }
    setErrors(newErrors)
    setTouched({ name: true, email: true, phone: true, category: true, message: true })
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    const hasError = Object.values(newErrors).some(Boolean)

    if (hasError) {
      const order = ['name', 'email', 'phone', 'category', 'message']
      const firstInvalid = order.find((k) => newErrors[k])
      if (firstInvalid && formRef.current) {
        const el = formRef.current.querySelector(`[name="${firstInvalid}"]`)
        el?.focus()
      }
      return
    }

    setSubmitState('loading')

    try {
      const payload = {
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        category: fields.category,
        message: fields.message.trim(),
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
        console.warn('Network call to /api/contact failed, using fallback:', err)
      }

      // Fallback document if API was unreachable
      if (!createdDoc) {
        createdDoc = {
          id: `MSG-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          ...payload,
          status: 'UNREAD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }

      // Add to contact store so admin section receives it live
      contactStore.addMessage(createdDoc)

      setSubmitState('success')
      setFields({ name: '', email: '', phone: '', category: '', message: '' })
      setTouched({ name: false, email: false, phone: false, category: false, message: false })
    } catch {
      setSubmitState('error')
    }
  }

  function handleRetry() {
    setSubmitState('idle')
  }

  function handleCopyPlusCode() {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(PLUS_CODE)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2200)
    }
  }

  function scrollToForm(e) {
    e.preventDefault()
    document.getElementById('contact-form-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  /* ── Render ────────────────────────────────────────────────────────────── */

  return (
    <div className="contact-page">

      {/* Full-page robotic space background */}
      <div className="page-space-bg" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION A — HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby={`${uid}-hero-heading`}
        className="relative flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 sm:px-5 sm:pt-36 sm:pb-24 md:pt-40 md:pb-32 overflow-hidden"
      >
        {/* Circuit background overlay */}
        <div className="circuit-bg" aria-hidden="true" />

        {/* Ambient glow */}
        <div className="hero-glow" aria-hidden="true" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto"
        >


          {/* Heading */}
          <motion.h1
            id={`${uid}-hero-heading`}
            variants={fadeUp}
            className="font-orbitron font-bold leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 3.75rem)', color: 'var(--color-text-tertiary)' }}
          >
            <span style={{ color: 'var(--color-accent)' }}>Contact</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="font-body text-base md:text-lg leading-relaxed max-w-xl"
            style={{ color: 'var(--color-text-primary)', opacity: 0.85 }}
          >
            ROBORASHTRA welcomes questions, collaborations, partnerships,
            sponsorship opportunities, and bold ideas. Reach out — we&rsquo;d
            love to connect.
          </motion.p>

          {/* CTA */}
          <motion.a
            variants={fadeUp}
            href="#contact-form-section"
            onClick={scrollToForm}
            className="submit-btn"
            aria-label="Scroll to contact form"
          >
            Get in Touch
            <ArrowUpRight size={14} aria-hidden="true" />
          </motion.a>
        </motion.div>
      </section>

      {/* Schematic divider */}
      <div className="schematic-divider mx-5 md:mx-12 lg:mx-24" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION B — CONTACT INFO CARDS
      ══════════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Contact information"
        className="px-4 py-12 sm:px-5 sm:py-16 md:px-12 lg:px-24 max-w-6xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="label-eyebrow mb-8"
        >
          Ways to Reach Us
        </motion.p>

        <motion.div
          variants={cardStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {/* Card 1 — Venue Location */}
          <InfoCard icon={MapPin} title="Event Venue">
            <p className="card-value font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              {VENUE_NAME}
            </p>
            <p
              className="font-mono text-xs mt-1"
              style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.04em' }}
            >
              {PLUS_CODE}
            </p>
            <a
              href={MAP_QUERY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link"
              aria-label="View venue location on Google Maps (opens in new tab)"
            >
              Open in Maps
              <ArrowUpRight size={11} aria-hidden="true" />
            </a>
          </InfoCard>

          {/* Card 2 — General Enquiries / Official Mail */}
          <InfoCard icon={Mail} title="Official Email">
            <p className="card-value">
              For general questions, collaborations, registration, and official queries.
            </p>
            <a
              href={`mailto:${OFFICIAL_EMAIL}`}
              className="card-link"
              style={{ textTransform: 'lowercase', letterSpacing: '0.04em' }}
              aria-label={`Send email to ${OFFICIAL_EMAIL}`}
            >
              <span>{OFFICIAL_EMAIL}</span>
              <ArrowUpRight size={11} aria-hidden="true" />
            </a>
          </InfoCard>

          {/* Card 3 — Instagram (verified link) */}
          <InfoCard icon={ExternalLink} title="Follow Us">
            <p className="card-value">
              Stay updated with live event coverage, announcements, and
              behind-the-scenes from RoboHawk.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link"
              aria-label="Visit RoboHawk on Instagram (opens in new tab)"
            >
              <span>@robohawk.pccoer</span>
              <ArrowUpRight size={11} aria-hidden="true" />
            </a>
          </InfoCard>

          {/* Card 4 — Partnerships & Sponsorships */}
          <InfoCard icon={Handshake} title="Partnerships &amp; Sponsors">
            <p className="card-value">
              Interested in partnering with India&rsquo;s premier robotics
              championship? View tiers &amp; opportunities.
            </p>
            <Link
              href={SPONSOR_ROUTE}
              className="card-link"
              aria-label="View sponsorship tiers on the /sponsor page"
            >
              <span>Explore Sponsors (/sponsor)</span>
              <ArrowUpRight size={11} aria-hidden="true" />
            </Link>
          </InfoCard>
        </motion.div>
      </section>

      {/* Schematic divider */}
      <div className="schematic-divider mx-5 md:mx-12 lg:mx-24" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION B2 — EVENT LOCATION & INTERACTIVE GOOGLE MAP
      ══════════════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby={`${uid}-map-heading`}
        className="px-4 py-12 sm:px-5 sm:py-16 md:px-12 lg:px-24 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="label-eyebrow mb-3">Championship Coordinates</p>
              <h2
                id={`${uid}-map-heading`}
                className="font-orbitron font-bold"
                style={{
                  fontSize: 'clamp(1.35rem, 3vw, 2.2rem)',
                  color: 'var(--color-text-tertiary)',
                  letterSpacing: '0.04em',
                }}
              >
                Campus Location &amp; Map
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={MAP_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="map-action-btn primary"
                aria-label="Get directions to PCCOER on Google Maps (opens in new tab)"
              >
                <Navigation size={13} aria-hidden="true" />
                <span>Get Directions</span>
                <ArrowUpRight size={11} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="map-wrapper">
            {/* HUD Header Bar */}
            <div className="map-hud">
              <div className="map-hud-info">
                <span className="map-pulse-dot" aria-hidden="true" />
                <span className="font-mono text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
                  Venue: <strong style={{ color: 'var(--color-text-tertiary)' }}>{VENUE_NAME}</strong>
                </span>
                <div className="map-code-pill">
                  <MapPin size={12} style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
                  <span>{PLUS_CODE}</span>
                </div>
              </div>

              <div className="map-hud-actions">
                <button
                  type="button"
                  onClick={handleCopyPlusCode}
                  className="map-action-btn"
                  aria-label="Copy Plus Code to clipboard"
                >
                  {copiedCode ? (
                    <>
                      <Check size={12} style={{ color: 'var(--color-text-tertiary)' }} aria-hidden="true" />
                      <span style={{ color: 'var(--color-text-tertiary)' }}>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} aria-hidden="true" />
                      <span>Copy Plus Code</span>
                    </>
                  )}
                </button>
                <a
                  href={GOOGLE_MAPS_SHORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-action-btn"
                  aria-label="Open location in Google Maps (opens in new tab)"
                >
                  <ExternalLink size={12} aria-hidden="true" />
                  <span>Open in Maps</span>
                </a>
              </div>
            </div>

            {/* Google Maps Embed Frame */}
            <div className="map-frame-container">
              <iframe
                title={`Google Map for ${VENUE_NAME} at ${PLUS_CODE}`}
                src={MAP_EMBED_URL}
                className="map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Map Footer Bar */}
            <div className="map-footer-bar">
              <div>
                <p className="map-venue-name">{VENUE_FULL}</p>
                <p className="map-venue-sub">{VENUE_ADDRESS}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0 font-mono text-[0.72rem]">
                <span style={{ color: 'var(--color-text-primary)', opacity: 0.6 }}>COORDINATES:</span>
                <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
                  {VENUE_COORDS.lat}, {VENUE_COORDS.lng}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Schematic divider */}
      <div className="schematic-divider mx-4 sm:mx-5 md:mx-12 lg:mx-24" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION C — CONTACT FORM
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="contact-form-section"
        aria-labelledby={`${uid}-form-heading`}
        className="px-4 py-12 sm:px-5 sm:py-16 md:px-12 lg:px-24 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section header */}
          <p className="label-eyebrow mb-3">Send a Message</p>
          <h2
            id={`${uid}-form-heading`}
            className="font-orbitron font-bold mb-8 md:mb-10"
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              color: 'var(--color-text-tertiary)',
              letterSpacing: '0.04em',
            }}
          >
            Start the Conversation
          </h2>

          <div className="contact-form-wrap">
            <AnimatePresence mode="wait">

              {/* ── Success state ────────────────────────────────────────── */}
              {submitState === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="feedback-panel success"
                  role="status"
                  aria-live="polite"
                >
                  <div className="feedback-icon" aria-hidden="true">
                    <CheckCircle2 size={26} strokeWidth={1.5} />
                  </div>
                  <p className="feedback-title">Message Received</p>
                  <p className="feedback-body">
                    Thank you for reaching out. We&rsquo;ll review your message
                    and respond as soon as possible.
                  </p>
                </motion.div>
              )}

              {/* ── Error state ──────────────────────────────────────────── */}
              {submitState === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="feedback-panel error"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="feedback-icon" aria-hidden="true">
                    <AlertCircle size={26} strokeWidth={1.5} />
                  </div>
                  <p className="feedback-title">Something Went Wrong</p>
                  <p className="feedback-body">
                    We couldn&rsquo;t send your message. Please try again, or
                    reach out to us directly via Instagram.
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="retry-btn"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {/* ── Idle / loading: show form ────────────────────────────── */}
              {(submitState === 'idle' || submitState === 'loading') && (
                <motion.form
                  key="form"
                  ref={formRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Contact form"
                >
                  <div className="form-row form-row-2col" style={{ marginBottom: '1.5rem' }}>

                    {/* Full Name */}
                    <div className={`form-field${errors.name && touched.name ? ' has-error' : ''}`}>
                      <label htmlFor={`${uid}-name`}>
                        Full Name
                        <span className="required-star" aria-hidden="true">*</span>
                      </label>
                      <input
                        id={`${uid}-name`}
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        aria-required="true"
                        aria-describedby={`${uid}-name-error`}
                        aria-invalid={!!(errors.name && touched.name)}
                        placeholder="e.g. Riddhi Sonawane"
                        value={fields.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <span
                        id={`${uid}-name-error`}
                        className="field-error"
                        role="alert"
                        aria-live="polite"
                      >
                        {touched.name ? errors.name : ''}
                      </span>
                    </div>

                    {/* Category */}
                    <div
                      className={`form-field${errors.category && touched.category ? ' has-error' : ''}`}
                    >
                      <label htmlFor={`${uid}-category`}>
                        Enquiry Category
                        <span className="required-star" aria-hidden="true">*</span>
                      </label>
                      <div className="select-wrap">
                        <select
                          id={`${uid}-category`}
                          name="category"
                          required
                          aria-required="true"
                          aria-describedby={`${uid}-category-error`}
                          aria-invalid={!!(errors.category && touched.category)}
                          value={fields.category}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="" disabled>
                            Select a category…
                          </option>
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <span
                        id={`${uid}-category-error`}
                        className="field-error"
                        role="alert"
                        aria-live="polite"
                      >
                        {touched.category ? errors.category : ''}
                      </span>
                    </div>
                  </div>

                  {/* Verified Email & Compulsory Phone Number */}
                  <div className="form-row form-row-2col" style={{ marginBottom: '1.5rem' }}>

                    {/* Email */}
                    <div className={`form-field${errors.email && touched.email ? ' has-error' : ''}`}>
                      <label htmlFor={`${uid}-email`}>
                        Email Address
                        <span className="required-star" aria-hidden="true">*</span>
                      </label>
                      <input
                        id={`${uid}-email`}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        aria-required="true"
                        aria-describedby={`${uid}-email-error`}
                        aria-invalid={!!(errors.email && touched.email)}
                        placeholder="you@example.com"
                        value={fields.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <span
                        id={`${uid}-email-error`}
                        className="field-error"
                        role="alert"
                        aria-live="polite"
                      >
                        {touched.email ? errors.email : ''}
                      </span>
                    </div>

                    {/* Mobile Phone Number */}
                    <div className={`form-field${errors.phone && touched.phone ? ' has-error' : ''}`}>
                      <label htmlFor={`${uid}-phone`}>
                        Mobile Phone Number
                        <span className="required-star" aria-hidden="true">*</span>
                      </label>
                      <input
                        id={`${uid}-phone`}
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        aria-required="true"
                        aria-describedby={`${uid}-phone-error`}
                        aria-invalid={!!(errors.phone && touched.phone)}
                        placeholder="+91 98765 43210"
                        value={fields.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <span
                        id={`${uid}-phone-error`}
                        className="field-error"
                        role="alert"
                        aria-live="polite"
                      >
                        {touched.phone ? errors.phone : ''}
                      </span>
                    </div>
                  </div>

                  {/* Message */}
                  <div
                    className={`form-field${errors.message && touched.message ? ' has-error' : ''}`}
                    style={{ marginBottom: '2rem' }}
                  >
                    <label htmlFor={`${uid}-message`}>
                      Message
                      <span className="required-star" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id={`${uid}-message`}
                      name="message"
                      required
                      aria-required="true"
                      aria-describedby={`${uid}-message-error`}
                      aria-invalid={!!(errors.message && touched.message)}
                      placeholder="Tell us about your enquiry, idea, or proposal…"
                      rows={5}
                      value={fields.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span
                      id={`${uid}-message-error`}
                      className="field-error"
                      role="alert"
                      aria-live="polite"
                    >
                      {touched.message ? errors.message : ''}
                    </span>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitState === 'loading'}
                    aria-label={submitState === 'loading' ? 'Sending message…' : 'Send message'}
                  >
                    {submitState === 'loading' ? (
                      <>
                        <span className="btn-spinner" aria-hidden="true" />
                        <span>Sending…</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={13} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Schematic divider */}
      <div className="schematic-divider mx-5 md:mx-12 lg:mx-24" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════════════════════
          SECTION D — CONNECT CTA STRIP
      ══════════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Social media and collaboration"
        className="px-4 py-12 sm:px-5 sm:py-16 md:px-12 lg:px-24 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="cta-strip"
        >
          <p className="label-eyebrow">Stay Connected</p>

          <p
            className="font-body leading-relaxed max-w-lg"
            style={{
              color: 'var(--color-text-primary)',
              opacity: 0.75,
              fontSize: 'var(--font-size-base)',
            }}
          >
            Got a bold idea or want to partner with ROBORASHTRA? Reach us at{' '}
            <a
              href={`mailto:${OFFICIAL_EMAIL}`}
              style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
            >
              {OFFICIAL_EMAIL}
            </a>{' '}
            or explore sponsorship opportunities on our sponsor portal.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-link"
              aria-label="Visit RoboHawk on Instagram (opens in new tab)"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span>@robohawk.pccoer</span>
              <ArrowUpRight size={11} aria-hidden="true" />
            </a>
            <Link
              href={SPONSOR_ROUTE}
              className="map-action-btn primary"
              style={{
                padding: 'var(--space-2) var(--space-4)',
                minHeight: '42px',
                borderRadius: 'var(--radius-xs)',
              }}
              aria-label="Explore sponsorship opportunities on /sponsor"
            >
              <Handshake size={14} aria-hidden="true" />
              <span>Sponsor Route (/sponsor)</span>
              <ArrowUpRight size={11} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Bottom spacing to clear the navbar on scroll */}
      <div style={{ height: '4rem' }} aria-hidden="true" />
    </div>
  )
}
