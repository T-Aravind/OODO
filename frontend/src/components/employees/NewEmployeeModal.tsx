import React, { useState } from 'react'
import { UserPlus } from 'lucide-react'
import type { Employee, EmployeeStatus } from '../../types'
import { Modal } from '../common/Modal'

interface NewEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEmployee: (employee: Omit<Employee, 'id'>) => void
}

const DEPARTMENTS = [
  'AI & Data Science',
  'Engineering',
  'Product & Design',
  'People & Culture (HR)',
  'Cloud Infrastructure',
  'Sales & Growth',
  'Marketing',
  'Finance & Operations'
]

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
]

export const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({
  isOpen,
  onClose,
  onAddEmployee
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [designation, setDesignation] = useState('')
  const [manager, setManager] = useState('')
  const [location, setLocation] = useState('Bangalore Tech Hub, India')
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState<EmployeeStatus>('present')
  const [employmentType, setEmploymentType] = useState<'Full-Time' | 'Part-Time' | 'Contract'>('Full-Time')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male')
  const [profileImage, setProfileImage] = useState(AVATAR_PRESETS[0])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Full name is required'
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required'
    if (!designation.trim()) errs.designation = 'Job designation is required'
    if (!manager.trim()) errs.manager = 'Reporting manager is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    onAddEmployee({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '+91 98000 00000',
      department,
      designation: designation.trim(),
      manager: manager.trim(),
      location: location.trim(),
      joiningDate: new Date(joiningDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      status,
      employmentType,
      gender,
      profileImage,
      nationality: 'Indian',
      workShift: 'General Shift (09:00 AM - 06:00 PM)',
      extension: `Ext. ${Math.floor(1000 + Math.random() * 9000)}`
    })

    // Reset form & close
    setName('')
    setEmail('')
    setPhone('')
    setDesignation('')
    setManager('')
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Employee"
      subtitle="Add a new team member to the organizational directory"
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit} className="modal-form-grid">
        {/* Avatar Preset Picker */}
        <div className="form-avatar-picker-section">
          <label className="field-label">Select Profile Avatar</label>
          <div className="avatar-preset-row">
            {AVATAR_PRESETS.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`Preset ${idx + 1}`}
                onClick={() => setProfileImage(imgUrl)}
                className={`avatar-preset-thumb ${profileImage === imgUrl ? 'selected' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-name">
              Full Name *
            </label>
            <input
              id="new-emp-name"
              type="text"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Rahul Verma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <span className="field-error-text">{errors.name}</span>}
          </div>

          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-email">
              Work Email *
            </label>
            <input
              id="new-emp-email"
              type="email"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              placeholder="e.g. rahul.verma@dayflow.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="field-error-text">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-dept">
              Department *
            </label>
            <select
              id="new-emp-dept"
              className="form-input"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-desig">
              Job Designation / Title *
            </label>
            <input
              id="new-emp-desig"
              type="text"
              className={`form-input ${errors.designation ? 'input-error' : ''}`}
              placeholder="e.g. Cloud Engineer"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            {errors.designation && <span className="field-error-text">{errors.designation}</span>}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-manager">
              Reporting Manager *
            </label>
            <input
              id="new-emp-manager"
              type="text"
              className={`form-input ${errors.manager ? 'input-error' : ''}`}
              placeholder="e.g. Rajesh Sharma (VP Engineering)"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
            />
            {errors.manager && <span className="field-error-text">{errors.manager}</span>}
          </div>

          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-phone">
              Phone Number
            </label>
            <input
              id="new-emp-phone"
              type="tel"
              className="form-input"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row-3">
          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-type">
              Employment Type
            </label>
            <select
              id="new-emp-type"
              className="form-input"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as 'Full-Time' | 'Part-Time' | 'Contract')}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-gender">
              Gender
            </label>
            <select
              id="new-emp-gender"
              className="form-input"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other' | 'Prefer not to say')}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-status">
              Work Status
            </label>
            <select
              id="new-emp-status"
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
            >
              <option value="present">🟢 Present</option>
              <option value="on_leave">✈ On Leave</option>
              <option value="absent">🟡 Absent</option>
            </select>
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-joining">
              Joining Date
            </label>
            <input
              id="new-emp-joining"
              type="date"
              className="form-input"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
          </div>

          <div className="form-field-group">
            <label className="field-label" htmlFor="new-emp-loc">
              Office Work Location
            </label>
            <input
              id="new-emp-loc"
              type="text"
              className="form-input"
              placeholder="e.g. Bangalore Tech Hub, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-actions-footer">
          <button type="button" onClick={onClose} className="btn-modal-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-modal-primary">
            <UserPlus size={16} />
            <span>Create Employee</span>
          </button>
        </div>
      </form>
    </Modal>
  )
}
