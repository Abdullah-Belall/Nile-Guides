import Reduirect from "@/app/_components/client/rediruct";
import PostPage from "@/app/_components/templates/post-page";
import { unCountedMessage } from "@/app/_utils/interfaces/main";
import {
  DASHBOARD_ONE_POST_SERVER_REQ,
  SERVER_COLLECTOR_REQ,
} from "@/app/_utils/requests/server-requests-hub";

export default async function DashboardPost({ params }: { params: Promise<{ id: string }> }) {
  const unWrap = await params;
  const response = await SERVER_COLLECTOR_REQ(DASHBOARD_ONE_POST_SERVER_REQ, { id: unWrap.id });
  if (response.done) {
    return <PostPage data={response?.data} />;
  } else {
    return response.status === 401 ? (
      <Reduirect reduirectTo="/log-in" />
    ) : (
      <h1 className="text-maindark mx-auto">{unCountedMessage}</h1>
    );
  }
}
