import { db } from "../libs/db.js"
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req,res) => {
    //get all the from request body
    const {title,description,difficulty,tags,example,constraints, testcases, codesnippets, referencesolutions  } = req.body;

    //check user role once again 
    if(req.user.role!=="ADMIN"){
        return res.status(403).json({message:"you are not allowed to create a problem"})
    }
    //loop through each reference solutions for diff language
    try {
        for(const [language,solutionCode] of Object.entries(referencesolutions)){

            const languageId = getJudge0LanguageId(language);
            
            
            if(!language){
               return res.status(400).json({error:`Language ${language} is not supported`}); 
            }

            const submissions = testcases.map(({input,output})=>({
                source_code : solutionCode,
                language_id : languageId,
                stdin : input,
                expected_output : output                
            }))

            console.log(submissions)
            
            const submissionResults  = await submitBatch(submissions)
            
            
            const tokens = submissionResults.map((res)=>res.token)
            

            const results = await pollBatchResults(tokens)

            
            for(let i=0;i<results.length; i++){

                const result = results[i];



                if(result.status.id!==3){
                    return res.status(400).json({error:`Testcase ${i+1} failed for language ${language}`})
                }

            }

            const newProblem = await db.problem.create({
                data:{
                    title, description, difficulty, tags, example, constraints, testcases, codesnippets, referencesolutions,userId:req.user.id
                }
            })

            res.status(201).json({
                message:"problem created successfully!",
                success:true,
                data:newProblem
            })
        }
    } catch (error) {
        
    }


} 
export const getAllProblems = async (req,res) => {} 
export const getProblemsById = async (req,res) => {} 
export const updateProblemsById = async (req,res) => {} 
export const deleteProblemsById = async (req,res) => {} 
export const getAllProblemsSolvedByUser = async (req,res) => {} 