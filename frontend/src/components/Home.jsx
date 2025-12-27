import { useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Clearance Management System</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-blue-200">Home</Link>
              
              <div className="relative">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="hover:text-blue-200 flex items-center"
                >
                  Services
                  <span className="ml-1">▼</span>
                </button>
                {isServicesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 hover:bg-gray-100">Termination Clearance</div>
                      <div className="px-4 py-2 hover:bg-gray-100">ID Replacement</div>
                      <div className="px-4 py-2 hover:bg-gray-100">Document Verification</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="hover:text-blue-200 flex items-center"
                >
                  About
                  <span className="ml-1">▼</span>
                </button>
                {isAboutOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Link to="/about-system" className="block px-4 py-2 hover:bg-gray-100">About System</Link>
                      <Link to="/about-developer" className="block px-4 py-2 hover:bg-gray-100">About Developer</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <Link to="/contact" className="hover:text-blue-200">Contact</Link>
              <Link to="/login" className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800">Login</Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 hover:bg-blue-800">Home</Link>
              <div className="px-3 py-2">
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="w-full text-left hover:bg-blue-800 p-2 rounded"
                >
                  Services 
                </button>
                {isServicesOpen && (
                  <div className="ml-4 mt-2 space-y-1">
                    <div className="px-3 py-1 text-sm hover:bg-blue-800">Termination Clearance</div>
                    <div className="px-3 py-1 text-sm hover:bg-blue-800">ID Replacement</div>
                    <div className="px-3 py-1 text-sm hover:bg-blue-800">Document Verification</div>
                  </div>
                )}
              </div>
              <div className="px-3 py-2">
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="w-full text-left hover:bg-blue-800 p-2 rounded"
                >
                  About 
                </button>
                {isAboutOpen && (
                  <div className="ml-4 mt-2 space-y-1">
                    <Link to="/about-system" className="block px-3 py-1 text-sm hover:bg-blue-800">About System</Link>
                    <Link to="/about-developer" className="block px-3 py-1 text-sm hover:bg-blue-800">About Developer</Link>
                  </div>
                )}
              </div>
              <Link to="/contact" className="block px-3 py-2 hover:bg-blue-800">Contact</Link>
              <Link to="/login" className="block px-3 py-2 bg-blue-800 hover:bg-blue-900">Login</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Digital Clearance Management system
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your academic clearance process with our digital platform. 
            Submit requests, track progress, and download certificates seamlessly.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 inline-block"
            >
              Get Started
            </Link>
            <Link
              to="/learn-more"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50 inline-block"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Everything you need for academic clearance</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Termination Clearance</h3>
              <p className="text-gray-600">Complete clearance for graduation, transfer, or withdrawal</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🆔</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">ID Replacement</h3>
              <p className="text-gray-600">Quick replacement for lost or damaged student IDs</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Digital Certificates</h3>
              <p className="text-gray-600">Download verified digital clearance certificates</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to complete your clearance</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold">1</div>
              <h3 className="font-semibold mb-2">Submit Request</h3>
              <p className="text-gray-600 text-sm">Create and submit your clearance request online</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold">2</div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600 text-sm">Monitor your request through each approval stage</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold">3</div>
              <h3 className="font-semibold mb-2">Get Approved</h3>
              <p className="text-gray-600 text-sm">Receive approvals from relevant departments</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold">4</div>
              <h3 className="font-semibold mb-2">Download Certificate</h3>
              <p className="text-gray-600 text-sm">Get your digital clearance certificate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Clearance Management</h3>
              <p className="text-gray-400 text-sm">
                Streamlining academic processes with digital solutions for students and institutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Termination Clearance</li>
                <li>ID Replacement</li>
                <li>Document Verification</li>
                <li>Certificate Generation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Contact Support</li>
                <li>User Guide</li>
                <li>FAQ</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="text-sm text-gray-400 space-y-2">
                <p>Email: support@clearance.edu</p>
                <p>Phone: +251990056412</p>
                <p>Office Hours: 8AM - 5PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Clearance Management System. Developed by Bisirat | +251990056412</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home