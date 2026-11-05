import { useEffect, useState } from 'react'
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  X,
  Users,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'

const STORAGE_KEY = 'pulse-clients'

const managedByOptions = [
  'Admin',
  'John Smith',
  'David Kumar',
  'Priya Sharma',
  'Arun Kumar',
]

const regionOptions = [
  'North',
  'South',
  'East',
  'West',
  'Central',
]

const initialClients = [
  {
    id: 1,
    clientName: 'Tech Solutions',
    managedBy: 'John Smith',
    contactPerson: 'Robert',
    email: 'robert@techsolutions.com',
    phone: '9876543210',
    region: 'South',
    locality: 'Chennai',
    projectsCount: 4,
    score: 85,
  },
  {
    id: 2,
    clientName: 'Global Systems',
    managedBy: 'Priya Sharma',
    contactPerson: 'Michael',
    email: 'michael@globalsystems.com',
    phone: '9876543211',
    region: 'North',
    locality: 'Delhi',
    projectsCount: 2,
    score: 92,
  },
  {
    id: 3,
    clientName: 'Digital Works',
    managedBy: 'David Kumar',
    contactPerson: 'Sarah',
    email: 'sarah@digitalworks.com',
    phone: '9876543212',
    region: 'West',
    locality: 'Mumbai',
    projectsCount: 3,
    score: 78,
  },
]

const emptyForm = {
  clientName: '',
  managedBy: '',
  contactPerson: '',
  email: '',
  phone: '',
  region: '',
  locality: '',
}

export default function Clients() {
  const [clients, setClients] = useState(() => {
    const savedClients = localStorage.getItem(STORAGE_KEY)

    return savedClients
      ? JSON.parse(savedClients)
      : initialClients
  })

  const [search, setSearch] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [modalMode, setModalMode] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [activeMenu, setActiveMenu] = useState(null)
  const [error, setError] = useState('')

  // Save clients in LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
  }, [clients])

  // Search and region filter
