import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import apiService from '../services/api'

const AdminDashboard = () => {
  const { user, logout, requests, fetchRequests } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState([])
  const [pendingRegistrations, setPendingRegistrations] = useState([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '', password: '', name: '', email: '', role: 'student',
    department: '', program: '', studentId: '', approverType: ''
  })
  const [userError, setUserError] = useState('')
  const [userSuccess, setUserSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    requestsByType: { termination: 0, idReplacement: 0 }
  })

  useEffect(() => {
    fetchRequests()
    fetchStats()
    if (activeTab === 'users') {
      fetchUsers()
      fetchPendingRegistrations()
    }
  }, [activeTab])

  const fetchStats = async () => {
    try {
      const data = await apiService.getStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;
      
      console.log('Fetching users with params:', params);
      const data = await apiService.getUsers(params);
      console.log('Received users:', data);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUserError('Failed to fetch users: ' + error.message);
    }
  }

  const fetchPendingRegistrations = async () => {
    try {
      const data = await apiService.getPendingRegistrations()
      setPendingRegistrations(data)
    } catch (error) {
      console.error('Failed to fetch pending registrations:', error)
    }
  }

  const handleRegistrationApproval = async (registrationId, action) => {
    try {
      console.log('Processing registration approval:', { registrationId, action });
      await apiService.approveRegistration(registrationId, action);
      await fetchPendingRegistrations();
      await fetchUsers();
      setUserSuccess(`Registration ${action} successfully!`);
      setTimeout(() => setUserSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to process registration:', error);
      setUserError('Failed to process registration: ' + error.message);
      setTimeout(() => setUserError(''), 5000);
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setUserError('')
    setUserSuccess('')
    try {
      await apiService.createUser(newUser)
      await fetchUsers()
      setShowAddUser(false)
      setNewUser({ username: '', password: '', name: '', email: '', role: 'student', department: '', program: '', studentId: '', approverType: '' })
      setUserSuccess('User created successfully!')
      setTimeout(() => setUserSuccess(''), 3000)
    } catch (error) {
      console.error('Failed to create user:', error)
      setUserError(error.message || 'Failed to create user')
    }
  }

  const handleBlockUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active'
    try {
      console.log('Updating user status:', { userId, currentStatus, newStatus });
      await apiService.updateUserStatus(userId, newStatus)
      await fetchUsers()
      setUserSuccess(`User ${newStatus} successfully!`);
      setTimeout(() => setUserSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to update user status:', error)
      setUserError('Failed to update user status: ' + error.message);
      setTimeout(() => setUserError(''), 5000);
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        console.log('Deleting user:', { userId });
        await apiService.deleteUser(userId)
        await fetchUsers()
        setUserSuccess('User deleted successfully!');
        setTimeout(() => setUserSuccess(''), 3000);
      } catch (error) {
        console.error('Failed to delete user:', error)
        setUserError('Failed to delete user: ' + error.message);
        setTimeout(() => setUserError(''), 5000);
      }
    }
  }

  const reassignRequest = async (requestId, newApprover) => {
    try {
      await apiService.reassignRequest(requestId, newApprover)
      await fetchRequests()
    } catch (error) {
      console.error('Failed to reassign request:', error)
    }
  }

  const generateCertificate = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}/certificate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to download certificate')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `clearance-certificate-${requestId}.jpg`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate certificate:', error)
      alert('Failed to generate certificate. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-700 hidden sm:block">Welcome, {user.name}</span>
              <Link to="/settings" className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded">Settings</Link>
              <button onClick={logout} className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-4 py-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {userSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {userSuccess}
          </div>
        )}

        {/* Error Message */}
        {userError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {userError}
          </div>
        )}

        {/* Mobile-first Tab Navigation */}
        <div className="mb-4 sm:mb-6">
          <div className="flex overflow-x-auto space-x-2 sm:space-x-8 pb-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'requests', label: 'Requests' },
              { id: 'users', label: 'Users' },
              { id: 'settings', label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab - Mobile-first */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">System Overview</h2>
            
            {/* Mobile-first Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.totalRequests}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-lg sm:text-2xl font-semibold text-yellow-600">{stats.pendingRequests}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Approved</p>
                  <p className="text-lg sm:text-2xl font-semibold text-green-600">{stats.approvedRequests}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Rejected</p>
                  <p className="text-lg sm:text-2xl font-semibold text-red-600">{stats.rejectedRequests}</p>
                </div>
              </div>
            </div>

            {/* Request Types Breakdown */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg font-medium mb-4">Request Types</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600">Termination</p>
                  <p className="text-xl font-semibold text-blue-600">{stats.requestsByType?.termination || 0}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <p className="text-sm text-gray-600">ID Replacement</p>
                  <p className="text-xl font-semibold text-green-600">{stats.requestsByType?.idReplacement || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab - Mobile-first */}
        {activeTab === 'requests' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">All Clearance Requests</h2>
            
            {/* Mobile-first Request Cards */}
            <div className="space-y-4">
              {requests.map(request => (
                <div key={request.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{request.studentName}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {request.type.replace(/([A-Z])/g, ' $1')} - {request.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.programType} ({request.programMode})
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'certificate_ready' ? 'bg-purple-100 text-purple-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status.replace('_', ' ')}
                      </span>
                      
                      <span className="text-xs text-gray-500">
                        {request.currentStep + 1} / {request.approvalSequence?.length || 0}
                      </span>
                      
                      {request.status === 'certificate_ready' && (
                        <button
                          onClick={() => generateCertificate(request.id)}
                          className="text-blue-600 hover:text-blue-900 text-xs underline"
                        >
                          Certificate
                        </button>
                      )}
                      
                      {request.status === 'pending' && (
                        <select
                          onChange={(e) => reassignRequest(request.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                          defaultValue=""
                        >
                          <option value="" disabled>Reassign</option>
                          <option value="Academic Advisor">Academic Advisor</option>
                          <option value="Department Head">Department Head</option>
                          <option value="Library A">Library A</option>
                          <option value="Library B">Library B</option>
                          <option value="Library C">Library C</option>
                          <option value="Main Library">Main Library</option>
                          <option value="Finance">Finance</option>
                          <option value="Dormitory">Dormitory</option>
                          <option value="Cafeteria">Cafeteria</option>
                          <option value="Campus Police">Campus Police</option>
                          <option value="Post Graduate Dean">Post Graduate Dean</option>
                          <option value="Registrar">Registrar</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab - Mobile-first */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">User Management</h2>
            
            {/* Pending Registrations */}
            {pendingRegistrations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Registrations</h3>
                <div className="space-y-4">
                  {pendingRegistrations.map(registration => (
                    <div key={registration.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{registration.name}</h4>
                          <p className="text-sm text-gray-600">@{registration.username} - {registration.email}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {registration.role} {registration.approverType && `- ${registration.approverType}`}
                          </p>
                          {registration.department && (
                            <p className="text-xs text-gray-500">{registration.department}</p>
                          )}
                          {registration.program && (
                            <p className="text-xs text-gray-500">{registration.program}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            Submitted: {new Date(registration.submittedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRegistrationApproval(registration.id, 'approved')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRegistrationApproval(registration.id, 'rejected')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Active Users */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Add User
              </button>
            </div>
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="approver">Approver</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <button
                onClick={fetchUsers}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Search
              </button>
            </div>
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">@{user.username} - {user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role} {user.approverType && `- ${user.approverType}`}
                      </p>
                      {user.department && (
                        <p className="text-xs text-gray-500">{user.department}</p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-center ${
                        user.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'approver' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'teacher' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.status === 'blocked' ? 'Blocked' : user.role}
                      </span>
                      {user.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleBlockUser(user.id, user.status)}
                            className={`px-2 py-1 rounded text-xs ${
                              user.status === 'active' 
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {user.status === 'active' ? 'Block' : 'Unblock'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab - Mobile-first */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">System Settings</h2>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <p className="text-gray-600 mb-4">System configuration options</p>
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <p>• Configure approval workflows</p>
                <p>• Notification settings</p>
                <p>• System parameters</p>
                <p>• Backup and restore</p>
                <p>• Audit log settings</p>
              </div>
              <Link
                to="/admin/settings"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm inline-block"
              >
                Open System Settings
              </Link>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium mb-4">Add New User</h3>
                {userError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {userError}
                  </div>
                )}
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="approver">Approver</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {newUser.role === 'approver' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Approver Type</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={newUser.approverType}
                        onChange={(e) => setNewUser({...newUser, approverType: e.target.value})}
                      >
                        <option value="">Select Type</option>
                        <option value="Academic Advisor">Academic Advisor</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Library A">Library A</option>
                        <option value="Library B">Library B</option>
                        <option value="Library C">Library C</option>
                        <option value="Main Library">Main Library</option>
                        <option value="Finance">Finance</option>
                        <option value="Dormitory">Dormitory</option>
                        <option value="Cafeteria">Cafeteria</option>
                        <option value="Campus Police">Campus Police</option>
                        <option value="Post Graduate Dean">Post Graduate Dean</option>
                        <option value="Registrar">Registrar</option>
                      </select>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm"
                    >
                      Create User
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddUser(false)
                        setUserError('')
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard