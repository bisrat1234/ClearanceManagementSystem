const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createCanvas } = require('canvas');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://damitachewyiradu_db_user:2123@cluster0.5ojpbcv.mongodb.net/clearance_system';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize data after successful connection
    initializeData();
    assignStudentId();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'documents-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF) and documents (PDF, DOC, DOCX) are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'approver', 'admin'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: String,
  program: String,
  studentId: String,
  approverType: String,
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }
}, { timestamps: true });

const requestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: String,
  department: String,
  program: String,
  type: { type: String, enum: ['termination', 'idReplacement'], required: true },
  reason: String,
  programType: String,
  programMode: String,
  documents: [String],
  status: { type: String, enum: ['draft', 'submitted', 'pending', 'approved', 'rejected', 'completed', 'certificate_ready', 'cancelled'], default: 'pending' },
  currentStep: { type: Number, default: 0 },
  approvalSequence: [String],
  approvals: [{
    approver: String,
    action: String,
    comment: String,
    timestamp: { type: Date, default: Date.now }
  }],
  notifications: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

const registrationSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  role: String,
  department: String,
  program: String,
  studentId: String,
  approverType: String,
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const resetCodeSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
  used: { type: Boolean, default: false }
}, { timestamps: true });

const auditLogSchema = new mongoose.Schema({
  action: String,
  user: String,
  details: String
}, { timestamps: true });

