import ConfirmOrderComponent from "@/app/_components/client/Posts/confirm-order";
import { BaseWebsiteLink } from "@/app/base";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Booking | Nile Guides",
  description:
    "Complete your tour booking on Nile Guides. Confirm your reservation and proceed with secure payment options.",
  keywords: [
    "confirm booking",
    "Nile Guides payment",
    "tour reservation",
    "secure payment",
    "Egypt tours",
  ],
  openGraph: {
    title: "Confirm Booking | Nile Guides",
    description:
      "Complete your tour booking on Nile Guides. Confirm your reservation and proceed with secure payment options.",
    type: "website",
    url: BaseWebsiteLink,
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "Confirm Booking - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Confirm Booking | Nile Guides",
    description:
      "Complete your tour booking on Nile Guides. Confirm your reservation and proceed with secure payment options.",
    images: ["/logo.ico"],
  },
};
export default function ConfirmOrder({ params }: any) {
  return <ConfirmOrderComponent params={params} />;
}
