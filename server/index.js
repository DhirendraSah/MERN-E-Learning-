import express from 'express';
import dotenv from "dotenv";
import { connectDb } from './database/db.js';
import Razorpay from 'razorpay';
import cors from 'cors';

const app = express();

dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.Razorpay_key,
    key_secret: process.env.Razorpay_Secret,
     
 });

//using middleware
app.use(express.json());
app.use(cors());

const port= process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/uploads",express.static("uploads"));

//importing routes
import userRouter from './routes/user.js';
import courseRoutes from './routes/course.js';
import adminRoutes from './routes/admin.js';

//using routes
app.use("/api", userRouter);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(5000, ()=>{
    console.log(`server is running on port http://localhost:${port}`);
    connectDb()
})