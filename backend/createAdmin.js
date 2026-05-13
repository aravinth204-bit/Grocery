import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    // Delete any old admin accounts to avoid conflicts
    await User.deleteMany({ role: 'admin' });

    // Create new admin with user's requested credentials
    await User.create({
      name: 'Super Admin',
      email: 'admin@gmail.com',
      mobile: '9876543210',
      password: '12345678',
      role: 'admin',
    });

    console.log('Admin credentials updated successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
