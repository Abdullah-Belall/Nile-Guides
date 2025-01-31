"use client";
import { useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import styles from "@/app/ui/new-business.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoCloudUploadOutline } from "react-icons/io5";
import {
  CLIENT_COLLECTOR_REQ,
  DELETE_IMAGE_REQ,
  MAKE_TICKET_REQ,
  UPLOAD_IMAGE_REQ,
} from "@/app/_utils/requests/client-requests-hub";
import Footer from "@/app/_components/server/footer";
import { states } from "@/app/_utils/common/arrayes";

export default function ChangeRoleTicket() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [statesDrop, setStatesDrop] = useState(false);
  const [data, setData] = useState({ state: "Government" });
  const [accept, setAccept] = useState(false);
  const [vaildationMessage, setVaildationMessage] = useState("");
  const [frontCard, setFrontCard] = useState("");
  const [backCard, setBackCard] = useState("");
  const frontCardEle = useRef<any>();
  const backCardEle = useRef<any>();

  const handleUpload = async (
    event: any,
    cardType: "front" | "back",
    cardValue: any
  ): Promise<void> => {
    const file = event.target.files[0];
    if (!file) {
      setVaildationMessage("Please select a post image.");
      return;
    }

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      setVaildationMessage("The uploaded file is not a valid image.");
      event.target.value = "";
      return;
    }

    const img = new globalThis.Image();
    const imageLoaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image."));
    });

    img.src = URL.createObjectURL(file);
    try {
      await imageLoaded;
      if (img.width / img.height > 2 || img.width / img.height < 1.1) {
        setVaildationMessage(`Invalid image dimensions.`);
        setLoading(false);
        return;
      }
    } catch {
      setVaildationMessage("There is an error, please try again later.");
    }
    if (cardValue !== "") {
      const DeleteResponse = await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
        fileName: cardValue,
        type: "temporary-delete",
      });
      if (!DeleteResponse.done) {
        setVaildationMessage(DeleteResponse.message);
        setLoading(false);
        return;
      }
    }
    const formData = new FormData();
    formData.append("image", file);

    const response: any = await CLIENT_COLLECTOR_REQ(UPLOAD_IMAGE_REQ, {
      formData,
      type: "temporary-save",
    });
    if (response.done) {
      if (cardType === "front") {
        setFrontCard(response.filename);
      } else {
        setBackCard(response.filename);
      }
    } else {
      setVaildationMessage(response.message);
    }
    setLoading(false);
  };
  const handleSend = async () => {
    if (loading) return;
    if (frontCard === "" || backCard === "") {
      setVaildationMessage("Please select the id card.");
      return;
    }
    if (!accept) {
      setVaildationMessage("You have to accept the terms to be a worker.");
      return;
    }
    if (!states.includes(data.state)) {
      setVaildationMessage("Please select a Housing Governorate.");
      return;
    }
    setLoading(true);
    await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
      fileName: frontCard,
      type: "temporary-delete",
    });
    await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
      fileName: backCard,
      type: "temporary-delete",
    });

    let image1;
    let image2;
    const formData = new FormData();
    formData.append("image", frontCardEle.current.files[0]);
    const saveFrontResponse: any = await CLIENT_COLLECTOR_REQ(UPLOAD_IMAGE_REQ, {
      formData,
      type: "save",
    });
    if (!saveFrontResponse.done) {
      setLoading(false);
      setVaildationMessage(saveFrontResponse.message);
      return;
    }
    // eslint-disable-next-line prefer-const
    image1 = saveFrontResponse.filename;
    formData.delete("image");
    formData.append("image", backCardEle.current.files[0]);
    const saveBackResponse: any = await CLIENT_COLLECTOR_REQ(UPLOAD_IMAGE_REQ, {
      formData,
      type: "save",
    });
    if (!saveBackResponse.done) {
      setLoading(false);
      setVaildationMessage(saveBackResponse.message);
      return;
    }
    // eslint-disable-next-line prefer-const
    image2 = saveBackResponse.filename;
    const response = await CLIENT_COLLECTOR_REQ(MAKE_TICKET_REQ, {
      type: `clients`,
      data: {
        subject: "Change Role",
        body: `state: ${data.state}`,
        image1,
        image2,
      },
    });
    if (response.done) {
      setVaildationMessage("");
      router.replace("/profile");
    } else {
      if (response.status === 401) {
        router.replace("/log-in");
      } else {
        setVaildationMessage(response?.message as string);
      }
    }
    setLoading(false);
  };
  return (
    <>
      <section className="w-full min-h-[calc(100dvh-94px)] flex justify-center items-center px-mainX">
        <div className="w-full min-[470px]:w-[450px] bg-seclight p-5 rounded-md">
          <h1 className="flex flex-col font-semibold text-2xl text-mainlight text-center mb-7">
            Change Role Ticket
          </h1>
          <div className="flex gap-2">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file1"
                className="relative flex overflow-hidden flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 border-dashed rounded-md cursor-pointer text-mainlight bg-seclight hover:bg-mainlight hover:text-secdark duration-200"
              >
                <Image
                  className={frontCard === "" ? "hidden" : ""}
                  fill
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/temporary-uploads/${frontCard}`}
                  alt="Post Image"
                />
                <div
                  className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                    frontCard === "" ? "" : "hidden"
                  }`}
                >
                  <IoCloudUploadOutline className="text-2xl" />
                  <p className="mb-2 text-xs text-center mt-2">Front side of Egyptian ID card</p>
                  <p className="text-[9px] text-center">PNG, JPEG or JPG (MAX. 800x400px)</p>
                </div>
                <input
                  ref={frontCardEle}
                  onChange={(e) => handleUpload(e, "front", frontCard)}
                  id="dropzone-file1"
                  type="file"
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file2"
                className="relative flex overflow-hidden flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 border-dashed rounded-md cursor-pointer text-mainlight bg-seclight hover:bg-mainlight hover:text-secdark duration-200"
              >
                <Image
                  className={backCard === "" ? "hidden" : ""}
                  fill
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/temporary-uploads/${backCard}`}
                  alt="Post Image"
                />
                <div
                  className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                    backCard === "" ? "" : "hidden"
                  }`}
                >
                  <IoCloudUploadOutline className="text-2xl" />
                  <p className="mb-2 text-xs text-center mt-2">Back side of Egyptian ID card</p>
                  <p className="text-[9px] text-center">PNG, JPEG or JPG (MAX. 800x400px)</p>
                </div>
                <input
                  ref={backCardEle}
                  onChange={(e) => handleUpload(e, "back", backCard)}
                  id="dropzone-file2"
                  type="file"
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <p className="text-sm mb-1 mt-8">Housing Governorate</p>
          <div
            onClick={() => setStatesDrop(!statesDrop)}
            className={`${
              statesDrop ? "border-mainlight" : "border-anotherLight"
            } mb-8 relative text-mainlight w-full text-sm border duration-200 rounded-md px-2 py-3 flex justify-between items-center cursor-pointer`}
          >
            {data.state}
            <span>
              <MdKeyboardArrowDown />
            </span>
            <ul
              className={
                styles.orders +
                ` ${
                  statesDrop ? "" : "hidden"
                } z-10 shadow-xl bg-seclight overflow-y-scroll absolute w-full max-h-[140px] px-2 rounded-md left-0 top-[50px] flex flex-col`
              }
            >
              {states.map((e, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => {
                      setData({ state: e });
                      setStatesDrop(false);
                    }}
                    className="py-3 border-b text-mainlight"
                  >
                    {e}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex items-center mt-3">
            <label
              htmlFor="remember-me"
              className="ml-6 relative text-mainlight ml-3 block text-sm cursor-pointer"
            >
              <div
                className={`${
                  accept ? "bg-secdark" : "bg-mainlight"
                } absolute flex justify-center items-center left-[-22px] top-[50%] translate-y-[-50%] w-[13px] text-xs h-[13px] rounded-sm p-2 border`}
              >
                {accept ? "✔" : ""}
              </div>
              <input
                checked={accept}
                onChange={(e) => setAccept(e.target.checked)}
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="hidden"
              />
              I accept the{" "}
            </label>
            <div className="text-sm inline duration-300 text-anotherLight hover:text-mainlight font-semibold underline hover:no-underline ml-1">
              Terms and Conditions
            </div>
          </div>
          <p className="text-xs text-[red] w-fit mx-auto my-2">{vaildationMessage}</p>
          <div
            onClick={handleSend}
            className={`${
              loading ? "animate-pulse" : ""
            } mx-auto text-seclight bg-mainlight cursor-pointer w-full sm:w-[99px] h-[40px] text-center px-5 py-2 font-semibold rounded-md shadow-md flex justify-center items-center`}
          >
            {loading ? <HiDotsHorizontal className="text-3xl" /> : "Submit"}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
