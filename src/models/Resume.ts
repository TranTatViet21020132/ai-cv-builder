import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { TEMPLATE_IDS } from "@/lib/validation";

/**
 * Interface for WorkExperience subdocument
 */
export interface IWorkExperience {
  position?: string;
  company?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

/**
 * Interface for Education subdocument
 */
export interface IEducation {
  degree?: string;
  school?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Interface for Resume document
 */
export interface IResume extends Document {
  _id: Types.ObjectId;
  id: string;
  userId: string;
  title?: string;
  description?: string;
  photoUrl?: string;
  colorHex?: string;
  borderStyle?: string;
  templateId?: "classic" | "modern" | "minimal" | "creative" | "professional" | "compact" | "elegant" | "tech";
  summary?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  skills?: string[];
  workExperiences?: IWorkExperience[];
  educations?: IEducation[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for WorkExperience subdocument
 */
const WorkExperienceSchema = new Schema<IWorkExperience>(
  {
    position: { type: String },
    company: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
  },
  { _id: false },
);

/**
 * Schema for Education subdocument
 */
const EducationSchema = new Schema<IEducation>(
  {
    degree: { type: String },
    school: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false },
);

/**
 * Schema for Resume document
 */
const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: { type: String },
    description: { type: String },
    photoUrl: { type: String },
    colorHex: { type: String },
    borderStyle: { type: String },
    templateId: { type: String, enum: TEMPLATE_IDS, default: "classic" },
    summary: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    jobTitle: { type: String },
    city: { type: String },
    country: { type: String },
    phone: { type: String },
    email: { type: String },
    skills: [{ type: String }],
    workExperiences: [WorkExperienceSchema],
    educations: [EducationSchema],
  },
  {
    timestamps: true,
  },
);

// Virtual field to map _id to id for compatibility
ResumeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
ResumeSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});

ResumeSchema.set("toObject", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    return ret;
  },
});

// Create indexes
ResumeSchema.index({ userId: 1, updatedAt: -1 });

/**
 * Resume model
 * Uses existing model if available to prevent recompilation errors in Next.js
 */
const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;
