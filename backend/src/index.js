import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"



dotenv.config()


const app = express()
const port = process.env.PORT || 8080

app.use(express.json())
app.use(cookieParser())




// import routes 
import authRouter from "./routes/auth.route.js"
import problemRouter from "./routes/problem.route.js"
import executeRouter from "./routes/execute.route.js"
import submissionsRouter from "./routes/submission.routes.js"
import playlistRouter from "./routes/playlist.routes.js"

app.use("/api/v1/user",authRouter)
app.use("/api/v1/problem",problemRouter)
app.use("/api/v1/run",executeRouter)
app.use("/api/v1/submissions",submissionsRouter)
app.use("/api/v1/playlist",playlistRouter)




app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
