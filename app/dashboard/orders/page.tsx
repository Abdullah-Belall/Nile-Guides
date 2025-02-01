import DashboardOrders from "@/app/_components/client/dashboard-orders";
import Reduirect from "@/app/_components/client/rediruct";
import Footer from "@/app/_components/server/footer";
import { unCountedMessage } from "@/app/_utils/interfaces/main";
import {
  DASHBOARD_ORDERS_SERVER_REQ,
  SERVER_COLLECTOR_REQ,
} from "@/app/_utils/requests/server-requests-hub";

export default async function Services({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const Unwrap = await searchParams;

  const response = await SERVER_COLLECTOR_REQ(DASHBOARD_ORDERS_SERVER_REQ, {
    params: { page: Unwrap.page },
  });

  if (response.done) {
    return (
      <>
        <div className="w-full px-mainX min-h-dvh">
          <DashboardOrders data_={response.data} />
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
