import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';  // for password hashing

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: [40, 'Email cannot be longer than 40 characters'],
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [8, 'Password must be at least 8 characters long']
  },
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: ['member', 'sponsor', 'alumni'],
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: 'Phone number must be in the format XXX-XXX-XXXX'
    },
    required: [false, 'Phone number is not required']
  },
  description: {
    type: String,
    maxLength: [200, 'Description cannot be more than 200 characters']
  },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = model('User', userSchema);

export default User;