const filteredClients = clients.filter((client) => {
  const searchValue = search.toLowerCase()

  const matchesSearch = [
    client.clientName,
    client.contactPerson,
    client.email,
    client.locality,
    client.managedBy,
  ].some((value) =>
    String(value || '').toLowerCase().includes(searchValue)
  )

  const matchesRegion =
    selectedRegion === 'All' ||
    client.region === selectedRegion

  return matchesSearch && matchesRegion
})
  // Open Add Client modal
  const handleAddClient = () => {
    setFormData(emptyForm)
    setSelectedClient(null)
    setError('')
    setModalMode('add')
  }

  // Open Edit Client modal
  const handleEditClient = (client) => {
    setFormData({
      clientName: client.clientName,
      managedBy: client.managedBy,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      region: client.region,
      locality: client.locality,
    })

    setSelectedClient(client)
    setError('')
    setModalMode('edit')
    setActiveMenu(null)
  }

  // Open View Client modal
  const handleViewClient = (client) => {
    setSelectedClient(client)
    setActiveMenu(null)
    setModalMode('view')
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
  }

  // Validate and save client
  const handleSubmit = (e) => {
    e.preventDefault()

    const {
      clientName,
      managedBy,
      contactPerson,
      email,
      phone,
      region,
      locality,
    } = formData

    // Required field validation
    if (
      !clientName.trim() ||
      !managedBy ||
      !contactPerson.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !region ||
      !locality.trim()
    ) {
      setError('Please fill in all mandatory fields.')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/

    if (!phoneRegex.test(phone)) {
      setError('Phone number must contain exactly 10 digits.')
      return
    }

    // Duplicate email validation
    const duplicateEmail = clients.some(
      (client) =>
        client.email.toLowerCase() === email.toLowerCase() &&
        client.id !== selectedClient?.id
    )

    if (duplicateEmail) {
      setError('This email address already exists.')
      return
    }

    if (modalMode === 'add') {
      const newClient = {
        id: Date.now(),
        ...formData,
        clientName: clientName.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim(),
        locality: locality.trim(),
        projectsCount: 0,
        score: 0,
      }

      setClients((prev) => [...prev, newClient])
    }

    if (modalMode === 'edit') {
      setClients((prev) =>
        prev.map((client) =>
          client.id === selectedClient.id
            ? {
                ...client,
                ...formData,
                clientName: clientName.trim(),
                contactPerson: contactPerson.trim(),
                email: email.trim(),
                locality: locality.trim(),
              }
            : client
        )
      )
    }

    closeModal()
  }

  // Delete client
  const handleDeleteClient = (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this client?'
    )

    if (!confirmDelete) return

    setClients((prev) =>
      prev.filter((client) => client.id !== id)
    )

    setActiveMenu(null)
  }

  // Close modal
  const closeModal = () => {
    setModalMode(null)
    setSelectedClient(null)
    setFormData(emptyForm)
    setError('')
  }

  // Reusable input class
  const inputStyles =
    'mt-1.5 w-full rounded-lg border border-(--border) bg-(--bg) px-3 py-2.5 text-sm text-(--text) outline-none transition focus:border-(--secondary) focus:ring-2 focus:ring-(--secondary)/20'

  const labelStyles =
    'text-sm font-medium text-(--text)'

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-(--text)">
            Clients
          </h1>

          <p className="mt-1 text-sm text-(--muted)">
            Manage your clients and their contact information.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddClient}
          className="flex items-center justify-center gap-2 rounded-lg bg-(--secondary) px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      {/* Client Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-(--border) bg-(--surface) p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-(--muted)">
              Total Clients
            </p>
            <Users size={20} className="text-(--secondary)" />
          </div>

          <h2 className="mt-3 text-2xl font-semibold text-(--text)">
            {clients.length}
          </h2>
        </div>

        <div className="rounded-xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--muted)">
            Total Projects
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-(--text)">
            {clients.reduce(
              (total, client) =>
                total + Number(client.projectsCount || 0),
              0
            )}
          </h2>
        </div>

        <div className="rounded-xl border border-(--border) bg-(--surface) p-5">
          <p className="text-sm text-(--muted)">
            Regions Covered
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-(--text)">
            {new Set(clients.map((client) => client.region)).size}
          </h2>
        </div>
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
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-(--border) bg-(--surface) py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none focus:border-(--secondary)"
          />
        </div>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="rounded-lg border border-(--border) bg-(--surface) px-4 py-2.5 text-sm text-(--text) outline-none focus:border-(--secondary)"
        >
          <option value="All">All Regions</option>

          {regionOptions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      {/* Client Table */}
      <div className="overflow-hidden rounded-xl border border-(--border) bg-(--surface)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left">
            <thead className="border-b border-(--border) bg-(--bg)">
              <tr>
                {[
                  'Client Name',
                  'Managed By',
                  'Projects Count',
                  'Score',
                  'Region',
                  'Actions',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-sm font-semibold uppercase tracking-wide text-(--muted)"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-(--border)">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="transition hover:bg-(--bg)"
                  >
                    {/* Client Name */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-(--text)">
                        {client.clientName}
                      </p>

                      <p className="mt-1 text-(--muted)">
                        {client.email}
                      </p>
                    </td>

                    {/* Managed By */}
                    <td className="px-5 py-4 text-sm text-(--text)">
                      {client.managedBy}
                    </td>

                    {/* Projects Count */}
                    <td className="px-5 py-4 text-sm text-(--text)">
                      {client.projectsCount}
                    </td>

                    {/* Score */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-(--secondary)/10 px-3 py-1 text-sm font-medium text-(--secondary)">
                        {client.score}/100
                      </span>
                    </td>

                    {/* Region */}
                    <td className="px-5 py-4 text-sm text-(--text)">
                      <div>{client.region}</div>
                      <p className="mt-1 text-xs text-(--muted)">
                        {client.locality}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="relative px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === client.id
                              ? null
                              : client.id
                          )
                        }
                        className="flex size-9 items-center justify-center rounded-lg text-(--muted) transition hover:bg-(--bg) hover:text-(--text)"
                        aria-label="Client actions"
                      >
                        <MoreVertical size={19} />
                      </button>

                      {activeMenu === client.id && (
                        <div className="absolute right-10 top-10 z-20 w-36 rounded-lg border border-(--border) bg-(--bg) p-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() =>
                              handleViewClient(client)
                            }
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-(--text) hover:bg-(--surface)"
                          >
                            <Eye size={15} />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEditClient(client)
                            }
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-(--text) hover:bg-(--surface)"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteClient(client.id)
                            }
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-(--muted)"
                  >
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-(--border) px-5 py-3">
          <p className="text-xs text-(--muted)">
            Showing {filteredClients.length} of {clients.length} clients
          </p>
        </div>
      </div>

      {/* Add / Edit / View Modal */}
      {modalMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-(--border) bg-(--bg) shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between border-b border-(--border) bg-(--bg) px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-(--text)">
                  {modalMode === 'add'
                    ? 'Add Client'
                    : modalMode === 'edit'
                      ? 'Edit Client'
                      : 'Client Details'}
                </h2>

                <p className="mt-1 text-xs text-(--muted)">
                  {modalMode === 'view'
                    ? 'View client information'
                    : 'Fields marked with * are mandatory'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-(--muted) hover:bg-(--surface)"
              >
                <X size={19} />
              </button>
            </div>

            {/* View Mode */}
            {modalMode === 'view' && selectedClient && (
              <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
                <DetailItem
                  icon={<Users size={17} />}
                  label="Client Name"
                  value={selectedClient.clientName}
                />

                <DetailItem
                  icon={<Users size={17} />}
                  label="Managed By"
                  value={selectedClient.managedBy}
                />

                <DetailItem
                  icon={<Users size={17} />}
                  label="Contact Person"
                  value={selectedClient.contactPerson}
                />

                <DetailItem
                  icon={<Mail size={17} />}
                  label="Email"
                  value={selectedClient.email}
                />

                <DetailItem
                  icon={<Phone size={17} />}
                  label="Phone"
                  value={selectedClient.phone}
                />

                <DetailItem
                  icon={<MapPin size={17} />}
                  label="Region"
                  value={selectedClient.region}
                />

                <DetailItem
                  icon={<MapPin size={17} />}
                  label="Locality"
                  value={selectedClient.locality}
                />

                <DetailItem
                  icon={<Users size={17} />}
                  label="Projects Count"
                  value={selectedClient.projectsCount}
                />

                <DetailItem
                  icon={<Users size={17} />}
                  label="Score"
                  value={`${selectedClient.score}/100`}
                />

                <div className="col-span-full flex justify-end border-t border-(--border) pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-(--border) px-5 py-2 text-sm font-medium text-(--text) hover:bg-(--surface)"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Add / Edit Form */}
            {(modalMode === 'add' || modalMode === 'edit') && (
              <form onSubmit={handleSubmit} className="p-6">

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* Client Name */}
                  <div>
                    <label className={labelStyles}>
                      Client Name *
                    </label>

                    <input
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      placeholder="Enter client name"
                      className={inputStyles}
                    />
                  </div>

                  {/* Managed By */}
                  <div>
                    <label className={labelStyles}>
                      Managed By *
                    </label>

                    <select
                      name="managedBy"
                      value={formData.managedBy}
                      onChange={handleChange}
                      className={inputStyles}
                    >
                      <option value="">Select manager</option>

                      {managedByOptions.map((manager) => (
                        <option key={manager} value={manager}>
                          {manager}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className={labelStyles}>
                      Contact Person *
                    </label>

                    <input
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="Enter contact person"
                      className={inputStyles}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelStyles}>
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className={inputStyles}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelStyles}>
                      Phone *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 10)

                        setFormData((prev) => ({
                          ...prev,
                          phone: value,
                        }))

                        setError('')
                      }}
                      placeholder="Enter 10-digit phone number"
                      className={inputStyles}
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className={labelStyles}>
                      Region *
                    </label>

                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={inputStyles}
                    >
                      <option value="">Select region</option>

                      {regionOptions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Locality */}
                  <div className="sm:col-span-2">
                    <label className={labelStyles}>
                      Locality *
                    </label>

                    <input
                      name="locality"
                      value={formData.locality}
                      onChange={handleChange}
                      placeholder="Enter locality"
                      className={inputStyles}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
                    {error}
                  </p>
                )}

                {/* Form Buttons */}
                <div className="mt-7 flex flex-col-reverse justify-end gap-3 border-t border-(--border) pt-5 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg border border-(--border) px-5 py-2.5 text-sm font-medium text-(--text) hover:bg-(--surface)"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-(--secondary) px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    {modalMode === 'add'
                      ? 'Save Client'
                      : 'Update Client'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Reusable client detail item
function DetailItem({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-(--muted)">
        {icon}
        <p className="text-xs font-medium">{label}</p>
      </div>

      <p className="wrap-break-words pl-6 text-sm font-medium text-(--text)">
        {value || '-'}
      </p>
    </div>
  )
}