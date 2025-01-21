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
import userRoute from './routes/userRoute.js';
import cartRoute from './routes/cartRoute.js';

app.get('/', (req, res) => {
  res.send(`Sever running at Port ${process.env.PORT}!`);
});

app.use('/api/users', userRoute);
app.use('/api/cart', cartRoute);


//server launch
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


