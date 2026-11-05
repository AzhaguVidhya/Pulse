import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Building2,
  UserRound,
  X,
} from 'lucide-react'

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Projects',
    path: '/projects',
    icon: FolderKanban,
  },
  {
    name: 'Clients',
    path: '/clients',
    icon: Building2,
  },
  {
    name:'Employees',
    path:"/employees",
    icon: UserRound,
  }
]

/**
 * Reusable Sidebar Component
 *
 * @param {boolean} isOpen - Controls mobile sidebar visibility
 * @param {function} onClose - Closes the mobile sidebar
 */
export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-(--border) bg-(--surface) transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-(--border) px-6">
          <h1 className="text-2xl font-bold tracking-wide text-(--secondary)">
            PULSE
          </h1>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-(--muted) hover:bg-(--border) md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-(--secondary) text-white'
                      : 'text-(--muted) hover:bg-(--border) hover:text-(--text)'
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-(--border) p-4">
          <p className="text-xs text-(--muted)">
            PULSE Management System
          </p>
        </div>
      </aside>
    </>
  )
}