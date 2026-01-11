import { ResumeValues } from "./validation";

// No longer needed with embedded documents in MongoDB, but kept for compatibility
export const resumeDataInclude = {};

// Type alias for resume data from the server
export type ResumeServerData = {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  photoUrl?: string;
  colorHex?: string;
  borderStyle?: string;
  templateId?: string;
  summary?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  skills?: string[];
  workExperiences?: Array<{
    position?: string;
    company?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
  }>;
  educations?: Array<{
    degree?: string;
    school?: string;
    startDate?: Date;
    endDate?: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

// Helper type for resume data with string dates (for client-side usage)
export type ResumeClientData = Omit<
  ResumeServerData,
  "createdAt" | "updatedAt" | "workExperiences" | "educations"
> & {
  createdAt: string;
  updatedAt: string;
  workExperiences?: Array<{
    position?: string;
    company?: string;
    startDate?: string | null;
    endDate?: string | null;
    description?: string;
  }>;
  educations?: Array<{
    degree?: string;
    school?: string;
    startDate?: string | null;
    endDate?: string | null;
  }>;
};

// Type for editor form props
export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
}

// Type for user subscription data
export interface UserSubscription {
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
  stripeCancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription levels
export type SubscriptionLevel = "free" | "pro" | "pro_plus";
