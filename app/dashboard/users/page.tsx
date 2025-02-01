import Reduirect from "@/app/_components/client/rediruct";
import UsersDashboard from "@/app/_components/client/users-dashboard";
import UsersFilterBar from "@/app/_components/client/users-filterbar";
import UsersSearch from "@/app/_components/client/users-search";
import { unCountedMessage } from "@/app/_utils/interfaces/main";
import {
  DASHBOARD_USERS_SERVER_REQ,
  SERVER_COLLECTOR_REQ,
} from "@/app/_utils/requests/server-requests-hub";
export default async function Users({
  searchParams,
}: {
  searchParams: Promise<{ type: string; gender: string; minAge: number }>;
}) {
  const type = (await searchParams).type || "clients";
  const response = await SERVER_COLLECTOR_REQ(DASHBOARD_USERS_SERVER_REQ, {
    params: { ...searchParams, type },
  });
  if (response.done) {
    return (
      <div className="relative w-full min-h-[calc(100dvh-94px)] px-mainX">
        <UsersFilterBar />
        <div className="w-full max-w-sm min-w-[200px] ml-auto mt-3">
          <UsersSearch />
        </div>
        {!response.data.data || response.data.total == 0 ? (
          <h1
            className={`absolute left-[50%] top-[55%] translate-x-[-50%] translate-y-[-50%] w-fit bg-seclightblur mx-auto py-3 px-5 rounded-md font-semibold`}
          >
            No users
          </h1>
        ) : (
          <UsersDashboard data={response.data as any} />
        )}
      </div>
    );
  } else {
    return response.status === 401 ? (
      <Reduirect reduirectTo="/log-in" />
    ) : (
      <h1 className="text-maindark mx-auto">{unCountedMessage}</h1>
    );
  }
}
