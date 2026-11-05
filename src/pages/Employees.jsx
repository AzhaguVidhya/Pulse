
import { useEffect, useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  Users,
  UserCheck,
  UserX,
  BriefcaseBusiness,
  ChevronDown,
} from 'lucide-react'

import { loadData, saveData } from '../utils/storage'

// Department options
const departments = [
  'Engineering',
  'QA',
  'HR',
  'Finance',
  'Management',
]

// Designations depend on the selected department
const designationsByDepartment = {
  Engineering: [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'React Developer',
    'Node.js Developer',
    'Software Engineer',
    'Tech Lead',
    'Engineering Manager',
  ],
  QA: [
    'Manual Tester',
    'Automation Tester',
    'QA Engineer',
    'Senior QA Engineer',
    'QA Lead',
    'Test Manager',
  ],
  HR: [
    'HR Executive',
    'HR Manager',
    'Recruiter',
    'Talent Acquisition Specialist',
  ],
  Finance: [
    'Accountant',
    'Finance Executive',
    'Financial Analyst',
    'Finance Manager',
  ],
  Management: [
    'Project Manager',
    'Delivery Manager',
    'Team Lead',
    'Program Manager',
    'Operations Manager',
  ],
}

// System roles
const systemRoles = [
  'Admin',
  'Delivery Manager',
  'Project Manager',
  'HR',
  'Finance',
  'Employee',
]

const emptyForm = {
  employeeId: '',
  name: '',
  email: '',
  department: '',
  designation: '',
  role: '',
  experience: '',
  reportingManager: '',
  status: 'Active',
}

const inputStyles =
  'w-full rounded-lg border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary)/20 disabled:cursor-not-allowed disabled:opacity-50'

const buttonStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition'

export default function Employees() {
  // Load employees from centralized storage
  const [employees, setEmployees] = useState(() =>
    loadData('pulse-employees')
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [modalMode, setModalMode] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  // Listen for employee data changes from other components
  useEffect(() => {
    const updateEmployees = () => {
      setEmployees(loadData('pulse-employees'))
    }

    window.addEventListener('pulse-data-updated', updateEmployees)

    return () => {
      window.removeEventListener('pulse-data-updated', updateEmployees)
    }
  }, [])
  const validateDuplicate = (field, value) => {
  const normalizedValue = value.trim().toLowerCase()

    if (!normalizedValue) return ''

    const duplicate = employees.some(
      (employee) =>
        String(employee[field] || '').trim().toLowerCase() === normalizedValue &&
        employee.id !== selectedEmployee?.id
    )

    if (!duplicate) return ''

    return field === 'employeeId'
      ? 'Employee ID already exists'
      : 'Email address already exists'
  }
  // Save updated employee records
  const updateEmployeeData = (updatedEmployees) => {
    setEmployees(updatedEmployees)
    saveData('pulse-employees', updatedEmployees)
  }

  // Input styles with validation highlighting
  const getInputClass = (field) =>
    `${inputStyles} ${
      errors[field]
        ? 'border-red-500 bg-red-500/5 focus:border-red-500 focus:ring-red-500/20'
        : ''
    }`

  // Filter employees
  const filteredEmployees = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return employees.filter((employee) => {
      const matchesSearch = [
        employee.employeeId,
        employee.name,
        employee.email,
        employee.department,
        employee.designation,
      ].some((value) =>
        String(value || '').toLowerCase().includes(searchValue)
      )

      const matchesStatus =
        statusFilter === 'All' || employee.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [employees, search, statusFilter])

  // Summary counts
  const totalEmployees = employees.length

  const activeEmployees = employees.filter(
    (employee) => employee.status === 'Active'
  ).length

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === 'Inactive'
  ).length

  // Count actual departments represented in employee records
  const totalDepartments = new Set(
    employees
      .map((employee) => employee.department)
      .filter(Boolean)
  ).size

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'department' ? { designation: '' } : {}),
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: ['employeeId', 'email'].includes(name)
        ? validateDuplicate(name, value)
        : '',
      ...(name === 'department' ? { designation: '' } : {}),
    }))
  }

  // Open Add modal
  const openAddModal = () => {
    setFormData(emptyForm)
    setErrors({})
    setSelectedEmployee(null)
    setModalMode('add')
  }

  // Open Edit modal
  const openEditModal = (employee) => {
    setFormData({
      employeeId: employee.employeeId || '',
      name: employee.name || '',
      email: employee.email || '',
      department: employee.department || '',
      designation: employee.designation || '',
      role: employee.role || '',
      experience: String(employee.experience ?? ''),
      reportingManager: employee.reportingManager || '',
      status: employee.status || 'Active',
    })

    setSelectedEmployee(employee)
    setErrors({})
    setModalMode('edit')
  }

  // Open View modal
  const openViewModal = (employee) => {
    setSelectedEmployee(employee)
    setErrors({})
    setModalMode('view')
  }

  // Close modal
  const closeModal = () => {
    setModalMode(null)
    setSelectedEmployee(null)
    setFormData(emptyForm)
    setErrors({})
  }

  // Form validation and submission
  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}

    const {
      employeeId,
      name,
      email,
      department,
      designation,
      role,
      experience,
    } = formData

    // Required field validation
    if (!employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required'
    }

    if (!name.trim()) {
      newErrors.name = 'Employee name is required'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      newErrors.email = 'Email ID is required'
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Enter a valid email address'
    }

    if (!department) {
      newErrors.department = 'Please select a department'
    }

    if (!designation) {
      newErrors.designation = 'Please select a designation'
    }

    if (!role) {
      newErrors.role = 'Please select a system role'
    }

    if (experience === '') {
      newErrors.experience = 'Experience is required'
    } else if (
      !Number.isFinite(Number(experience)) ||
      Number(experience) < 0
    ) {
      newErrors.experience = 'Enter a valid non-negative experience'
    }

    // Unique Employee ID validation
    const duplicateId = validateDuplicate('employeeId', employeeId)

