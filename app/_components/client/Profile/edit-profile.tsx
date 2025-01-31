"use client";
import Image from "next/image";
import { useState, useEffect, useContext, useRef } from "react";
import maleAvatar from "@/public/maleAvatar.png";
import femaleAvatar from "@/public/femaleAvatar.png";
import { MdAddAPhoto, MdKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/authContext";
import styles from "@/app/ui/new-business.module.css";
import MyButton from "@/app/_components/templates/my-button";
import {
  CLIENT_COLLECTOR_REQ,
  DELETE_IMAGE_REQ,
  EDIT_USER_DATA_REQ,
  UPLOAD_IMAGE_REQ,
} from "@/app/_utils/requests/client-requests-hub";
import { ResizeImage } from "@/app/_utils/common/functions";
import { states } from "@/app/_utils/common/arrayes";

export default function EditProfileComponent({ params }: any) {
  const router = useRouter();
  const [param_, setParam] = useState<string[]>([]);
  const [vaildationMessage, setVaildationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statesDrop, setStatesDrop] = useState(false);
  const avatar = param_[0] || "";
  const first_name = param_[1] || "";
  const last_name = param_[2] || "";
  const age = param_[3] || "";
  const gender = param_[4] || "";
  const role = param_[5] || "";
  const state = param_[6] || "";
  const [data, setData] = useState({ avatar, first_name, last_name, gender, age, state });
  const [dataClone, setDataClone] = useState({
    avatar,
    first_name,
    last_name,
    gender,
    age,
    state,
  });
  const [image, setImage] = useState<any>();
  const authContext = useContext<any>(AuthContext);
  const { dispatch } = authContext;
  const favatarInput = useRef<any>();
  const handleInp = (type: string, value: string | number) => {
    setData({ ...data, [type]: value });
  };

  useEffect(() => {
    const obj = { avatar, first_name, last_name, gender, age, state };
    setData(obj);
    setDataClone(obj);
  }, [param_]);
  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      const profileData = resolvedParams?.editProfile?.split("cuthere") || [];
      setParam(profileData);
    }
    unwrapParams();
  }, [params]);

  const vaildationChecker = () => {
    const isFirstNameValid = data.first_name.length >= 2 && data.first_name.length <= 14;
    const isLastNameValid = data.last_name.length >= 2 && data.last_name.length <= 14;
    if (!isFirstNameValid || !isLastNameValid) {
      setVaildationMessage(
        `First and Last name has to be two or more character and less than 14 character.`
      );
      return false;
    }
    const isAge = +data.age > 17 && +data.age < 100;
    if (!isAge) {
      setVaildationMessage(`Your age has to be 18 : 99 to sign up.`);
      return false;
    }
    const isGenderValid = ["male", "female"].includes(data.gender);
    if (!isGenderValid) {
      setVaildationMessage(`Gender must be male or female.`);
      return false;
    }
    setVaildationMessage(``);
    return true;
  };
  async function handleUpload(event: any): Promise<string | undefined> {
    if (image) {
      const DeleteOldAvatarResponse = await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
        fileName: image,
        type: "temporary-delete",
      });
      if (!DeleteOldAvatarResponse.done) {
        setVaildationMessage(DeleteOldAvatarResponse.message);
        setLoading(false);
        return;
      }
    }

    const file = event.target.files[0];
    if (!file) {
      setVaildationMessage("Please select a profile image.");
      return;
    }

    const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      setVaildationMessage("The uploaded file is not a valid image!");
      event.target.value = "";
      return;
    }

    const img = new globalThis.Image();
    const imageLoaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image."));
    });

    img.src = URL.createObjectURL(file);
    let resizedFile = file;
    try {
      await imageLoaded;

      const minSize = 128;
      const maxSize = 512;

      if (img.width < minSize || img.height < minSize) {
        setVaildationMessage(`The image dimensions must be at least ${minSize}x${minSize}px.`);
        setLoading(false);
        return;
      }
      if (img.width > maxSize && img.height <= maxSize) {
        const resizeImage = await ResizeImage(resizedFile, img.height, img.height);
        if (resizeImage.done) {
          resizedFile = resizeImage.file;
        } else {
          setVaildationMessage(`Can't resize this image to match the requirements.`);
          setLoading(false);
          return;
        }
      }
      if (img.height > maxSize && img.width <= maxSize) {
        const resizeImage = await ResizeImage(resizedFile, img.width, img.width);
        if (resizeImage.done) {
          resizedFile = resizeImage.file;
        } else {
          setVaildationMessage(`Can't resize this image to match the requirements.`);
          setLoading(false);
          return;
        }
      }
      if (img.height > maxSize && img.width > maxSize) {
        const resizeImage = await ResizeImage(resizedFile, maxSize, maxSize);
        if (resizeImage.done) {
          resizedFile = resizeImage.file;
        } else {
          setVaildationMessage(`Can't resize this image to match the requirements.`);
          setLoading(false);
          return;
        }
      }
    } catch {
      setVaildationMessage("Failed to validate the image dimensions.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", resizedFile);

    const response: any = await CLIENT_COLLECTOR_REQ(UPLOAD_IMAGE_REQ, {
      formData,
      type: "temporary-save",
    });

    if (response.done) {
      setImage(response.filename);
    } else {
      setVaildationMessage(response.message);
    }
  }

  const handleSend = async (e: any) => {
    e.preventDefault();
    if (loading) return;
    const condition =
      !image &&
      data.first_name === dataClone.first_name &&
      data.last_name === dataClone.last_name &&
      data.age === dataClone.age &&
      data.gender === dataClone.gender &&
      data.state === dataClone.state;

    if (condition) {
      router.replace("/profile");
      return;
    }
    if (!vaildationChecker()) {
      return;
    }

    setLoading(true);
    const dataReady = { ...data };
    dataReady.age = +dataReady.age as any;
    if (role === "client") delete (dataReady as any).state;
    let finalImageSrc;
    if (image) {
      const file = favatarInput.current.files[0];
      const img = new globalThis.Image();
      const imageLoaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image."));
      });

      img.src = URL.createObjectURL(file);
      let resizedFile = file;
      try {
        await imageLoaded;

        const minSize = 128;
        const maxSize = 512;

        if (img.width < minSize || img.height < minSize) {
          setVaildationMessage(`The image dimensions must be at least ${minSize}x${minSize}px.`);
          setLoading(false);
          return;
        }
        if (img.width > maxSize && img.height <= maxSize) {
          const resizeImage = await ResizeImage(resizedFile, img.height, img.height);
          if (resizeImage.done) {
            resizedFile = resizeImage.file;
          } else {
            setVaildationMessage(`Can't resize this image to match the requirements.`);
            setLoading(false);
            return;
          }
        }
        if (img.height > maxSize && img.width <= maxSize) {
          const resizeImage = await ResizeImage(resizedFile, img.width, img.width);
          if (resizeImage.done) {
            resizedFile = resizeImage.file;
          } else {
            setVaildationMessage(`Can't resize this image to match the requirements.`);
            setLoading(false);
            return;
          }
        }
        if (img.height > maxSize && img.width > maxSize) {
          const resizeImage = await ResizeImage(resizedFile, maxSize, maxSize);
          if (resizeImage.done) {
            resizedFile = resizeImage.file;
          } else {
            setVaildationMessage(`Can't resize this image to match the requirements.`);
            setLoading(false);
            return;
          }
        }
      } catch {
        setVaildationMessage("Failed to validate the image dimensions.");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("image", resizedFile);
      const transferAvatarResponse: any = await CLIENT_COLLECTOR_REQ(UPLOAD_IMAGE_REQ, {
        formData,
        type: "save",
      });
      if (transferAvatarResponse.done) {
        finalImageSrc = transferAvatarResponse.filename;
      } else {
        setVaildationMessage(transferAvatarResponse.message);
        setLoading(false);
        return;
      }
    }
    const response = await CLIENT_COLLECTOR_REQ(EDIT_USER_DATA_REQ, {
      ...dataReady,
      avatar: finalImageSrc,
    });
    if (response.done) {
      dispatch({
        type: "LOGIN",
        payload: {
          first_name: dataReady.first_name,
          last_name: dataReady.last_name,
          role: authContext.state.role,
          email: authContext.state.email,
          age: dataReady.age,
          avatar: dataReady.avatar,
          gender: dataReady.gender,
          state: dataReady.state,
        },
      });
      router.replace("/profile");
    } else {
      setVaildationMessage(response.message);
      setLoading(false);
      return;
    }
    if (image) {
      await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
        fileName: image,
        type: "temporary-delete",
      });

      if (data.avatar !== "null") {
        await CLIENT_COLLECTOR_REQ(DELETE_IMAGE_REQ, {
          fileName: data?.avatar,
          type: "delete",
        });
      }
    }

    setLoading(false);
  };
  const defaultAvatar = gender === "female" ? femaleAvatar : maleAvatar;
  const imageCondition: any =
    data.avatar !== "null"
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${data.avatar}`
      : defaultAvatar;
  const imageSrc = image
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/temporary-uploads/${image}`
    : imageCondition;
  return (
    <div className="w-full sm:w-[620px] px-mainX">
      <div className="w-full flex flex-col items-center p-3 bg-seclight rounded-lg shadow-md">
        <label htmlFor="avatar" className="w-fit relative cursor-pointer">
          <Image
            className={`rounded-full border border-maindark`}
            objectFit="cover"
            width={120}
            height={120}
            src={imageSrc}
            alt="Profile image"
          />
          <div className="flex justify-center items-center w-full h-full left-0 top-0 rounded-full bg-maindarkblur absolute opacity-0 hover:opacity-100 duration-200">
            <MdAddAPhoto />
          </div>
          <input
            ref={favatarInput}
            onChange={(e) => handleUpload(e)}
            id="avatar"
            type="file"
            className="hidden"
          />
        </label>
        <form className="w-full flex flex-col flex-wrap mt-4 gap-4">
          <div className="w-full flex gap-4">
            <label htmlFor="firstname" className="w-full text-sm text-mainlight">
              First Name
              <input
                value={data.first_name}
                onChange={(e) => handleInp("first_name", e.target.value)}
                id="firstname"
                className="w-full bg-transparent placeholder:text-anotherLight focus:placeholder:text-mainlight text-sm text-mainlight border-b duration-300 border-anotherLight focus:border-mainlight px-2 py-3 outline-none"
                placeholder="Enter Frist Name"
              />
            </label>
            <label htmlFor="lastname" className="w-full text-sm text-mainlight">
              Last Name
              <input
                value={data.last_name}
                onChange={(e) => handleInp("last_name", e.target.value)}
                id="lastname"
                className="w-full bg-transparent placeholder:text-anotherLight focus:placeholder:text-mainlight text-sm text-mainlight border-b duration-300 border-anotherLight focus:border-mainlight px-2 py-3 outline-none"
                placeholder="Enter Last Name"
              />
            </label>
          </div>
          <div className="flex gap-4">
            <label htmlFor="gender" className="text-sm text-mainlight w-full flex flex-col gap-1">
              Gender
              <div className="text-sm flex gap-1 items-center">
                <div
                  onClick={() => handleInp("gender", "male")}
                  className={`border border-mainlight hover:bg-mainlight text-xs sm:text-sm hover:text-maindark px-3 py-1 rounded-full text-nowrap cursor-pointer h-fit duration-300 ${
                    data.gender === "male" ? "text-maindark bg-mainlight" : "text-mainlight"
                  }`}
                >
                  👱‍♂️ Male
                </div>
                <div
                  onClick={() => handleInp("gender", "female")}
                  className={`border border-mainlight hover:bg-mainlight text-xs sm:text-sm hover:text-maindark px-3 py-1 rounded-full text-nowrap cursor-pointer h-fit duration-300 ${
                    data.gender === "female" ? "text-maindark bg-mainlight" : "text-mainlight"
                  }`}
                >
                  👩 Female
                </div>
              </div>
            </label>
            <label htmlFor="age" className="text-sm text-mainlight w-full">
              Age
              <div className="flex">
                <div
                  onClick={() => handleInp("age", +data.age - 1)}
                  className="duration-300 bg-seclightblur hover:bg-seclight flex justify-center items-center cursor-pointer rounded-s-lg px-2 py-3"
                >
                  <svg
                    className="w-3 h-3 text-maindark"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h16"
                    />
                  </svg>
                </div>
                <input
                  value={data.age}
                  onChange={(e) => handleInp("age", e.target.value)}
                  className="mx-[.5px] bg-seclight border-maindark outline-0 text-center text-maindark text-sm focus:ring-blue-500 block w-full py-2"
                  placeholder="999"
                  required
                />
                <div
                  onClick={() => handleInp("age", +data.age + 1)}
                  className="duration-300 bg-seclightblur hover:bg-seclight flex justify-center items-center cursor-pointer rounded-e-lg px-2 py-3 p-3 focus:ring-maindark focus:ring-2 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3 text-maindark"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </div>
              </div>
            </label>
          </div>
          {role !== "client" && (
            <div
              onClick={() => setStatesDrop(!statesDrop)}
              className={`${
                statesDrop ? "border-mainlight" : "border-anotherLight"
              } relative text-mainlight w-full text-sm border duration-200 rounded-md px-2 py-3 flex justify-between items-center cursor-pointer`}
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
                  } shadow-xl bg-seclight overflow-y-scroll absolute w-full max-h-[140px] px-2 rounded-md left-0 top-[50px] flex flex-col`
                }
              >
                {states.map((e, i) => {
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        handleInp("state", e);
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
          )}
          <MyButton
            buttonColors="bg-mainlight text-seclight w-[180px] mx-auto"
            say="Edit"
            loading={loading}
            clickFunc={handleSend}
            vaildationMessage={vaildationMessage}
            vaildationMessageWidth={"text-center"}
          />
        </form>
      </div>
    </div>
  );
}
