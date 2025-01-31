"use client";
import {
  CANCEL_BOOK_REQ,
  CLIENT_COLLECTOR_REQ,
  STRIPE_CLIENT_SECRET_REQ,
} from "@/app/_utils/requests/client-requests-hub";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { ImCancelCircle } from "react-icons/im";
import { IoCheckmark } from "react-icons/io5";
import { TbProgressHelp } from "react-icons/tb";

export default function ClientOrders({
  orderId,
  businessId,
  title,
  name,
  email,
  gender,
  day,
  from,
  to,
  price,
  guideOpinin,
  clientPaid,
  status,
}: any) {
  const router = useRouter();
  const [action, setAction] = useState(false);
  const [status_, setStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  const checkDateStatus = (inputDate: any) => {
    const dateRegex = /^(\d{1,2}(\.\d{1,2})?)(AM|PM)\s(\d{1,2})-(\d{1,2})-(\d{4})$/;
    const match = inputDate.match(dateRegex);
    // "Invalid date format. Use format like '4AM 25-12-2024' or '5.5PM 1-2-2025'."
    const [_, time, fraction, period, day, month, year] = match;
    let hours = parseInt(time);
    const minutes = fraction ? parseFloat(fraction) * 60 : 0;
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    const date = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    return date > now ? "pending" : guideOpinin === "pending" ? "cancelled" : "done";
  };
  useEffect(() => {
    if (status_ === "pending") {
      setStatus(checkDateStatus(to.trim() + " " + day.trim()));
    }
  }, []);
  const handleCancel = async () => {
    if (loading || status_ === "cancelled" || status_ === "done") {
      return;
    }
    setAction(false);
    setLoading(true);
    const response = await CLIENT_COLLECTOR_REQ(CANCEL_BOOK_REQ, { id: orderId });
    if (response?.done) setStatus("cancelled");
    setLoading(false);
  };
  const handlePayNow = async () => {
    if (
      loading ||
      status_ === "cancelled" ||
      status_ === "done" ||
      guideOpinin === "pending" ||
      guideOpinin === "cancelled" ||
      clientPaid != 0
    ) {
      return;
    }
    setAction(false);
    setLoading(true);
    const response = await CLIENT_COLLECTOR_REQ(STRIPE_CLIENT_SECRET_REQ, { amount: +price });
    if (response.done) {
      router.push(
        `/posts/${businessId}/confirm-order/${orderId}faselhere${price}faselhere${response.clientSecret}`
      );
    }
    setLoading(false);
  };
  return (
    <>
      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight">Post title:</dt>
        <dd className="mt-1.5 text-base font-semibold text-mainlight">
          <Link href={`/posts/${businessId}`} className="hover:underline text-nowrap">
            {title}
          </Link>
        </dd>
      </dl>

      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight text-nowrap">Guide name:</dt>
        <dd className="mt-1.5 text-base font-semibold text-mainlight text-nowrap">{name}</dd>
      </dl>

      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight text-nowrap">Guide email:</dt>
        <dd className="mt-1.5 text-base font-semibold text-mainlight text-nowrap">{email}</dd>
      </dl>

      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight text-nowrap">Guide gender:</dt>
        <dd className="mt-1.5 text-base font-semibold text-mainlight text-nowrap">{gender}</dd>
      </dl>

      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight">Day:</dt>
        <dd className="mt-1.5 text-base font-semibold text-mainlight text-nowrap">{day}</dd>
      </dl>

      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight">From:</dt>
        <dd className="mt-1.5 text-base font-semibold text-mainlight text-nowrap">{from}</dd>
      </dl>

      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight">To:</dt>
        <dd className="mt-1.5 text-base font-semibold text-mainlight text-nowrap">{to}</dd>
      </dl>

      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight text-nowrap">Total price:</dt>
        <dd className="mt-1.5 text-base font-semibold text-mainlight text-nowrap">${price}</dd>
      </dl>

      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight text-nowrap">You paid:</dt>
        <dd className="mt-1.5 text-base font-semibold text-mainlight text-nowrap">${clientPaid}</dd>
      </dl>

      <dl className="w-[50%] sm:w-full">
        <dt className="text-sm font-medium text-seclight text-nowrap">Guide&lsquo;s decision:</dt>
        {guideOpinin === "pending" && (
          <dd className="me-2 mt-1.5 inline-flex shrink-0 items-center rounded px-2.5 py-0.5 text-xs font-medium bg-yellow-900 text-yellow-300">
            <TbProgressHelp className="mr-1" />
            Pending
          </dd>
        )}
        {/* 2 */}
        {guideOpinin === "cancelled" && (
          <dd className="mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-red-900 text-red-300">
            <ImCancelCircle className="mr-1 text-sm" />
            Refused
          </dd>
        )}
        {/* 3 */}
        {guideOpinin === "done" && (
          <dd className="mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-green-900 text-green-300">
            <IoCheckmark className="mr-1 text-base" />
            Accepted
          </dd>
        )}
      </dl>
      <dl className="w-[50%] sm:w-full">
        <dt className="text-base font-medium text-seclight">Status:</dt>
        {status_ === "pending" && (
          <dd className="me-2 mt-1.5 inline-flex shrink-0 items-center rounded px-2.5 py-0.5 text-xs font-medium bg-yellow-900 text-yellow-300">
            <TbProgressHelp className="mr-1" />
            Pending
          </dd>
        )}
        {/* 2 */}
        {status_ === "cancelled" && (
          <dd className="mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-red-900 text-red-300">
            <ImCancelCircle className="mr-1 text-sm" />
            Cancelled
          </dd>
        )}
        {/* 3 */}
        {status_ === "done" && (
          <dd className="mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium bg-green-900 text-green-300">
            <IoCheckmark className="mr-1 text-base" />
            Completed
          </dd>
        )}
      </dl>

      <div className="w-full sm:w-full relative">
        <button
          onClick={() => setAction(!action)}
          className={`${
            status_ === "done" ||
            status_ === "cancelled" ||
            clientPaid != 0 ||
            guideOpinin === "cancelled"
              ? "bg-anotherLight text-seclight cursor-default"
              : "text-maindark bg-mainlight cursor-pointer"
          } ${
            loading ? "animate-pulse" : ""
          } w-full sm:w-[99px] h-[40px] text-center px-5 py-2 font-semibold rounded-md shadow-md flex justify-center items-center`}
        >
          {loading ? <HiDotsHorizontal className="text-3xl" /> : "Actions"}
        </button>
        <div
          className={`absolute shadow-xl w-full bg-mainlight rounded-md left-0 top-[43px] px-2 z-10 ${
            action ? "" : "hidden"
          }`}
        >
          {status_ === "pending" && guideOpinin === "done" && clientPaid == 0 && (
            <div
              onClick={handlePayNow}
              className="text-maindark w-full py-2 border-b border-maindark text-center font-semibold text-sm cursor-pointer"
            >
              Pay now
            </div>
          )}
          {clientPaid == 0 && status_ === "pending" && (
            <div
              onClick={handleCancel}
              className="text-maindark w-full py-2 text-center font-semibold text-sm cursor-pointer"
            >
              Cancel
            </div>
          )}
        </div>
      </div>
    </>
  );
}
