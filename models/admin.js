import { Schema, model } from 'mongoose';

// Define the Admin schema
const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the Admin model
const Admin = model('Admin', adminSchema);

export default Admin;
