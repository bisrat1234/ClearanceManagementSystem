import { Link } from 'react-router-dom'

const AboutSystem = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold">Clearance Management System</Link>
            </div>
            <div className="flex items-center">
              <Link to="/" className="hover:text-blue-200 px-3 py-2">← Back to Home</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About the System</h1>
          
          {/* System Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Overview</h2>
            <p className="text-gray-600 mb-4">
              The Clearance Management System is a comprehensive digital platform designed to streamline 
              and automate the student clearance process in educational institutions. This system eliminates 
              the traditional paper-based clearance procedures and provides a modern, efficient, and 
              transparent solution for managing student clearances.
            </p>
          </section>

          {/* Key Features */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🔐 Role-Based Access Control</h3>
                <p className="text-sm text-gray-600">
                  Secure authentication system with different access levels for Students, Teachers, 
                  Approvers, and Administrators.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">📋 Digital Request Management</h3>
                <p className="text-sm text-gray-600">
                  Submit and track clearance requests digitally with real-time status updates 
                  and automated workflow routing.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">✅ Automated Approval Workflow</h3>
                <p className="text-sm text-gray-600">
                  Predefined approval sequences based on request type and program, ensuring 
                  proper routing through all required departments.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">📄 Digital Certificate Generation</h3>
                <p className="text-sm text-gray-600">
                  Automatic generation of digital clearance certificates upon final approval 
                  with verification codes and validity periods.
                </p>
              </div>
            </div>
          </section>

          {/* User Roles */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Roles & Capabilities</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">👨‍🎓 Students</h3>
                <p className="text-sm text-gray-600">
                  Submit clearance requests, track progress, upload documents, receive notifications, 
                  and download digital certificates.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">👨‍🏫 Teachers/Faculty</h3>
                <p className="text-sm text-gray-600">
                  Dual role capability - submit personal clearance requests and act as approvers 
                  for student requests when assigned.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">✅ Approvers</h3>
                <p className="text-sm text-gray-600">
                  Review and approve/reject clearance requests, add comments, request additional 
                  documents, and manage approval workflows.
                </p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800">⚙️ Administrators</h3>
                <p className="text-sm text-gray-600">
                  Complete system control including user management, system monitoring, 
                  request reassignment, and system configuration.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Frontend Technologies</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• React 19 with Hooks and Context API</li>
                  <li>• Tailwind CSS for responsive styling</li>
                  <li>• React Router for navigation</li>
                  <li>• Vite for build tooling</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Backend Technologies</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Node.js with Express.js</li>
                  <li>• JWT for authentication</li>
                  <li>• bcryptjs for password hashing</li>
                  <li>• CORS for cross-origin requests</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Benefits</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ul className="space-y-2 text-gray-600">
                <li>✓ <strong>Efficiency:</strong> Reduces clearance processing time from weeks to days</li>
                <li>✓ <strong>Transparency:</strong> Real-time tracking and status updates for all users</li>
                <li>✓ <strong>Security:</strong> Secure authentication and role-based access control</li>
                <li>✓ <strong>Accessibility:</strong> 24/7 access from any device with internet connection</li>
                <li>✓ <strong>Audit Trail:</strong> Complete logging of all actions and approvals</li>
                <li>✓ <strong>Cost Effective:</strong> Eliminates paper usage and manual processing costs</li>
                <li>✓ <strong>Scalability:</strong> Can handle multiple institutions and thousands of users</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">System Support</h2>
            <p className="text-gray-600">
              For technical support, feature requests, or system inquiries, please contact the 
              development team or system administrator. The system is designed to be user-friendly 
              and includes comprehensive help documentation for all user roles.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AboutSystem