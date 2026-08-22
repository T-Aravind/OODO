import React, { useState } from 'react'
import { MOCK_CURRENT_EMPLOYEE, EmployeeProfileData } from '../../mock/employeeData'

export const EmployeeProfile: React.FC = () => {
  const [profile, setProfile] = useState<EmployeeProfileData>(MOCK_CURRENT_EMPLOYEE)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Edit form state
  const [phoneInput, setPhoneInput] = useState(profile.phone)
  const [addressInput, setAddressInput] = useState(profile.address)
  const [avatarInput, setAvatarInput] = useState(profile.profileImage)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfile((prev) => ({
      ...prev,
      phone: phoneInput,
      address: addressInput,
      profileImage: avatarInput,
    }))
    setIsEditModalOpen(false)
  }

  return (
    <div className="profile-view-container">
      {/* Header Banner Card */}
      <div className="profile-header-card">
        <div className="header-left">
          <div className="avatar-wrapper">
            <img src={profile.profileImage} alt={profile.name} className="profile-avatar-lg" />
          </div>
          <div className="profile-meta">
            <h2>{profile.name}</h2>
            <p className="designation-text">{profile.designation}</p>
            <div className="meta-tags">
              <span className="tag-pill emp-id">ID: {profile.id}</span>
              <span className="tag-pill dept">{profile.department}</span>
              <span className="tag-pill email">📧 {profile.email}</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button className="btn-action-primary" onClick={() => setIsEditModalOpen(true)}>
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      {/* Grid of Profile Information Cards */}
      <div className="profile-grid">
        {/* Card 1: Personal Information */}
        <div className="card-box">
          <div className="box-title">
            <h3>Personal Information</h3>
          </div>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">{profile.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">{profile.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone Number</span>
              <span className="info-value">{profile.phone}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Date of Birth</span>
              <span className="info-value">{profile.dob}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender</span>
              <span className="info-value">{profile.gender}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">Address</span>
              <span className="info-value">{profile.address}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Job Information */}
        <div className="card-box">
          <div className="box-title">
            <h3>Job Information</h3>
          </div>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Employee ID</span>
              <span className="info-value highlight">{profile.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Department</span>
              <span className="info-value">{profile.department}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Designation</span>
              <span className="info-value">{profile.designation}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Joining Date</span>
              <span className="info-value">{profile.joiningDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Employment Type</span>
              <span className="info-value">{profile.employmentType}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Reporting Manager</span>
              <span className="info-value">{profile.manager}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Salary Information (READ ONLY) */}
        <div className="card-box salary-box">
          <div className="box-title">
            <h3>Salary Information</h3>
            <span className="readonly-badge">🔒 Read Only (Employees Cannot Edit)</span>
          </div>
          <div className="salary-grid">
            <div className="sal-item">
              <span className="sal-label">Basic Salary</span>
              <span className="sal-amount">₹{profile.salary.basic.toLocaleString()}</span>
            </div>
            <div className="sal-item">
              <span className="sal-label">HRA</span>
              <span className="sal-amount">₹{profile.salary.hra.toLocaleString()}</span>
            </div>
            <div className="sal-item">
              <span className="sal-label">Allowances</span>
              <span className="sal-amount">₹{profile.salary.allowances.toLocaleString()}</span>
            </div>
            <div className="sal-item deduction">
              <span className="sal-label">Deductions</span>
              <span className="sal-amount">- ₹{profile.salary.deductions.toLocaleString()}</span>
            </div>
            <div className="sal-item net-sal full-width">
              <span className="sal-label">Net Take-Home Salary</span>
              <span className="sal-amount-lg">₹{profile.salary.netSalary.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Documents Section */}
        <div className="card-box docs-box">
          <div className="box-title">
            <h3>Documents & Contracts</h3>
          </div>
          <div className="docs-list">
            <div className="doc-item">
              <div className="doc-meta">
                <span className="doc-icon">📄</span>
                <div>
                  <p className="doc-title">Offer Letter</p>

                  <span className="doc-sub">PDF • 1.2 MB</span>
                </div>
              </div>
              <div className="doc-actions">
                <button className="btn-sm-outline" onClick={() => alert('Viewing Offer Letter PDF')}>
                  View
                </button>
                <button className="btn-sm-primary" onClick={() => alert('Downloading Offer Letter PDF')}>
                  Download
                </button>
              </div>
            </div>

            <div className="doc-item">
              <div className="doc-meta">
                <span className="doc-icon">📝</span>
                <div>
                  <p className="doc-title">Employment Contract</p>
                  <span className="doc-sub">PDF • 2.4 MB</span>
                </div>
              </div>
              <div className="doc-actions">
                <button className="btn-sm-outline" onClick={() => alert('Viewing Contract PDF')}>
                  View
                </button>
                <button className="btn-sm-primary" onClick={() => alert('Downloading Contract PDF')}>
                  Download
                </button>
              </div>
            </div>

            <div className="doc-item">
              <div className="doc-meta">
                <span className="doc-icon">🪪</span>
                <div>
                  <p className="doc-title">Government ID Proof</p>
                  <span className="doc-sub">JPG • 850 KB</span>
                </div>
              </div>
              <div className="doc-actions">
                <button className="btn-sm-outline" onClick={() => alert('Viewing ID Proof')}>
                  View
                </button>
                <button className="btn-sm-primary" onClick={() => alert('Downloading ID Proof')}>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile Information</h3>
              <button className="btn-close" onClick={() => setIsEditModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="modal-form">
              <p className="modal-note">
                ℹ️ Employees can only edit phone, address, and profile image. Job title & salary fields are managed by Admin/HR.
              </p>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="modal-textarea"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Profile Image URL</label>
                <input
                  type="text"
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  className="modal-input"
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
