import OrderNowComponent from "@/app/_components/client/Posts/order";
import { BaseWebsiteLink } from "@/app/base";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Tour | Nile Guides",
  description:
    "Book your favorite tours with Nile Guides. Choose from a variety of tours and experiences offered by professional guides.",
  keywords: [
    "book tour",
    "Nile Guides booking",
    "tour reservation",
    "Egypt tours",
    "travel booking",
  ],
  openGraph: {
    title: "Book a Tour | Nile Guides",
    description:
      "Book your favorite tours with Nile Guides. Choose from a variety of tours and experiences offered by professional guides.",
    type: "website",
    url: BaseWebsiteLink,
    images: [
      {
        url: "/logo.ico",
        width: 1200,
        height: 630,
        alt: "Book a Tour - Nile Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book a Tour | Nile Guides",
    description:
      "Book your favorite tours with Nile Guides. Choose from a variety of tours and experiences offered by professional guides.",
    images: ["/logo.ico"],
  },
};
export default function OrderNow() {
  return <OrderNowComponent />;
}
