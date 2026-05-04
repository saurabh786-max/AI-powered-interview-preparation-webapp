import { GoogleGenAI } from "@google/genai";
import z from 'zod'
import zodToJsonSchema from "zod-to-json-schema";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore:z.number().describe("the match score between the candidate and the job description"),
    technicalQuestions:z.array(z.object({
        question:z.string().describe("the technical question asked during the interview"),
        intention:z.string().describe("the intention behind asking the technical question"),
        answer:z.string().describe("the answer provided by the candidate")
    })),
    behavioralQuestions:z.array(z.object({
        question:z.string().describe("the behavioral question asked during the interview"),
        intention:z.string().describe("the intention behind asking the behavioral question"),
        answer:z.string().describe("the answer provided by the candidate")
    })),
    skillGaps:z.array(z.object({
        skill:z.string().describe("the skill gap identified during the interview"),
        severity:z.enum(["low","medium","high"]).describe("the severity of the skill gap")})),
    preparationPlan:z.array(z.object({
        day:z.number().describe("the day number in the preparation plan"),
        focusedArea:z.string().describe("the focused area for that day"),
        tasks:z.array(z.string()).describe("the tasks to be completed on that day")
    }))    


})

async function generateInterviewReport({resume,selfDescription,jobDescription}){
    const prompt =  `
You are an AI that ONLY returns valid JSON.

Generate an interview report STRICTLY in this format:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focusedArea": string,
      "tasks": string[]
    }
  ]
}

IMPORTANT:
- Return ONLY JSON
- No explanation
- No extra fields

DATA:
resume: ${resume}
selfDescription: ${selfDescription}
jobDescription: ${jobDescription}
`

    const response = await ai.models.generateContent({
        model:"gemini-2.0-flash",
        contents:prompt,
        config:{
            responseMimeType:"application/json",
            responseJsonSchema:zodToJsonSchema(interviewReportSchema)
        }
        })
        const recipe = interviewReportSchema.parse(JSON.parse(response.text));
        console.log(recipe)

}
export default generateInterviewReport;