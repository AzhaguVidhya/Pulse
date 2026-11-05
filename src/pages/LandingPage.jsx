import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, Users, Layers } from 'lucide-react'
import ThemeToggle from '../components/common/ThemeToggle'

const features = [
  {
    icon: BriefcaseBusiness,
    title: 'Project Management',
    description: 'Create, organize, and track your projects in one place.',
  },
  {
    icon: Users,
    title: 'Client Management',
    description: 'Manage client information and keep everything organized.',
  },
  {
    icon: Layers,
    title: 'Resource Allocation',
    description: 'Plan and manage resources across your projects.',
  },
]

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-(--bg) text-(--text)">

      {/* Navbar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-(--border) px-4 sm:px-8 lg:px-16">
        <h1 className="text-xl font-bold tracking-wide text-(--secondary)">
          PULSE
        </h1>

        <nav className="flex items-center gap-3 sm:gap-6">
          <a
            href="#features"
            className="hidden text-sm font-medium text-(--muted) transition-colors hover:text-(--secondary) sm:block"
          >
            Features
          </a>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-md bg-(--secondary) px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 sm:px-5"
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-3 text-center sm:px-8">

        {/* Hero section */}
        <section className="w-full max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-(--secondary) sm:text-sm">
            Project & Resource Management
          </p>

          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Manage Your Work.
            <span className="block text-(--secondary)">
              Stay in Control.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-(--muted) sm:text-base">
            PULSE helps you manage projects, clients, and resources
            efficiently from one simple workspace.
          </p>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mt-6 rounded-md bg-(--primary) px-7 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-(--secondary)"
          >
            Explore Dashboard
          </button>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mt-8 grid w-full max-w-5xl grid-cols-3 gap-2 sm:mt-12 sm:gap-5"
        >
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <div
                key={feature.title}
                className="flex flex-col items-center rounded-lg border border-(--border) bg-(--surface) p-3 sm:p-6"
              >
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-(--secondary)/10 text-(--secondary) sm:mb-4 sm:size-12">
                  <Icon size={20} />
                </div>

                <h3 className="text-base font-semibold sm:text-base">
                  {feature.title}
                </h3>

                <p className="mt-2 hidden text-sm leading-relaxed text-(--muted) sm:block">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="flex h-12 shrink-0 items-center justify-center border-t border-(--border) px-4">
        <p className="text-xs text-(--muted)">
          © {new Date().getFullYear()} PULSE. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default LandingPage