"use client";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import styles from "@/app/ui/new-business.module.css";
import { FaStar } from "react-icons/fa";
import MyButton from "../templates/my-button";
import { useRouter, useSearchParams } from "next/navigation";
import { IoFilterSharp } from "react-icons/io5";
import { language_levels, languages, states } from "@/app/_utils/common/arrayes";

const genders = ["Any", "male", "female"];

export default function FiltersOptions() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openFilters, setOpenFilters] = useState(false);
  const [dropDowns, setDropDowns] = useState({
    language: false,
    language_level: false,
    government: false,
    gender: false,
  });
  const [appliedFilters, setAppliedFilters] = useState<undefined | string[]>();
  const [search, setSearch] = useState(1);
  const setOpenDrops = (
    open: "language" | "language_level" | "government" | "gender",
    value: boolean
  ) => {
    setDropDowns({ ...dropDowns, [open]: value });
  };
  const [filters, setFilters] = useState({
    language: null,
    language_level: null,
    government: null,
    rate: false,
    maxPrice: "",
    gender: "Any",
  });
  const setInputs = (
    label: "language" | "language_level" | "government" | "rate" | "maxPrice" | "gender",
    value: any
  ) => {
    setFilters({ ...filters, [label]: value });
    if (["language", "language_level", "government"].includes(label))
      setOpenDrops(label as any, false);
  };
  const handleSearch = (e: any) => {
    e?.preventDefault();
    setSearch(search + 1);
  };
  useEffect(() => {
    if (search > 1) {
      let finalPath = window.location.pathname + "?";
      if (filters.language) finalPath += `language=${filters.language}&`;
      if (filters.language_level) finalPath += `language_level=${filters.language_level}&`;
      if (filters.government) finalPath += `state=${filters.government}&`;
      if (filters.rate) finalPath += `minRate=8&`;
      if (filters.maxPrice) finalPath += `maxPrice=${filters.maxPrice}&`;
      if (filters.gender !== "Any") finalPath += `gender=${filters.gender}&`;
      setOpenFilters(false);
      router.push(finalPath + `page=1&`);
    }
  }, [search]);

  useEffect(() => {
    if (searchParams.toString() !== "") {
      const splited = searchParams.toString().split("&");
      setAppliedFilters(splited);
    } else {
      setAppliedFilters(undefined);
    }
  }, [searchParams]);
  const handleRemove = (lable: string) => {
    let value_;
    const lable_ = lable === "state" ? "government" : lable === "minRate" ? "rate" : lable;
    const condition = ["language", "language_level", "state"].includes(lable);
    if (condition) value_ = null;
    if (lable === "minRate") value_ = false;
    if (lable === "maxPrice") value_ = "";
    if (lable === "gender") value_ = "Any";
    setInputs(lable_ as any, value_);
    handleSearch(undefined);
  };
  const AppliedFiltersUi = (from: 0 | 3, to: 3 | 6) => {
    return appliedFilters?.slice(from, to).map((e) => {
      const lable = e.split("=")[0];
      const value = e.split("=")[1];
      if (lable !== "page") {
        return (
          <button
            key={e + "tisl"}
            onClick={() => handleRemove(lable)}
            className="relative py-[2px] px-2 text-[8px] sm:text-sm rounded-full border border-maindark text-maindark text-nowrap"
          >
            {lable === "minRate"
              ? "4 stars & up"
              : lable === "maxPrice"
              ? `Max price: ${value}`
              : value}
            <div className="absolute hover:opacity-[1] opacity-0 text-anotherLight duration-200 w-full h-full left-0 top-0 rounded-full bg-maindarkblur flex justify-center items-center">
              X
            </div>
          </button>
        );
      }
    });
  };
  return (
    <>
      <div className="w-full py-2 flex items-center border-b-2 border-maindark mb-2 mt-[-6px]">
        <div className="w-full flex flex-col gap-1">
          <ul className="flex gap-y-1 gap-2">{AppliedFiltersUi(0, 3)}</ul>
          <ul className="flex gap-y-1 gap-2">{AppliedFiltersUi(3, 6)}</ul>
        </div>
        <div className="w-full flex justify-end">
          <button
            onClick={() => setOpenFilters(true)}
            className="flex justify-center items-center gap-3 px-4 min-[500px]:px-6 py-2 text-base text-mainlight min-[500px]:text-xl bg-maindark rounded-full"
          >
            Filters <IoFilterSharp />
          </button>
        </div>
      </div>
      {openFilters && (
        <>
          <div
            onClick={() => setOpenFilters(false)}
            className="fixed w-full h-dvh left-0 top-0 bg-blackLayer z-50"
          ></div>
          <div className="w-full min-[500px]:w-[480px] fixed z-50 px-mainX left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
            <div className="w-full bg-maindark rounded-lg p-3 pt-5">
              <h1 className="text-2xl text-mainlight mx-auto w-fit font-bold">Filters</h1>
              {/* language */}
              <button
                onClick={() => setOpenDrops("language", !dropDowns.language)}
                onBlur={() => setOpenDrops("language", false)}
                className={`${
                  dropDowns.language ? "border-mainlight" : "border-anotherLight"
                } mt-3 bg-seclight relative text-mainlight w-full text-sm border duration-200 rounded-md px-2 py-3 flex justify-between items-center cursor-pointer`}
              >
                {filters.language ?? "Language"}
                <span>
                  <MdKeyboardArrowDown />
                </span>
                <ul
                  className={
                    styles.orders +
                    ` ${
                      dropDowns.language ? "" : "hidden"
                    } z-10 shadow-xl bg-seclight overflow-y-scroll absolute w-full max-h-[140px] px-2 rounded-md left-0 top-[50px] flex flex-col`
                  }
                >
                  {languages.map((e, i) => {
                    return (
                      <li
                        onClick={() => setInputs("language", e)}
                        key={i}
                        className={`py-3 ${
                          i !== languages.length - 1 ? "border-b" : ""
                        } text-mainlight`}
                      >
                        {e}
                      </li>
                    );
                  })}
                </ul>
              </button>
              {/* language Level */}
              <button
                onClick={() => setOpenDrops("language_level", !dropDowns.language_level)}
                onBlur={() => setOpenDrops("language_level", false)}
                className={`${
                  dropDowns.language_level ? "border-mainlight" : "border-anotherLight"
                } mt-3 bg-seclight relative text-mainlight w-full text-sm border duration-200 rounded-md px-2 py-3 flex justify-between items-center cursor-pointer`}
              >
                {filters.language_level ?? "Language level"}
                <span>
                  <MdKeyboardArrowDown />
                </span>
                <ul
                  className={
                    styles.orders +
                    ` ${
                      dropDowns.language_level ? "" : "hidden"
                    } z-10 shadow-xl bg-seclight overflow-y-scroll absolute w-full max-h-[140px] px-2 rounded-md left-0 top-[50px] flex flex-col`
                  }
                >
                  {language_levels.map((e, i) => {
                    return (
                      <li
                        onClick={() => setInputs("language_level", e)}
                        key={i}
                        className={`py-3 ${
                          i !== language_levels.length - 1 ? "border-b" : ""
                        } text-mainlight`}
                      >
                        {e}
                      </li>
                    );
                  })}
                </ul>
              </button>
              {/* Government */}
              <button
                onClick={() => setOpenDrops("government", !dropDowns.government)}
                onBlur={() => setOpenDrops("government", false)}
                className={`${
                  dropDowns.government ? "border-mainlight" : "border-anotherLight"
                } mt-3 bg-seclight relative text-mainlight w-full text-sm border duration-200 rounded-md px-2 py-3 flex justify-between items-center cursor-pointer`}
              >
                {filters.government ?? "Government"}
                <span>
                  <MdKeyboardArrowDown />
                </span>
                <ul
                  className={
                    styles.orders +
                    ` ${
                      dropDowns.government ? "" : "hidden"
                    } z-10 shadow-xl bg-seclight overflow-y-scroll absolute w-full max-h-[140px] px-2 rounded-md left-0 top-[50px] flex flex-col`
                  }
                >
                  {states.map((e, i) => {
                    return (
                      <li
                        onClick={() => setInputs("government", e)}
                        key={i}
                        className={`py-3 ${
                          i !== states.length - 1 ? "border-b" : ""
                        } text-mainlight`}
                      >
                        {e}
                      </li>
                    );
                  })}
                </ul>
              </button>
              {/* Gender */}
              <button
                onClick={() => setOpenDrops("gender", !dropDowns.gender)}
                onBlur={() => setOpenDrops("gender", false)}
                className={`${
                  dropDowns.gender ? "border-mainlight" : "border-anotherLight"
                } mt-3 bg-seclight relative text-mainlight w-full text-sm border duration-200 rounded-md px-2 py-3 flex justify-between items-center cursor-pointer`}
              >
                {filters.gender === "Any" ? "Gender" : filters.gender}
                <span>
                  <MdKeyboardArrowDown />
                </span>
                <ul
                  className={
                    styles.orders +
                    ` ${
                      dropDowns.gender ? "" : "hidden"
                    } z-10 shadow-xl bg-seclight overflow-y-scroll absolute w-full max-h-[140px] px-2 rounded-md left-0 top-[50px] flex flex-col`
                  }
                >
                  {genders.map((e, i) => {
                    return (
                      <li
                        onClick={() => setInputs("gender", e)}
                        key={i}
                        className={`py-3 ${
                          i !== genders.length - 1 ? "border-b" : ""
                        } text-mainlight`}
                      >
                        {e}
                      </li>
                    );
                  })}
                </ul>
              </button>
              {/* Rate */}
              <div className="w-full flex flex-col gap-2 min-[500px]:gap-0 min-[500px]:flex-row justify-between items-center mt-3">
                <ul
                  onClick={() => setInputs("rate", !filters.rate)}
                  className={`${
                    filters.rate ? "opacity-[1]" : "opacity-[0.5]"
                  } flex w-fit gap-2 cursor-pointer duration-300 hover:scale-[1.02]`}
                >
                  <li className="text-2xl text-mainlight">
                    <FaStar />
                  </li>
                  <li className="text-2xl text-mainlight">
                    <FaStar />
                  </li>
                  <li className="text-2xl text-mainlight">
                    <FaStar />
                  </li>
                  <li className="text-2xl text-mainlight">
                    <FaStar />
                  </li>
                  <li className="text-2xl text-seclight">
                    <FaStar />
                  </li>
                  & Up
                </ul>
                {/* Max price */}
                <label>
                  <input
                    value={filters.maxPrice}
                    onChange={(e) => setInputs("maxPrice", e.target.value)}
                    type="number"
                    className={`border-b-2 border-seclight placeholder:text-seclight py-2 bg-transparent outline-0 px-1 text-center mx-auto caret-mainlight duration-200 focus:border-mainlight focus:placeholder:text-mainlight`}
                    placeholder="Max price"
                  />
                </label>
              </div>
              <MyButton
                buttonColors="bg-mainlight text-maindark mx-auto mt-5"
                say={"Search"}
                loading={false}
                clickFunc={handleSearch}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
