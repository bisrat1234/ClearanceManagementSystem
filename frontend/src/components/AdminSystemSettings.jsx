import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import apiService from '../services/api'

const AdminSystemSettings = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('workflows')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Settings states
  const [workflows, setWorkflows] = useState({})
  const [systemSettings, setSystemSettings] = useState({})
  const [auditLogs, setAuditLogs] = useState([])
  const [systemParams, setSystemParams] = useState({
    sessionTimeout: 24,
    maxFileSize: 10,
    certificateValidityMonths: 6,
    allowedFileTypes: 'pdf, doc, docx, jpg, png'
  })
  const [auditFilters, setAuditFilters] = useState({
    action: '',
    user: '',
    dateFrom: '',
    dateTo: '',
    limit: 50
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('Loading system settings data...');
      const [workflowsData, settingsData, logsData] = await Promise.all([
        apiService.getWorkflows().catch(err => {
          console.warn('Failed to load workflows:', err);
          return {};
        }),
        apiService.getSystemSettings().catch(err => {
          console.warn('Failed to load settings:', err);
          return {};
        }),
        apiService.getAuditLogs({ limit: 50 }).catch(err => {
          console.warn('Failed to load audit logs:', err);
          return [];
        })
      ])
      
      console.log('Loaded data:', { workflowsData, settingsData, logsData });
      
      setWorkflows(workflowsData || {})
      setSystemSettings(settingsData || {})
      setAuditLogs(logsData || [])
      
      // Initialize system params from loaded data
      if (settingsData?.system) {
        setSystemParams({
          sessionTimeout: settingsData.system.sessionTimeout || 24,
          maxFileSize: settingsData.system.maxFileSize || 10,
          certificateValidityMonths: settingsData.system.certificateValidityMonths || 6,
          allowedFileTypes: (settingsData.system.allowedFileTypes || ['pdf', 'doc', 'docx', 'jpg', 'png']).join(', ')
        })
      }
    } catch (error) {
      console.error('Failed to load system data:', error)
      setError('Failed to load system data: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (section, settings) => {
    setLoading(true)
    setError('')
    setMessage('')
    try {
      console.log('Updating settings:', { section, settings });
      await apiService.updateSystemSettings(section, settings)
      setMessage('Settings updated successfully')
      setTimeout(() => setMessage(''), 3000)
      loadData()
    } catch (error) {
      console.error('Failed to update settings:', error)
      setError('Failed to update settings: ' + error.message)
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const updateWorkflow = async (type, program, sequence) => {
    setLoading(true)
    try {
      await apiService.updateWorkflow(type, program, sequence)
      setMessage('Workflow updated successfully')
      loadData()
    } catch (error) {
      setError('Failed to update workflow')
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async () => {
    setLoading(true)
    try {
      const result = await apiService.createBackup()
      setMessage('Backup created successfully')
    } catch (error) {
      setError('Failed to create backup')
    } finally {
      setLoading(false)
    }
  }

  const restoreSystem = async () => {
    if (confirm('Are you sure you want to restore the system? This will overwrite current data.')) {
      setLoading(true)
      try {
        await apiService.restoreSystem()
        setMessage('System restored successfully')
        loadData()
      } catch (error) {
        setError('Failed to restore system')
      } finally {
        setLoading(false)
      }
    }
  }

  const searchAuditLogs = async () => {
    try {
      const logs = await apiService.getAuditLogs(auditFilters)
      setAuditLogs(logs)
    } catch (error) {
      setError('Failed to search audit logs')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin" className="text-blue-600 hover:text-blue-800 mr-4">← Back to Admin</Link>
              <h1 className="text-xl font-semibold text-gray-900">System Settings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <button onClick={logout} className="text-gray-500 hover:text-gray-700">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading system settings...</p>
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={loadData} 
              className="ml-4 text-sm underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && (
          <>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'workflows', name: 'Approval Workflows' },
              { id: 'notifications', name: 'Notifications' },
              { id: 'system', name: 'System Parameters' },
              { id: 'backup', name: 'Backup & Restore' },
              { id: 'audit', name: 'Audit Logs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Workflows Tab */}
        {activeTab === 'workflows' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Configure Approval Workflows</h2>
            {Object.keys(workflows).length > 0 ? (
              Object.entries(workflows).map(([type, programs]) => (
                <div key={type} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-md font-medium mb-4 capitalize">{type.replace(/([A-Z])/g, ' $1')}</h3>
                  {Object.entries(programs).map(([program, sequence]) => (
                    <div key={program} className="mb-4 p-4 border rounded">
                      <h4 className="font-medium mb-2 capitalize">{program.replace('-', ' ')}</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {sequence.map((step, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {index + 1}. {step}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          const newSequence = prompt('Enter new sequence (comma-separated):', sequence.join(', '))
                          if (newSequence) {
                            updateWorkflow(type, program, newSequence.split(',').map(s => s.trim()))
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit Workflow
                      </button>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading workflows...</p>
                  <p className="text-sm text-gray-400 mt-2">If this persists, workflows may need to be configured.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
            {systemSettings.notifications ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={systemSettings.notifications.emailEnabled || false}
                    onChange={(e) => updateSettings('notifications', { 
                      ...systemSettings.notifications, 
                      emailEnabled: e.target.checked 
                    })}
                    className="mr-3"
                  />
                  <label>Enable Email Notifications</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={systemSettings.notifications.smsEnabled || false}
                    onChange={(e) => updateSettings('notifications', { 
                      ...systemSettings.notifications, 
                      smsEnabled: e.target.checked 
                    })}
                    className="mr-3"
                  />
                  <label>Enable SMS Notifications</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={systemSettings.notifications.pushEnabled || false}
                    onChange={(e) => updateSettings('notifications', { 
                      ...systemSettings.notifications, 
                      pushEnabled: e.target.checked 
                    })}
                    className="mr-3"
                  />
                  <label>Enable Push Notifications</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reminder Days Before Deadline</label>
                  <input
                    type="number"
                    value={systemSettings.notifications.reminderDays || 3}
                    onChange={(e) => updateSettings('notifications', { 
                      ...systemSettings.notifications, 
                      reminderDays: parseInt(e.target.value) 
                    })}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading notification settings...</p>
              </div>
            )}
          </div>
        )}

        {/* System Parameters Tab */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">System Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Session Timeout (hours)</label>
                <input
                  type="number"
                  value={systemParams.sessionTimeout}
                  onChange={(e) => setSystemParams({...systemParams, sessionTimeout: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
                <input
                  type="number"
                  value={systemParams.maxFileSize}
                  onChange={(e) => setSystemParams({...systemParams, maxFileSize: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Certificate Validity (months)</label>
                <input
                  type="number"
                  value={systemParams.certificateValidityMonths}
                  onChange={(e) => setSystemParams({...systemParams, certificateValidityMonths: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Allowed File Types</label>
                <input
                  type="text"
                  value={systemParams.allowedFileTypes}
                  onChange={(e) => setSystemParams({...systemParams, allowedFileTypes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="pdf, doc, docx, jpg, png"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => updateSettings('system', {
                  sessionTimeout: systemParams.sessionTimeout,
                  maxFileSize: systemParams.maxFileSize,
                  certificateValidityMonths: systemParams.certificateValidityMonths,
                  allowedFileTypes: systemParams.allowedFileTypes.split(',').map(s => s.trim())
                })}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Settings'}
              </button>
            </div>
          </div>
        )}

        {/* Backup & Restore Tab */}
        {activeTab === 'backup' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Backup & Restore</h2>
            {systemSettings.backup ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Backup Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={systemSettings.backup.autoBackup || false}
                        onChange={(e) => updateSettings('backup', { 
                          ...systemSettings.backup, 
                          autoBackup: e.target.checked 
                        })}
                        className="mr-3"
                      />
                      <label>Enable Automatic Backup</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                      <select
                        value={systemSettings.backup.backupFrequency || 'daily'}
                        onChange={(e) => updateSettings('backup', { 
                          ...systemSettings.backup, 
                          backupFrequency: e.target.value 
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Retention Days</label>
                      <input
                        type="number"
                        value={systemSettings.backup.retentionDays || 30}
                        onChange={(e) => updateSettings('backup', { 
                          ...systemSettings.backup, 
                          retentionDays: parseInt(e.target.value) 
                        })}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Manual Operations</h3>
                  <div className="space-x-4">
                    <button
                      onClick={createBackup}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Backup'}
                    </button>
                    <button
                      onClick={restoreSystem}
                      disabled={loading}
                      className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                      {loading ? 'Restoring...' : 'Restore System'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading backup settings...</p>
              </div>
            )}
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Audit Log Settings</h2>
              {systemSettings.audit && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Log Level</label>
                    <select
                      value={systemSettings.audit.logLevel}
                      onChange={(e) => updateSettings('audit', { logLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="error">Error</option>
                      <option value="warn">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Retention Days</label>
                    <input
                      type="number"
                      value={systemSettings.audit.retentionDays}
                      onChange={(e) => updateSettings('audit', { retentionDays: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Audit Log Viewer</h3>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Filter by action"
                  value={auditFilters.action}
                  onChange={(e) => setAuditFilters({...auditFilters, action: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Filter by user"
                  value={auditFilters.user}
                  onChange={(e) => setAuditFilters({...auditFilters, user: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="date"
                  value={auditFilters.dateFrom}
                  onChange={(e) => setAuditFilters({...auditFilters, dateFrom: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <button
                  onClick={searchAuditLogs}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  Search
                </button>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map(log => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminSystemSettings