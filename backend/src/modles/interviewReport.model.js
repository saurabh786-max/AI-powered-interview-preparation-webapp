import mongoose from "mongoose";

// Technical Questions
const technicalQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

// Behavioral Questions
const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

// Skill Gaps
const skillGapsSchema = new mongoose.Schema(
  {
    skill: { type: String, required: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
  },
  { _id: false }
);

// Preparation Plan
const preparationPlanSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    focusedArea: { type: String, required: true },
    tasks: [{ type: String, required: true }],
  },
  { _id: false }
);

// Main Schema
const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: { type: String, required: true },
    resume: String,
    selfDescription: String,
    matchScore: { type: Number, min: 0, max: 100 },

    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapsSchema],
    preparationPlan: [preparationPlanSchema],
  },
  { timestamps: true }
);

export const InterviewReport = mongoose.model(
  "InterviewReport",
  interviewReportSchema
);