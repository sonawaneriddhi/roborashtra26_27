'use client'

import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import TeamManagerTab from '@/components/admin/TeamManagerTab'

export default function WebsiteTeamAdminPage() {
  return (
    <AdminLayout>
      <TeamManagerTab />
    </AdminLayout>
  )
}
