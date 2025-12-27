const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://damitachewyiradu_db_user:2123@cluster0.5ojpbcv.mongodb.net/clearance_system';

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

const User = mongoose.model('User', userSchema);

const initUsers = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const defaultUsers = [
      { username: 'student1', password: await bcrypt.hash('password', 10), role: 'student', name: 'John Doe', email: 'student1@university.edu', department: 'Computer Science', program: 'MSc Computer Science', status: 'active' },
      { username: 'advisor1', password: await bcrypt.hash('password', 10), role: 'approver', name: 'Dr. Smith', email: 'advisor1@university.edu', approverType: 'Academic Advisor', status: 'active' },
      { username: 'admin1', password: await bcrypt.hash('password', 10), role: 'admin', name: 'Admin User', email: 'admin1@university.edu', status: 'active' }
    ];

    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ username: userData.username });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.username}`);
      } else {
        console.log(`User already exists: ${userData.username}`);
      }
    }

    console.log('User initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

initUsers();