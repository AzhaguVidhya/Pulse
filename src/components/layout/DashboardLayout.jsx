import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/clients': 'Clients',
  '/employees':"Employees"
}

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  const title = pageTitles[location.pathname] || 'Dashboard'

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-(--bg) text-(--text)">

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main section */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Navbar */}
        <Navbar
          title={title}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  )
}