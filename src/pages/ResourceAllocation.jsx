
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Users,
  CalendarDays,
  BriefcaseBusiness,
} from 'lucide-react'

const PROJECTS_KEY = 'pulse-projects'
const EMPLOYEES_KEY = 'pulse-employees'
const ALLOCATIONS_KEY = 'pulse-resource-allocations'

const allocationRoles = [
  'Developer',
  'QA Engineer',
  'DevOps',
  'UI/UX Designer',
]

const emptyForm = {
  role: '',
  employeeId: '',
  startDate: '',
  endDate: '',
  percentage: '100',
}

const inputStyles =
  'w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary)/20'

const buttonStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition'

function readStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

// Supports common field names used in project records
function getProjectValue(project, fields) {
  for (const field of fields) {
    if (project?.[field] !== undefined && project?.[field] !== null) {
      return project[field]
    }
  }

  return ''
}

function getProjectName(project) {
  return getProjectValue(project, ['projectName', 'name', 'title'])
}

function getProjectClient(project) {
  return getProjectValue(project, ['clientName', 'client', 'client_name'])
}

function getProjectStatus(project) {
  return getProjectValue(project, ['status', 'projectStatus']) || 'Not specified'
}

function getProjectManager(project) {
  return getProjectValue(project, [
    'deliveryManager',
    'managedBy',
    'projectManager',
    'manager',
  ]) || 'Not assigned'
}

function getProjectStart(project) {
  return getProjectValue(project, [
    'startDate',
    'projectStartDate',
    'start_date',
  ])
}

function getProjectEnd(project) {
  return getProjectValue(project, [
    'endDate',
    'projectEndDate',
    'end_date',
  ])
}

