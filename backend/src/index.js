import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";


 
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{ 
    res.send("hello guys welcome to leetzone");
});

app.use("/api/v1/auth",authRoutes);

app.listen(PORT,()=>{
    console.log("server is running at : ",PORT)
});

