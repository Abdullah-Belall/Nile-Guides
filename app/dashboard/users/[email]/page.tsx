import PostsSecDashboard from "@/app/_components/client/posts-sec-dashboard";
import TicketsCard from "@/app/_components/templates/tickets-card";
import UserPageDashbord from "@/app/_components/client/user-page-dashboard";
import styles from "@/app/ui/admins-user-tickets.module.css";
import {
  DASHBOARD_ONE_USER_SERVER_REQ,
  DASHBOARD_USER_TICKETS_SERVER_REQ,
  SERVER_COLLECTOR_REQ,
} from "@/app/_utils/requests/server-requests-hub";
import { unCountedMessage } from "@/app/_utils/interfaces/main";
import Reduirect from "@/app/_components/client/rediruct";
export default async function PostPage({ params }: { params: Promise<{ email: string }> }) {
  const unWrap = await params;
  const user_email = unWrap?.email?.split("%40").join("@");
  const userDataResponse = await SERVER_COLLECTOR_REQ(DASHBOARD_ONE_USER_SERVER_REQ, {
    body: { user_email },
  });
  const rolesTickets = ["client", "worker"];
  const userRole = userDataResponse?.data?.role;
  const ticketsResponse = rolesTickets.includes(userRole)
    ? await SERVER_COLLECTOR_REQ(DASHBOARD_USER_TICKETS_SERVER_REQ, {
        data: { user_email, role: userRole },
      })
    : null;
  if (userDataResponse.done) {
    return (
      <div className="w-full flex flex-col pb-4 gap-2 px-mainX">
        <div
          className={`${
            !rolesTickets.includes(userRole) ? "justify-center" : "lg:flex-row"
          } w-full flex flex-col gap-2`}
        >
          <UserPageDashbord data={userDataResponse.data} />
          {ticketsResponse && (
            <div className="w-full min-h-[150px] relative">
              <span className="bg-gradient-to-b from-[#AE9460] to-[#cdbc9a] w-full font-bold text-mainlight bg-maindark text-center rounded-md block mb-1 py-2">
                Tickets
              </span>
              <div
                className={
                  styles.orders +
                  " pr-1 flex flex-col lg:flex-row lg:flex-wrap gap-2 h-[calc(100dvh-154px)] overflow-y-scroll"
                }
              >
                {ticketsResponse.data?.total != 0 ? (
                  ticketsResponse.data.data.map((e: any, i: any) => (
                    <div key={i} className="w-full lg:w-[calc(50%-.25rem)]">
                      <TicketsCard
                        ticketId={e.id}
                        role={"client"}
                        userEmail={e.client?.email ?? e.worker?.email}
                        userName={
                          e.client?.first_name ??
                          e.worker?.first_name + " " + e.client?.last_name ??
                          e.worker?.last_name
                        }
                        title={e.subject}
                        body={e.body}
                        image1={e.image1}
                        image2={e.image2}
                        image3={e.image3}
                        status={e.status}
                        date={e.created_at}
                      />
                    </div>
                  ))
                ) : (
                  <h1 className="text-nowrap absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-fit bg-seclight mx-auto py-3 px-5 rounded-md font-semibold">
                    There is no Tickets
                  </h1>
                )}
              </div>
            </div>
          )}
        </div>
        {userRole && userRole === "worker" && (
          <PostsSecDashboard email={userDataResponse.data.email} />
        )}
      </div>
    );
  } else {
    return userDataResponse.status === 401 ? (
      <Reduirect reduirectTo="/log-in" />
    ) : (
      <h1 className="text-maindark mx-auto">{unCountedMessage}</h1>
    );
  }
}
