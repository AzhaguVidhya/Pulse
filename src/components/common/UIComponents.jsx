import React from 'react'
import { X } from 'lucide-react'

/**
 * Reusable Button Component
 *
 * @param {'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'} variant
 * @param {'sm' | 'md' | 'lg'} size
 * @param {string} children
 * @param {string} className
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-(--secondary) disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  const variants = {
    primary: 'bg-(--secondary) text-white hover:bg-(--primary)',
    secondary: 'bg-(--primary) text-white hover:opacity-90',
    outline: 'border border-(--border) bg-transparent text-(--text) hover:bg-(--secondary)/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-(--text) hover:bg-(--secondary)/10',
  }

  return (
    <button
      className={`${baseStyles} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Reusable Card Component
 *
 * @param {string} title
 * @param {React.ReactNode} children
 * @param {string} className
 */
export function Card({
  title,
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={`rounded-xl border border-(--border) bg-(--surface) p-5 text-(--text) shadow-sm ${className}`}
      {...props}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold">
          {title}
        </h3>
      )}

      {children}
    </div>
  )
}

/**
 * Reusable Badge Component
 *
 * @param {'success' | 'warning' | 'danger' | 'info'} variant
 */
export function Badge({
  variant = 'info',
  children,
  className = '',
  ...props
}) {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-(--secondary)/10 text-(--secondary)',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

/**
 * Reusable Input Component
 */
export function Input({
  label,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-(--text)">
          {label}
        </label>
      )}

      <input
        className={`w-full rounded-lg border border-(--border) bg-(--bg) px-4 py-2.5 text-sm text-(--text) outline-none transition placeholder:opacity-50 focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary)/20 ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

/**
 * Reusable Modal Component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-lg rounded-xl border border-(--border) bg-(--surface) p-6 text-(--text) shadow-xl ${className}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-(--secondary)/10"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}