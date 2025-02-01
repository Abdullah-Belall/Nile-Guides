import {
  CLIENT_ORDERS_SERVER_REQ,
  SERVER_COLLECTOR_REQ,
} from "../_utils/requests/server-requests-hub";
import OrdersOrServices from "../_components/client/orders-services-profile";
import Footer from "../_components/server/footer";
import { unCountedMessage } from "../_utils/interfaces/main";

import { Metadata } from "next";
import { BaseWebsiteLink } from "../base";
import Reduirect from "../_components/client/rediruct";

export const metadata: Metadata = {
  title: "My Orders | Nile Guides",
  description:
    "View and manage your tour bookings on Nile Guides. Track your reservations and access booking details.",
  keywords: [
    "my orders",
    "Nile Guides bookings",
    "tour reservations",
    "booking history",
    "Egypt tours",
  ],
  openGraph: {
    title: "My Orders | Nile Guides",
    description:
      "View and manage your tour bookings on Nile Guides. Track your reservations and access booking details.",
    type: "website",
    url: BaseWebsiteLink + "/orders",
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "My Orders - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Orders | Nile Guides",
    description:
      "View and manage your tour bookings on Nile Guides. Track your reservations and access booking details.",
    images: ["/logo.ico"],
  },
};

export default async function Services({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const Unwrap = await searchParams;

  const response = await SERVER_COLLECTOR_REQ(CLIENT_ORDERS_SERVER_REQ, {
    params: { page: Unwrap.page },
  });
  if (response.done) {
    return (
      <>
        <div className="w-full px-mainX min-h-dvh">
          <OrdersOrServices data_={response.data} role={"client"} forP={false} />
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
