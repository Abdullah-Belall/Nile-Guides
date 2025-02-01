import PostPage from "@/app/_components/templates/post-page";
import PostPageSkeleton from "@/app/_components/skeletons/post-page";
import { GET_POST_SERVER_REQ } from "@/app/_utils/requests/server-requests-hub";
import { Metadata } from "next";
import { BaseWebsiteLink } from "@/app/base";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const response = await GET_POST_SERVER_REQ({ id: (await params).id });

  if (!response.done) {
    return {
      title: "Post Not Found | Nile Guides",
      description: "The post you are looking for does not exist.",
    };
  }

  const post = response.data;

  return {
    title: `${post.title} | Nile Guides`,
    description:
      post.description ||
      "Explore this post on Nile Guides to discover amazing tours and services.",
    keywords: ["Nile Guides", "tour post", "Egypt tours", post.title, post.category],
    openGraph: {
      title: `${post.title} | Nile Guides`,
      description:
        post.description ||
        "Explore this post on Nile Guides to discover amazing tours and services.",
      type: "article",
      url: BaseWebsiteLink + `/posts/${(await params).id}`,
      images: [
        {
          url: post.image || "/logo.ico",
          width: 1200,
          height: 630,
          alt: post.title || "Nile Guides Post",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Nile Guides`,
      description:
        post.description ||
        "Explore this post on Nile Guides to discover amazing tours and services.",
      images: [post.image || "/logo.ico"],
    },
  };
}

export default async function MainPostPage({ params }: Props) {
  const response = await GET_POST_SERVER_REQ({ id: (await params).id });
  if (response.done) {
    return <PostPage data={response.data} />;
  } else {
    return <PostPageSkeleton />;
  }
}
