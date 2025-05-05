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



export {getAllSubmissions}