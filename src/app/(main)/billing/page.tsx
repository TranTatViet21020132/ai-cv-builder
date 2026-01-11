import connectDB from "@/lib/mongodb";
import UserSubscription from "@/models/UserSubscription";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import Stripe from "stripe";
import GetSubscriptionButton from "./GetSubscriptionButton";
import ManageSubscriptionButton from "./ManageSubscriptionButton";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  await connectDB();

  const subscriptionDoc = await UserSubscription.findById(userId);

  // Convert Mongoose document to plain object with proper serialization
  const subscription = subscriptionDoc
    ? {
        userId: subscriptionDoc.userId,
        stripeSubscriptionId: subscriptionDoc.stripeSubscriptionId,
        stripeCustomerId: subscriptionDoc.stripeCustomerId,
        stripePriceId: subscriptionDoc.stripePriceId,
        stripeCurrentPeriodEnd: subscriptionDoc.stripeCurrentPeriodEnd,
        stripeCancelAtPeriodEnd: subscriptionDoc.stripeCancelAtPeriodEnd,
      }
    : null;

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p>
        Your current plan:{" "}
        <span className="font-bold">
          {priceInfo ? (priceInfo.product as Stripe.Product).name : "Free"}
        </span>
      </p>
      {subscription ? (
        <>
          {subscription.stripeCancelAtPeriodEnd && (
            <p className="text-destructive">
              Your subscription will be canceled on{" "}
              {formatDate(subscription.stripeCurrentPeriodEnd, "MMMM dd, yyyy")}
            </p>
          )}
          <ManageSubscriptionButton />
        </>
      ) : (
        <GetSubscriptionButton />
      )}
    </main>
  );
}
