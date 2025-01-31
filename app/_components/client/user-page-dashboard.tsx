"use client";
import Image from "next/image";
import maleAvatar from "@/public/maleAvatar.png";
import femaleAvatar from "@/public/femaleAvatar.png";
import { useEffect, useState } from "react";
import styles from "@/app/ui/user-page-dashboard.module.css";
import MyButton from "../templates/my-button";
import {
  CLIENT_COLLECTOR_REQ,
  DASHBOARD_BAND_USER_REQ,
  DASHBOARD_CHANGE_ROLE_REQ,
} from "@/app/_utils/requests/client-requests-hub";
import { states } from "@/app/_utils/common/arrayes";

export default function UserPageDashbord({ data }: any) {
  const [role, setRole] = useState<undefined | string>();
  const [government, setGovernment] = useState(data.state ?? "");
  const [openRolesStatesOverLay, setOpenRolesStatesOverLay] = useState(false);
  const [openBandOverLay, setOpenBandOverLay] = useState(false);
  const [openRolesList, setOpenRolesList] = useState(false);
  const [openStatesList, setOpenStatesList] = useState(false);
  const [changeRole, setChangeRole] = useState("");
  const [changeGovernment, setChangeGovernment] = useState("Government");
  const [loadingForRolesAndStates, setLoadingForRolesAndStates] = useState(false);
  const [vaildationMessageForRolesAndStates, setVaildationMessageForRolesAndStates] = useState("");
  const handleChangeRole = (value: string) => {
    setChangeRole(value);
    setOpenRolesList(false);
  };
  const handleChangeState = (value: string) => {
    setChangeGovernment(value);
    setOpenStatesList(false);
  };
  const handleSubmitRolesStatesOverLay = async () => {
    if (loadingForRolesAndStates) return;
    if (changeRole === role) {
      setVaildationMessageForRolesAndStates(`This user is already a ${changeRole}.`);
      return;
    }
    if (changeRole !== "client" && changeGovernment === "Government") {
      setVaildationMessageForRolesAndStates("You have to select a Government.");
      return;
    }
    const objReady: any = {
      user_email: data?.email,
      change_role_to: changeRole,
      state: changeGovernment,
    };
    if (changeRole === "client") delete objReady.state;
    setVaildationMessageForRolesAndStates(``);
    setLoadingForRolesAndStates(true);
    const response = await CLIENT_COLLECTOR_REQ(DASHBOARD_CHANGE_ROLE_REQ, { body: objReady });
    if (response.done) {
      setRole(changeRole);
      setGovernment(changeGovernment);
      setOpenRolesStatesOverLay(false);
    } else {
      setVaildationMessageForRolesAndStates(response.message);
    }
    setLoadingForRolesAndStates(false);
  };
  const allRoles = ["client", "worker", "admin", "superadmin"];
  const [accept, setAccept] = useState([false, false]);
  const [loadingForBand, setLoadingForBand] = useState(false);
  const [reason, setReason] = useState("");
  const [vaildationMessageForBand, setVaildationMessageForBand] = useState("");

  const handleBand = async (e: any) => {
    e.preventDefault();
    if (loadingForBand) return;
    if (reason.length < 20) {
      setVaildationMessageForBand("Please enter more details.");
      return;
    }
    if (!accept[0] || !accept[1]) {
      setVaildationMessageForBand("Read the Terms well and submit it.");
      return;
    }
    setLoadingForBand(true);
    const response = await CLIENT_COLLECTOR_REQ(DASHBOARD_BAND_USER_REQ, {
      body: { user_email: data?.email, reason },
    });
    if (response.done) {
      setOpenBandOverLay(false);
    } else {
      setVaildationMessageForBand(response.message);
    }
  };
  useEffect(() => {
    if (data?.role) {
      setRole(data?.role);
      setChangeRole(data?.role);
    }
    if (data?.state) {
      setGovernment(data?.state);
      setChangeGovernment(data?.state);
    }
  }, [data]);

  const content = [
    { tit: "Account Status", value: !data?.is_banded ? "Normal" : "Banded" },
    { tit: "Email Address", value: data?.email },
    { tit: "Role", value: role || data?.role },
    { tit: "Age", value: data?.age },
    { tit: "Government", value: government },
    { tit: "Gender", value: data?.gender },
  ];

  return (
    <>
      <div
        onClick={() => {
          setOpenRolesStatesOverLay(false);
          setOpenBandOverLay(false);
        }}
        className={`${
          openRolesStatesOverLay || openBandOverLay ? "" : "hidden"
        } bg-blackLayer fixed w-full h-dvh left-0 top-0 z-50`}
      ></div>
      <div
        className={`${
          !openRolesStatesOverLay && "hidden"
        } fixed w-full min-[470px]:w-[450px] px-[10px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50`}
      >
        <div className="flex flex-col items-center w-full min-[470px]:w-[450px] rounded-md bg-maindark p-5">
          <h1 className="w-full font-bold text-center mb-7 text-xl">Change Role options</h1>
          <div className="relative w-full">
            <button
              onClick={() => setOpenRolesList(!openRolesList)}
              onBlur={() => setOpenRolesList(false)}
              className="w-full bg-mainlight text-maindark rounded-lg py-3"
            >
              {changeRole}
              <ul
                className={`${
                  !openRolesList && "hidden"
                } w-full absolute left-0 top-[52px] bg-mainlight rounded-lg px-3 z-30`}
              >
                {allRoles.map((e, i) => (
                  <li
                    key={e}
                    onClick={() => handleChangeRole(e)}
                    className={`${
                      i !== allRoles.length - 1 && "border-b border-seclight"
                    } text-center text-sm text-seclight py-2 hover:text-maindark hover:border-maindark cursor-pointer duration-200`}
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </button>
          </div>
          <div className={`${changeRole === "client" && "hidden"} relative mt-2 w-full`}>
            <button
              onClick={() => setOpenStatesList(!openStatesList)}
              onBlur={() => setOpenStatesList(false)}
              className="w-full bg-mainlight text-maindark rounded-lg py-3"
            >
              {changeGovernment}
              <ul
                className={
                  styles.orders +
                  ` ${
                    !openStatesList && "hidden"
                  } w-full max-h-[140px] absolute overflow-y-scroll left-0 top-[52px] bg-mainlight rounded-lg px-3`
                }
              >
                {states.map((e, i) => (
                  <li
                    key={e}
                    onClick={() => handleChangeState(e)}
                    className={`${
                      i !== states.length - 1 && "border-b border-seclight"
                    } text-center text-sm text-seclight py-2 hover:text-maindark hover:border-maindark cursor-pointer duration-200`}
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </button>
          </div>
          <MyButton
            buttonColors={`bg-transparent border border-mainlight text-mainlight duration-200 hover:bg-mainlight hover:text-maindark mx-auto ${
              loadingForRolesAndStates ? "bg-mainlight text-maindark" : ""
            }`}
            say="Submit"
            loading={loadingForRolesAndStates}
            clickFunc={handleSubmitRolesStatesOverLay}
            vaildationMessage={vaildationMessageForRolesAndStates}
            vaildationMessageWidth="mx-auto"
          />
        </div>
      </div>
      <div
        className={`${
          !openBandOverLay && "hidden"
        } fixed w-full min-[470px]:w-[450px] px-[10px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50`}
      >
        <div className="flex flex-col w-full min-[470px]:w-[450px] rounded-md bg-maindark p-5">
          <h1 className="w-full font-bold text-center mb-7 text-xl">Band User</h1>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="block min-h-[80px] max-h-[120px] p-2.5 w-full text-sm text-mainlight bg-transparent border-b border-anotherLight focus:border-mainlight outline-0 placeholder:text-anotherLight focus:placeholder:text-mainlight"
            placeholder="Write band reason here..."
          ></textarea>
          <label
            htmlFor="remember-me"
            className="relative text-mainlight ml-3 block text-xs cursor-pointer mt-4"
          >
            <div
              className={`${
                accept[0] ? "bg-maindark" : "bg-mainlight"
              } absolute flex justify-center items-center left-[-22px] top-0 w-[7px] text-xs h-[7px] rounded-sm p-2 border`}
            >
              {accept[0] ? "✔" : ""}
            </div>
            <input
              checked={accept[0]}
              onChange={(e) => setAccept([e.target.checked, accept[1]])}
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="hidden"
            />
            By band this user his all posts,tickets,rates,etc will deleted for ever.
          </label>
          <label className="relative text-mainlight ml-3 block text-xs cursor-pointer mt-4">
            <div
              className={`${
                accept[1] ? "bg-maindark" : "bg-mainlight"
              } absolute flex justify-center items-center left-[-22px] top-0 w-[7px] text-xs h-[7px] rounded-sm p-2 border`}
            >
              {accept[1] ? "✔" : ""}
            </div>
            <input
              checked={accept[1]}
              onChange={(e) => setAccept([accept[0], e.target.checked])}
              name="remember-me"
              type="checkbox"
              className="hidden"
            />
            I checked that this is the user i want to band.
          </label>
          <MyButton
            buttonColors="bg-[#b60000] text-mainlight mx-auto"
            say="Band"
            loading={loadingForBand}
            clickFunc={handleBand}
            vaildationMessage={vaildationMessageForBand}
            vaildationMessageWidth="mx-auto"
          />
        </div>
      </div>
      {/* ============================= */}
      <div className="min-w-[30%] gap-6 p-5 flex flex-col justify-between rounded-lg bg-gradient-to-tr from-[#AE9460] to-[#cdbc9a]">
        <Image
          loading="eager"
          className="rounded-full border border-maindark mx-auto"
          width={120}
          height={120}
          src={
            data?.avatar
              ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${data.avatar}`
              : data?.gender === "male"
              ? maleAvatar
              : femaleAvatar
          }
          alt={data?.first_name + " " + data?.last_name}
        />
        <ul className="flex flex-col gap-2">
          {content.map((e, i) => (
            <li
              className={e.tit === "Government" && role === "client" ? "hidden" : ""}
              key={i + "agkbad"}
            >
              <h1 className="text-base text-semibold text-mainlight">{e.tit}</h1>
              <p className="text-sm text-anotherLight">{e.value}</p>
            </li>
          ))}
        </ul>
        <div className="w-full flex gap-2">
          <button
            onClick={() => setOpenRolesStatesOverLay(true)}
            className={`bg-seclight w-full text-center shadow-xl py-3 px-6 text-sm text-nowrap text-maindark font-semibold rounded-md hover:bg-mainlight duration-300 focus:outline-none`}
          >
            Change Role
          </button>
          <button
            onClick={() => setOpenBandOverLay(true)}
            className={`bg-[#b60000] w-full shadow-xl py-3 px-6 text-sm text-mainlight font-semibold rounded-md hover:bg-[red] duration-300 focus:outline-none`}
          >
            Band
          </button>
        </div>
      </div>
    </>
  );
}
