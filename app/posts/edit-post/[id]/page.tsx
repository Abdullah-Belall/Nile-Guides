import UpdatePostComponent from "@/app/_components/client/Posts/edit-post";
import { BaseWebsiteLink } from "@/app/base";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Post | Nile Guides",
  description:
    "Edit and update your post on Nile Guides. Modify details, images, and descriptions to keep your tours and services up-to-date.",
  keywords: ["update post", "edit post", "Nile Guides post", "modify tours", "worker dashboard"],
  openGraph: {
    title: "Update Post | Nile Guides",
    description:
      "Edit and update your post on Nile Guides. Modify details, images, and descriptions to keep your tours and services up-to-date.",
    type: "website",
    url: BaseWebsiteLink + "/posts",
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "Update Post - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Update Post | Nile Guides",
    description:
      "Edit and update your post on Nile Guides. Modify details, images, and descriptions to keep your tours and services up-to-date.",
    images: ["/logo.ico"],
  },
};
export default function UpdatePost({ params }: { params: { id: any } }) {
  return <UpdatePostComponent params={params} />;
}
