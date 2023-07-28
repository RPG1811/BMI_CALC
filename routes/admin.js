import { Router } from 'express';
const arouter = Router();
import User from '../models/user.js';
import Admin from '../models/admin.js';

// Get all users' weight and BMI data
arouter.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name weight height bmi timestamp');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all-time low and high weight and BMI
arouter.get('/stats', async (req, res) => {
  try {
    const allUsers = await User.find({}, 'weight bmi');
    const allWeights = allUsers.map(user => user.weight);
    const allBMIs = allUsers.map(user => user.bmi);

    const allTimeLowWeight = Math.min(...allWeights);
    const allTimeHighWeight = Math.max(...allWeights);
    const allTimeLowBMI = Math.min(...allBMIs);
    const allTimeHighBMI = Math.max(...allBMIs);

    res.json({
      allTimeLowWeight,
      allTimeHighWeight,
      allTimeLowBMI,
      allTimeHighBMI,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default arouter;