export default function ResourceAllocation() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId')

  const [projects] = useState(() => readStorage(PROJECTS_KEY))
  const [employees] = useState(() => readStorage(EMPLOYEES_KEY))

  const [allocations, setAllocations] = useState(() =>
    readStorage(ALLOCATIONS_KEY)
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [editingAllocation, setEditingAllocation] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [search, setSearch] = useState('')

  const project = projects.find(
    (item) => String(item.id) === String(projectId)
  )

  const projectStart = project ? getProjectStart(project) : ''
  const projectEnd = project ? getProjectEnd(project) : ''

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employee.status === 'Active'),
    [employees]
  )

  const currentProjectAllocations = useMemo(
    () =>
      allocations.filter(
        (allocation) =>
          String(allocation.projectId) === String(projectId)
      ),
    [allocations, projectId]
  )

  const filteredAllocations = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return currentProjectAllocations.filter((allocation) => {
      const employee = employees.find(
        (item) => item.employeeId === allocation.employeeId
      )

      return [
        allocation.role,
        allocation.employeeId,
        employee?.name,
      ].some((value) =>
        String(value || '').toLowerCase().includes(searchValue)
      )
    })
  }, [currentProjectAllocations, employees, search])

  // Persist allocation records
  useEffect(() => {
    localStorage.setItem(ALLOCATIONS_KEY, JSON.stringify(allocations))
  }, [allocations])

  const getEmployee = (employeeId) =>
    employees.find((employee) => employee.employeeId === employeeId)

  const getEmployeeName = (employeeId) =>
    getEmployee(employeeId)?.name || 'Unknown Employee'

  const getInputClass = (field) =>
    `${inputStyles} ${
      errors[field]
        ? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500/20'
        : ''
    }`

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const openAddModal = () => {
    setEditingAllocation(null)
    setFormData(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEditModal = (allocation) => {
    setEditingAllocation(allocation)

    setFormData({
      role: allocation.role || '',
      employeeId: allocation.employeeId || '',
      startDate: allocation.startDate || '',
      endDate: allocation.endDate || '',
      percentage: String(allocation.percentage ?? 100),
    })

    setErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingAllocation(null)
    setFormData(emptyForm)
    setErrors({})
  }

  // Check whether the employee would exceed 100% during
  // any overlapping allocation period.
  const exceedsAllocationLimit = () => {
    const candidateStart = new Date(`${formData.startDate}T00:00:00`)
    const candidateEnd = new Date(`${formData.endDate}T00:00:00`)
    const candidatePercentage = Number(formData.percentage)

    const otherAllocations = allocations.filter((allocation) => {
      if (allocation.employeeId !== formData.employeeId) return false

      // Ignore the allocation currently being edited
      if (allocation.id === editingAllocation?.id) return false

      const existingStart = new Date(`${allocation.startDate}T00:00:00`)
      const existingEnd = new Date(`${allocation.endDate}T00:00:00`)

      return (
        existingStart <= candidateEnd &&
        existingEnd >= candidateStart
      )
    })

    const datesToCheck = new Set([
      formData.startDate,
      ...otherAllocations.flatMap((allocation) => [
        allocation.startDate,
        allocation.endDate,
      ]),
    ])

    for (const date of datesToCheck) {
      const currentDate = new Date(`${date}T00:00:00`)

      if (currentDate < candidateStart || currentDate > candidateEnd) {
        continue
      }

      const existingPercentage = otherAllocations
        .filter((allocation) => {
          const start = new Date(`${allocation.startDate}T00:00:00`)
          const end = new Date(`${allocation.endDate}T00:00:00`)

          return currentDate >= start && currentDate <= end
        })
        .reduce(
          (total, allocation) => total + Number(allocation.percentage || 0),
          0
        )

      if (existingPercentage + candidatePercentage > 100) {
        return true
      }
    }

    return false
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!formData.role) {
      newErrors.role = 'Please select a role'
    }

    if (!formData.employeeId) {
      newErrors.employeeId = 'Please select an employee'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (formData.startDate && formData.endDate) {
      if (formData.startDate >= formData.endDate) {
        newErrors.endDate = 'End date must be after start date'
      }

      if (
        projectStart &&
        formData.startDate < projectStart
      ) {
        newErrors.startDate = 'Start date must be within project dates'
      }

      if (
        projectEnd &&
        formData.endDate > projectEnd
      ) {
        newErrors.endDate = 'End date must be within project dates'
      }

      if (
        projectStart &&
        projectEnd &&
        (formData.startDate < projectStart ||
          formData.endDate > projectEnd)
      ) {
        newErrors.startDate =
          'Allocation period must fall within project dates'
      }
    }

    const percentage = Number(formData.percentage)

    if (
      formData.percentage === '' ||
      !Number.isFinite(percentage) ||
      percentage <= 0 ||
      percentage > 100
    ) {
      newErrors.percentage = 'Enter a percentage between 1 and 100'
    }

    if (
      formData.employeeId &&
      formData.startDate &&
      formData.endDate &&
      formData.startDate < formData.endDate &&
      percentage > 0 &&
      percentage <= 100 &&
      !newErrors.startDate &&
      !newErrors.endDate &&
      exceedsAllocationLimit()
    ) {
      newErrors.percentage =
        'This employee would exceed 100% allocation during this period'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const now = new Date().toISOString()

    if (editingAllocation) {
      setAllocations((prev) =>
        prev.map((allocation) =>
          allocation.id === editingAllocation.id
            ? {
                ...allocation,
                ...formData,
                percentage,
                modifiedAt: now,
              }
            : allocation
        )
      )
    } else {
      const newAllocation = {
        id: Date.now(),
        projectId: project.id,
        role: formData.role,
        employeeId: formData.employeeId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        percentage,
        createdAt: now,
        modifiedAt: now,
      }

      setAllocations((prev) => [...prev, newAllocation])
    }

    closeModal()
  }

  const handleDelete = (allocation) => {
    const confirmed = window.confirm(
      `Remove ${getEmployeeName(allocation.employeeId)} from this project?`
    )

    if (!confirmed) return

    setAllocations((prev) =>
      prev.filter((item) => item.id !== allocation.id)
    )
  }

  const totalAllocated = currentProjectAllocations.reduce(
    (total, allocation) => total + Number(allocation.percentage || 0),
    0
  )

  if (!project) {
    return (
      <div className="space-y-2 p-4 sm:p-6">
        <button
          onClick={() => navigate('/projects')}
          className={`${buttonStyles} border border-(--border) text-(--text) hover:bg-(--bg)`}
        >
          <ArrowLeft size={17} />
          Back to Projects
        </button>

        <div className="rounded-xl border border-(--border) bg-(--surface) p-8 text-center">
          <h2 className="text-lg font-semibold text-(--text)">
            Project not found
          </h2>
          <p className="mt-2 text-sm text-(--muted)">
            Please open Resource Allocation from a project's Actions menu.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            onClick={() => navigate('/projects')}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-(--secondary) hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>

          <h1 className="text-2xl font-bold text-(--text)">
            Resource Allocation
          </h1>

          <p className="mt-1 text-sm text-(--muted)">
            Manage resources assigned to this project.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className={`${buttonStyles} bg-(--primary) text-white hover:opacity-90`}
        >
          <Plus size={18} />
          Add Resource
        </button>
      </div>

      {/* Project Details */}
      <div className="rounded-xl border border-(--border) bg-(--surface) p-5">
        <div className="mb-4 flex items-center gap-2">
          <BriefcaseBusiness size={19} className="text-(--secondary)" />
          <h2 className="font-semibold text-(--text)">
            Project Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <InfoItem
            label="Project Name"
            value={getProjectName(project)}
          />

          <InfoItem
            label="Client Name"
            value={getProjectClient(project) || 'Not specified'}
          />

          <InfoItem
            label="Project Status"
            value={getProjectStatus(project)}
          />

          <InfoItem
            label="Delivery Manager"
            value={getProjectManager(project)}
          />

          <InfoItem
            label="Project Start Date"
            value={projectStart || 'Not specified'}
          />

          <InfoItem
            label="Project End Date"
            value={projectEnd || 'Not specified'}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Allocated Resources"
          value={currentProjectAllocations.length}
          icon={Users}
        />

        <SummaryCard
          title="Total Allocation"
          value={`${totalAllocated}%`}
          icon={BriefcaseBusiness}
        />

        <SummaryCard
          title="Active Employees Available"
          value={activeEmployees.length}
          icon={CalendarDays}
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)"
        />

        <input
          type="text"
          placeholder="Search allocated resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputStyles} pl-10 w-full` }
        />
      </div>

      {/* Allocation Table */}
      <div className="overflow-hidden rounded-xl border border-(--border) bg-(--surface)">
        <div className="border-b border-(--border) p-5">
          <h2 className="font-semibold text-(--text)">
            Allocated Resources
          </h2>
          <p className="mt-1 text-xs text-(--muted)">
            Employees assigned to {getProjectName(project)}.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left text-sm">
            <thead className="bg-(--bg) text-(--muted)">
              <tr>
                <th className="px-5 py-4 font-semibold">Resource Name</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Start Date</th>
                <th className="px-5 py-4 font-semibold">End Date</th>
                <th className="px-5 py-4 font-semibold">Allocation</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--border)">
              {filteredAllocations.length > 0 ? (
                filteredAllocations.map((allocation) => (
                  <tr
                    key={allocation.id}
                    className="transition hover:bg-(--bg)"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-(--text)">
                        {getEmployeeName(allocation.employeeId)}
                      </p>
                      <p className="mt-1 text-xs text-(--muted)">
                        {allocation.employeeId}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-(--text)">
                      {allocation.role}
                    </td>

                    <td className="px-5 py-4 text-(--text)">
                      {allocation.startDate}
                    </td>

                    <td className="px-5 py-4 text-(--text)">
                      {allocation.endDate}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-(--secondary)/10 px-3 py-1 text-xs font-semibold text-(--secondary)">
                        {allocation.percentage}%
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <ActionButton
                          icon={Pencil}
                          label="Edit"
                          onClick={() => openEditModal(allocation)}
                        />

                        <ActionButton
                          icon={Trash2}
                          label="Delete"
                          danger
                          onClick={() => handleDelete(allocation)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-(--muted)"
                  >
                    No resources allocated to this project yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-(--border) bg-(--surface) shadow-xl">

            <div className="flex items-center justify-between border-b border-(--border) p-5">
              <div>
                <h2 className="text-lg font-bold text-(--text)">
                  {editingAllocation ? 'Edit Allocation' : 'Add Resource'}
                </h2>
                <p className="mt-1 text-xs text-(--muted)">
                  Assign an employee to this project.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-(--muted) hover:bg-(--bg)"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">

                {/* Role */}
                <FormField label="Role" required>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={getInputClass('role')}
                  >
                    <option value="">Select Role</option>
                    {allocationRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.role} />
                </FormField>

                {/* Resource Name */}
                <FormField label="Resource Name" required>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={getInputClass('employeeId')}
                  >
                    <option value="">Select Employee</option>

                    {activeEmployees.map((employee) => (
                      <option
                        key={employee.id}
                        value={employee.employeeId}
                      >
                        {employee.name} ({employee.employeeId})
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.employeeId} />
                </FormField>

                {/* Start Date */}
                <FormField label="Allocation Start Date" required>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={projectStart || undefined}
                    max={projectEnd || undefined}
                    className={getInputClass('startDate')}
                  />
                  <FieldError message={errors.startDate} />
                </FormField>

                {/* End Date */}
                <FormField label="Allocation End Date" required>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={
                      formData.startDate
                        ? formData.startDate
                        : projectStart || undefined
                    }
                    max={projectEnd || undefined}
                    className={getInputClass('endDate')}
                  />
                  <FieldError message={errors.endDate} />
                </FormField>

                {/* Allocation Percentage */}
                <FormField label="Allocation Percentage" required>
                  <select
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleChange}
                    className={getInputClass('percentage')}
                  >
                    <option value="100">100% - Full-time</option>
                    <option value="75">75%</option>
                    <option value="50">50% - Part-time</option>
                    <option value="25">25%</option>
                  </select>
                  <FieldError message={errors.percentage} />
                </FormField>

                {/* Project display */}
                <FormField label="Selected Project">
                  <input
                    value={getProjectName(project)}
                    disabled
                    className={`${inputStyles} opacity-70`}
                  />
                </FormField>
              </div>

              <div className="flex flex-col-reverse justify-end gap-3 border-t border-(--border) p-5 sm:flex-row">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`${buttonStyles} border border-(--border) text-(--text) hover:bg-(--bg)`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`${buttonStyles} bg-(--primary) text-white hover:opacity-90`}
                >
                  {editingAllocation ? 'Update Allocation' : 'Save Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-medium text-(--text)">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

function FieldError({ message }) {
  if (!message) return null

  return (
    <p className="mt-1 text-xs font-medium text-red-500">
      {message}
    </p>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-(--muted)">{label}</p>
      <p className="mt-1 wrap-break-words text-sm font-semibold text-(--text)">
        {value || 'Not specified'}
      </p>
    </div>
  )
}

function SummaryCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--surface) p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-(--muted)">{title}</p>
        <div className="rounded-lg bg-(--secondary)/10 p-2 text-(--secondary)">
          <Icon size={20} />
        </div>
      </div>
      <h3 className="mt-4 text-2xl font-bold text-(--text)">
        {value}
      </h3>
    </div>
  )
}

function ActionButton({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`rounded-lg p-2 transition ${
        danger
          ? 'text-red-500 hover:bg-red-500/10'
          : 'text-(--muted) hover:bg-(--bg) hover:text-(--secondary)'
      }`}
    >
      <Icon size={17} />
    </button>
  )
}
