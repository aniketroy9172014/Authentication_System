import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import cookieParser from 'cookie-parser'; //use for send cookie
import connectDB from './config/mongodb.js'; //connect database function
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
const port= 5000;
const app = express();


//Mongodb connection
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser()); //this use to parses the cookies attached to the client request object. If a request comes with Cookie: token=abc123, You can access it using this: returns "abc123"
app.use(cors({credentials: true})); // This enables Cross-Origin Resource Sharing (CORS). Required when your frontend (e.g., React app at localhost:3000) sends requests to the backend (e.g., Node.js at localhost:5000) with credentials (cookies, headers).

app.get('/', (req, res)=> res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, ()=> {
    console.log(`server started on port: http://localhost:${port}`)
});

