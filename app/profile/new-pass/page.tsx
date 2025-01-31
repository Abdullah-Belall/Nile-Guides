import NewPasswordComponent from "@/app/_components/client/Profile/new-pass";
import { BaseWebsiteLink } from "@/app/base";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Nile Guides",
  description:
    "Reset your password for your Nile Guides account. Enter your new password to regain access to your account securely.",
  keywords: [
    "reset password",
    "Nile Guides password reset",
    "forgot password",
    "account recovery",
    "secure password",
  ],
  openGraph: {
    title: "Reset Password | Nile Guides",
    description:
      "Reset your password for your Nile Guides account. Enter your new password to regain access to your account securely.",
    type: "website",
    url: BaseWebsiteLink + "/profile/new-pass",
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "Reset Password - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reset Password | Nile Guides",
    description:
      "Reset your password for your Nile Guides account. Enter your new password to regain access to your account securely.",
    images: ["/logo.ico"],
  },
};
export default function NewPassword() {
  return <NewPasswordComponent />;
}
