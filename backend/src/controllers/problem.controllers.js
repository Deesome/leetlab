import {
  getIdOfLanguage,
  submitBatch,
  pollBatchResults,
} from "../libs/judge0.libs.js";
import { db } from "../libs/db.js";

const createProblem = async (req, res) => {
  // get all the data from body
  // check for user role (should be an admin) // double check for safety
  //loop through each reference solution

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    testcases,
    codeSnippets,
    constraints,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access Denied- admins only",
    });
  }

  // reference solution
  /*
 {
    PYTHON : "referenceSolution",
    JAVA : "referenceSolution",
    JAVASCRIPT : "referenceSolution"

 }
*/

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      console.log("language", language);
      console.log("solution", solutionCode);
      console.log("---------------------");

      const languageId = await getIdOfLanguage(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ message: `Language ${language} is not supported` });
      }

      // ready submission
      const submissions = testcases.map((testcase) => {
        const { input, output } = testcase;
        return {
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        };
      });

      console.log("-------------");
      console.log("Submission", submissions); // array of an object

      // now send to judge0
      const submissionResults = await submitBatch(submissions);
      console.log("----------");
      console.log("submission Results", submissionResults); // array of an object [{token},{token},{token}]

      // loop through tokens
      const tokens = submissionResults.map((res) => res.token);
      console.log("tokens", tokens); // array of token

      const results = await pollBatchResults(tokens);
      console.log("results", results); // array of an object

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);
        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      sucess: true,
      message: "Message Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

const getAllProblems = async (req, res) => {
  // get all the problems from database

  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(400).json({
        message: "no problem found",
      });
    }

    return res.status(200).json({
      sucess: true,
      message: "Problems fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problems",
    });
  }
};

const getProblemById = async (req, res) => {
  console.log("get problem by id")
  const { problemId } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(400).json({
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully Fetched Problem by ID",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problem by ID",
    });
  }
};

const updateProblemById = async (req, res) => {
  // get the problemId from req.params
  //  get all the fields from body
  //  At Frontend , all the filed will be prefilled
  // now same as create Problem

  const { problemId } = req.params;
 

  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(400).json({
        message: "Problem not found",
      });
    }

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      testcases,
      codeSnippets,
      constraints,
      referenceSolutions,
    } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access Denied- admins only",
      });
    }

    // refernceSolution : it is an object that contains language and its solution
    // so we need to extract the language and its specific solutiion

    for(const[language,solutionCode] of Object.entries(referenceSolutions)){
      // now get the languageID so that we can send it to judge0

      const languageId = await getIdOfLanguage(language)

      if(!languageId){
        return res.status(400).json({
          message : `Language ${language} is not supported`
        })
      }

      // now prepare the submission 

      const submissions = testcases.map(testcase => {
        const {input,output} = testcase

        return {
          source_code : solutionCode,
          language_id  : languageId,
          stdin : input,
          expected_output : output
        }
      })

      // now send this submissions to judge0

      const submissionResults = await submitBatch(submissions) //tokens

      if(!submissionResults){
        return res.status(400).json({
          message : "Error in handling submissionResults by JUDGE0"
        })
      }

      const tokens = submissionResults.map((res)=> res.token)
      console.log("tokens",tokens)

      const results = await pollBatchResults(tokens)

      for(let i = 0 ; i<results.length; i++){
        const result = results[i]

        if(result.status.id !== 3){
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const updatedProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        userId: req.user.id,
      },
    })

    return res.status(200).json({
      sucess: true,
      message: "Problem Updated Successfully",
      problem: updatedProblem
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Updating Problem",
    });
  }
};

const deleteProblem = async (req, res) => {
  const { problemId } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(400).json({
        message: "Problem does not exist",
      });
    }

    await db.problem.delete({
      where: {
        id: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While deleting the problem",
    });
  }
};

const getAllProblemSolvedByUser = async(req,res)=>{
  console.log("Enter here")
  try {
    const problems = await db.problem.findMany({
      where:{
        solvedBy:{
          some:{
            userId:req.user.id
          }
        }
      },
      include:{
        solvedBy:{
          where:{
            userId:req.user.id
          }
        }
      }
    })

    console.log("Problem",problems)

    res.status(200).json({
      success:true,
      message:"Solved Problem fetched successfully",
      problems
    })
  } catch (error) {
    console.error("Error fetching Solved problems :" , error);
    res.status(500).json({error:"Failed to fetch Solved problems"})
  }

}

export { createProblem, getAllProblems, getProblemById,updateProblemById,deleteProblem,getAllProblemSolvedByUser };
