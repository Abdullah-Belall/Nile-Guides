"use client";
import PostForm from "@/app/_components/templates/post-form";
import { CLIENT_COLLECTOR_REQ, WORKER_POST_REQ } from "@/app/_utils/requests/client-requests-hub";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImSpinner } from "react-icons/im";
export default function UpdatePostComponent({ params }: { params: Promise<{ id: any }> }) {
  const router = useRouter();
  const [data, setData] = useState<any>();

  useEffect(() => {
    async function GetData() {
      const params_ = await params;
      const response = await CLIENT_COLLECTOR_REQ(WORKER_POST_REQ, { id: params_.id });
      if (response?.data?.id) {
        setData(response.data);
      } else {
        if (response.status === 401) {
          router.replace("/log-in");
        }
      }
    }
    GetData();
  }, []);
  if (!data) {
    return (
      <>
        <div className="fixed select-none w-full h-dvh left-0 top-0 bg-blackLayer z-50 flex justify-center items-center gap-2">
          <ImSpinner className="animate-spin duration-500 text-2xl" />
          Loading...
        </div>
        <PostForm type={"Post"} />
      </>
    );
  }
  return <PostForm type={"Update"} dataForUpdate={data} />;
}
