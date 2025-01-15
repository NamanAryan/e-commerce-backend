import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//mongo connect
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => console.log(err));

//routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

import userRoute from './routes/userRoute.js';
app.use('/api/users', userRoute);


//server launch
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


