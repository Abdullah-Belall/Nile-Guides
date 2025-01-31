import WorkerPostsProfile from "../_components/client/worker-posts-profile";
import Footer from "../_components/server/footer";
import { unCountedMessage } from "../_utils/interfaces/main";
import {
  SERVER_COLLECTOR_REQ,
  WORKERS_POSTS_SERVER_REQ,
} from "../_utils/requests/server-requests-hub";
import { Metadata } from "next";
import { BaseWebsiteLink } from "../base";
import Reduirect from "../_components/client/rediruct";

export const metadata: Metadata = {
  title: "My Posts | Nile Guides",
  description:
    "View and manage your posts on Nile Guides. Track the performance of your tours and services, and make updates as needed.",
  keywords: ["my posts", "worker posts", "Nile Guides posts", "manage tours", "service updates"],
  openGraph: {
    title: "My Posts | Nile Guides",
    description:
      "View and manage your posts on Nile Guides. Track the performance of your tours and services, and make updates as needed.",
    type: "website",
    url: BaseWebsiteLink + "/posts",
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "My Posts - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Posts | Nile Guides",
    description:
      "View and manage your posts on Nile Guides. Track the performance of your tours and services, and make updates as needed.",
    images: ["/logo.ico"],
  },
};
export default async function Posts() {
  const response = await SERVER_COLLECTOR_REQ(WORKERS_POSTS_SERVER_REQ);
  if (response.done) {
    return (
      <>
        <WorkerPostsProfile data={response.data} />
        <Footer />
      </>
    );
  } else {
    return response.status === 401 ? (
      <Reduirect reduirectTo="/log-in" />
    ) : (
      <h1 className="text-maindark mx-auto">{unCountedMessage}</h1>
    );
  }
}
