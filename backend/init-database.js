const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://damitachewyiradu_db_user:2123@cluster0.5ojpbcv.mongodb.net/clearance_system';

// User Schema
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

// Request Schema
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
  status: { type: String, enum: ['draft', 'submitted', 'pending', 'approved', 'rejected', 'completed', 'certificate_ready'], default: 'pending' },
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

// Registration Schema
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

// Reset Code Schema
const resetCodeSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
  used: { type: Boolean, default: false }
}, { timestamps: true });

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  action: String,
  user: String,
  details: String
}, { timestamps: true });

// Settings Schema
const settingsSchema = new mongoose.Schema({
  section: { type: String, unique: true },
  settings: mongoose.Schema.Types.Mixed
}, { timestamps: true });

// Workflow Schema
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

const initializeDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - remove in production)
    // await User.deleteMany({});
    // await Settings.deleteMany({});
    // await Workflow.deleteMany({});

    // Create Users
    const users = [
      { username: 'student1', password: await bcrypt.hash('password', 10), role: 'student', name: 'John Doe', email: 'student1@university.edu', department: 'Computer Science', program: 'MSc Computer Science', status: 'active' },
      { username: 'advisor1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Dr. Smith', email: 'advisor1@university.edu', approverType: 'Academic Advisor', status: 'active' },
      { username: 'admin1', password: await bcrypt.hash('password', 10), role: 'admin', name: 'Admin User', email: 'admin1@university.edu', status: 'active' },
      { username: 'teacher1', password: await bcrypt.hash('password', 10), role: 'teacher', name: 'Prof. Johnson', email: 'teacher1@university.edu', department: 'Computer Science', approverType: 'Academic Advisor', status: 'active' },
      { username: 'depthead1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Dr. Wilson', email: 'depthead1@university.edu', approverType: 'Department Head', status: 'active' },
      { username: 'librarya1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Ms. Brown', email: 'librarya1@university.edu', approverType: 'Library A', status: 'active' },
      { username: 'libraryb1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Mr. Davis', email: 'libraryb1@university.edu', approverType: 'Library B', status: 'active' },
      { username: 'libraryc1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Ms. Miller', email: 'libraryc1@university.edu', approverType: 'Library C', status: 'active' },
      { username: 'mainlib1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Dr. Taylor', email: 'mainlib1@university.edu', approverType: 'Main Library', status: 'active' },
      { username: 'finance1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Mr. Anderson', email: 'finance1@university.edu', approverType: 'Finance', status: 'active' },
      { username: 'dorm1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Ms. Garcia', email: 'dorm1@university.edu', approverType: 'Dormitory', status: 'active' },
      { username: 'cafeteria1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Mr. Martinez', email: 'cafeteria1@university.edu', approverType: 'Cafeteria', status: 'active' },
      { username: 'police1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Officer Johnson', email: 'police1@university.edu', approverType: 'Campus Police', status: 'active' },
      { username: 'pgdean1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Prof. Williams', email: 'pgdean1@university.edu', approverType: 'Post Graduate Dean', status: 'active' },
      { username: 'registrar1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Dr. Thompson', email: 'registrar1@university.edu', approverType: 'Registrar', status: 'active' },
      { username: 'bookstore1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Ms. Lee', email: 'bookstore1@university.edu', approverType: 'Bookstore', status: 'active' }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.username}`);
      }
    }

    // Create System Settings
    const settings = [
      {
        section: 'notifications',
        settings: {
          emailEnabled: true,
          smsEnabled: false,
          pushEnabled: true,
          reminderDays: 3
        }
      },
      {
        section: 'system',
        settings: {
          sessionTimeout: 24,
          maxFileSize: 10,
          allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
          certificateValidityMonths: 6
        }
      },
      {
        section: 'backup',
        settings: {
          autoBackup: true,
          backupFrequency: 'daily',
          retentionDays: 30
        }
      },
      {
        section: 'audit',
        settings: {
          logLevel: 'info',
          retentionDays: 90,
          logActions: ['login', 'approval', 'rejection', 'creation']
        }
      }
    ];

    for (const setting of settings) {
      const existingSetting = await Settings.findOne({ section: setting.section });
      if (!existingSetting) {
        await Settings.create(setting);
        console.log(`Created setting: ${setting.section}`);
      }
    }

    // Create Workflows
    const workflows = [
      // Termination workflows
      { type: 'termination', program: 'postgraduate-regular', sequence: ['Academic Advisor', 'Department Head', 'Library A', 'Library B', 'Library C', 'Post Graduate Dean', 'Dormitory', 'Cafeteria', 'Registrar'] },
      { type: 'termination', program: 'postgraduate-evening', sequence: ['Academic Advisor', 'Department Head', 'Library A', 'Library B', 'Post Graduate Dean', 'Cafeteria', 'Registrar'] },
      { type: 'termination', program: 'undergraduate-regular', sequence: ['Academic Advisor', 'Department Head', 'Library A', 'Library B', 'Main Library', 'Dormitory', 'Cafeteria', 'Registrar'] },
      { type: 'termination', program: 'undergraduate-evening', sequence: ['Academic Advisor', 'Department Head', 'Library A', 'Library B', 'Main Library', 'Cafeteria', 'Registrar'] },
      { type: 'termination', program: 'diploma-regular', sequence: ['Academic Advisor', 'Library A', 'Library B', 'Dormitory', 'Cafeteria', 'Registrar'] },
      { type: 'termination', program: 'diploma-evening', sequence: ['Academic Advisor', 'Library A', 'Library B', 'Cafeteria', 'Registrar'] },
      
      // ID Replacement workflows
      { type: 'idReplacement', program: 'postgraduate-regular', sequence: ['Academic Advisor', 'Library A', 'Library B', 'Main Library', 'Bookstore', 'Campus Police', 'Dormitory', 'Cafeteria', 'Finance', 'Registrar'] },
      { type: 'idReplacement', program: 'postgraduate-evening', sequence: ['Academic Advisor', 'Library A', 'Library B', 'Main Library', 'Bookstore', 'Campus Police', 'Cafeteria', 'Finance', 'Registrar'] },
      { type: 'idReplacement', program: 'undergraduate-regular', sequence: ['Academic Advisor', 'Library A', 'Library B', 'Main Library', 'Bookstore', 'Campus Police', 'Finance', 'Registrar'] },
      { type: 'idReplacement', program: 'undergraduate-evening', sequence: ['Academic Advisor', 'Library A', 'Library B', 'Main Library', 'Bookstore', 'Campus Police', 'Finance', 'Registrar'] },
      { type: 'idReplacement', program: 'diploma-regular', sequence: ['Academic Advisor', 'Library A', 'Library B', 'Bookstore', 'Campus Police', 'Finance', 'Registrar'] },
      { type: 'idReplacement', program: 'diploma-evening', sequence: ['Academic Advisor', 'Library A', 'Library B', 'Bookstore', 'Campus Police', 'Finance', 'Registrar'] }
    ];

    for (const workflow of workflows) {
      const existingWorkflow = await Workflow.findOne({ type: workflow.type, program: workflow.program });
      if (!existingWorkflow) {
        await Workflow.create(workflow);
        console.log(`Created workflow: ${workflow.type}-${workflow.program}`);
      }
    }

    console.log('Database initialization complete!');
    console.log('Default login credentials:');
    console.log('Admin: admin1 / password');
    console.log('Student: student1 / password');
    console.log('Approver: advisor1 / password');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();