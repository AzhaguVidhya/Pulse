import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

/**
 * Reusable Theme Toggle Component
 *
 * Switches between light and dark themes.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex size-10 items-center justify-center rounded-md border border-(--border) bg-(--surface) text-(--text) transition-colors duration-300 hover:opacity-80"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
    </button>
  )
}