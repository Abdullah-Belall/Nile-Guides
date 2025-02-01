import PostsFilterBar from "@/app/_components/client/posts-filterbar";
import PostsPageDashboard from "@/app/_components/client/posts-page-dashboard";
import Reduirect from "@/app/_components/client/rediruct";
import Footer from "@/app/_components/server/footer";
import { unCountedMessage } from "@/app/_utils/interfaces/main";
import {
  DASHBOARD_POSTS_SERVER_REQ,
  SERVER_COLLECTOR_REQ,
} from "@/app/_utils/requests/server-requests-hub";

export default async function WorkersBusinessDashboard({
  searchParams,
}: {
  searchParams: Promise<{ status: string; page: number }>;
}) {
  const params = await searchParams;
  const response = await SERVER_COLLECTOR_REQ(DASHBOARD_POSTS_SERVER_REQ, {
    params,
  });
  if (response.done) {
    return (
      <>
        <div className="w-full min-h-[calc(100dvh-94px)] px-mainX">
          <PostsFilterBar param={"Active"} />
          <PostsPageDashboard data={response.data} />
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
