import { getIdOfLanguage, submitBatch,pollBatchResults } from "../libs/judge0.libs.js";
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

    console.log("-------------")
    console.log("Submission",submissions) // array of an object

    // now send to judge0
    const submissionResults = await submitBatch(submissions);
    console.log("----------")
    console.log("submission Results", submissionResults); // array of an object [{token},{token},{token}]

    // loop through tokens
      const tokens  = submissionResults.map(res => (res.token))
      console.log("tokens",tokens) // array of token


      const results = await pollBatchResults(tokens);
      console.log("results",results) // array of an object


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

export { createProblem };
