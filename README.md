# Clearance Management System

A comprehensive web application for managing student clearance requests with role-based access control, built with modern technologies and MongoDB integration.

## Features

### Core Functionality
- **Role-based Authentication**: Student, Teacher, Approver, Admin roles with JWT tokens
- **Clearance Request Management**: Submit, track, and approve clearance requests
- **Automated Workflow Routing**: Configurable approval sequences based on request type and program
- **Digital Certificate Generation**: Text-based certificates upon final approval
- **Real-time Status Tracking**: Live updates on request progress with notifications
- **File Upload Support**: Document attachment with validation (PDF, DOC, images)
- **Responsive Design**: Mobile-first design for all devices

### User Roles & Capabilities

#### Students & Teachers
- Submit termination clearance requests (Graduation, Transfer, etc.)
- Submit ID replacement requests (Lost/Damaged)
- Track request status with detailed progress indicators
- Download digital clearance certificates
- Upload supporting documents (max 10MB)
- Update profile information

#### Approvers
- Review assigned clearance requests based on approval sequence
- Approve/reject requests with mandatory comments
- View complete request history and documentation
- Access uploaded documents for verification

#### Administrators
- **System Overview**: Monitor performance statistics and metrics
- **User Management**: Create, block/unblock, and delete user accounts
- **Registration Approval**: Review and approve/reject new user registrations
- **Request Management**: View all requests, reassign to different approvers
- **System Settings**: Configure workflows, notifications, and system parameters
- **Audit Logs**: Track all system activities with filtering capabilities
- **Backup & Restore**: System backup and restoration functionality

### Approval Workflows

#### Termination Clearance
- **All Programs**: Academic Advisor → Department Head → Library Services → Dean's Office → Student Services → Registrar

#### ID Replacement
- **All Programs**: Academic Advisor → Library Services → Campus Security → Finance Office → Registrar

*Workflows are configurable through admin settings*

## Technology Stack

### Frontend
- **React 19** with Hooks and Context API for state management
- **Tailwind CSS** for responsive, mobile-first styling
- **React Router v6** for client-side navigation
- **Lucide React** for consistent iconography
- **Vite** for fast development and optimized builds

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM for data persistence
- **JWT** for secure authentication and authorization
- **bcryptjs** for password hashing and security
- **Multer** for file upload handling
- **CORS** for cross-origin resource sharing
- **dotenv** for environment configuration

### Database Schema
- **Users**: Authentication, roles, and profile information
- **Requests**: Clearance requests with approval tracking
- **Registrations**: Pending user registration approvals
- **Settings**: System configuration and parameters
- **AuditLogs**: System activity tracking

## Project Structure

```
ClearanceManagementSystem/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Login.jsx       # Authentication
│   │   │   ├── Register.jsx    # User registration
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── ApproverDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminSystemSettings.jsx
│   │   │   ├── Settings.jsx    # User settings
│   │   │   └── Home.jsx        # Landing page
│   │   ├── services/           # API service layer
│   │   │   └── api.js          # Centralized API calls
│   │   ├── App.jsx             # Main app with routing
│   │   └── main.jsx            # Application entry point
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── vite.config.js          # Vite build configuration
│   └── package.json
├── backend/                     # Node.js backend API
│   ├── server.js               # Express server with MongoDB
│   ├── uploads/                # File upload directory
│   ├── .env                    # Environment variables
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Environment Configuration

Create `.env` file in backend directory:
```env
PORT=5000
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clearance_system
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv multer
```

3. Start development server:
```bash
node server.js
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install react react-dom react-router-dom lucide-react
npm install -D @vitejs/plugin-react tailwindcss postcss autoprefixer vite
```

3. Start development server:
```bash
npm run dev
```

Application runs on `http://localhost:5173`

## Demo Credentials

### Student Account
- **Username**: student1
- **Password**: password
- **Role**: Student

### Approver Accounts
- **Academic Advisor**
  - Username: advisor1
  - Password: password
  
