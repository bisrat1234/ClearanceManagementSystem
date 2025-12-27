import { Link } from 'react-router-dom'

const AboutDeveloper = () => {
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
          <div className="text-center mb-8">
            <div className="w-32 h-32 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">👨‍💻</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">About the Developer</h1>
            <p className="text-xl text-blue-600 font-semibold">Bisirat Yiradu</p>
          </div>

          {/* Personal Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800">Full Name</h3>
                  <p className="text-gray-600">Bisirat Yiradu</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Academic Level</h3>
                  <p className="text-gray-600">4th Year Student</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">University</h3>
                  <p className="text-gray-600">Debre Markos University</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Field of Study</h3>
                  <p className="text-gray-600">Software Engineering</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Contact</h3>
                  <p className="text-gray-600">+251990056412</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Specialization</h3>
                  <p className="text-gray-600">Full-Stack Web Development</p>
                </div>
              </div>
            </div>
          </section>

          {/* Academic Background */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Academic Background</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">Software Engineering Student</h3>
                <p className="text-gray-600">
                  Currently pursuing a Bachelor's degree in Software Engineering at Debre Markos University. 
                  As a 4th-year student, I have gained comprehensive knowledge in software development, 
                  system analysis, database design, and project management.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">Technical Expertise</h3>
                <p className="text-gray-600">
                  Specialized in modern web development technologies including React.js, Node.js, 
                  Express.js, and database management. Experienced in building responsive, 
                  user-friendly web applications with focus on performance and security.
                </p>
              </div>
            </div>
          </section>

          {/* Project Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About This Project</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Clearance Management System</h3>
              <p className="text-gray-600 mb-4">
                This Clearance Management System was developed as part of my academic journey to 
                demonstrate practical application of software engineering principles. The project 
                showcases my ability to design and implement a complete web-based solution that 
                addresses real-world problems in educational institutions.
              </p>
              
              <h4 className="font-semibold text-gray-800 mb-2">Development Approach</h4>
              <ul className="text-gray-600 space-y-1 mb-4">
                <li>• Applied software engineering best practices</li>
                <li>• Implemented secure authentication and authorization</li>
                <li>• Designed responsive and user-friendly interfaces</li>
                <li>• Created comprehensive role-based functionality</li>
                <li>• Ensured scalability and maintainability</li>
              </ul>
              
              <h4 className="font-semibold text-gray-800 mb-2">Key Achievements</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Successfully digitized traditional paper-based processes</li>
                <li>• Implemented complex workflow automation</li>
                <li>• Created intuitive user interfaces for all user types</li>
                <li>• Developed secure and efficient backend systems</li>
                <li>• Integrated modern web technologies effectively</li>
              </ul>
            </div>
          </section>

          {/* Skills & Technologies */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Technical Skills</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Frontend Development</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• React.js & Hooks</li>
                  <li>• HTML5 & CSS3</li>
                  <li>• Tailwind CSS</li>
                  <li>• JavaScript (ES6+)</li>
                  <li>• Responsive Design</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Backend Development</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Node.js & Express.js</li>
                  <li>• RESTful API Design</li>
                  <li>• JWT Authentication</li>
                  <li>• Database Design</li>
                  <li>• Security Implementation</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Tools & Methodologies</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Git Version Control</li>
                  <li>• Agile Development</li>
                  <li>• System Analysis</li>
                  <li>• UI/UX Design</li>
                  <li>• Testing & Debugging</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Vision & Goals */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vision & Goals</h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                As a passionate software engineering student, my goal is to develop innovative 
                solutions that make a positive impact on society. This clearance management system 
                represents my commitment to using technology to solve real-world problems and 
                improve efficiency in educational institutions.
              </p>
              
              <p className="text-gray-600">
                I believe in continuous learning, staying updated with the latest technologies, 
                and contributing to the software development community. My aim is to become a 
                skilled software engineer who can design and build systems that truly serve 
                users' needs while maintaining high standards of quality and security.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>
            <div className="bg-blue-600 text-white p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <p className="mb-1">📞 Phone: +251990056412</p>
                  <p className="mb-1">🎓 University: Debre Markos University</p>
                  <p>💻 Field: Software Engineering</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Project Inquiries</h3>
                  <p className="text-sm">
                    For questions about this system, collaboration opportunities, 
                    or technical discussions, feel free to reach out. I'm always 
                    interested in connecting with fellow developers and learning 
                    from the community.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AboutDeveloper