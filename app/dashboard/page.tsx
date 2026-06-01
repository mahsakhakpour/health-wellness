'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ChildData {
  id: string
  name: string
  birthDate: string
  age: number
  diagnoses: string[]
  bloodType: string
  allergies: string[]
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  purpose: string
}

interface Appointment {
  id: string
  type: string
  provider: string
  date: string
  time: string
}

interface CareTeamMember {
  id: string
  name: string
  role: string
}

interface TherapyGoal {
  id: string
  description: string
  currentLevel: number
  targetLevel: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // State for modals
  const [showAddMedication, setShowAddMedication] = useState(false)
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const [showAddCareTeam, setShowAddCareTeam] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showUpdateGoals, setShowUpdateGoals] = useState(false)
  
  // State for form data
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', purpose: '' })
  const [newAppointment, setNewAppointment] = useState({ type: '', provider: '', date: '', time: '' })
  const [newCareMember, setNewCareMember] = useState({ name: '', role: '' })
  
  // Child profile state
  const [childProfile, setChildProfile] = useState<ChildData>({
    id: '1',
    name: 'Alex Johnson',
    birthDate: '2019-05-15',
    age: 6,
    diagnoses: ['Autism Spectrum Disorder', 'Speech Delay'],
    bloodType: 'O+',
    allergies: ['Penicillin']
  })
  
  const [editForm, setEditForm] = useState({
    name: '',
    birthDate: '',
    bloodType: '',
    allergies: '',
    newDiagnosis: ''
  })
  
  // Therapy goals state
  const [therapyGoals, setTherapyGoals] = useState<TherapyGoal[]>([
    { id: '1', description: 'Use 2-word phrases', currentLevel: 45, targetLevel: 80 },
    { id: '2', description: 'Make eye contact', currentLevel: 40, targetLevel: 85 },
    { id: '3', description: 'Sit calmly for 10 min', currentLevel: 50, targetLevel: 90 }
  ])
  
  const [goalUpdates, setGoalUpdates] = useState<{ [key: string]: number }>({})
  
  // State for lists
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: 'Melatonin', dosage: '2mg', frequency: 'Bedtime', purpose: 'Sleep support' }
  ])
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', type: 'Pediatrician', provider: 'Dr. Sarah Smith', date: 'March 15, 2025', time: '10:00 AM' },
    { id: '2', type: 'Speech Therapy', provider: 'Sarah Johnson', date: 'March 18, 2025', time: '2:00 PM' }
  ])
  
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>([
    { id: '1', name: 'Dr. Sarah Smith', role: 'Pediatrician' },
    { id: '2', name: 'Dr. Michael Jones', role: 'Neurologist' },
    { id: '3', name: 'Sarah Johnson', role: 'Speech Therapist' }
  ])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Handlers
  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault()
    const newMed = {
      id: Date.now().toString(),
      ...newMedication
    }
    setMedications([...medications, newMed])
    setNewMedication({ name: '', dosage: '', frequency: '', purpose: '' })
    setShowAddMedication(false)
  }

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    const newApt = {
      id: Date.now().toString(),
      ...newAppointment
    }
    setAppointments([...appointments, newApt])
    setNewAppointment({ type: '', provider: '', date: '', time: '' })
    setShowAddAppointment(false)
  }

  const handleAddCareTeam = (e: React.FormEvent) => {
    e.preventDefault()
    const newMember = {
      id: Date.now().toString(),
      ...newCareMember
    }
    setCareTeam([...careTeam, newMember])
    setNewCareMember({ name: '', role: '' })
    setShowAddCareTeam(false)
  }

  const handleEditProfile = (e: React.FormEvent) => {
    e.preventDefault()
    
    const birthDateObj = new Date(editForm.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthDateObj.getFullYear()
    const monthDiff = today.getMonth() - birthDateObj.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--
    }
    
    const allergiesArray = editForm.allergies.split(',').map(a => a.trim()).filter(a => a)
    
    let newDiagnoses = [...childProfile.diagnoses]
    if (editForm.newDiagnosis && editForm.newDiagnosis.trim()) {
      newDiagnoses = [...childProfile.diagnoses, editForm.newDiagnosis.trim()]
    }
    
    setChildProfile({
      ...childProfile,
      name: editForm.name,
      birthDate: editForm.birthDate,
      age: age,
      bloodType: editForm.bloodType,
      allergies: allergiesArray,
      diagnoses: newDiagnoses
    })
    
    setShowEditProfile(false)
    setEditForm({ name: '', birthDate: '', bloodType: '', allergies: '', newDiagnosis: '' })
  }

  const handleUpdateGoals = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedGoals = therapyGoals.map(goal => ({
      ...goal,
      currentLevel: goalUpdates[goal.id] !== undefined ? goalUpdates[goal.id] : goal.currentLevel
    }))
    
    setTherapyGoals(updatedGoals)
    setShowUpdateGoals(false)
    setGoalUpdates({})
  }

  const openEditModal = () => {
    setEditForm({
      name: childProfile.name,
      birthDate: childProfile.birthDate,
      bloodType: childProfile.bloodType,
      allergies: childProfile.allergies.join(', '),
      newDiagnosis: ''
    })
    setShowEditProfile(true)
  }

  const openUpdateGoalsModal = () => {
    const updates: { [key: string]: number } = {}
    therapyGoals.forEach(goal => {
      updates[goal.id] = goal.currentLevel
    })
    setGoalUpdates(updates)
    setShowUpdateGoals(true)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-semibold text-xl text-slate-900">Nurture Health</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Family Record</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Health Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your family's health records in one place</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Active Medications</p>
            <p className="text-3xl font-bold text-slate-900">{medications.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Care Team</p>
            <p className="text-3xl font-bold text-slate-900">{careTeam.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Upcoming Appointments</p>
            <p className="text-3xl font-bold text-slate-900">{appointments.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-500 mb-1">Active Goals</p>
            <p className="text-3xl font-bold text-slate-900">{therapyGoals.length}</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Child Profile */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Child Profile</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{childProfile.name}</h3>
                    <p className="text-slate-600 mt-1">Age: {childProfile.age} years • Blood Type: {childProfile.bloodType}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {childProfile.diagnoses.map((diag, idx) => (
                        <span key={idx} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded">
                          {diag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-slate-500">Allergies:</p>
                      <p className="text-sm text-slate-700">{childProfile.allergies.join(', ') || 'None'}</p>
                    </div>
                  </div>
                  <button
                    onClick={openEditModal}
                    className="text-sm bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-semibold text-slate-900">Current Medications</h2>
                <button
                  onClick={() => setShowAddMedication(true)}
                  className="text-sm bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  + Add
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {medications.map((med) => (
                  <div key={med.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">{med.name}</p>
                        <p className="text-sm text-slate-600 mt-1">{med.dosage} • {med.frequency} • {med.purpose}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-semibold text-slate-900">Upcoming Appointments</h2>
                <button
                  onClick={() => setShowAddAppointment(true)}
                  className="text-sm bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  + Schedule
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">{apt.type}</p>
                        <p className="text-sm text-slate-600 mt-1">with {apt.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{apt.date}</p>
                        <p className="text-xs text-slate-500">{apt.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Therapy Goals */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-semibold text-slate-900">Therapy Goals</h2>
                <button
                  onClick={openUpdateGoalsModal}
                  className="text-sm bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Update
                </button>
              </div>
              <div className="p-6 space-y-4">
                {therapyGoals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-700">{goal.description}</span>
                      <span className="text-slate-500">{goal.currentLevel}% → {goal.targetLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-teal-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${goal.currentLevel}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Care Team */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-semibold text-slate-900">Care Team</h2>
                <button
                  onClick={() => setShowAddCareTeam(true)}
                  className="text-sm bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  + Add
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {careTeam.map((member) => (
                  <div key={member.id} className="p-6">
                    <p className="font-medium text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-600 mt-1">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Add Medication</h2>
            </div>
            <form onSubmit={handleAddMedication} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Melatonin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
                <input
                  type="text"
                  required
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 2mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                <input
                  type="text"
                  required
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Bedtime"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                <input
                  type="text"
                  required
                  value={newMedication.purpose}
                  onChange={(e) => setNewMedication({ ...newMedication, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Sleep support"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">Save</button>
                <button type="button" onClick={() => setShowAddMedication(false)} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Appointment Modal */}
      {showAddAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Schedule Appointment</h2>
            </div>
            <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Appointment Type</label>
                <input
                  type="text"
                  required
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Pediatrician, Dentist, Therapy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Provider Name</label>
                <input
                  type="text"
                  required
                  value={newAppointment.provider}
                  onChange={(e) => setNewAppointment({ ...newAppointment, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Dr. Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  required
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., April 10, 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input
                  type="text"
                  required
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 3:00 PM"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">Save</button>
                <button type="button" onClick={() => setShowAddAppointment(false)} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Care Team Modal */}
      {showAddCareTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Add Care Team Member</h2>
            </div>
            <form onSubmit={handleAddCareTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newCareMember.name}
                  onChange={(e) => setNewCareMember({ ...newCareMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Dr. Emily Brown"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role / Specialty</label>
                <input
                  type="text"
                  required
                  value={newCareMember.role}
                  onChange={(e) => setNewCareMember({ ...newCareMember, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Occupational Therapist"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">Save</button>
                <button type="button" onClick={() => setShowAddCareTeam(false)} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Edit Child Profile</h2>
            </div>
            <form onSubmit={handleEditProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Child's Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Birth Date</label>
                <input
                  type="date"
                  required
                  value={editForm.birthDate}
                  onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Type</label>
                <select
                  value={editForm.bloodType}
                  onChange={(e) => setEditForm({ ...editForm, bloodType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Allergies (comma separated)</label>
                <input
                  type="text"
                  value={editForm.allergies}
                  onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Penicillin, Peanuts, Latex"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Add New Diagnosis (optional)</label>
                <input
                  type="text"
                  value={editForm.newDiagnosis}
                  onChange={(e) => setEditForm({ ...editForm, newDiagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., ADHD, Sensory Processing Disorder"
                />
              </div>
              <div className="pt-2">
                <p className="text-sm text-slate-500 mb-2">Current Diagnoses:</p>
                <div className="flex gap-2 flex-wrap">
                  {childProfile.diagnoses.map((diag, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                      {diag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">Save Changes</button>
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Goals Modal */}
      {showUpdateGoals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Update Therapy Goals</h2>
              <p className="text-sm text-slate-500 mt-1">Adjust the progress percentage for each goal</p>
            </div>
            <form onSubmit={handleUpdateGoals} className="p-6 space-y-6">
              {therapyGoals.map((goal) => (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <label className="font-medium text-slate-700">{goal.description}</label>
                    <span className="text-teal-600 font-medium">{goalUpdates[goal.id] || goal.currentLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={goal.targetLevel}
                    value={goalUpdates[goal.id] !== undefined ? goalUpdates[goal.id] : goal.currentLevel}
                    onChange={(e) => setGoalUpdates({
                      ...goalUpdates,
                      [goal.id]: parseInt(e.target.value)
                    })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span>
                    <span>Target: {goal.targetLevel}%</span>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">Save Progress</button>
                <button type="button" onClick={() => setShowUpdateGoals(false)} className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}