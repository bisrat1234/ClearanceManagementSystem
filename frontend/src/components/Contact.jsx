import { Link } from 'react-router-dom'

const Contact = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
          
          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              We're here to help you with any questions or issues regarding the Clearance Management System. 
              Reach out to us through any of the following channels:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">📞 Phone Support</h3>
                <p className="text-gray-600 mb-2">Primary Contact:</p>
                <p className="text-lg font-semibold text-gray-800">+251990056412</p>
                <p className="text-sm text-gray-500 mt-2">Available: 2:00 AM - 12:00 PM (Mon-Fri)</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">📧 Email Support</h3>
                <p className="text-gray-600 mb-2">General Inquiries:</p>
                <p className="text-lg font-semibold text-gray-800">damitachewyiradu@gmail.com</p>
                <p className="text-sm text-gray-500 mt-2">Response time: Within 24 hours</p>
              </div>
            </div>
          </section>

          {/* Support Categories */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Support Categories</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🎓 Student Support</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Account registration issues</li>
                  <li>• Request submission help</li>
                  <li>• Status tracking questions</li>
                  <li>• Certificate download problems</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">✅ Approver Support</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Approval process guidance</li>
                  <li>• System navigation help</li>
                  <li>• Request management issues</li>
                  <li>• Role-specific questions</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">⚙️ Technical Support</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Login and access issues</li>
                  <li>• Browser compatibility</li>
                  <li>• System errors and bugs</li>
                  <li>• Performance problems</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Office Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Office Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">🏢 Main Office</h3>
                  <p className="text-gray-600">
                    Debre Markos University<br/>
                    Software Engineering Department<br/>
                    Debre Markos, Ethiopia
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">🕒 Office Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 2:00 AM - 6:00 AM & 8:00 AM - 11:30 AM<br/>
                    Saturday: 9:00 AM - 1:00 PM<br/>
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">How do I reset my password?</h3>
                <p className="text-gray-600 text-sm">
                  Use the "Forgot Password" link on the login page to reset your password via email verification.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">How long does the clearance process take?</h3>
                <p className="text-gray-600 text-sm">
                  Processing time varies by request type and program, typically 3-7 business days for complete approval.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-800">Can I track my request status?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, you can track your request status in real-time through your student dashboard.
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-gray-800">What if my request is rejected?</h3>
                <p className="text-gray-600 text-sm">
                  You'll receive detailed feedback on why it was rejected and can resubmit after addressing the issues.
                </p>
              </div>
            </div>
          </section>

          {/* Emergency Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Emergency Contact</h2>
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">🚨 Urgent Issues</h3>
              <p className="text-gray-600 mb-3">
                For urgent system issues that prevent you from completing critical clearance processes:
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div>
                  <span className="font-semibold text-gray-800">Emergency Hotline:</span>
                  <span className="text-lg font-bold text-red-600 ml-2">+251990056412</span>
                </div>
                <div className="text-sm text-gray-500">
                  Available 24/7 for critical issues
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Contact