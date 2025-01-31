import VerifyEmailComponent from "@/app/_components/client/Auth/Signup/verify-email";
import { BaseWebsiteLink } from "@/app/base";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | Nile Guides",
  description:
    "Verify your email address to complete your registration on Nile Guides. Enter the verification code sent to your email to confirm your account.",
  keywords: [
    "verify email",
    "Nile Guides verification",
    "confirm account",
    "email verification",
    "Nile Guides sign up",
  ],
  openGraph: {
    title: "Verify Email | Nile Guides",
    description:
      "Verify your email address to complete your registration on Nile Guides. Enter the verification code sent to your email to confirm your account.",
    type: "website",
    url: BaseWebsiteLink + "/sign-up",
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "Verify Email - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify Email | Nile Guides",
    description:
      "Verify your email address to complete your registration on Nile Guides. Enter the verification code sent to your email to confirm your account.",
    images: ["/logo.ico"],
  },
};
export default function page() {
  return <VerifyEmailComponent />;
}
