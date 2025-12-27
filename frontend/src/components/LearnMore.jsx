import { Link } from 'react-router-dom'

const LearnMore = () => {
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Learn More About Our System</h1>
          
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-lg text-gray-600 mb-6">
              Discover how our Clearance Management System revolutionizes the traditional clearance process, 
              making it faster, more transparent, and completely digital. Learn about features, benefits, 
              and how to get the most out of the system.
            </p>
          </section>

          {/* Getting Started */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🚀 Getting Started</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">For Students</h3>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Register your account or login with existing credentials</li>
                  <li>2. Complete your profile information</li>
                  <li>3. Submit your clearance request with required documents</li>
                  <li>4. Track your request progress in real-time</li>
                  <li>5. Download your digital certificate when approved</li>
                </ol>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">For Staff & Approvers</h3>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>1. Login with your assigned approver credentials</li>
                  <li>2. Review pending requests in your dashboard</li>
                  <li>3. Examine submitted documents and information</li>
                  <li>4. Approve or reject with detailed comments</li>
                  <li>5. Monitor approval workflow progress</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">✨ Key Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="text-2xl mb-3">📱</div>
                <h3 className="font-semibold text-gray-800 mb-2">Mobile Responsive</h3>
                <p className="text-sm text-gray-600">
                  Access the system from any device - desktop, tablet, or smartphone with full functionality.
                </p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="text-2xl mb-3">🔔</div>
                <h3 className="font-semibold text-gray-800 mb-2">Real-time Notifications</h3>
                <p className="text-sm text-gray-600">
                  Get instant updates on your request status, approvals, and any required actions.
                </p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="text-2xl mb-3">📄</div>
                <h3 className="font-semibold text-gray-800 mb-2">Digital Documents</h3>
                <p className="text-sm text-gray-600">
                  Upload, manage, and download all documents digitally with secure storage.
                </p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="text-2xl mb-3">🔒</div>
                <h3 className="font-semibold text-gray-800 mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600">
                  Advanced security measures protect your personal information and documents.
                </p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="text-2xl mb-3">⚡</div>
                <h3 className="font-semibold text-gray-800 mb-2">Fast Processing</h3>
                <p className="text-sm text-gray-600">
                  Automated workflows reduce processing time from weeks to just a few days.
                </p>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <div className="text-2xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-800 mb-2">Progress Tracking</h3>
                <p className="text-sm text-gray-600">
                  Visual progress indicators show exactly where your request stands in the workflow.
                </p>
              </div>
            </div>
          </section>

          {/* Clearance Types */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 Clearance Types</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">🎓 Termination Clearance</h3>
                <p className="text-gray-600 mb-3">
                  Required for graduation, withdrawal, transfer, or academic dismissal. Ensures all 
                  academic and financial obligations are cleared.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Approval Sequence:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Academic Advisor</li>
                      <li>• Department Head</li>
                      <li>• Library Services</li>
                      <li>• Dean's Office</li>
                      <li>• Student Services</li>
                      <li>• Registrar (Final)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Required Documents:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Academic transcripts</li>
                      <li>• Library clearance form</li>
                      <li>• Financial clearance</li>
                      <li>• Dormitory clearance (if applicable)</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">🆔 ID Card Replacement</h3>
                <p className="text-gray-600 mb-3">
                  For lost, damaged, or stolen student ID cards. Quick replacement process with 
                  verification steps.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Approval Sequence:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Academic Advisor</li>
                      <li>• Library Services</li>
                      <li>• Campus Security</li>
                      <li>• Finance Office</li>
                      <li>• Registrar (Final)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Required Documents:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Police report (if stolen)</li>
                      <li>• Passport photo</li>
                      <li>• Replacement fee receipt</li>
                      <li>• Affidavit (if lost)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">🎯 Why Choose Our System?</h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">For Students</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>✓ No more long queues or office visits</li>
                    <li>✓ 24/7 access to submit and track requests</li>
                    <li>✓ Instant notifications on status changes</li>
                    <li>✓ Digital certificates with verification</li>
                    <li>✓ Complete transparency in the process</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">For Institutions</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>✓ Reduced administrative workload</li>
                    <li>✓ Improved process efficiency</li>
                    <li>✓ Better record keeping and audit trails</li>
                    <li>✓ Cost savings on paper and storage</li>
                    <li>✓ Enhanced student satisfaction</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Support & Resources */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">📚 Support & Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/contact" className="block bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                <h3 className="font-semibold text-blue-800 mb-2">📞 Contact Support</h3>
                <p className="text-sm text-gray-600">Get help with any questions or technical issues</p>
              </Link>
              
              <Link to="/about-system" className="block bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors">
                <h3 className="font-semibold text-green-800 mb-2">ℹ️ System Information</h3>
                <p className="text-sm text-gray-600">Learn about system features and capabilities</p>
              </Link>
              
              <Link to="/about-developer" className="block bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-colors">
                <h3 className="font-semibold text-purple-800 mb-2">👨💻 About Developer</h3>
                <p className="text-sm text-gray-600">Meet the team behind the system</p>
              </Link>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Join thousands of students and staff who have already streamlined their clearance process.
            </p>
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 inline-block"
              >
                Login Now
              </Link>
              <Link
                to="/register"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 inline-block"
              >
                Create Account
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LearnMore