if (duplicateId) {
  newErrors.employeeId = duplicateId
}

const duplicateEmail = validateDuplicate('email', email)

if (duplicateEmail) {
  newErrors.email = duplicateEmail
}

    // Stop submission if errors exist
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const now = new Date().toISOString().slice(0, 10)

    // Add employee
    if (modalMode === 'add') {
      const newEmployee = {
        ...formData,
        id: Date.now(),
        employeeId: employeeId.trim(),
        name: name.trim(),
        email: email.trim(),
        experience: Number(experience),
        createdAt: now,
        modifiedAt: now,
      }

      const updatedEmployees = [...employees, newEmployee]

      updateEmployeeData(updatedEmployees)
    }

    // Edit employee
    if (modalMode === 'edit') {
      const updatedEmployees = employees.map((employee) =>
        employee.id === selectedEmployee.id
          ? {
              ...employee,
              name: name.trim(),
              department,
              designation,
              role,
              experience: Number(experience),
              reportingManager: formData.reportingManager,
              status: formData.status,
              modifiedAt: now,
            }
          : employee
      )

      updateEmployeeData(updatedEmployees)
    }

    closeModal()
  }

  // Delete employee
  const handleDelete = (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    )

    if (!confirmed) return

    const updatedEmployees = employees.filter(
      (item) => item.id !== employee.id
    )

    updateEmployeeData(updatedEmployees)
  }

  // Find reporting manager name
  const getManagerName = (managerId) => {
    if (!managerId) return 'Not assigned'

    const manager = employees.find(
      (employee) => employee.employeeId === managerId
    )

    return manager?.name || 'Not assigned'
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-(--text)">
            Employees
          </h1>

          <p className="mt-1 text-sm text-(--muted)">
            Manage employee information and details.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className={`${buttonStyles} bg-(--secondary) text-white hover:opacity-90`}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Employees"
          value={totalEmployees}
          icon={Users}
        />

        <SummaryCard
          title="Active Employees"
          value={activeEmployees}
          icon={UserCheck}
        />

        <SummaryCard
          title="Inactive Employees"
          value={inactiveEmployees}
          icon={UserX}
        />

        <SummaryCard
          title="Departments"
          value={totalDepartments}
          icon={BriefcaseBusiness}
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted)"
          />

          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputStyles} pl-10`}
          />
        </div>

        <div className="relative sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputStyles} appearance-none pr-9`}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--muted)"
          />
        </div>
      </div>

      {/* Employees Table */}
      <div className="overflow-hidden rounded-xl border border-(--border) bg-(--surface)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-187.5 text-left text-sm">
            <thead className="bg-(--bg) text-(--muted)">
              <tr>
                <th className="px-5 py-4 font-semibold">Emp ID</th>
                <th className="px-5 py-4 font-semibold">Name</th>
                <th className="px-5 py-4 font-semibold">
                  Total Experience
                </th>
                <th className="px-5 py-4 font-semibold">
                  Current Role
                </th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--border)">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="transition hover:bg-(--bg)"
                  >
                    <td className="px-5 py-4 font-medium text-(--secondary)">
                      {employee.employeeId}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-(--text)">
                        {employee.name}
                      </p>

                      <p className="mt-1 text-xs text-(--muted)">
                        {employee.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-(--text)">
                      {employee.experience} years
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-(--text)">
                        {employee.designation}
                      </p>

                      <p className="mt-1 text-xs text-(--muted)">
                        {employee.department}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          employee.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <ActionButton
                          icon={Eye}
                          label="View"
                          onClick={() => openViewModal(employee)}
                        />

                        <ActionButton
                          icon={Pencil}
                          label="Edit"
                          onClick={() => openEditModal(employee)}
                        />

                        <ActionButton
                          icon={Trash2}
                          label="Delete"
                          onClick={() => handleDelete(employee)}
                          danger
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
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="my-auto w-full max-w-2xl rounded-2xl border border-(--border) bg-(--surface) shadow-xl">

            <div className="flex items-center justify-between border-b border-(--border) p-5">
              <div>
                <h2 className="text-lg font-bold text-(--text)">
                  {modalMode === 'add'
                    ? 'Add Employee'
                    : 'Edit Employee'}
                </h2>

                <p className="mt-1 text-xs text-(--muted)">
                  Fill in the employee information below.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-(--muted) transition hover:bg-(--secondary)/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">

                <FormField label="Employee ID" required>
                  <input
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    disabled={modalMode === 'edit'}
                    placeholder="Example: EMP004"
                    className={getInputClass('employeeId')}
                  />
                  <FieldError message={errors.employeeId} />
                </FormField>

                <FormField label="Employee Name" required>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter employee name"
                    className={getInputClass('name')}
                  />
                  <FieldError message={errors.name} />
                </FormField>

                <FormField label="Email ID" required>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={modalMode === 'edit'}
                    placeholder="example@gmail.com"
                    className={getInputClass('email')}
                  />
                  <FieldError message={errors.email} />
                </FormField>

                <FormField label="Department" required>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={getInputClass('department')}
                  >
                    <option value="">Select Department</option>

                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>

                  <FieldError message={errors.department} />
                </FormField>

                <FormField label="Designation" required>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    disabled={!formData.department}
                    className={getInputClass('designation')}
                  >
                    <option value="">
                      {formData.department
                        ? 'Select Designation'
                        : 'First select a department'}
                    </option>

                    {(designationsByDepartment[formData.department] || []).map(
                      (designation) => (
                        <option key={designation} value={designation}>
                          {designation}
                        </option>
                      )
                    )}
                  </select>

                  <FieldError message={errors.designation} />
                </FormField>

                <FormField label="System Role" required>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={getInputClass('role')}
                  >
                    <option value="">Select System Role</option>

                    {systemRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <FieldError message={errors.role} />
                </FormField>

                <FormField label="Experience (Years)" required>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    step="0.5"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Enter experience"
                    className={getInputClass('experience')}
                  />

                  <FieldError message={errors.experience} />
                </FormField>

                <FormField label="Reporting Manager">
                  <select
                    name="reportingManager"
                    value={formData.reportingManager}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    <option value="">Select Reporting Manager</option>

                    {employees
                      .filter(
                        (employee) =>
                          employee.status === 'Active' &&
                          employee.id !== selectedEmployee?.id
                      )
                      .map((employee) => (
                        <option
                          key={employee.id}
                          value={employee.employeeId}
                        >
                          {employee.name} ({employee.employeeId})
                        </option>
                      ))}
                  </select>
                </FormField>

                <FormField label="Status">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputStyles}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
                  {modalMode === 'add'
                    ? 'Save Employee'
                    : 'Update Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {modalMode === 'view' && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-(--border) bg-(--surface) shadow-xl">

            <div className="flex items-center justify-between border-b border-(--border) p-5">
              <div>
                <h2 className="text-lg font-bold text-(--text)">
                  Employee Details
                </h2>

                <p className="mt-1 text-xs text-(--muted)">
                  Complete employee information.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-(--muted) hover:bg-(--bg)"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <DetailItem
                label="Employee ID"
                value={selectedEmployee.employeeId}
              />

              <DetailItem
                label="Employee Name"
                value={selectedEmployee.name}
              />

              <DetailItem
                label="Email"
                value={selectedEmployee.email}
              />

              <DetailItem
                label="Department"
                value={selectedEmployee.department}
              />

              <DetailItem
                label="Designation"
                value={selectedEmployee.designation}
              />

              <DetailItem
                label="System Role"
                value={selectedEmployee.role}
              />

              <DetailItem
                label="Experience"
                value={`${selectedEmployee.experience} years`}
              />

              <DetailItem
                label="Reporting Manager"
                value={getManagerName(selectedEmployee.reportingManager)}
              />

              <DetailItem
                label="Status"
                value={selectedEmployee.status}
              />

              <DetailItem
                label="Created Date"
                value={selectedEmployee.createdAt}
              />

              <DetailItem
                label="Modified Date"
                value={selectedEmployee.modifiedAt}
              />
            </div>

            <div className="flex justify-end border-t border-(--border) p-5">
              <button
                onClick={closeModal}
                className={`${buttonStyles} bg-(--primary) text-white hover:opacity-90`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Reusable form field
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

// Field validation error
function FieldError({ message }) {
  if (!message) return null

  return (
    <p className="mt-1 text-xs font-medium text-red-500">
      {message}
    </p>
  )
}

// Summary card
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

// Table action button
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

// Employee details item
function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-(--muted)">
        {label}
      </p>

      <p className="mt-1 wrap-break-words text-sm font-medium text-(--text)">
        {value || 'Not provided'}
      </p>
    </div>
  )
}
