import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import apiService from '../services/api'

const ApproverDashboard = () => {
  const { user, logout, requests, fetchRequests } = useAuth()
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    searchBy: 'all',
    status: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: ''
  })
  const [allRequests, setAllRequests] = useState([])
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    fetchRequests()
    loadAllRequests()
  }, [])

  const loadAllRequests = async () => {
    try {
      const response = await apiService.searchRequests({})
      setAllRequests(response)
    } catch (error) {
      console.error('Failed to load all requests:', error)
    }
  }

  const handleSearch = async () => {
    try {
      const params = {}
      if (searchFilters.search) params.search = searchFilters.search
      if (searchFilters.searchBy !== 'all') params.searchBy = searchFilters.searchBy
      if (searchFilters.status !== 'all') params.status = searchFilters.status
      if (searchFilters.type !== 'all') params.type = searchFilters.type
      if (searchFilters.dateFrom) params.dateFrom = searchFilters.dateFrom
      if (searchFilters.dateTo) params.dateTo = searchFilters.dateTo
      
      const response = await apiService.searchRequests(params)
      setAllRequests(response)
    } catch (error) {
      setError('Failed to search requests')
    }
  }

  const clearSearch = () => {
    setSearchFilters({
      search: '',
      searchBy: 'all',
      status: 'all',
      type: 'all',
      dateFrom: '',
      dateTo: ''
    })
    loadAllRequests()
  }

  const handleApproval = async (requestId, action) => {
    // Require comment for rejection
    if (action === 'rejected' && (!comment || comment.trim() === '')) {
      setError('Rejection reason is required')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      await apiService.approveRequest(requestId, { action, comment })
      await fetchRequests()
      setSelectedRequest(null)
      setComment('')
    } catch (error) {
      if (error.message.includes('400')) {
        setError('Rejection reason is required')
      } else {
        setError('Failed to process approval')
      }
    } finally {
      setLoading(false)
    }
  }

  const pendingRequests = requests.filter(req => req.status === 'pending')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Approver Panel</h1>
              <span className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                {user.approverType || 'Approver'}
              </span>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {showSearch ? 'Search Results' : `Pending Approvals (${pendingRequests.length})`}
          </h2>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            {showSearch ? 'Show Pending Only' : 'Search All Requests'}
          </button>
        </div>

        {/* Search Panel */}
        {showSearch && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-lg font-medium mb-4">Search Requests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Term</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchFilters.search}
                  onChange={(e) => setSearchFilters({...searchFilters, search: e.target.value})}
                  placeholder="Enter search term..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search By</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchFilters.searchBy}
                  onChange={(e) => setSearchFilters({...searchFilters, searchBy: e.target.value})}
                >
                  <option value="all">All Fields</option>
                  <option value="studentName">Student Name</option>
                  <option value="studentId">Student ID</option>
                  <option value="department">Department</option>
                  <option value="program">Program</option>
                  <option value="reason">Reason</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters({...searchFilters, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="certificate_ready">Certificate Ready</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchFilters.type}
                  onChange={(e) => setSearchFilters({...searchFilters, type: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="termination">Termination Clearance</option>
                  <option value="idReplacement">ID Replacement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchFilters.dateFrom}
                  onChange={(e) => setSearchFilters({...searchFilters, dateFrom: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchFilters.dateTo}
                  onChange={(e) => setSearchFilters({...searchFilters, dateTo: e.target.value})}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Search
              </button>
              <button
                onClick={clearSearch}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {(showSearch ? allRequests : pendingRequests).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm sm:text-base">
              {showSearch ? 'No requests found matching your search criteria' : 'No pending requests for approval'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(showSearch ? allRequests : pendingRequests).map(request => (
              <div key={request.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-medium">
                      {request.studentName} - {request.type.replace(/([A-Z])/g, ' $1')}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                    </p>
                    {request.reason && (
                      <p className="text-xs sm:text-sm text-gray-600 capitalize">
                        Reason: {request.reason}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600">
                      Program: {request.programType} ({request.programMode})
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Status: <span className={`px-2 py-1 rounded text-xs ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'certificate_ready' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    {request.status === 'pending' ? 'Review' : 'View Details'}
                  </button>
                </div>
                
                {/* Mobile-first Progress Display */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Step</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {request.approvalSequence && request.approvalSequence.map((step, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${
                          index < request.currentStep ? 'bg-green-100 text-green-800' :
                          index === request.currentStep ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile-first Review Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium mb-4">
                  Review Request - {selectedRequest.studentName}
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Request Type</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {selectedRequest.type.replace(/([A-Z])/g, ' $1')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Program</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {selectedRequest.programType} ({selectedRequest.programMode})
                      </p>
                    </div>
                  </div>
                  
                  {selectedRequest.reason && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reason</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {selectedRequest.reason}
                      </p>
                    </div>
                  )}

                  {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Documents</label>
                      <div className="space-y-2">
                        {selectedRequest.documents.map((doc, index) => {
                          const isImage = /\.(jpg|jpeg|png|gif)$/i.test(doc);
                          return (
                            <div key={index} className="flex items-center space-x-2">
                              <a
                                href={`http://localhost:5000/uploads/${doc}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm flex items-center space-x-1"
                              >
                                <span>{isImage ? '🖼️' : '📄'}</span>
                                <span>{doc}</span>
                              </a>
                              {isImage && (
                                <img 
                                  src={`http://localhost:5000/uploads/${doc}`} 
                                  alt="Document preview" 
                                  className="w-16 h-16 object-cover rounded border"
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

                  {selectedRequest.approvals && selectedRequest.approvals.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Previous Approvals</label>
                      <div className="space-y-2">
                        {selectedRequest.approvals.map((approval, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <span className="font-medium text-sm">{approval.approver}</span>
                              <span className={`px-2 py-1 rounded text-xs mt-1 sm:mt-0 inline-block ${
                                approval.action === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {approval.action}
                              </span>
                            </div>
                            {approval.comment && (
                              <p className="text-sm text-gray-600 mt-1">{approval.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments <span className="text-red-500">*Required for rejection</span>
                  </label>
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
                      {error}
                    </div>
                  )}
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your comments here. Required when rejecting a request."
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  {selectedRequest.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproval(selectedRequest.id, 'approved')}
                        disabled={loading}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                      >
                        {loading ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleApproval(selectedRequest.id, 'rejected')}
                        disabled={loading}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                      >
                        {loading ? 'Processing...' : 'Reject'}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 text-sm font-medium"
                  >
                    {selectedRequest.status === 'pending' ? 'Cancel' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApproverDashboard