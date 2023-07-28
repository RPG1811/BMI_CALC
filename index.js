// index.js
import express from 'express';
import { connect } from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000; // You can use any port number you prefer

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
connect('mongodb+srv://Raj:Raj1811@cluster0.dsh4yfz.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
  mongoose.set('strictQuery', false);

// Routes
import Urouter from './routes/user.js'; // Update this path
import arouter from './routes/admin.js'; // Update this path

app.use('/api/user', Urouter);
app.use('/api/admin', arouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