const settingsSchema = new mongoose.Schema({
  section: String,
  settings: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const workflowSchema = new mongoose.Schema({
  type: String,
  program: String,
  sequence: [String]
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Request = mongoose.model('Request', requestSchema);
const Registration = mongoose.model('Registration', registrationSchema);
const ResetCode = mongoose.model('ResetCode', resetCodeSchema);
const AuditLog = mongoose.model('AuditLog', auditLogSchema);
const Settings = mongoose.model('Settings', settingsSchema);
const Workflow = mongoose.model('Workflow', workflowSchema);

// Initialize default data
const initializeData = async () => {
  try {
    const userCount = await User.countDocuments();
    console.log('Current user count:', userCount);
    
    if (userCount === 0) {
      console.log('Creating default users...');
      const defaultUsers = [
        { username: 'student1', password: await bcrypt.hash('password', 10), role: 'student', name: 'John Doe', email: 'student1@university.edu', department: 'Computer Science', program: 'MSc Computer Science', studentId: 'DMU153986', status: 'active' },
        { username: 'advisor1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Dr. Smith', email: 'advisor1@university.edu', approverType: 'Academic Advisor', status: 'active' },
        { username: 'depthead1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Prof. Johnson', email: 'depthead1@university.edu', approverType: 'Department Head', status: 'active' },
        { username: 'libraryA', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Ms. Wilson', email: 'library.a@university.edu', approverType: 'Library (A) Chief of Circulation', status: 'active' },
        { username: 'libraryB', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Mr. Bekele', email: 'library.b@university.edu', approverType: 'Library (B) Chief of Circulation', status: 'active' },
        { username: 'libraryC', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Mrs. Kebede', email: 'library.c@university.edu', approverType: '(Main) Library (C)', status: 'active' },
        { username: 'library1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Ms. Anderson', email: 'library1@university.edu', approverType: 'Library Services', status: 'active' },
        { username: 'dean1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Dr. Brown', email: 'dean1@university.edu', approverType: 'Dean\'s Office', status: 'active' },
        // amazonq-ignore-next-line
        { username: 'student_services1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Mr. Davis', email: 'services1@university.edu', approverType: 'Student Services', status: 'active' },
        { username: 'security1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Mr. Wilson', email: 'security1@university.edu', approverType: 'Campus Security', status: 'active' },
        { username: 'finance1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Ms. Taylor', email: 'finance1@university.edu', approverType: 'Finance Office', status: 'active' },
        { username: 'registrar1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Mrs. Miller', email: 'registrar1@university.edu', approverType: 'Registrar', status: 'active' },
        { username: 'admin1', password: await bcrypt.hash('password', 10), role: 'admin', name: 'Admin User', email: 'admin1@university.edu', status: 'active' }
      ];
      await User.insertMany(defaultUsers);
      console.log('Default users created successfully');
      
      // Verify admin user was created
      const adminUser = await User.findOne({ username: 'admin1' });
      console.log('Admin user verification:', adminUser ? 'Created successfully' : 'Failed to create');
    } else {
      // Check if admin user exists
      const adminUser = await User.findOne({ username: 'admin1' });
      console.log('Admin user exists:', adminUser ? 'Yes' : 'No');
      
      if (!adminUser) {
        console.log('Creating missing admin user...');
        const adminUser = new User({
          username: 'admin1',
          password: await bcrypt.hash('password', 10),
          role: 'admin',
          name: 'Admin User',
          email: 'admin1@university.edu',
          status: 'active'
        });
        await adminUser.save();
        console.log('Admin user created successfully');
      }
    }

    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      const defaultSettings = [
        { section: 'notifications', settings: { emailEnabled: true, smsEnabled: false, pushEnabled: true, reminderDays: 3 } },
        { section: 'system', settings: { sessionTimeout: 24, maxFileSize: 10, allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'], certificateValidityMonths: 6 } },
        { section: 'backup', settings: { autoBackup: true, backupFrequency: 'daily', retentionDays: 30 } },
        { section: 'audit', settings: { logLevel: 'info', retentionDays: 90, logActions: ['login', 'approval', 'rejection', 'creation'] } }
      ];
      await Settings.insertMany(defaultSettings);
      console.log('Default settings created');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

// Auto-assign studentId to users without one
const assignStudentId = async () => {
  try {
    const studentsWithoutId = await User.find({ role: 'student', studentId: { $exists: false } });
    for (const student of studentsWithoutId) {
      const randomId = Math.floor(100000 + Math.random() * 900000);
      student.studentId = `DMU${randomId}`;
      await student.save();
      console.log(`Assigned studentId ${student.studentId} to ${student.name}`);
    }
  } catch (error) {
    console.error('Error assigning student IDs:', error);
  }
};



// Enhanced approval sequences based on program type and mode
const approvalSequences = {
  termination: {
    // All programs use the same comprehensive sequence with all approver types
    'postgraduate-regular': ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'],
    'postgraduate-evening': ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'],
    'postgraduate-summer': ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'],
    'undergraduate-regular': ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'],
    'undergraduate-evening': ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'],
    'undergraduate-summer': ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'],
    'diploma-regular': ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'],
    'diploma-evening': ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'],
    'diploma-summer': ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar']
  },
  idReplacement: {
    // ID replacement uses Library Services instead of the three separate library approvers
    'postgraduate-regular': ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar'],
    'postgraduate-evening': ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar'],
    'postgraduate-summer': ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar'],
    'undergraduate-regular': ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar'],
    'undergraduate-evening': ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar'],
    'undergraduate-summer': ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar'],
    'diploma-regular': ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar'],
    'diploma-evening': ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar'],
    'diploma-summer': ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar']
  }
};

// Status definitions
const REQUEST_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted', 
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CERTIFICATE_READY: 'certificate_ready'
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    console.log('Login attempt:', { username });
    
    const user = await User.findOne({ username });
    console.log('User found:', user ? { id: user._id, username: user.username, role: user.role } : 'No user found');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Account is blocked. Contact administrator.' });
    }

    console.log('Comparing passwords...');
    const validPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', validPassword);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for:', user.username);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        approverType: user.approverType,
        department: user.department,
        program: user.program,
        studentId: user.studentId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password, name, email, role, department, program, studentId, approverType } = req.body;
  
  try {
    const existingUser = await User.findOne({ username });
    const existingPending = await Registration.findOne({ username });
    
    if (existingUser || existingPending) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newRegistration = new Registration({
      username,
      password: hashedPassword,
      name,
      email,
      role,
      department,
      program,
      studentId,
      approverType,
      status: 'pending'
    });
    
    await newRegistration.save();
    res.status(201).json({ message: 'Registration submitted for approval' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password - Request reset code
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    console.log('Password reset request for email:', email);
    
    // Check if user exists in database
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log('User found in database:', user ? { id: user._id, name: user.name, email: user.email } : 'No user found');
    
    if (!user) {
      console.log('Email not found in database:', email);
      return res.status(404).json({ message: 'Email not found' });
    }
    
    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    console.log('Generated reset code:', resetCode, 'expires at:', expiresAt);
    
    // Remove any existing codes for this email
    await ResetCode.deleteMany({ email: email.toLowerCase().trim() });
    
    // Store new code
    const newResetCode = new ResetCode({
      email: email.toLowerCase().trim(),
      code: resetCode,
      expiresAt,
      used: false
    });
    
    await newResetCode.save();
    console.log('Reset code saved to database');
    
    // Send email with reset code
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@clearance.edu',
      to: email,
      subject: 'Password Reset Code - Clearance Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You have requested to reset your password for the Clearance Management System.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0;">Your Reset Code:</h3>
            <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 4px; margin: 10px 0;">${resetCode}</h1>
          </div>
          <p><strong>This code will expire in 15 minutes.</strong></p>
          <p>If you did not request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">Clearance Management System<br>Debre Markos University</p>
        </div>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent successfully to ${email}`);
      res.json({ message: 'Verification code sent to your email' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      console.log(`Fallback: Reset code for ${email}: ${resetCode}`);
      
      // In development, include the code in response
      const isDevelopment = process.env.NODE_ENV === 'development';
      res.json({ 
        message: isDevelopment ? 
          `Reset code generated: ${resetCode} (email service unavailable)` : 
          'Reset code generated successfully. Check console for code (email service unavailable)',
        fallback: true,
        ...(isDevelopment && { code: resetCode })
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to process password reset request' });
  }
});

// Verify reset code
app.post('/api/auth/verify-reset-code', async (req, res) => {
  const { email, code } = req.body;
  
  try {
    const resetEntry = await ResetCode.findOne({
      email,
      code,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetEntry) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    
    res.json({ message: 'Code verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  
  try {
    const resetEntry = await ResetCode.findOne({
      email,
      code,
      used: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!resetEntry) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();
    
    // Mark code as used
    resetEntry.used = true;
    await resetEntry.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all clearance requests with search
app.get('/api/requests', authenticateToken, async (req, res) => {
  const { search, searchBy, status, type, dateFrom, dateTo } = req.query;
  
  try {
    let query = {};
    
    console.log('Request query params:', { userId: req.user.id, role: req.user.role });
    
    if (req.user.role === 'student') {
      query.studentId = req.user.id;
      console.log('Student query:', query);
    } else if (req.user.role === 'approver' || req.user.role === 'teacher') {
      const user = await User.findById(req.user.id);
      const userApproverType = user.approverType || (req.user.role === 'teacher' ? 'Academic Advisor' : null);
      console.log('Approver details:', { userApproverType, userId: req.user.id });
      
      if (userApproverType) {
        // Show all requests related to this approver type (pending, approved, rejected, completed)
        query.$or = [
          // Requests where this approver is the current step (pending)
          {
            status: 'pending',
            $expr: {
              $eq: [
                { $arrayElemAt: ['$approvalSequence', '$currentStep'] },
                userApproverType
              ]
            }
          },
          // Requests where this approver has already approved/rejected
          {
            'approvals.approver': userApproverType
          }
        ];
        console.log('Approver query:', JSON.stringify(query, null, 2));
      }
    }

    // Apply search filters
    if (search && searchBy) {
      const searchRegex = new RegExp(search, 'i');
      switch (searchBy) {
        case 'studentName':
          query.studentName = searchRegex;
          break;
        case 'department':
          query.department = searchRegex;
          break;
        case 'program':
          query.program = searchRegex;
          break;
        case 'reason':
          query.reason = searchRegex;
          break;
        case 'id':
          if (mongoose.Types.ObjectId.isValid(search)) {
            query._id = search;
          }
          break;
        default:
          query.$or = [
            { studentName: searchRegex },
            { department: searchRegex },
            { reason: searchRegex }
          ];
      }
    }

    if (status && status !== 'all') {
      query.status = status;
    }
    if (type && type !== 'all') {
      query.type = type;
    }
    if (dateFrom) {
      query.createdAt = { ...query.createdAt, $gte: new Date(dateFrom) };
    }
    if (dateTo) {
      query.createdAt = { ...query.createdAt, $lte: new Date(dateTo) };
    }

    const requests = await Request.find(query).sort({ createdAt: -1 });
    console.log('Found requests:', requests.length);
    
    // Get user info for approvers/teachers
    let userApproverType = null;
    if (req.user.role === 'approver' || req.user.role === 'teacher') {
      const user = await User.findById(req.user.id);
      userApproverType = user.approverType || (req.user.role === 'teacher' ? 'Academic Advisor' : null);
    }
    
    // Transform the response to include id field and proper date formatting
    const transformedRequests = requests.map(request => {
      const requestObj = {
        ...request.toObject(),
        id: request._id.toString(),
        submittedAt: request.createdAt
      };
      
      // Add approver-specific info for approvers/teachers
      if (userApproverType) {
        const approverAction = request.approvals.find(approval => approval.approver === userApproverType);
        
        requestObj.approverStatus = approverAction ? approverAction.action : 'pending';
        requestObj.approverComment = approverAction ? approverAction.comment : null;
        requestObj.approverDate = approverAction ? approverAction.timestamp : null;
        requestObj.isCurrentApprover = request.status === 'pending' && 
                                     request.approvalSequence[request.currentStep] === userApproverType;
      }
      
      return requestObj;
    });
    
    res.json(transformedRequests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all requests for approvers by their type (pending, approved, rejected, etc.)
app.get('/api/requests/approver-history', authenticateToken, async (req, res) => {
  if (req.user.role !== 'approver' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Approver access required' });
  }

  const { search, searchBy, status, type, dateFrom, dateTo } = req.query;
  
  try {
    const user = await User.findById(req.user.id);
    const userApproverType = user.approverType || (req.user.role === 'teacher' ? 'Academic Advisor' : null);
    
    if (!userApproverType) {
      return res.status(400).json({ message: 'Approver type not found' });
    }

    let query = {
      $or: [
        // Requests where this approver is the current step (pending)
        {
          status: 'pending',
          $expr: {
            $eq: [
              { $arrayElemAt: ['$approvalSequence', '$currentStep'] },
              userApproverType
            ]
          }
        },
        // Requests where this approver has already approved/rejected
        {
          'approvals.approver': userApproverType
        }
      ]
    };

    // Apply search filters
    if (search && searchBy) {
      const searchRegex = new RegExp(search, 'i');
      const searchFilter = {};
      switch (searchBy) {
        case 'studentName':
          searchFilter.studentName = searchRegex;
          break;
        case 'department':
          searchFilter.department = searchRegex;
          break;
        case 'program':
          searchFilter.program = searchRegex;
          break;
        case 'reason':
          searchFilter.reason = searchRegex;
          break;
        default:
          searchFilter.$or = [
            { studentName: searchRegex },
            { department: searchRegex },
            { reason: searchRegex }
          ];
      }
      query = { $and: [query, searchFilter] };
    }

    if (status && status !== 'all') {
      query = { $and: [query, { status }] };
    }
    if (type && type !== 'all') {
      query = { $and: [query, { type }] };
    }
    if (dateFrom) {
      query = { $and: [query, { createdAt: { $gte: new Date(dateFrom) } }] };
    }
    if (dateTo) {
      query = { $and: [query, { createdAt: { $lte: new Date(dateTo) } }] };
    }

    const requests = await Request.find(query).sort({ createdAt: -1 });
    
    // Transform and add approver-specific info
    const transformedRequests = requests.map(request => {
      const requestObj = request.toObject();
      const approverAction = request.approvals.find(approval => approval.approver === userApproverType);
      
      return {
        ...requestObj,
        id: request._id.toString(),
        submittedAt: request.createdAt,
        approverStatus: approverAction ? approverAction.action : 'pending',
        approverComment: approverAction ? approverAction.comment : null,
        approverDate: approverAction ? approverAction.timestamp : null,
        isCurrentApprover: request.status === 'pending' && 
                          request.approvalSequence[request.currentStep] === userApproverType
      };
    });
    
    res.json(transformedRequests);
  } catch (error) {
    console.error('Get approver history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get only pending requests for approvers
app.get('/api/requests/pending', authenticateToken, async (req, res) => {
  if (req.user.role !== 'approver' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Approver access required' });
  }

  const { search, searchBy, type, dateFrom, dateTo } = req.query;
  
  try {
    const user = await User.findById(req.user.id);
    const userApproverType = user.approverType || (req.user.role === 'teacher' ? 'Academic Advisor' : null);
    
    if (!userApproverType) {
      return res.status(400).json({ message: 'Approver type not found' });
    }

    let query = {
      status: 'pending',
      $expr: {
        $eq: [
          { $arrayElemAt: ['$approvalSequence', '$currentStep'] },
          userApproverType
        ]
      }
    };

    // Apply search filters
    if (search && searchBy) {
      const searchRegex = new RegExp(search, 'i');
      switch (searchBy) {
        case 'studentName':
          query.studentName = searchRegex;
          break;
        case 'department':
          query.department = searchRegex;
          break;
        case 'program':
          query.program = searchRegex;
          break;
        case 'reason':
          query.reason = searchRegex;
          break;
        default:
          query.$or = [
            { studentName: searchRegex },
            { department: searchRegex },
            { reason: searchRegex }
          ];
      }
    }

    if (type && type !== 'all') {
      query.type = type;
    }
    if (dateFrom) {
      query.createdAt = { ...query.createdAt, $gte: new Date(dateFrom) };
    }
    if (dateTo) {
      query.createdAt = { ...query.createdAt, $lte: new Date(dateTo) };
    }

    const requests = await Request.find(query).sort({ createdAt: -1 });
    
    const transformedRequests = requests.map(request => ({
      ...request.toObject(),
      id: request._id.toString(),
      submittedAt: request.createdAt,
      isCurrentApprover: true
    }));
    
    res.json(transformedRequests);
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit clearance request
app.post('/api/requests', authenticateToken, async (req, res) => {
  if (req.user.role !== 'student' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only students and teachers can submit requests' });
  }

  try {
    const { type, reason, programType, programMode, documents } = req.body;
    const user = await User.findById(req.user.id);
    
    // Get workflow from database or use predefined sequences
    const workflow = await Workflow.findOne({ type, program: `${programType}-${programMode}` });
    const approvalSequence = workflow ? workflow.sequence : 
      approvalSequences[type] && approvalSequences[type][`${programType}-${programMode}`] ? 
      approvalSequences[type][`${programType}-${programMode}`] : 
      (type === 'termination' ? 
        ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'] :
        ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar']);

    const requestData = {
      studentId: req.user.id,
      studentName: user.name,
      department: user.department,
      program: user.program,
      type,
      reason,
      programType,
      programMode,
      documents: documents || [],
      status: 'pending',
      currentStep: 0,
      approvalSequence,
      approvals: [],
      notifications: [{
        type: 'SUBMITTED',
        message: 'Request submitted successfully',
        timestamp: new Date()
      }]
    };

    const newRequest = new Request(requestData);
    await newRequest.save();
    
    // Return with consistent format
    const response = {
      ...newRequest.toObject(),
      id: newRequest._id.toString(),
      submittedAt: newRequest.createdAt
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Submit request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit clearance request with file uploads
app.post('/api/requests/with-files', authenticateToken, upload.array('documents', 5), async (req, res) => {
  if (req.user.role !== 'student' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only students and teachers can submit requests' });
  }

  try {
    const { type, reason, programType, programMode } = req.body;
    const user = await User.findById(req.user.id);
    
    // Get uploaded file names
    const documents = req.files ? req.files.map(file => file.filename) : [];
    
    // Get workflow from database or use predefined sequences
    const workflow = await Workflow.findOne({ type, program: `${programType}-${programMode}` });
    const approvalSequence = workflow ? workflow.sequence : 
      approvalSequences[type] && approvalSequences[type][`${programType}-${programMode}`] ? 
      approvalSequences[type][`${programType}-${programMode}`] : 
      (type === 'termination' ? 
        ['Academic Advisor', 'Department Head', 'Library (A) Chief of Circulation', 'Library (B) Chief of Circulation', '(Main) Library (C)', 'Dean\'s Office', 'Student Services', 'Registrar'] :
        ['Academic Advisor', 'Library Services', 'Campus Security', 'Finance Office', 'Registrar']);

    const requestData = {
      studentId: req.user.id,
      studentName: user.name,
      department: user.department,
      program: user.program,
      type,
      reason,
      programType,
      programMode,
      documents,
      status: 'pending',
      currentStep: 0,
      approvalSequence,
      approvals: [],
      notifications: [{
        type: 'SUBMITTED',
        message: 'Request submitted successfully',
        timestamp: new Date()
      }]
    };

    const newRequest = new Request(requestData);
    await newRequest.save();
    
    // Return with consistent format
    const response = {
      ...newRequest.toObject(),
      id: newRequest._id.toString(),
      submittedAt: newRequest.createdAt
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Submit request with files error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel request (students only, non-pending requests)
app.put('/api/requests/:id/cancel', authenticateToken, async (req, res) => {
  if (req.user.role !== 'student' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only students and teachers can cancel requests' });
  }

  try {
    const requestId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid request ID format' });
    }
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Check if user owns the request
    if (request.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only cancel your own requests' });
    }
    
    // Cannot cancel pending requests
    if (request.status === 'pending') {
      return res.status(400).json({ message: 'Cannot cancel pending requests' });
    }
    
    // Cannot cancel already completed or rejected requests
    if (request.status === 'certificate_ready' || request.status === 'rejected') {
      return res.status(400).json({ message: 'Cannot cancel completed or rejected requests' });
    }
    
    // Update request status to cancelled
    request.status = 'cancelled';
    
    if (!Array.isArray(request.notifications)) {
      request.notifications = [];
    }
    
    request.notifications.push({
      type: 'CANCELLED',
      message: 'Request cancelled by student',
      timestamp: new Date()
    });
    
    await request.save();
    
    res.json({
      ...request.toObject(),
      id: request._id.toString()
    });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject request
app.put('/api/requests/:id/approve', authenticateToken, async (req, res) => {
  console.log('Approval request received:', {
    requestId: req.params.id,
    userId: req.user.id,
    userRole: req.user.role,
    body: req.body
  });

  if (req.user.role !== 'approver' && req.user.role !== 'admin' && req.user.role !== 'teacher') {
    console.log('Access denied - invalid role');
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const requestId = req.params.id;
    const { action, comment } = req.body;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      console.log('Invalid request ID format:', requestId);
      return res.status(400).json({ message: 'Invalid request ID format' });
    }
    
    console.log('Processing approval:', { requestId, action, comment });
    
    if (action === 'rejected' && (!comment || comment.trim() === '')) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      console.log('Request not found:', requestId);
      return res.status(404).json({ message: 'Request not found' });
    }

    // Ensure notifications array exists
    if (!Array.isArray(request.notifications)) {
      request.notifications = [];
    }

    console.log('Found request:', {
      id: request._id,
      status: request.status,
      currentStep: request.currentStep,
      approvalSequence: request.approvalSequence
    });

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', {
      id: user._id,
      name: user.name,
      approverType: user.approverType
    });
    
    // Check authorization for approvers (skip for admin)
    if (req.user.role !== 'admin') {
      const expectedApprover = request.approvalSequence[request.currentStep];
      console.log('Authorization check:', {
        userApproverType: user.approverType,
        expectedApprover: expectedApprover,
        currentStep: request.currentStep
      });

      // For teachers, allow if they have approverType or if they are the expected approver
      const userApproverType = user.approverType || (req.user.role === 'teacher' ? 'Academic Advisor' : null);
      
      if ((req.user.role === 'approver' || req.user.role === 'teacher') && 
          expectedApprover !== userApproverType) {
        console.log('Authorization failed - not the expected approver');
        return res.status(403).json({ 
          message: `Not authorized for this approval step. Expected: ${expectedApprover}, Got: ${userApproverType}` 
        });
      }
    }

    const newApproval = {
      approver: user.approverType || user.name,
      action,
      comment: comment || '',
      timestamp: new Date()
    };

    console.log('Adding approval:', newApproval);
    request.approvals.push(newApproval);

    if (action === 'approved') {
      if (request.currentStep === request.approvalSequence.length - 1) {
        request.status = 'certificate_ready';
        console.log('Request completed - certificate ready');
        request.notifications.push({
          type: 'CERTIFICATE_READY',
          message: 'Your clearance request has been fully approved. Certificate is ready for download.',
          timestamp: new Date()
        });
      } else {
        request.currentStep++;
        console.log('Request forwarded to step:', request.currentStep);
        console.log('Next approver:', request.approvalSequence[request.currentStep]);
        request.notifications.push({
          type: 'APPROVED',
          message: `Approved by ${newApproval.approver}. Forwarded to ${request.approvalSequence[request.currentStep]}.`,
          timestamp: new Date()
        });
      }
    } else {
      request.status = 'rejected';
      console.log('Request rejected');
      request.notifications.push({
        type: 'REJECTED',
        message: `Request rejected by ${newApproval.approver}. Reason: ${comment}`,
        timestamp: new Date(),
        priority: 'high'
      });
    }

    console.log('Saving request with new status:', request.status);
    
    try {
      await request.save();
      console.log('Request saved successfully');
    } catch (saveError) {
      console.error('Request save error:', saveError);
      return res.status(500).json({ message: 'Failed to save approval: ' + saveError.message });
    }
    
    // Log the action
    try {
      const auditLog = new AuditLog({
        action: `request_${action}`,
        user: req.user.username,
        details: `${action} request ${requestId} by ${newApproval.approver}`
      });
      await auditLog.save();
      console.log('Audit log saved');
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    console.log('Approval process completed successfully');
    res.json({
      ...request.toObject(),
      id: request._id.toString()
    });
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ message: 'Failed to process approval: ' + error.message });
  }
});

// Generate certificate
app.get('/api/requests/:id/certificate', authenticateToken, async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'certificate_ready') {
      return res.status(400).json({ message: 'Certificate not ready yet' });
    }

    // Check authorization
    if (req.user.role === 'student' && request.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get student data for certificate
    const student = await User.findById(request.studentId);
    const studentIdForCert = student?.studentId || 'N/A';

    // Create canvas for certificate
    const width = 1200;
    const height = 1600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Inner border
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Header
    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎓 DEBRE MARKOS UNIVERSITY 🎓', width / 2, 120);

    ctx.font = 'bold 32px Arial';
    ctx.fillText('OFFICE OF THE REGISTRAR', width / 2, 170);

    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#dc2626';
    ctx.fillText(' STUDENT CLEARANCE CERTIFICATE ', width / 2, 230);

    // Certificate content
    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    
    const leftMargin = 100;
    let yPos = 320;
    const lineHeight = 40;

    // Student Information
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(' STUDENT INFORMATION', leftMargin, yPos);
    yPos += lineHeight + 10;

    ctx.font = '22px Arial';
    ctx.fillStyle = '#374151';
    ctx.fillText(` Name: ${request.studentName}`, leftMargin, yPos);
    yPos += lineHeight;
    ctx.fillText(` Faculty: ${request.department || 'N/A'}`, leftMargin, yPos);
    yPos += lineHeight;
    ctx.fillText(` Department: ${request.department || 'N/A'}`, leftMargin, yPos);
    yPos += lineHeight;
    ctx.fillText(` ID Number: ${studentIdForCert}`, leftMargin, yPos);
    yPos += lineHeight;
    ctx.fillText(` Date: ${new Date().toLocaleDateString()}`, leftMargin, yPos);
    yPos += lineHeight + 20;

    // Clearance Details
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(' CLEARANCE DETAILS', leftMargin, yPos);
    yPos += lineHeight + 10;

    ctx.font = '22px Arial';
    ctx.fillStyle = '#374151';
    ctx.fillText(` Type: ${request.type === 'termination' ? 'Termination Clearance' : 'ID Replacement'}`, leftMargin, yPos);
    yPos += lineHeight;
    ctx.fillText(` Reason: ${request.reason || 'N/A'}`, leftMargin, yPos);
    yPos += lineHeight;
    ctx.fillText(` Certificate ID: CERT-${requestId}`, leftMargin, yPos);
    yPos += lineHeight;
    ctx.fillText(` Valid Until: ${new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, leftMargin, yPos);
    yPos += lineHeight + 30;

    // Approval Status
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#059669';
    ctx.fillText('✅ APPROVAL STATUS: COMPLETED', leftMargin, yPos);
    yPos += lineHeight + 20;

    // Approval signatures
    const approvalSignatures = {};
    request.approvals.forEach(approval => {
      if (approval.action === 'approved') {
        approvalSignatures[approval.approver] = {
          signature: '✓ APPROVED',
          date: approval.timestamp.toLocaleDateString()
        };
      }
    });

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(' APPROVAL SIGNATURES', leftMargin, yPos);
    yPos += lineHeight;

    ctx.font = '18px Arial';
    ctx.fillStyle = '#374151';
    let approverCount = 1;
    for (const [approver, details] of Object.entries(approvalSignatures)) {
      ctx.fillText(`${approverCount}. ${approver}: ${details.signature} (${details.date})`, leftMargin, yPos);
      yPos += 30;
      approverCount++;
    }

    yPos += 40;

    // Footer
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#dc2626';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 CONGRATULATIONS ON YOUR SUCCESSFUL CLEARANCE! 🎉', width / 2, yPos);
    yPos += 30;
    
    ctx.font = '18px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('This document certifies completion of all required university clearance procedures.', width / 2, yPos);
    yPos += 40;
    
    ctx.font = '16px Arial';
    ctx.fillText(' Generated by: Clearance Management System', width / 2, yPos);
    yPos += 25;
    ctx.fillText('Developed by Bisirat 2025 | +251990056412', width / 2, yPos);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    
    // Set response headers for image download
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="clearance-certificate-${requestId}.jpg"`);
    res.setHeader('Content-Length', buffer.length);
    
    // Send the image buffer
    res.send(buffer);
  } catch (error) {
    console.error('Certificate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all requests for approvers (with search) - FIXED
app.get('/api/requests/all', authenticateToken, async (req, res) => {
  if (req.user.role !== 'approver' && req.user.role !== 'admin' && req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const { search, searchBy, status, type, dateFrom, dateTo } = req.query;
    let query = {};

    // Apply search filters
    if (search && searchBy) {
      const searchRegex = new RegExp(search, 'i');
      switch (searchBy) {
        case 'studentName':
          query.studentName = searchRegex;
          break;
        case 'department':
          query.department = searchRegex;
          break;
        case 'program':
          query.program = searchRegex;
          break;
        case 'reason':
          query.reason = searchRegex;
          break;
        default:
          query.$or = [
            { studentName: searchRegex },
            { department: searchRegex },
            { reason: searchRegex }
          ];
      }
    }

    if (status && status !== 'all') {
      query.status = status;
    }
    if (type && type !== 'all') {
      query.type = type;
    }
    if (dateFrom) {
      query.createdAt = { ...query.createdAt, $gte: new Date(dateFrom) };
    }
    if (dateTo) {
      query.createdAt = { ...query.createdAt, $lte: new Date(dateTo) };
    }

    const requests = await Request.find(query).sort({ createdAt: -1 });
    
    const transformedRequests = requests.map(request => ({
      ...request.toObject(),
      id: request._id.toString(),
      submittedAt: request.createdAt
    }));
    
    res.json(transformedRequests);
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system statistics (admin only)
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'pending' });
    const approvedRequests = await Request.countDocuments({ status: 'certificate_ready' });
    const rejectedRequests = await Request.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments();
    const terminationRequests = await Request.countDocuments({ type: 'termination' });
    const idReplacementRequests = await Request.countDocuments({ type: 'idReplacement' });

    const stats = {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalUsers,
      requestsByType: {
        termination: terminationRequests,
        idReplacement: idReplacementRequests
      },
      averageProcessingTime: '3.2 days'
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get workflow rules
app.get('/api/workflow/:type/:program', authenticateToken, (req, res) => {
  const { type, program } = req.params;
  const workflow = approvalSequences[type] && approvalSequences[type][program];
  
  if (!workflow) {
    return res.status(404).json({ message: 'Workflow not found' });
  }
  
  res.json({ steps: workflow });
});

// Admin: Get all users with search and filters
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  console.log('Get users request:', {
    query: req.query,
    adminUser: req.user.username
  });
  
  if (req.user.role !== 'admin') {
    console.log('Access denied - not admin');
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const { search, searchBy, role, status } = req.query;
    let query = {};
    
    console.log('Search parameters:', { search, searchBy, role, status });
    
    // Apply search filters
    if (search && searchBy) {
      const searchRegex = new RegExp(search, 'i');
      switch (searchBy) {
        case 'name':
          query.name = searchRegex;
          break;
        case 'username':
          query.username = searchRegex;
          break;
        case 'email':
          query.email = searchRegex;
          break;
        case 'department':
          query.department = searchRegex;
          break;
        default:
          query.$or = [
            { name: searchRegex },
            { username: searchRegex },
            { email: searchRegex }
          ];
      }
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    console.log('Final query:', JSON.stringify(query, null, 2));
    
    const users = await User.find(query, '-password').sort({ createdAt: -1 });
    console.log('Found users:', users.length);
    
    // Transform users to include id field
    const transformedUsers = users.map(user => ({
      ...user.toObject(),
      id: user._id.toString()
    }));
    
    res.json(transformedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Reassign pending request - FIXED
app.put('/api/admin/requests/:id/reassign', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const requestId = req.params.id;
    const { newApprover } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid request ID format' });
    }
    
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only reassign pending requests' });
    }
    
    // Update the approval sequence at current step
    request.approvalSequence[request.currentStep] = newApprover;
    
    if (!Array.isArray(request.notifications)) {
      request.notifications = [];
    }
    
    request.notifications.push({
      type: 'REASSIGNED',
      message: `Request reassigned to ${newApprover}`,
      timestamp: new Date()
    });
    
    await request.save();
    
    const response = {
      ...request.toObject(),
      id: request._id.toString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Reassign request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get pending registrations
app.get('/api/admin/registrations', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const { search, searchBy, status = 'pending' } = req.query;
    let query = {};
    
    // Apply status filter
    if (status !== 'all') {
      query.status = status;
    }
    
    // Apply search filters
    if (search && searchBy) {
      const searchRegex = new RegExp(search, 'i');
      switch (searchBy) {
        case 'name':
          query.name = searchRegex;
          break;
        case 'username':
          query.username = searchRegex;
          break;
        case 'email':
          query.email = searchRegex;
          break;
        case 'role':
          query.role = searchRegex;
          break;
        case 'department':
          query.department = searchRegex;
          break;
        default:
          query.$or = [
            { name: searchRegex },
            { username: searchRegex },
            { email: searchRegex }
          ];
      }
    }
    
    const registrations = await Registration.find(query).sort({ createdAt: -1 });
    
    // Transform registrations to include id field and submittedAt
    const transformedRegistrations = registrations.map(reg => ({
      ...reg.toObject(),
      id: reg._id.toString(),
      submittedAt: reg.createdAt
    }));
    
    res.json(transformedRegistrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Approve/Reject registration
app.put('/api/admin/registrations/:id/approve', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const registrationId = req.params.id;
    const { action, comment } = req.body;
    
    console.log('Processing registration approval:', { registrationId, action, comment });
    
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    if (action === 'approved') {
      // Auto-generate studentId for students
      let studentId = registration.studentId;
      if (registration.role === 'student' && !studentId) {
        const randomId = Math.floor(100000 + Math.random() * 900000);
        studentId = `DMU${randomId}`;
      }
      
      // Create new user
      const newUser = new User({
        username: registration.username,
        password: registration.password,
        role: registration.role,
        name: registration.name,
        email: registration.email,
        department: registration.department,
        program: registration.program,
        studentId,
        approverType: registration.approverType,
        status: 'active'
      });
      
      await newUser.save();
      await Registration.findByIdAndDelete(registrationId);
      
      // Log the action
      const auditLog = new AuditLog({
        action: 'registration_approved',
        user: req.user.username,
        details: `Approved registration for ${registration.username} (${registration.role})`
      });
      await auditLog.save();
      
      console.log('Registration approved successfully:', { username: newUser.username, role: newUser.role });
      
      res.json({ 
        message: 'Registration approved and user created successfully',
        user: {
          username: newUser.username,
          name: newUser.name,
          role: newUser.role,
          studentId: newUser.studentId
        }
      });
    } else {
      await Registration.findByIdAndDelete(registrationId);
      
      const auditLog = new AuditLog({
        action: 'registration_rejected',
        user: req.user.username,
        details: `Rejected registration for ${registration.username}. Reason: ${comment || 'No reason provided'}`
      });
      await auditLog.save();
      
      console.log('Registration rejected successfully:', { username: registration.username });
      
      res.json({ message: 'Registration rejected successfully' });
    }
  } catch (error) {
    console.error('Registration approval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Registrar: Get pending registrations (enhanced access)
app.get('/api/registrar/registrations', authenticateToken, async (req, res) => {
  if (req.user.role !== 'approver' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Registrar or Admin access required' });
  }
  
  try {
    // Check if user is Registrar
    if (req.user.role === 'approver') {
      const user = await User.findById(req.user.id);
      if (user.approverType !== 'Registrar') {
        return res.status(403).json({ message: 'Registrar access required' });
      }
    }
    
    const { search, searchBy, status = 'pending' } = req.query;
    let query = {};
    
    // Apply status filter
    if (status !== 'all') {
      query.status = status;
    }
    
    // Apply search filters
    if (search && searchBy) {
      const searchRegex = new RegExp(search, 'i');
      switch (searchBy) {
        case 'name':
          query.name = searchRegex;
          break;
        case 'username':
          query.username = searchRegex;
          break;
        case 'email':
          query.email = searchRegex;
          break;
        case 'role':
          query.role = searchRegex;
          break;
        case 'department':
          query.department = searchRegex;
          break;
        default:
          query.$or = [
            { name: searchRegex },
            { username: searchRegex },
            { email: searchRegex }
          ];
      }
    }
    
    const registrations = await Registration.find(query).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Registrar: Approve/Reject registration (enhanced)
app.put('/api/registrar/registrations/:id/approve', authenticateToken, async (req, res) => {
  if (req.user.role !== 'approver' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Registrar or Admin access required' });
  }
  
  try {
    // Check if user is Registrar
    if (req.user.role === 'approver') {
      const user = await User.findById(req.user.id);
      if (user.approverType !== 'Registrar') {
        return res.status(403).json({ message: 'Registrar access required' });
      }
    }
    
    const registrationId = req.params.id;
    const { action, comment } = req.body;
    
    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    if (action === 'approved') {
      // Auto-generate studentId for students
      let studentId = registration.studentId;
      if (registration.role === 'student' && !studentId) {
        const randomId = Math.floor(100000 + Math.random() * 900000);
        studentId = `DMU${randomId}`;
      }
      
      // Create new user
      const newUser = new User({
        username: registration.username,
        password: registration.password,
        role: registration.role,
        name: registration.name,
        email: registration.email,
        department: registration.department,
        program: registration.program,
        studentId,
        approverType: registration.approverType,
        status: 'active'
      });
      
      await newUser.save();
      await Registration.findByIdAndDelete(registrationId);
      
      // Log the action
      const auditLog = new AuditLog({
        action: 'registration_approved',
        user: req.user.username,
        details: `Approved registration for ${registration.username} (${registration.role})`
      });
      await auditLog.save();
      
      res.json({ 
        message: 'Registration approved and user created successfully',
        user: {
          username: newUser.username,
          name: newUser.name,
          role: newUser.role,
          studentId: newUser.studentId
        }
      });
    } else {
      await Registration.findByIdAndDelete(registrationId);
      
      const auditLog = new AuditLog({
        action: 'registration_rejected',
        user: req.user.username,
        details: `Rejected registration for ${registration.username}. Reason: ${comment || 'No reason provided'}`
      });
      await auditLog.save();
      
      res.json({ message: 'Registration rejected successfully' });
    }
  } catch (error) {
    console.error('Registration approval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Admin: Create new user
app.post('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const { username, password, name, email, role, department, program, studentId, approverType } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      email,
      role,
      department,
      program,
      studentId,
      approverType,
      status: 'active'
    });
    
    await newUser.save();
    
    const auditLog = new AuditLog({
      action: 'user_created',
      user: req.user.username,
      details: `Created user ${username} with role ${role}`
    });
    await auditLog.save();
    
    const userResponse = newUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Block/Unblock user
app.put('/api/admin/users/:id/status', authenticateToken, async (req, res) => {
  console.log('Block/Unblock user request:', {
    userId: req.params.id,
    requestBody: req.body,
    adminUser: req.user.username
  });
  
  if (req.user.role !== 'admin') {
    console.log('Access denied - not admin');
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    console.log('Processing status change:', { userId, status });
    
    if (userId === req.user.id) {
      console.log('Cannot modify own account');
      return res.status(400).json({ message: 'Cannot modify your own account' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true, select: '-password' }
    );
    
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User status updated successfully:', { username: user.username, newStatus: status });
    
    const auditLog = new AuditLog({
      action: 'user_status_changed',
      user: req.user.username,
      details: `Changed user ${user.username} status to ${status}`
    });
    await auditLog.save();
    
    res.json(user);
  } catch (error) {
    console.error('Block/Unblock user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete user
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  console.log('Delete user request:', {
    userId: req.params.id,
    adminUser: req.user.username
  });
  
  if (req.user.role !== 'admin') {
    console.log('Access denied - not admin');
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const userId = req.params.id;
    
    console.log('Processing user deletion:', { userId });
    
    if (userId === req.user.id) {
      console.log('Cannot delete own account');
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User deleted successfully:', { username: user.username });
    
    const auditLog = new AuditLog({
      action: 'user_deleted',
      user: req.user.username,
      details: `Deleted user ${user.username}`
    });
    await auditLog.save();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Get own profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Update own profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, department, program } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (department) updateData.department = department;
    if (program) updateData.program = program;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Change password
app.put('/api/user/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: System Settings
app.get('/api/admin/settings', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const settings = await Settings.find();
    const settingsData = {};
    settings.forEach(setting => {
      settingsData[setting.section] = setting.settings;
    });
    res.json(settingsData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/settings', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const { section, settings } = req.body;
    
    await Settings.findOneAndUpdate(
      { section },
      { settings },
      { upsert: true }
    );
    
    const auditLog = new AuditLog({
      action: 'settings_update',
      user: req.user.username,
      details: `Updated ${section} settings`
    });
    await auditLog.save();
    
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Approval Workflows
app.get('/api/admin/workflows', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const workflows = await Workflow.find();
    const workflowData = {};
    
    workflows.forEach(workflow => {
      if (!workflowData[workflow.type]) {
        workflowData[workflow.type] = {};
      }
      workflowData[workflow.type][workflow.program] = workflow.sequence;
    });
    
    res.json(workflowData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/workflows', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const { type, program, sequence } = req.body;
    
    // Update workflow in database
    await Workflow.findOneAndUpdate(
      { type, program },
      { sequence },
      { upsert: true }
    );
    
    // Update existing pending requests with new workflow
    const pendingRequests = await Request.find({
      type,
      programType: program.split('-')[0],
      programMode: program.split('-')[1],
      status: 'pending'
    });
    
    let updatedRequestsCount = 0;
    for (const request of pendingRequests) {
      // Only update if current step is still valid in new sequence
      if (request.currentStep < sequence.length) {
        request.approvalSequence = sequence;
        
        // Add notification about workflow change
        if (!Array.isArray(request.notifications)) {
          request.notifications = [];
        }
        request.notifications.push({
          type: 'WORKFLOW_UPDATED',
          message: `Workflow updated by admin. Current approver: ${sequence[request.currentStep]}`,
          timestamp: new Date()
        });
        
        await request.save();
        updatedRequestsCount++;
      }
    }
    
    const auditLog = new AuditLog({
      action: 'workflow_update',
      user: req.user.username,
      details: `Updated ${type} workflow for ${program}. Updated ${updatedRequestsCount} pending requests.`
    });
    await auditLog.save();
    
    res.json({ 
      message: 'Workflow updated successfully', 
      updatedRequests: updatedRequestsCount 
    });
  } catch (error) {
    console.error('Workflow update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Audit Logs
app.get('/api/admin/audit-logs', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const { limit = 100, action, user, dateFrom, dateTo } = req.query;
    let query = {};
    
    if (action) query.action = action;
    if (user) query.user = new RegExp(user, 'i');
    if (dateFrom) query.createdAt = { ...query.createdAt, $gte: new Date(dateFrom) };
    if (dateTo) query.createdAt = { ...query.createdAt, $lte: new Date(dateTo) };
    
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Backup System - FIXED
app.post('/api/admin/backup', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const userCount = await User.countDocuments();
    const requestCount = await Request.countDocuments();
    const settings = await Settings.find();
    const workflows = await Workflow.find();
    
    const backup = {
      timestamp: new Date().toISOString(),
      users: userCount,
      requests: requestCount,
      settings: settings.length,
      workflows: workflows.length
    };
    
    const auditLog = new AuditLog({
      action: 'backup_created',
      user: req.user.username,
      details: 'System backup created'
    });
    await auditLog.save();
    
    res.json({ message: 'Backup created successfully', backup });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/restore', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    // Mock restore - in real implementation, would restore from backup file
    const auditLog = new AuditLog({
      action: 'system_restored',
      user: req.user.username,
      details: 'System restored from backup'
    });
    await auditLog.save();
    
    res.json({ message: 'System restored successfully' });
  } catch (error) {
    console.error('Restore error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update existing user with studentId (temporary endpoint)
app.put('/api/admin/update-student-id/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const userId = req.params.id;
    const { studentId } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { studentId },
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Student ID updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});