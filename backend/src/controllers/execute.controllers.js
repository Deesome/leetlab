import { pollBatchResults, submitBatch } from "../libs/judge0.libs.js";
import { db } from "../libs/db.js";
import { json } from "express";

const runCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_output, problemId } =
      req.body;
    const userId = req.user.id;
    console.log(source_code, language_id, stdin, expected_output, problemId);
    console.log(userId);
    if (!userId || !source_code || !problemId) {
      return res.status(400).json({
        error: "data Not correct",
      });
    }

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_output) ||
      expected_output.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));
    const runResults = await submitBatch(submissions);

    const tokens = runResults.map((res) => res.token);

    // 4. Poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    console.log("Result-------------");
    console.log(results);

    // results - array of object
    // expectedOutput : array of object

    const testResults = results.map((result, i) => {
      const passed = result.stdout.trim() === expected_output[i].trim();
      return {
        testCase: i + 1,
        passed,
        stdout: result.stdout,
        expected: expected_output[i],
        stderr: result.stderr,
        compileOutput: result.compileOutput,
        status: result.status.id,
        memory: result.memory,
        time: result.time,
      };
    });

    res.status(200).json({
      message: "Code executed",
      results: testResults,
    });

    if (!results || results.length === 0) {
      return res
        .status(500)
        .json({ error: "Failed to get results from Judge0" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const submitCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_output, problemId } =
      req.body;
    const userId = req.user.id;
    console.log(source_code, language_id, stdin, expected_output, problemId);
    console.log(userId);

    if (!userId || !source_code || !problemId) {
      return res.status(400).json({
        error: "data Not correct",
      });
    }

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_output) ||
      expected_output.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));
    const runResults = await submitBatch(submissions);

    const tokens = runResults.map((res) => res.token);

    // 4. Poll judge0 for results of all submitted test cases
    const results = await pollBatchResults(tokens);

    

    if (!results || results.length === 0) {
      return res.status(500).json({ error: "Judge0 failed to return results" });
    }

    const stdout = results.map((r) => r.stdout || ""); // array
    const stderr = results.map((r) => r.stderr || ""); //array
    const compileOutput = results.map((r) => r.compile_output || "");
    const status = results.map((r) => r.status.description || "");
    const memory = results.map((r) => r.memory.toString() || "");
    const time = results.map((r) => r.time || "");
    

    const submissionDB = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode:{source_code},
        language: language_id.toString(),
        stdin: JSON.stringify(stdin),
        stdout: JSON.stringify(stdout),
        stderr: JSON.stringify(stderr),
        compileOutput: JSON.stringify(compileOutput),
        status: JSON.stringify(status),
        memory: JSON.stringify(memory),
        time: JSON.stringify(time),
      },
    });

    if (!submissionDB) {
      return res.status(500).json({
        error: "Internal error while creating submission in database",
      });
    }

   

    // submission should be single
    // store the data in sbmission model
    // but in submission model stdin and stdout are not single , they are more then one , in db it is tring

    const testCaseResults = await Promise.all(results.map(async(result, i) => {
      const passed = result.stdout.trim() === expected_output[i].trim();

      // returning object doesnot make sense
      // create entries in DB here 
      
      return db.testCaseResult.create({
        data:{
          submissionId : submissionDB.id,
          testCase: i + 1,
          passed,
          stdout: result.stdout,
          expected: expected_output[i],
          stderr: result.stderr,
          compileOutput: result.compileOutput,
          status: result.status.description,
          memory: result.memory.toString(),
          time: result.time,

        }
        })
     
    }))

  
    if(!testCaseResults){
      return res.status(500).json({
        error : "Internal Error while save testcase result to DB"
      })
    }

    console.log("testCaseResult",testCaseResults)

    

    res.status(200).json({
      message: "Code executed",
      submissionDB,testCaseResults
    });

    if (!results || results.length === 0) {
      return res
        .status(500)
        .json({ error: "Failed to get results from Judge0" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { runCode, submitCode };
