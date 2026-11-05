
import { useEffect, useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Users,
  BriefcaseBusiness,
  FolderKanban,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const initialProjects = [
  {
    id: 1,
    name: 'Website Development',
    client: 'ABC Technologies',
    status: 'In Progress',
    startDate: '2026-10-01',
    endDate: '2026-12-30',
  },
  {
    id: 2,
    name: 'Mobile Application',
    client: 'XYZ Solutions',
    status: 'Completed',
    startDate: '2026-08-01',
    endDate: '2026-10-15',
  },
  {
    id: 3,
    name: 'CRM Development',
    client: 'Global Systems',
    status: 'Pending',
    startDate: '2026-11-01',
    endDate: '2027-01-30',
  },
]

const emptyForm = {
  name: '',
  client: '',
  status: 'Pending',
  startDate: '',
  endDate: '',
}

const emptyReviewerForm = {
  dueDate: '',
  techExecution: '',
  projectExecution: '',
  devOps: '',
}

export default function Projects() {
  const navigate = useNavigate()

  // Projects state
  const [projects, setProjects] = useState(() => {
    try {
      const savedProjects = localStorage.getItem('pulse-projects')
      return savedProjects ? JSON.parse(savedProjects) : initialProjects
    } catch {
      return initialProjects
    }
  })

  // Employees state
  const [employees, setEmployees] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pulse-employees')) || []
    } catch {
      return []
    }
  })

  // Project modal states
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // Reviewer modal states
  const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [reviewerForm, setReviewerForm] = useState(emptyReviewerForm)

  // Save projects to LocalStorage
  useEffect(() => {
    localStorage.setItem('pulse-projects', JSON.stringify(projects))
  }, [projects])

  // Get only active employees
  const activeEmployees = employees.filter(
    (employee) => employee.status === 'Active'
  )

  // Navigate to Resource Allocation
  const handleResourceAllocation = (project) => {
    navigate(`/resource-allocation?projectId=${project.id}`)
  }

  // Search and filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.client.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      filterStatus === 'All' || project.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Open Add Project modal
  const openAddModal = () => {
    setForm(emptyForm)
    setEditId(null)
    setIsModalOpen(true)
  }

  // Open Edit Project modal
  const openEditModal = (project) => {
    setForm({
      name: project.name,
      client: project.client,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
    })

    setEditId(project.id)
    setIsModalOpen(true)
  }

  // Open Add Reviewer modal
  const openReviewerModal = (project) => {
    let savedReviewers = {}

    try {
      savedReviewers = JSON.parse(
        localStorage.getItem('pulse-reviewers') || '{}'
      )
    } catch {
      savedReviewers = {}
    }

    const existingReview = savedReviewers[project.id]

    setSelectedProject(project)
    setReviewerForm(
      existingReview
        ? {
            dueDate: existingReview.dueDate || '',
            techExecution: existingReview.techExecution || '',
            projectExecution: existingReview.projectExecution || '',
            devOps: existingReview.devOps || '',
          }
        : emptyReviewerForm
    )

    setIsReviewerModalOpen(true)
  }

  // Close Reviewer modal
  const closeReviewerModal = () => {
    setIsReviewerModalOpen(false)
    setSelectedProject(null)
    setReviewerForm(emptyReviewerForm)
  }

  // Handle project form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // Handle reviewer form changes
  const handleReviewerChange = (e) => {
    setReviewerForm({
      ...reviewerForm,
      [e.target.name]: e.target.value,
    })
  }

  // Save project
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim() || !form.client.trim()) return

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      alert('End date cannot be earlier than start date.')
      return
    }

    if (editId !== null) {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editId ? { ...project, ...form } : project
        )
      )
    } else {
      setProjects((currentProjects) => [
        ...currentProjects,
        {
          id: Date.now(),
          ...form,
        },
      ])
    }

    setIsModalOpen(false)
    setForm(emptyForm)
    setEditId(null)
  }

  // Save reviewer assignments
  const handleReviewerSubmit = (e) => {
    e.preventDefault()

    if (
      !reviewerForm.dueDate ||
      !reviewerForm.techExecution ||
      !reviewerForm.projectExecution ||
      !reviewerForm.devOps
    ) {
      alert('Please complete all reviewer details.')
      return
    }

    if (!selectedProject) return

    let savedReviewers = {}

    try {
      savedReviewers = JSON.parse(
        localStorage.getItem('pulse-reviewers') || '{}'
      )
    } catch {
      savedReviewers = {}
    }

    savedReviewers[selectedProject.id] = {
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      ...reviewerForm,
    }

    localStorage.setItem(
      'pulse-reviewers',
      JSON.stringify(savedReviewers)
    )

    alert('Reviewers assigned successfully.')
    closeReviewerModal()
  }

  // Delete project
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (confirmed) {
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== id)
      )

      // Remove associated reviewer configuration
      try {
        const savedReviewers = JSON.parse(
          localStorage.getItem('pulse-reviewers') || '{}'
        )

        delete savedReviewers[id]

        localStorage.setItem(
          'pulse-reviewers',
          JSON.stringify(savedReviewers)
        )
      } catch {
        localStorage.removeItem('pulse-reviewers')
      }
    }
  }

  const statusStyles = {
    Pending: 'bg-amber-500/10 text-amber-600',
    'In Progress': 'bg-sky-500/10 text-sky-600',
    Completed: 'bg-emerald-500/10 text-emerald-600',
  }

  const inputStyles =
    'w-full rounded-md border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--text) outline-none focus:border-(--secondary)'

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-(--text)">
            Projects
          </h1>
          <p className="mt-1 text-sm text-(--muted)">
            Create and manage all your projects.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-md bg-(--secondary) px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={18} />
          Add Project
        </button>
      </section>

      {/* Search and filter */}
      <section className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or clients..."
            className="w-full rounded-md border border-(--border) bg-(--surface) py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none focus:border-(--secondary)"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-(--border) bg-(--surface) px-4 py-2.5 text-sm text-(--text) outline-none focus:border-(--secondary)"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </section>

      {/* Project count */}
      <p className="text-sm text-(--muted)">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>

      {/* Projects table */}
      <section className="overflow-hidden rounded-lg border border-(--border) bg-(--surface)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-187.5 text-left text-sm">
            <thead className="bg-(--bg) text-(--muted)">
              <tr>
                <th className="px-5 py-4 font-medium">Project Name</th>
                <th className="px-5 py-4 font-medium">Client</th>
                <th className="px-5 py-4 font-medium">Start Date</th>
                <th className="px-5 py-4 font-medium">End Date</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-t border-(--border) transition-colors hover:bg-(--bg)"
                  >
                    <td className="px-5 py-4 font-medium text-(--text)">
                      <div className="flex items-center gap-2">
                        <FolderKanban size={17} className="text-(--secondary)" />
                        {project.name}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-(--muted)">
                      {project.client}
                    </td>

                    <td className="px-5 py-4 text-(--muted)">
                      {project.startDate || '—'}
                    </td>

                    <td className="px-5 py-4 text-(--muted)">
                      {project.endDate || '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[project.status] || ''}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(project)}
                          className="rounded-md p-2 text-(--secondary) hover:bg-(--secondary)/10"
                          aria-label="Edit project"
                          title="Edit project"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openReviewerModal(project)}
                          className="rounded-md p-2 text-(--secondary) hover:bg-(--secondary)/10"
                          aria-label="Add reviewer"
                          title="Add Reviewer"
                        >
                          <Users size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResourceAllocation(project)}
                          className="rounded-md p-2 text-(--text) hover:bg-(--bg)"
                          aria-label="Resource allocation"
                          title="Resource Allocation"
                        >
                          <BriefcaseBusiness size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(project.id)}
                          className="rounded-md p-2 text-red-500 hover:bg-red-500/10"
                          aria-label="Delete project"
                          title="Delete project"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-(--muted)"
                  >
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add/Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-xl border border-(--border) bg-(--bg) p-5 shadow-xl sm:p-6">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-(--text)">
                {editId !== null ? 'Edit Project' : 'Add New Project'}
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md p-2 text-(--muted) hover:bg-(--surface)"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--text)">
                  Project Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter project name"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--text)">
                  Client Name *
                </label>
                <input
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  required
                  placeholder="Enter client name"
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--text)">
                  Project Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputStyles}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-(--text)">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-(--text)">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    min={form.startDate || undefined}
                    onChange={handleChange}
                    className={inputStyles}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-(--border) px-5 py-2.5 text-sm font-medium text-(--text) hover:bg-(--surface)"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-(--secondary) px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  {editId !== null ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Reviewer Modal */}
      {isReviewerModalOpen && selectedProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg rounded-xl border border-(--border) bg-(--bg) p-5 shadow-xl sm:p-6">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-(--text)">
                  Add Reviewer – PULSE
                </h2>
                <p className="mt-1 text-sm text-(--muted)">
                  Assign reviewers for each project stage.
                </p>
              </div>

              <button
                type="button"
                onClick={closeReviewerModal}
                className="rounded-md p-2 text-(--muted) hover:bg-(--surface)"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewerSubmit} className="space-y-4">

              {/* Project Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--text)">
                  Project Name
                </label>
                <input
                  type="text"
                  value={selectedProject.name}
                  readOnly
                  className={`${inputStyles} text-(--muted)`}
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--text)">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={reviewerForm.dueDate}
                  onChange={handleReviewerChange}
                  required
                  className={inputStyles}
                />
              </div>

              {/* Tech Execution */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--text)">
                  Tech Execution Reviewer *
                </label>
                <select
                  name="techExecution"
                  value={reviewerForm.techExecution}
                  onChange={handleReviewerChange}
                  required
                  className={inputStyles}
                >
                  <option value="">Select Reviewer</option>
                  {activeEmployees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Execution */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--text)">
                  Project Execution Reviewer *
                </label>
                <select
                  name="projectExecution"
                  value={reviewerForm.projectExecution}
                  onChange={handleReviewerChange}
                  required
                  className={inputStyles}
                >
                  <option value="">Select Reviewer</option>
                  {activeEmployees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DevOps */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-(--text)">
                  DevOps Reviewer *
                </label>
                <select
                  name="devOps"
                  value={reviewerForm.devOps}
                  onChange={handleReviewerChange}
                  required
                  className={inputStyles}
                >
                  <option value="">Select Reviewer</option>
                  {activeEmployees.map((employee) => (
                    <option key={employee.id} value={employee.name}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>

              {activeEmployees.length === 0 && (
                <p className="text-sm text-amber-600">
                  No active employees available. Please add or activate employees first.
                </p>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeReviewerModal}
                  className="rounded-md border border-(--border) px-5 py-2.5 text-sm font-medium text-(--text) hover:bg-(--surface)"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={activeEmployees.length === 0}
                  className="rounded-md bg-(--secondary) px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save Reviewers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
