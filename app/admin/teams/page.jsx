'use client'

import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import TeamManagerTab from '@/components/admin/TeamManagerTab'

export default function AdminTeamsPage() {
  return (
    <AdminLayout>
      <TeamManagerTab />
    </AdminLayout>
  )
}
