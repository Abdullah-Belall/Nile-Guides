"use client";
import React, { createContext, useEffect, useReducer } from "react";
import { CLIENT_COLLECTOR_REQ, PROFILE_REQ } from "./_utils/requests/client-requests-hub";
import { UserPayloadInterface } from "./_utils/interfaces/main";

const initialState = {
  first_name: null,
  last_name: null,
  email: null,
  age: null,
  role: null,
  avatar: null,
  gender: null,
  state: null,
};
const authReducer = (
  state: UserPayloadInterface,
  action: { type: "LOGIN" | "LOGOUT"; payload?: UserPayloadInterface }
): any => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return {
        first_name: null,
        last_name: null,
        email: null,
        age: null,
        role: null,
        avatar: null,
        gender: null,
        state: null,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<any>(undefined);
export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    const initializeAuth = async () => {
      const ProfileResponse = await CLIENT_COLLECTOR_REQ(PROFILE_REQ);
      if (ProfileResponse?.done) {
        dispatch({ type: "LOGIN", payload: ProfileResponse.data });
      } else {
        dispatch({
          type: "LOGOUT",
          payload: {
            first_name: null,
            last_name: null,
            email: null,
            age: null,
            role: null,
            avatar: null,
            gender: null,
            state: null,
          },
        });
      }
    };

    initializeAuth();
  }, []);
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};
