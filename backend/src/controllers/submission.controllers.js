import { db } from "../libs/db.js"

const getAllSubmissions = async(req,res)=>{
    // user must be login 
    // get all the submission for current user login
    // send it to the response

    const userId = req.user.id
    console.log(userId)

    if(!userId){
        return res.status(403).json({
            error : "User not allowed, You must login first"
        })
    }

   try {
     const allSubmissions = await db.submission.findMany({
         where :{
             userId
         }
     })
 
     return res.status(200).json({
         success : true,
         message : "All submission fetched Successfully",
         allSubmissions
     })
   } catch (error) {
    console.error("Fetch Submissions Error:", error);
    res.status(500).json({ error: "Failed to fetch submissions" })
    
   }

}

const getSubmissionForProblem = async(req,res)=>{
    // user must be login
    // get problemid from params
    //search the submission on the basis of problemid
    // send back the response 

    const userId = req.user.id
    const problemId = req.params.problemId

    if(!userId){
        return res.status(403).json({
            error : "User not allowed, You must login first"
        })
    }

    if(!problemId){
        return res.status(400).json({
            error : " ProblemId is required"
        })
    }

   try {
     const submissionsForProblem = await db.submission.findMany({
         where : {
             userId,
             problemId
         }
     })

      res.status(200).json({
            success:true,
            message:"Submissions for problem fetched successfully",
            submissionsForProblem
      })
   } catch (error) {
        console.error("Fetch Submissions Error:", error);
        res.status(500).json({ error: "Failed to fetch submissions for problem" });
    
   }




}

const getSubmissionCountForProblem = async(req,res) =>{
    const userId = req.user.id
    const problemId = req.params.problemId

    if(!userId){
        return res.status(403).json({
            error : "User not allowed, You must login first"
        })
    }

    if(!problemId){
        return res.status(400).json({
            error : " ProblemId is required"
        })
    }

    try {
        const submissionCount = await db.submission.count({
            where : {
                userId,
                problemId
            }
        })

        res.status(200).json({
            success:true,
            message:"SubmissionCount Fetched successfully",
            count:submissionCount
        })
        
    } catch (error) {
        console.error("Fetch SubmissionCount Error:", error);
        res.status(500).json({ error: "Failed to fetch submissionCount" });
        
    }
}



export {getAllSubmissions,getSubmissionForProblem,getSubmissionCountForProblem}