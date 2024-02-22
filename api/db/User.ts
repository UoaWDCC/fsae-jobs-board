import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 40,
    minLength: 1,
  },
});

const User = model('User', userSchema);

export default User;
