import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"



dotenv.config()


const app = express()
const port = process.env.PORT || 8080

app.use(express.json())
app.use(cookieParser())


app.get("/",(req,res)=>{
    res.send("Welcome to LEETLAB🔥")
})

// import routes 
import authRouter from "./routes/auth.route.js"

app.use("/api/v1/user",authRouter)




app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
