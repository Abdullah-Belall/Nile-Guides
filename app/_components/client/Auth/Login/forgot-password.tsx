"use client";
import MyButton from "@/app/_components/templates/my-button";
import {
  FORGOT_PASSWORD_CONFIRMATION_REQ,
  FORGOT_PASSWORD_REQ,
} from "@/app/_utils/requests/client-requests-hub";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function ForgotPasswordComponent() {
  const router = useRouter();
  const [code1, setCode1] = useState<any>("");
  const [code2, setCode2] = useState<any>("");
  const [code3, setCode3] = useState<any>("");
  const [code4, setCode4] = useState<any>("");
  const [code5, setCode5] = useState<any>("");
  const [code6, setCode6] = useState<any>("");
  const one = useRef<any>();
  const two = useRef<any>();
  const three = useRef<any>();
  const four = useRef<any>();
  const five = useRef<any>();
  const six = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [email, setEmail] = useState("");
  const [skipStep, setSkipStep] = useState(false);
  const [resendCode, setResendCode] = useState(0);
  const handleInp = (e: any) => {
    return e.target.value < 0 || e.target.value > 9 ? "" : e.target.value;
  };
  const handleSend = async (e: any) => {
    e.preventDefault();
    if (loading) return;
    if (!skipStep) {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isEmailValid) {
        setErrMessage(`Email Not vaild.`);
        return;
      }
      setLoading(true);
      const response = await FORGOT_PASSWORD_REQ({ email });
      if (response?.done) {
        setSkipStep(true);
        setErrMessage(``);
      } else {
        setErrMessage(response?.message as string);
      }
      setLoading(false);
      return;
    }

    const condition =
      code1 !== "" && code2 !== "" && code3 !== "" && code4 !== "" && code5 !== "" && code6 !== "";
    if (!condition) {
      setErrMessage("Please fill all inputs.");
      return;
    }
    setErrMessage("");
    setLoading(true);
    const verification_code = code1 + code2 + code3 + code4 + code5 + code6;
    const response = await FORGOT_PASSWORD_CONFIRMATION_REQ({ email, verification_code });
    if (response?.done) {
      router.push("/profile/new-pass");
    } else {
      setErrMessage(response?.message as string);
    }
    setLoading(false);
  };
  const ResendCode = async (e: any) => {
    e.preventDefault();
    if (loading) return;
    setResendCode(resendCode + 1);
    if (resendCode > 3) {
      setErrMessage("Try again later.");
      return;
    }
    setLoading(true);
    const response = await FORGOT_PASSWORD_REQ({ email });
    if (response?.done) {
      setErrMessage(``);
    } else {
      setErrMessage(response?.message as string);
    }
    setLoading(false);
  };
  return (
    <div className="relative flex flex-col justify-center overflow-hidden py-12 px-mainX">
      <div className="relative bg-gradient-to-b from-[#cdbc9a] to-[#AE9460] px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl text-mainlight">
              <p>Forgot Password</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-anotherLight">
              <p>
                {skipStep
                  ? "We sent a verification code to your email address"
                  : "We will send a code to your email address"}
              </p>
            </div>
          </div>
          <div>
            <form>
              <div className="flex flex-col space-y-8">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`${
                    skipStep ? "hidden" : ""
                  } placeholder:text-sm placeholder:text-secdark p-3 w-full outline-none rounded-lg border border-gray-200 text-sm bg-mainlight focus:border-maindark caret-maindark text-maindark`}
                />
                <div
                  className={`${
                    skipStep ? "" : "hidden"
                  } flex gap-2 flex-row items-center justify-between mx-auto w-full max-w-xs`}
                >
                  <div className="w-16 h-16">
                    <input
                      onChange={(e) => {
                        setCode1(handleInp(e));
                        two.current.focus();
                      }}
                      value={code1}
                      ref={one}
                      className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-mainlight focus:border-maindark caret-maindark text-maindark"
                      type="number"
                    />
                  </div>
                  <div className="w-16 h-16">
                    <input
                      onChange={(e) => {
                        setCode2(handleInp(e));
                        three.current.focus();
                      }}
                      value={code2}
                      ref={two}
                      className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-mainlight focus:border-maindark caret-maindark text-maindark"
                      type="number"
                    />
                  </div>
                  <div className="w-16 h-16">
                    <input
                      onChange={(e) => {
                        setCode3(handleInp(e));
                        four.current.focus();
                      }}
                      value={code3}
                      ref={three}
                      className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-mainlight focus:border-maindark caret-maindark text-maindark"
                      type="number"
                    />
                  </div>
                  <div className="w-16 h-16">
                    <input
                      onChange={(e) => {
                        setCode4(handleInp(e));
                        five.current.focus();
                      }}
                      value={code4}
                      ref={four}
                      className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-mainlight focus:border-maindark caret-maindark text-maindark"
                      type="number"
                    />
                  </div>
                  <div className="w-16 h-16">
                    <input
                      onChange={(e) => {
                        setCode5(handleInp(e));
                        six.current.focus();
                      }}
                      value={code5}
                      ref={five}
                      className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-mainlight focus:border-maindark caret-maindark text-maindark"
                      type="number"
                    />
                  </div>
                  <div className="w-16 h-16">
                    <input
                      onChange={(e) => setCode6(handleInp(e))}
                      value={code6}
                      ref={six}
                      className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-mainlight focus:border-maindark caret-maindark text-maindark"
                      type="number"
                    />
                  </div>
                </div>
                <div className="flex flex-col mt-0">
                  <MyButton
                    buttonColors="bg-mainlight text-maindark mx-auto"
                    say="Send"
                    loading={loading}
                    clickFunc={handleSend}
                    vaildationMessage={errMessage}
                    vaildationMessageWidth="mx-auto"
                  />
                  <div
                    className={`${
                      skipStep ? "" : "hidden"
                    } flex flex-row items-center justify-center text-center text-xs mt-2 font-medium space-x-1 text-anotherLight`}
                  >
                    <p>Didn&lsquo;t recieve code?</p>{" "}
                    <button
                      onClick={(e) => ResendCode(e)}
                      className="outline-0 flex flex-row items-center text-anotherLight underline hover:no-underline duration-300"
                      rel="noopener noreferrer"
                    >
                      Resend
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
