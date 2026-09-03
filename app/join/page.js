'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const divisions = [
  'Autonomous Navigation',
  'Robotic Manipulation',
  'Combat & Competition',
  'Embedded & IoT',
  'Not sure yet',
]

export default function Join() {
  const [form, setForm] = useState({ name: '', email: '', division: '', note: '' })
  const [submitted, setSubmitted] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <Nav />
      <main className="pt-32 pb-28">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <p className="label-eyebrow mb-3">ENLIST</p>
          <h1 className="font-display font-700 text-4xl md:text-5xl mb-4">
            Sign up. We&apos;ll hand you a soldering iron.
          </h1>
          <p className="text-slate max-w-lg mb-14">
            No robotics background required — just curiosity and a free
            Tuesday or Thursday evening. Fill this out and a unit lead will
            reach out within the week.
          </p>

          {submitted ? (
            <div className="tick-frame border border-amber/60 bg-panel/50 p-10 text-center">
              <p className="font-mono text-xs tracking-widest2 text-amber mb-3">TRANSMISSION RECEIVED</p>
              <h2 className="font-display text-2xl mb-2">Welcome to the build, {form.name.split(' ')[0] || 'recruit'}.</h2>
              <p className="text-slate text-sm">
                Check your inbox at {form.email || 'your email'} — a unit lead will follow up shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="tick-frame border border-grid bg-panel/40 p-8 md:p-10 space-y-7">
              <div>
                <label htmlFor="name" className="block font-mono text-xs tracking-widest2 text-slate mb-2">
                  FULL NAME
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={update('name')}
                  className="w-full bg-blueprint border border-grid px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-amber focus:border-amber transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-mono text-xs tracking-widest2 text-slate mb-2">
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update('email')}
                  className="w-full bg-blueprint border border-grid px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-amber focus:border-amber transition-colors"
                  placeholder="you@college.edu"
                />
              </div>

              <div>
                <label htmlFor="division" className="block font-mono text-xs tracking-widest2 text-slate mb-2">
                  PREFERRED DIVISION
                </label>
                <select
                  id="division"
                  required
                  value={form.division}
                  onChange={update('division')}
                  className="w-full bg-blueprint border border-grid px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-amber focus:border-amber transition-colors"
                >
                  <option value="" disabled>Select a division</option>
                  {divisions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="note" className="block font-mono text-xs tracking-widest2 text-slate mb-2">
                  ANYTHING WE SHOULD KNOW? (OPTIONAL)
                </label>
                <textarea
                  id="note"
                  rows={4}
                  value={form.note}
                  onChange={update('note')}
                  className="w-full bg-blueprint border border-grid px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-amber focus:border-amber transition-colors resize-none"
                  placeholder="Prior projects, tools you know, or just say hi"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber text-blueprintDeep font-mono text-sm tracking-widest2 px-6 py-4 hover:bg-ink transition-colors"
              >
                SUBMIT ENLISTMENT →
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
