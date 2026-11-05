import { Menu, Bell } from 'lucide-react'
import ThemeToggle from '../common/ThemeToggle'

/**
 * Reusable Navbar Component
 *
 * @param {string} title - Current page title
 * @param {function} onMenuClick - Opens the mobile sidebar
 */
export default function Navbar({ title = 'Dashboard', onMenuClick }) {
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between border-b border-(--border) bg-(--bg) px-4 sm:px-6">

      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-(--text) transition-colors hover:bg-(--surface) md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={21} />
        </button>

        <h2 className="text-lg font-semibold text-(--text) sm:text-xl">
          {title}
        </h2>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          className="rounded-md p-2 text-(--muted) transition-colors hover:bg-(--surface) hover:text-(--text)"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <ThemeToggle />

        <div className="flex size-9 items-center justify-center rounded-full bg-(--secondary) text-sm font-semibold text-white">
          P
        </div>
      </div>
    </header>
  )
}