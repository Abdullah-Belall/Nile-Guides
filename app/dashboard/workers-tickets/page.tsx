import PostsFilterBar from "@/app/_components/client/posts-filterbar";
import Reduirect from "@/app/_components/client/rediruct";
import TicketsDashboard from "@/app/_components/client/tickets-dashboard";
import Footer from "@/app/_components/server/footer";
import { unCountedMessage } from "@/app/_utils/interfaces/main";
import {
  DASHBOARD_USERS_TICKETS_SERVER_REQ,
  SERVER_COLLECTOR_REQ,
} from "@/app/_utils/requests/server-requests-hub";

export default async function ClientsTickets({
  searchParams,
}: {
  searchParams: Promise<{ page: number; status: string }>;
}) {
  const response = await SERVER_COLLECTOR_REQ(DASHBOARD_USERS_TICKETS_SERVER_REQ, {
    params: searchParams,
    role: "workers",
  });
  if (response.done) {
    return (
      <>
        <div className="relative px-mainX min-h-dvh w-full">
          <PostsFilterBar param={"Active"} />
          <div className="w-full flex flex-wrap gap-3 mt-2">
            <TicketsDashboard data={response.data} currentUserRole="admin" />
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
