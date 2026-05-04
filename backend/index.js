import app from "./app.js";
import connectDB from "./src/db/db.js";
import generateInterviewReport from "./src/services/ai.service.js";
import invokeGeminiAi from "./src/services/ai.service.js";
import {jobDescription,resume,selfDescription} from "./src/services/temp.data.js"

// generateInterviewReport({resume,selfDescription,jobDescription})
connectDB()
.then(
    
app.listen(process.env.port || 5000, ()=>{
    console.log(`app is listing on the port : ${process.env.PORT}`)
})
)
.catch((err)=>{
    console.log("MONGODB connection failed !!! ",err);
})

