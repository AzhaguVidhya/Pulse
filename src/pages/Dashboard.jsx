import {
  FolderKanban,
  Users,
  BriefcaseBusiness,
  Clock,
  ArrowUpRight,
} from 'lucide-react'

const stats = [
  {
    title: 'Total Projects',
    value: '12',
    icon: FolderKanban,
    description: 'Projects created',
  },
  {
    title: 'Active Projects',
    value: '08',
    icon: BriefcaseBusiness,
    description: 'Currently running',
  },
  {
    title: 'Total Clients',
    value: '15',
    icon: Users,
    description: 'Registered clients',
  },
  {
    title: 'Pending Tasks',
    value: '06',
    icon: Clock,
    description: 'Tasks to complete',
  },
]

const projects = [
  {
    name: 'Website Development',
    client: 'ABC Technologies',
    status: 'In Progress',
    progress: 75,
  },
  {
    name: 'Mobile Application',
    client: 'XYZ Solutions',
    status: 'Completed',
    progress: 100,
  },
  {
    name: 'CRM Development',
    client: 'Global Systems',
    status: 'Pending',
    progress: 25,
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Welcome section */}
      <section>
        <h1 className="text-2xl font-bold text-(--text)">
          Welcome to PULSE
        </h1>
        <p className="mt-1 text-sm text-(--muted)">
          Here's an overview of your project management workspace.
        </p>
      </section>

      {/* Statistics cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-lg border border-(--border) bg-(--surface) p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-(--muted)">
                  {stat.title}
                </p>

                <div className="rounded-md bg-(--secondary)/10 p-2 text-(--secondary)">
                  <Icon size={20} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold text-(--text)">
                {stat.value}
              </h2>

              <p className="mt-1 text-xs text-(--muted)">
                {stat.description}
              </p>
            </div>
          )
        })}
      </section>

      {/* Recent projects */}
      <section className="overflow-hidden rounded-lg border border-(--border) bg-(--surface)">

        <div className="flex items-center justify-between border-b border-(--border) p-5">
          <div>
            <h2 className="text-lg font-semibold text-(--text)">
              Recent Projects
            </h2>
            <p className="mt-1 text-xs text-(--muted)">
              Overview of recently created projects
            </p>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-(--secondary) hover:opacity-80"
          >
            View All <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead className="bg-(--bg)  text-(--muted)">
              <tr>
                <th className="px-5 py-3 font-medium">Project Name</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Progress</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.name}
                  className="border-t border-(--border)"
                >
                  <td className="px-5 py-4 font-medium text-(--text)">
                    {project.name}
                  </td>

                  <td className="px-5 py-4 text-(--muted)">
                    {project.client}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-(--secondary)/10 px-3 py-1 text-xs font-medium text-(--secondary)">
                      {project.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-(--border)">
                        <div
                          className="h-full rounded-full bg-(--secondary)"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>

                      <span className="text-xs text-(--muted)">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}