- **Department Head**
  - Username: depthead1
  - Password: password
  
- **Library Services**
  - Username: library1
  - Password: password
  
- **Dean's Office**
  - Username: dean1
  - Password: password
  
- **Student Services**
  - Username: student_services1
  - Password: password
  
- **Registrar**
  - Username: registrar1
  - Password: password

### Admin Account
- **Username**: admin1
- **Password**: password
- **Role**: Administrator

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - New user registration

### Requests Management
- `GET /api/requests` - Get user requests (role-filtered)
- `POST /api/requests` - Submit new request (with file upload)
- `PUT /api/requests/:id/approve` - Approve/reject request
- `GET /api/requests/:id/certificate` - Generate certificate

### Admin Operations
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management with search/filter
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id/status` - Block/unblock user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/registrations` - Pending registrations
- `PUT /api/admin/registrations/:id/approve` - Approve/reject registration
- `PUT /api/admin/requests/:id/reassign` - Reassign request

### System Settings
- `GET /api/admin/settings` - Get system configuration
- `PUT /api/admin/settings` - Update system settings
- `GET /api/admin/workflows` - Get approval workflows
- `PUT /api/admin/workflows` - Update workflows
- `GET /api/admin/audit-logs` - Get audit logs with filtering
- `POST /api/admin/backup` - Create system backup
- `POST /api/admin/restore` - Restore system

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password

## System Features

### Security
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: bcrypt hashing with salt rounds
- **Role-based Access**: Granular permission control
- **Input Validation**: Server-side validation and sanitization
- **File Upload Security**: Type and size validation

### Data Management
- **MongoDB Integration**: Scalable NoSQL database
- **Mongoose ODM**: Schema validation and data modeling
- **File Storage**: Local file system with organized structure
- **Audit Trail**: Complete activity logging

### User Experience
- **Mobile-first Design**: Responsive across all devices
- **Real-time Updates**: Live status tracking
- **Intuitive Navigation**: Clear user flows
- **Error Handling**: Comprehensive error messages
- **Loading States**: User feedback during operations

## Business Rules

1. **Registration Process**: New users require admin approval
2. **Request Eligibility**: Users must be active to submit requests
3. **Approval Sequence**: Strict workflow adherence based on request type
4. **File Requirements**: Maximum 5 files, 10MB each
5. **Certificate Validity**: 6 months from approval date
6. **Audit Compliance**: All actions logged with timestamps

## Development Guidelines

### Adding New Features
1. Update MongoDB schemas in `server.js`
2. Add API endpoints with proper authentication
3. Create/update React components
4. Update API service methods
5. Test across all user roles

### Customizing Workflows
1. Modify `approvalSequences` in backend
2. Update admin settings interface
3. Test workflow transitions

### Extending User Roles
1. Add role to user schema
2. Update authentication middleware
3. Create role-specific components
4. Update routing and permissions

## Deployment

### Production Environment
1. **Database**: MongoDB Atlas for cloud hosting
2. **Backend**: Deploy to Heroku, AWS, or DigitalOcean
3. **Frontend**: Deploy to Netlify, Vercel, or AWS S3
4. **Environment**: Set production environment variables
5. **Security**: Enable HTTPS and secure headers

### Performance Optimization
- Database indexing for frequently queried fields
- Image optimization and compression
- API response caching
- Bundle size optimization

## Monitoring & Maintenance

### System Monitoring
- **Audit Logs**: Track all system activities
- **Error Logging**: Comprehensive error tracking
- **Performance Metrics**: Response time monitoring
- **User Analytics**: Usage pattern analysis

### Backup Strategy
- **Automated Backups**: Scheduled database backups
- **File Backups**: Document storage backup
- **Recovery Testing**: Regular restore procedures

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support:
- **Issues**: Create GitHub issue with detailed description
- **Documentation**: Check inline code comments
- **Community**: Join project discussions

---

**Production Ready**: This system includes MongoDB integration, comprehensive admin features, file upload capabilities, and full audit trail functionality suitable for institutional deployment.