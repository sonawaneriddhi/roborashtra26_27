'use client'

import React, { useState, useEffect } from 'react'
import { X, User, Shield, Briefcase, Mail, Phone, Image as ImageIcon, Sparkles, Check } from 'lucide-react'

const SQUAD_OPTIONS = [
  { id: 'workshop', name: 'WORKSHOP' },
  { id: 'pr', name: 'PUBLIC RELATIONS (PR)' },
  { id: 'event', name: 'EVENT MANAGEMENT' },
  { id: 'ps', name: 'PROBLEM STATEMENT (PS)' },
  { id: 'design', name: 'DESIGN & MEDIA' },
  { id: 'web', name: 'WEB & TECHNICAL' },
  { id: 'content', name: 'CONTENT & CURATION' },
  { id: 'docs', name: 'DOCUMENTATION' },
  { id: 'cad', name: 'CAD & 3D HARDWARE' },
]

export default function TeamEditorModal({
  isOpen,
  onClose,
  onSave,
  type = 'SQUAD_MEMBER', // 'EXECUTIVE_LEAD' | 'FACULTY' | 'SQUAD_MEMBER'
  initialData = null,
  activeSquadId = 'workshop',
}) {
  const isEditing = Boolean(initialData && initialData.id)

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    instagram: '',
    squadId: activeSquadId,
    isHead: false,
    department: 'Department of Computer Science Engineering',
    badge: 'FACULTY COORDINATOR',
    credentials: '',
    description: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        role: initialData.role || initialData.designation || '',
        image: initialData.image || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        linkedin: initialData.socials?.linkedin || initialData.linkedin || '',
        github: initialData.socials?.github || initialData.github || '',
        instagram: initialData.socials?.instagram || initialData.instagram || '',
        squadId: initialData.squadId || activeSquadId,
        isHead: Boolean(initialData.isHead),
        department: initialData.department || 'Department of Computer Science Engineering',
        badge: initialData.badge || 'FACULTY COORDINATOR',
        credentials: initialData.credentials || '',
        description: initialData.description || '',
      })
    } else {
      setFormData({
        name: '',
        role: '',
        image: '',
        phone: '',
        email: '',
        linkedin: '',
        github: '',
        instagram: '',
        squadId: activeSquadId,
        isHead: false,
        department: 'Department of Computer Science Engineering',
        badge: 'FACULTY COORDINATOR',
        credentials: '',
        description: '',
      })
    }
  }, [initialData, activeSquadId, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.role.trim()) return

    onSave({
      ...formData,
      id: initialData?.id,
    })
    onClose()
  }

  const titleText = isEditing
    ? type === 'EXECUTIVE_LEAD'
      ? 'EDIT EXECUTIVE COUNCIL LEAD'
      : type === 'FACULTY'
      ? 'EDIT FACULTY ADVISOR'
      : 'EDIT SQUAD CREW MEMBER'
    : type === 'EXECUTIVE_LEAD'
    ? 'ADD EXECUTIVE COUNCIL LEAD'
    : type === 'FACULTY'
    ? 'ADD FACULTY ADVISOR'
    : 'ADD SQUAD CREW MEMBER'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="tick-frame relative w-full max-w-lg bg-[#070B19] border-2 border-amber/60 text-ivory p-5 sm:p-6 shadow-[0_0_50px_rgba(255,159,28,0.25)] my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber/30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 border border-amber/60 bg-amber/15 flex items-center justify-center text-amber">
              {type === 'EXECUTIVE_LEAD' ? (
                <Shield className="w-4 h-4" />
              ) : type === 'FACULTY' ? (
                <Briefcase className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-sm sm:text-base text-ivory uppercase tracking-wider">
                {titleText}
              </h3>
              <p className="font-mono text-[10px] text-ivory/50">
                {isEditing ? `Modifying personnel record ID: ${initialData?.id}` : 'Enroll new personnel into live website registry'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1 text-ivory/50 hover:text-amber transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 font-mono text-xs">
          {/* Member Name */}
          <div>
            <label className="block text-ivory/70 uppercase mb-1">
              FULL NAME <span className="text-amber">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Shivraj Patil"
              className="w-full px-3 py-2 bg-[#060A12] border border-amber/40 text-ivory focus:border-amber focus:outline-none transition-colors"
            />
          </div>

          {/* Role / Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-ivory/70 uppercase mb-1">
                {type === 'FACULTY' ? 'DESIGNATION *' : 'ROLE / TITLE *'}
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder={type === 'FACULTY' ? 'Faculty Coordinator' : type === 'EXECUTIVE_LEAD' ? 'Club President' : 'Firmware Engineer'}
                className="w-full px-3 py-2 bg-[#060A12] border border-amber/40 text-ivory focus:border-amber focus:outline-none transition-colors"
              />
            </div>

            {type === 'SQUAD_MEMBER' && (
              <div>
                <label className="block text-ivory/70 uppercase mb-1">CLUB SQUAD DIVISION *</label>
                <select
                  value={formData.squadId}
                  onChange={(e) => setFormData({ ...formData, squadId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060A12] border border-amber/40 text-ivory focus:border-amber focus:outline-none transition-colors"
                >
                  {SQUAD_OPTIONS.map((sq) => (
                    <option key={sq.id} value={sq.id} className="bg-[#070B19] text-ivory">
                      {sq.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {type === 'FACULTY' && (
              <div>
                <label className="block text-ivory/70 uppercase mb-1">DEPARTMENT</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Department of Computer Science Engineering"
                  className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Squad Member Lead Toggle */}
          {type === 'SQUAD_MEMBER' && (
            <div className="flex items-center gap-3 p-2.5 border border-white/10 bg-[#0B132B]/40">
              <input
                type="checkbox"
                id="isHeadToggle"
                checked={formData.isHead}
                onChange={(e) => setFormData({ ...formData, isHead: e.target.checked })}
                className="w-4 h-4 accent-amber cursor-pointer"
              />
              <label htmlFor="isHeadToggle" className="cursor-pointer text-xs text-ivory/80 select-none">
                Designate as <span className="text-amber font-bold">Squad Lead / Director</span> (appears in top leadership row)
              </label>
            </div>
          )}

          {/* Faculty specific details */}
          {type === 'FACULTY' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-ivory/70 uppercase mb-1">BADGE / HONORIFIC</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="FACULTY DIRECTOR"
                    className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-ivory/70 uppercase mb-1">CREDENTIALS</label>
                  <input
                    type="text"
                    value={formData.credentials}
                    onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                    placeholder="Ph.D. Robotics (IITB) · IEEE Senior Member"
                    className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ivory/70 uppercase mb-1">ABOUT / MENTORSHIP FOCUS</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Spearheading autonomous kinematics architectures and national combat robotics mentorship..."
                  className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Portrait Image URL or Cloudinary ID */}
          <div>
            <label className="block text-ivory/70 uppercase mb-1">
              PORTRAIT IMAGE (CLOUDINARY PUBLIC ID OR DIRECT HTTPS URL)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="e.g. roborashtra/team/lead/shivrajpatil or https://..."
                className="flex-1 px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none font-mono text-[11px]"
              />
              {formData.image && (
                <div className="w-9 h-9 border border-amber/40 bg-[#0B132B] overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-[10px] text-ivory/40 mt-1">
              Leave blank to auto-generate sleek initials placeholder card on public pages.
            </p>
          </div>

          {/* Contact (Phone & Email) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-ivory/70 uppercase mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="roborashtra_pr@gmail.com"
                className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-ivory/70 uppercase mb-1">PHONE NUMBER</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9322349300"
                className="w-full px-3 py-2 bg-[#060A12] border border-white/20 text-ivory focus:border-amber focus:outline-none"
              />
            </div>
          </div>

          {/* Social Profiles */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-amber block font-bold">
              PUBLIC SOCIAL LINKS (OPTIONAL)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="LinkedIn URL"
                className="px-2.5 py-1.5 bg-[#060A12] border border-white/15 text-ivory focus:border-amber focus:outline-none text-[11px]"
              />
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="GitHub URL"
                className="px-2.5 py-1.5 bg-[#060A12] border border-white/15 text-ivory focus:border-amber focus:outline-none text-[11px]"
              />
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="Instagram URL"
                className="px-2.5 py-1.5 bg-[#060A12] border border-white/15 text-ivory focus:border-amber focus:outline-none text-[11px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-amber/30 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/20 text-ivory/70 hover:text-ivory hover:border-white/40 uppercase transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber text-blueprintDeep font-bold uppercase tracking-wider hover:bg-amberDim transition-all shadow-[0_0_15px_rgba(255,159,28,0.3)] flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {isEditing ? 'UPDATE PERSONNEL' : 'ENROLL PERSONNEL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
