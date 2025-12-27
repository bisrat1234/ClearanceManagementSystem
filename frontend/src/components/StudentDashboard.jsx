import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import apiService from '../services/api'

const StudentDashboard = () => {
  const { user, logout, requests, fetchRequests } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    type: 'termination',
    reason: 'graduation',
    programType: 'postgraduate',
    programMode: 'regular'
  })

  // Debug logging
  console.log('StudentDashboard - User:', user)
  console.log('StudentDashboard - Requests:', requests)

  // Show loading if user is not available
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    )
  }

  // Update reason when type changes
  useEffect(() => {
    if (formData.type === 'termination' && !['graduation', 'withdrawal', 'leave', 'adr'].includes(formData.reason)) {
      setFormData(prev => ({ ...prev, reason: 'graduation' }))
    } else if (formData.type === 'idReplacement' && !['lost', 'damaged', 'stolen'].includes(formData.reason)) {
      setFormData(prev => ({ ...prev, reason: 'lost' }))
    }
  }, [formData.type])
  const [selectedFiles, setSelectedFiles] = useState([])

  useEffect(() => {
    if (user) {
      fetchRequests().catch(err => {
        console.error('Failed to fetch requests:', err)
        setError('Failed to load requests')
      })
    }
  }, [user])

  const submitRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const requestData = {
        ...formData,
        reason: formData.reason || (formData.type === 'termination' ? 'graduation' : 'lost')
      }
      
      let response
      if (selectedFiles.length > 0) {
        const formDataToSend = new FormData()
        formDataToSend.append('type', requestData.type)
        formDataToSend.append('reason', requestData.reason)
        formDataToSend.append('programType', requestData.programType)
        formDataToSend.append('programMode', requestData.programMode)
        
        selectedFiles.forEach(file => {
          formDataToSend.append('documents', file)
        })
        
        response = await apiService.submitRequestWithFiles(formDataToSend)
      } else {
        response = await apiService.submitRequest(requestData)
      }
      
      await fetchRequests()
      setShowForm(false)
      setFormData({ type: 'termination', reason: 'graduation', programType: 'postgraduate', programMode: 'regular' })
      setSelectedFiles([])
      alert('Request submitted successfully!')
    } catch (error) {
      console.error('Failed to submit request:', error)
      alert(`Failed to submit request: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const downloadCertificate = async (requestId) => {
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
      console.error('Failed to download certificate:', error)
      alert('Failed to download certificate. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'text-green-600'
      case 'rejected': return 'text-red-600'
      case 'completed': return 'text-blue-600'
      case 'certificate_ready': return 'text-purple-600'
      default: return 'text-yellow-600'
    }
  }

  const myRequests = requests ? requests : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Student Panel</h1>
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
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Mobile-first Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Clearance Requests</h2>
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-3 sm:py-2 rounded-md hover:bg-blue-700 text-center font-medium"
          >
            New Request
          </button>
        </div>

        {/* Mobile-first Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium mb-4">Submit Clearance Request</h3>
                <form onSubmit={submitRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="termination">Termination Clearance</option>
                      <option value="idReplacement">ID Card Replacement</option>
                    </select>
                  </div>
                  
                  {formData.type === 'termination' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Termination Reason</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={formData.reason || 'graduation'}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      >
                        <option value="graduation">Graduation</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="leave">Leave of Absence</option>
                        <option value="adr">Academic Dismissal (ADR)</option>
                      </select>
                    </div>
                  )}

                  {formData.type === 'idReplacement' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Replacement Reason</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={formData.reason || 'lost'}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      >
                        <option value="lost">Lost</option>
                        <option value="damaged">Damaged</option>
                        <option value="stolen">Stolen</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={formData.programType}
                      onChange={(e) => setFormData({...formData, programType: e.target.value})}
                    >
                      <option value="postgraduate">Postgraduate</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="diploma">Diploma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Mode</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={formData.programMode}
                      onChange={(e) => setFormData({...formData, programMode: e.target.value})}
                    >
                      <option value="regular">Regular</option>
                      <option value="evening">Evening</option>
                      <option value="summer">Summer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      capture="environment"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                    />
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">Selected files:</p>
                        <ul className="text-xs text-gray-500">
                          {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-4 rounded mb-4 text-xs">
            <p><strong>Student ID:</strong> {user?.studentId || 'Not Set'}</p>
            <p><strong>Total Requests:</strong> {requests?.length || 0}</p>
            <p><strong>My Requests:</strong> {myRequests.length}</p>
          </div>
        )}

        {/* Mobile-first Request List */}
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm sm:text-base">No clearance requests yet. Submit your first request!</p>
            </div>
          ) : (
            myRequests.map(request => (
              <div key={request.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-medium capitalize">
                      {request.type.replace(/([A-Z])/g, ' $1')} Request
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                    </p>
                    {request.reason && (
                      <p className="text-xs sm:text-sm text-gray-600 capitalize">
                        Reason: {request.reason}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className={`${getStatusColor(request.status)}`}>
                      <span className="capitalize font-medium text-sm">{request.status.replace('_', ' ')}</span>
                    </div>
                    {(request.status === 'certificate_ready') && (
                      <button
                        onClick={() => downloadCertificate(request.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 w-full sm:w-auto"
                      >
                        Download Certificate
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Mobile-first Progress Tracker */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Approval Progress</h4>
                  <div className="space-y-2">
                    {request.approvalSequence && request.approvalSequence.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 ${
                          index < request.currentStep ? 'bg-green-500' :
                          index === request.currentStep ? 'bg-yellow-500' : 'bg-gray-300'
                        }`} />
                        <span className={`text-xs sm:text-sm ${
                          index < request.currentStep ? 'text-green-700' :
                          index === request.currentStep ? 'text-yellow-700' : 'text-gray-500'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Documents */}
                {request.documents && request.documents.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {request.documents.map((doc, index) => {
                        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(doc);
                        return (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <a
                              href={`http://localhost:5000/uploads/${doc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs flex items-center space-x-1 flex-1"
                            >
                              <span>{isImage ? '🖼️' : '📄'}</span>
                              <span className="truncate">{doc}</span>
                            </a>
                            {isImage && (
                              <img 
                                src={`http://localhost:5000/uploads/${doc}`} 
                                alt="Document preview" 
                                className="w-12 h-12 object-cover rounded border flex-shrink-0"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard