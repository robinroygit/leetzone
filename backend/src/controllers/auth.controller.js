
import bcrypt from "bcryptjs";
import {db} from "../libs/db.js"
import { userRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"

export const register = async (req,res)=>{
    
    const {email,password,name} = req.body;

    try {
        const existingUser = await db.user.findUnique({ 
            where:{email}
        })

        if(existingUser){
            return res.status(400).json({error:"user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await db.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
                role: userRole.USER
            }
        })

        const token = jwt.sign({id:newUser.id},process.env.JWT_SECRET,{
            expiresIn: "7d"
        })

        res.cookie("jwt",token,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV!=='development',
            maxAge:1000*60*60*24*7
        })

        res.status(201).json({
            message:"user created successfully",
            user:{
                id:newUser.id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role, 
                image:newUser.image
            }
        })

    } catch (error) {

        console.error("error creating user",error);
        res.status(500).json({
            error:"error creating user"
        })
        
    }


}

export const login = async (req,res)=>{

    const {email,password} = req.body;

    try {
        const user = await db.user.findUnique({
            where:{email}
        })

        if(!user){
            return res.status(401).json({
                error:"User not found!"
            })
        }

        const isMatched = await bcrypt.compare(password,user.password);

        if(!isMatched){
            return res.status(401).json({
               error:"invalid credentials" 
            })
        }

        const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{
           expiresIn:"7d" 
        })

        res.cookie("jwt",token,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV!=='development',
            maxAge:1000*60*60*24*7
        }) 

        res.status(201).json({
            message:"user logged in successfully",
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role, 
                image:user.image
            }
        })

    } catch (error) {
        console.error("error logging in user",error);
        res.status(500).json({
            error:"error logging in user"
        })
    }
}

export const logout = async (req,res)=>{}

export const check = async (req,res)=>{}

