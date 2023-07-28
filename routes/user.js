import { Router } from 'express';
const Urouter = Router();
import User from '../models/user.js';

// Create a new user
Urouter.post('/user', async (req, res) => {
  try {
    const { name, height, weight } = req.body;

    // Calculate BMI
    const bmi = weight / (height * height);

    const user = new User({
      name,
      height,
      weight,
      bmi, // Save the calculated BMI directly to the database
    });

    await user.save();
    res.status(201).json({ user, bmi });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve all users
Urouter.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default Urouter;
