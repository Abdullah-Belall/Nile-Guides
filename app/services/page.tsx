import {
  SERVER_COLLECTOR_REQ,
  WORKERS_SERVICES_SERVER_REQ,
} from "../_utils/requests/server-requests-hub";
import OrdersOrServices from "../_components/client/orders-services-profile";
import Footer from "../_components/server/footer";
import { unCountedMessage } from "../_utils/interfaces/main";
import { Metadata } from "next";
import { BaseWebsiteLink } from "../base";
import Reduirect from "../_components/client/rediruct";

export const metadata: Metadata = {
  title: "My Services | Nile Guides",
  description:
    "Manage and view the services you have provided to clients on Nile Guides. Track your bookings and improve your offerings.",
  keywords: [
    "manage services",
    "worker dashboard",
    "Nile Guides services",
    "tourism services",
    "bookings",
  ],
  openGraph: {
    title: "My Services | Nile Guides",
    description:
      "Manage and view the services you have provided to clients on Nile Guides. Track your bookings and improve your offerings.",
    type: "website",
    url: BaseWebsiteLink + "/services",
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "My Services - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Services | Nile Guides",
    description:
      "Manage and view the services you have provided to clients on Nile Guides. Track your bookings and improve your offerings.",
    images: ["/logo.ico"],
  },
};

export default async function Services({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const Unwrap = await searchParams;
  const response = await SERVER_COLLECTOR_REQ(WORKERS_SERVICES_SERVER_REQ, {
    params: { page: Unwrap.page },
  });
  if (response.done) {
    return (
      <>
        <div className="w-full px-mainX min-h-dvh">
          <OrdersOrServices data_={response.data} role={"worker"} forP={false} />
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
