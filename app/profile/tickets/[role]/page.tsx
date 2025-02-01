import PostsFilterBar from "@/app/_components/client/posts-filterbar";
import Reduirect from "@/app/_components/client/rediruct";
import TicketsDashboard from "@/app/_components/client/tickets-dashboard";
import Footer from "@/app/_components/server/footer";
import { unCountedMessage } from "@/app/_utils/interfaces/main";
import {
  SERVER_COLLECTOR_REQ,
  TICKETS_SERVER_REQ,
} from "@/app/_utils/requests/server-requests-hub";
import { BaseWebsiteLink } from "@/app/base";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tickets | Nile Guides",
  description:
    "View and manage your support tickets on Nile Guides. Submit new tickets for any issues or inquiries, and track their status with the admin team.",
  keywords: [
    "support tickets",
    "Nile Guides tickets",
    "contact support",
    "issue resolution",
    "help center",
  ],
  openGraph: {
    title: "Tickets | Nile Guides",
    description:
      "View and manage your support tickets on Nile Guides. Submit new tickets for any issues or inquiries, and track their status with the admin team.",
    type: "website",
    url: BaseWebsiteLink + "/profile",
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "Tickets - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tickets | Nile Guides",
    description:
      "View and manage your support tickets on Nile Guides. Submit new tickets for any issues or inquiries, and track their status with the admin team.",
    images: ["/logo.ico"],
  },
};
export default async function UsersTickets({
  params,
  searchParams,
}: {
  params: Promise<{ role: "client" | "worker" }>;
  searchParams: Promise<{ page: number; status: string }>;
}) {
  const unWrap = await params;
  const response = await SERVER_COLLECTOR_REQ(TICKETS_SERVER_REQ, {
    type: `${unWrap.role}s`,
    params: await searchParams,
  });
  if (response.done) {
    return (
      <>
        <div className="relative px-mainX min-h-dvh w-full">
          <PostsFilterBar param={"Compleded"} />
          <div className="w-full flex flex-wrap gap-3 mt-2">
            <TicketsDashboard data={response.data} currentUserRole="client" />
          </div>
        </div>
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
