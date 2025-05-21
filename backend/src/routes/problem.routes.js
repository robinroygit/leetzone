
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createProblem } from "../controllers/problem.controller";


const problemRoutes = express.Router();


problemRoutes.post("/create-problem", authMiddleware,createProblem);
problemRoutes.get("/get-all-problems", authMiddleware,getAllProblems);
problemRoutes.get("/get-problems/:id", authMiddleware,getProblemsById);
problemRoutes.put("/update-problems/:id", authMiddleware,updateProblemsById);
problemRoutes.delete("/delete-problems/:id", authMiddleware,deleteProblemsById);
problemRoutes.get("/get-solved-problems/:id", authMiddleware,getAllProblemsSolvedByUser);



export default problemRoutes;