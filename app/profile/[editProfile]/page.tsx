import EditProfileComponent from "@/app/_components/client/Profile/edit-profile";
import { BaseWebsiteLink } from "@/app/base";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile | Nile Guides",
  description:
    "Update your personal information on Nile Guides, including your name, gender, age, and other details. Keep your profile up-to-date for a better experience.",
  keywords: [
    "edit profile",
    "update profile",
    "Nile Guides profile",
    "personal information",
    "user settings",
  ],
  openGraph: {
    title: "Edit Profile | Nile Guides",
    description:
      "Update your personal information on Nile Guides, including your name, gender, age, and other details. Keep your profile up-to-date for a better experience.",
    type: "website",
    url: BaseWebsiteLink + "/profile",
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "Edit Profile - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edit Profile | Nile Guides",
    description:
      "Update your personal information on Nile Guides, including your name, gender, age, and other details. Keep your profile up-to-date for a better experience.",
    images: ["/logo.ico"],
  },
};
export default function EditProfile({ params }: any) {
  return <EditProfileComponent params={params} />;
}
