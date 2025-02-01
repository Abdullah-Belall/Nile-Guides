import MainSecProfile from "../_components/server/main-sec-profile";
import OrdersOrServices from "../_components/client/orders-services-profile";
import WorkerAnalysis from "../_components/client/worker-analysis-profile";
import {
  CLIENT_ORDERS_SERVER_REQ,
  PROFILE_SERVER_REQ,
  SERVER_COLLECTOR_REQ,
  WORKERS_SERVICES_SERVER_REQ,
} from "../_utils/requests/server-requests-hub";
import Footer from "../_components/server/footer";
import Reduirect from "../_components/client/rediruct";

import { Metadata } from "next";
import { unCountedMessage } from "../_utils/interfaces/main";
import { BaseWebsiteLink } from "../base";

export async function generateMetadata(): Promise<Metadata> {
  let role: any;
  const ProfileResponse = await SERVER_COLLECTOR_REQ(PROFILE_SERVER_REQ);
  if (ProfileResponse.done) {
    role = ProfileResponse.data.role;
  }
  const user = await ProfileResponse?.data;
  const roleTitle = role === "client" ? "Client" : role === "worker" ? "Tour Guide" : "Admin";

  const roleDescription =
    role === "client"
      ? `Explore your bookings and manage your profile on Nile Guides.`
      : role === "worker"
      ? `Discover amazing tours with ${user?.first_name}, an expert tour guide on Nile Guides. Check availability and book your next adventure now!`
      : `Manage and oversee operations on Nile Guides.`;

  return {
    title: `${user?.first_name} ${user?.last_name} | ${roleTitle} on Nile Guides`,
    description: roleDescription,
    openGraph: {
      title: `${user?.first_name} | ${roleTitle} on Nile Guides`,
      description: roleDescription,
      url: BaseWebsiteLink + `/profile`,
      siteName: "Nile Guides",
      images: [
        {
          url: process.env.NEXT_PUBLIC_BACKEND_URL + user?.avatar || "/logo.ico",
          width: 800,
          height: 800,
          alt: `${user?.first_name}'s Profile Picture`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${user?.first_name} | ${roleTitle} on Nile Guides`,
      description: roleDescription,
      images: [user?.avatar || "/logo.ico"],
    },
  };
}

export default async function Profile() {
  let role: any;
  const ProfileResponse = await SERVER_COLLECTOR_REQ(PROFILE_SERVER_REQ);
  if (ProfileResponse.done) {
    role = ProfileResponse.data.role;
  }
  let data;
  const AllowedRoles = ["client", "worker"];
  if (AllowedRoles.includes(role)) {
    const dataResponse =
      role === "client"
        ? await SERVER_COLLECTOR_REQ(CLIENT_ORDERS_SERVER_REQ)
        : await SERVER_COLLECTOR_REQ(WORKERS_SERVICES_SERVER_REQ);
    if (dataResponse.done) {
      data = dataResponse.data;
    }
  }
  if (ProfileResponse.done) {
    return (
      <>
        <section className="min-h-[calc(100dvh-94px)] px-mainX pt-4 antialiased w-full bg-anotherLight">
          <div className="pt-4">
            <MainSecProfile ProfileResponse={ProfileResponse} />
            {ProfileResponse?.data?.role === "worker" && <WorkerAnalysis />}
            {AllowedRoles.includes(role) && (
              <OrdersOrServices data_={data} role={role} forP={true} />
            )}
          </div>
        </section>
        <Footer />
      </>
    );
  } else {
    return ProfileResponse.status === 401 ? (
      <Reduirect reduirectTo="/log-in" />
    ) : (
      <h1 className="text-maindark mx-auto">{unCountedMessage}</h1>
    );
  }
}
