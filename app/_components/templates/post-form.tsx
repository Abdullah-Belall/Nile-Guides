"use client";
import Footer from "@/app/_components/server/footer";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import styles from "@/app/ui/user-page-dashboard.module.css";
import { useRouter } from "next/navigation";
import {
  CLIENT_COLLECTOR_REQ,
  DELETE_IMAGE_REQ,
  NEW_POST_REQ,
  UPDATE_POST_REQ,
  UPLOAD_IMAGE_REQ,
} from "@/app/_utils/requests/client-requests-hub";
import { unCountedMessage } from "@/app/_utils/interfaces/main";
import MyButton from "./my-button";
import { language_levels, languages, states } from "@/app/_utils/common/arrayes";

export default function PostForm({
  type,
  dataForUpdate,
}: {
  type: "Update" | "Post";
  dataForUpdate?: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [validationErr, setValidationErr] = useState("");
  const [data, setData] = useState<any>({
    title: "",
    description: "",
    language: "Language",
    language_level: "Level",
    price: "",
    state: "Government",
    image: "",
  });
  const [dropDowns, setDropDowns] = useState({
    language: false,
    language_level: false,
    state: false,
  });
  const setOpenDrops = (type: string, value: boolean) => {
    setDropDowns({ ...dropDowns, [type]: value });
  };
  const [oldImage, setOldImage] = useState<string | undefined>();
  const imgEle = useRef<any>();
  useEffect(() => {
    if (type === "Update" && dataForUpdate) {
      setData({
        title: dataForUpdate.title,
        description: dataForUpdate.description,
        language: dataForUpdate.language,
        language_level: dataForUpdate.language_level,
        price: dataForUpdate.price,
        state: dataForUpdate.state,
        image: dataForUpdate.image,
      });
      setOldImage(dataForUpdate.image);
    }
  }, []);

  const handleInp = (type: string, value: any) => {
    setData({ ...data, [type]: value });
  };

  const handleUpload = async (event: any): Promise<string | undefined> => {
    const file = event.target.files[0];
    if (!file) {
      setValidationErr("Please select a post image.");
      return;
    }

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      setValidationErr("The uploaded file is not a valid image!");
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
        setValidationErr(`Invalid image dimensions.`);
        setLoading(false);
        return;
      }
    } catch (err) {
      setValidationErr(unCountedMessage);
    }
    if (data.image !== "") {
      await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
        fileName: data.image,
        type: data.image === dataForUpdate?.image ? "delete" : "temporary-delete",
      });
    }
    if (type === "Post" || (data.image !== "" && dataForUpdate?.image !== data.image)) {
      await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
        fileName: data.image,
        type: "temporary-delete",
      });
    }
    const formData = new FormData();
    formData.append("image", file);
    const response: any = await CLIENT_COLLECTOR_REQ(UPLOAD_IMAGE_REQ, {
      formData,
      type: "temporary-save",
    });
    if (response.done) {
      handleInp("image", response.filename);
    } else {
      setValidationErr(response.message);
    }
  };
  const vaildationChecker = () => {
    const { title, description, language, language_level, price, state, image } = data;
    if (title.length < 10) {
      setValidationErr("Title has to be more than 10 letters.");
      return false;
    }
    if (description.length < 20) {
      setValidationErr("Description has to be more than 20 letters.");
      return false;
    }
    if (language === "Language") {
      setValidationErr("Please select post language.");
      return false;
    }
    if (language_level === "Level") {
      setValidationErr("Please select post language level.");
      return false;
    }
    if (state === "Government") {
      setValidationErr("Please select post government.");
      return false;
    }
    if (image === "") {
      setValidationErr("Please select post image.");
      return false;
    }
    if (+price < 1) {
      setValidationErr("please enter a vaild price.");
      return false;
    }
    setValidationErr("");
    return true;
  };
  const handleSend = async (e: any) => {
    e.preventDefault();
    if (loading) return;
    if (!vaildationChecker()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const cloneData = { ...data, price: +data.price };
    if (type === "Update" && oldImage !== data.image) {
      await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
        fileName: dataForUpdate.image,
        type: "delete",
      });
    }
    await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
      fileName: data.image,
      type: "temporary-delete",
    });

    if (type === "Post" || oldImage !== data.image) {
      const formData = new FormData();
      formData.append("image", imgEle.current.files[0]);
      const saveImgResponse = await CLIENT_COLLECTOR_REQ(UPLOAD_IMAGE_REQ, {
        formData,
        type: "save",
      });
      if (!saveImgResponse.done) {
        setValidationErr(saveImgResponse.message);
        setLoading(false);
        return;
      }
      cloneData.image = saveImgResponse.filename;
    }
    const response =
      type === "Post"
        ? await CLIENT_COLLECTOR_REQ(NEW_POST_REQ, { data: cloneData })
        : await CLIENT_COLLECTOR_REQ(UPDATE_POST_REQ, {
            data: { ...data, image: cloneData.image, price: +data.price },
            id: dataForUpdate.id,
          });
    if (response.done) {
      router.replace("/posts");
    } else {
      if (response.status === 401) {
        router.replace("/log-in");
      } else {
        setValidationErr(response?.message as string);
      }
    }
    setLoading(false);
  };
  return (
    <>
      <div className="flex items-center justify-center py-12 w-full px-mainX">
        <div className="w-full max-w-[622px]">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="relative flex overflow-hidden flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-md cursor-pointer text-mainlight bg-seclight hover:text-secdark duration-200"
            >
              <Image
                className={data.image === "" ? "hidden" : ""}
                fill
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${
                  type === "Post" || data.image !== dataForUpdate.image ? "temporary-" : ""
                }uploads/${data.image}`}
                alt="Post Image"
              />
              <div
                className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                  data.image === "" ? "" : "hidden"
                }`}
              >
                <svg
                  className="w-8 h-8 mb-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs">PNG, JPEG or JPG (MAX. 800x400px)</p>
              </div>
              <input
                ref={imgEle}
                onChange={(e) => handleUpload(e)}
                id="dropzone-file"
                type="file"
                className="hidden"
              />
            </label>
          </div>
          <div className="mb-5 mt-3">
            <label htmlFor="name" className="mb-2 block text-base text-maindark">
              Title
            </label>
            <input
              value={data.title}
              onChange={(e) => handleInp("title", e.target.value)}
              type="text"
              name="name"
              id="name"
              placeholder="Post title"
              className="w-full rounded-md bg-seclight placeholder:text-mainlight py-4 px-3 text-base font-medium outline-none text-mainlight focus:bg-mainlight focus:text-maindark focus:placeholder:text-secdark focus focus:shadow-sm duration-200"
            />
          </div>
          <div className="text-sm flex flex-col mt-3">
            <label htmlFor="description" className="mb-2 block text-base text-maindark">
              Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) => handleInp("description", e.target.value)}
              id="message"
              className="block h-[200px] resize-none p-2.5 w-full text-sm text-mainlight placeholder:text-mainlight focus:bg-mainlight focus:placeholder:text-maindark focus:text-maindark bg-secdark duration-200 rounded-md outline-0"
              placeholder="Write your thoughts here..."
            ></textarea>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setOpenDrops("language", !dropDowns.language)}
              onBlur={() => setOpenDrops("language", false)}
              className={`${
                dropDowns.language ? "bg-mainlight text-maindark" : "bg-secdark text-mainlight"
              } mt-3 duration-200 relative w-full duration-200 rounded-md px-3 py-4 flex justify-between items-center cursor-pointer`}
            >
              {data.language}
              <span>
                <MdKeyboardArrowDown />
              </span>
              <ul
                className={
                  styles.orders +
                  ` ${
                    dropDowns.language ? "" : "hidden"
                  } z-10 shadow-xl bg-mainlight overflow-y-scroll absolute w-full max-h-[140px] px-2 rounded-md left-0 top-[61px] flex flex-col`
                }
              >
                {languages.map((e, i) => {
                  return (
                    <li
                      onClick={() => handleInp("language", e)}
                      key={i}
                      className={`py-3 ${
                        i !== languages.length - 1 ? "border-b border-seclight" : ""
                      } text-maindark text-sm`}
                    >
                      {e}
                    </li>
                  );
                })}
              </ul>
            </button>
            <button
              onClick={() => setOpenDrops("language_level", !dropDowns.language_level)}
              onBlur={() => setOpenDrops("language_level", false)}
              className={`${
                dropDowns.language_level
                  ? "bg-mainlight text-maindark"
                  : "bg-secdark text-mainlight"
              } mt-3 relative w-full duration-200 rounded-md px-3 py-4 flex justify-between items-center cursor-pointer`}
            >
              {data.language_level}
              <span>
                <MdKeyboardArrowDown />
              </span>
              <ul
                className={
                  styles.orders +
                  ` ${
                    dropDowns.language_level ? "" : "hidden"
                  } z-10 shadow-xl bg-mainlight text-maindark overflow-y-scroll absolute w-full max-h-[140px] px-2 rounded-md left-0 top-[61px] flex flex-col`
                }
              >
                {language_levels.map((e, i) => {
                  return (
                    <li
                      onClick={() => handleInp("language_level", e)}
                      key={i}
                      className={`py-3 ${
                        i !== languages.length - 1 ? "border-b" : ""
                      } text-maindark text-sm`}
                    >
                      {e}
                    </li>
                  );
                })}
              </ul>
            </button>
          </div>
          <button
            onClick={() => setOpenDrops("state", !dropDowns.state)}
            onBlur={() => setOpenDrops("state", false)}
            className={`${
              dropDowns.state ? "bg-mainlight text-maindark" : "bg-secdark text-mainlight"
            } mt-3 relative w-full duration-200 rounded-md px-3 py-4 flex justify-between items-center cursor-pointer`}
          >
            {data.state}
            <span>
              <MdKeyboardArrowDown />
            </span>
            <ul
              className={
                styles.orders +
                ` ${
                  dropDowns.state ? "" : "hidden"
                } z-10 shadow-xl bg-mainlight text-maindark overflow-y-scroll absolute w-full max-h-[140px] px-2 rounded-md left-0 top-[61px] flex flex-col`
              }
            >
              {states.map((e, i) => {
                return (
                  <li
                    onClick={() => handleInp("state", e)}
                    key={i}
                    className={`py-3 ${
                      i !== languages.length - 1 ? "border-b" : ""
                    } text-maindark text-sm`}
                  >
                    {e}
                  </li>
                );
              })}
            </ul>
          </button>
          <div>
            <input
              value={data.price}
              onChange={(e) => handleInp("price", e.target.value)}
              type="number"
              id="minPrice"
              className={`inline-block mt-3 placeholder:text-mainlight focus:text-maindark focus:bg-mainlight focus:placeholder:text-maindark outline-0 bg-secdark text-mainlight text-sm rounded-lg block p-2.5 duration-200 w-[120px]`}
              placeholder="Price for hour"
            />
            <span className="inline-block text-sm text-maindark ml-2 mt-2">With dollar</span>
          </div>
          <MyButton
            buttonColors="bg-secdark text-mainlight mx-auto"
            say={type}
            loading={loading}
            clickFunc={handleSend}
            vaildationMessage={validationErr}
            vaildationMessageWidth="mx-auto"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
