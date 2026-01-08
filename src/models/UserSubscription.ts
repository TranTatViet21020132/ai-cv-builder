import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Interface for UserSubscription document
 */
export interface IUserSubscription extends Omit<Document, "_id"> {
  _id: string; // This will be the userId (custom string _id, not ObjectId)
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
  stripeCancelAtPeriodEnd: boolean;
}

/**
 * Schema for UserSubscription document
 */
const UserSubscriptionSchema = new Schema<IUserSubscription>(
  {
    _id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    stripePriceId: {
      type: String,
      required: true,
    },
    stripeCurrentPeriodEnd: {
      type: Date,
      required: true,
    },
    stripeCancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false, // We're manually setting _id to userId
    timestamps: false, // UserSubscription doesn't need timestamps based on Prisma schema
  },
);

// Indexes are already defined in field definitions above (index: true)
// No need to create them again with schema.index()

/**
 * UserSubscription model
 * Uses existing model if available to prevent recompilation errors in Next.js
 */
const UserSubscription: Model<IUserSubscription> =
  mongoose.models.UserSubscription ||
  mongoose.model<IUserSubscription>("UserSubscription", UserSubscriptionSchema);

export default UserSubscription;
