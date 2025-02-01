"use server";
import axios from "axios";
import { ProfileInterface, RefreshTokenInterface, unCountedMessage } from "../interfaces/main";
import { cookies } from "next/headers";

const BASE_URL = "https://nile-guides.vercel.app/api";
//? ALLOWED FOR ANY USER (NO NEED FOR SERVER_COLLECTOR_REQ())
const HOME_POSTS_SERVER_REQ = async (params?: {
  page?: string;
  gender?: string;
  language?: string;
  language_level?: string;
  state?: string;
  rate?: string;
  minPrice?: string;
  maxPrice?: string;
}) => {
  try {
    const response: any = await axios.get(`${BASE_URL}/home-posts`, { params });
    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const GET_POST_SERVER_REQ = async ({ id }: { id: string }): Promise<any> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/post/${id}`);
    return response?.data?.title
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
//? ALLOWED FOR ONLY LOGGED USER (NEED FOR SERVER_COLLECTOPR_REQ())
const USER_ROLE_SERVER_REQ = async ({ access_token }: { access_token: string }): Promise<any> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/user-role`, {
      headers: { cookie: `access_token=${access_token};` },
    });
    return response?.data?.role
      ? { done: true, role: response?.data.role }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const PROFILE_SERVER_REQ = async ({
  access_token,
}: {
  access_token: string;
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/profile`, {
      headers: {
        cookie: `access_token=${access_token};`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return response?.data?.email
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const TICKETS_SERVER_REQ = async ({
  type,
  access_token,
  params,
}: {
  access_token: string;
  type: "workers" | "clients";
  params: { page?: string; status?: string };
}): Promise<ProfileInterface> => {
  params.status = params.status ?? "pending";
  try {
    const response: any = await axios.get(`${BASE_URL}/tickets/${type}`, {
      params,
      headers: { cookie: `access_token=${access_token};` },
    });
    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
//? CLIENTS REQUESTS
const CLIENT_ORDERS_SERVER_REQ = async ({
  params,
  access_token,
}: {
  params: { page?: string };
  access_token: string;
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/clients/orders`, {
      params,
      headers: { cookie: `access_token=${access_token};` },
    });

    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
//? WORKERS REQUESTS
const WORKERS_POSTS_SERVER_REQ = async ({
  access_token,
}: {
  access_token: string;
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/workers/posts`, {
      headers: { cookie: `access_token=${access_token};` },
    });
    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const WORKERS_SERVICES_SERVER_REQ = async ({
  params,
  access_token,
}: {
  params: { page?: string };
  access_token: string;
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/workers/services`, {
      params,
      headers: { cookie: `access_token=${access_token};` },
    });
    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const WORKERS_SERVICES_DETAILS_SERVER_REQ = async ({
  access_token,
}: {
  access_token: string;
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/workers/services/details`, {
      headers: { cookie: `access_token=${access_token};` },
    });
    return response?.data?.totalMoneyWithoutBenfits === 0 ||
      response?.data?.totalMoneyWithoutBenfits
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
//! ALLOWED FOR ONLY ADMINS
const DASHBOARD_POSTS_SERVER_REQ = async ({
  access_token,
  params,
}: {
  access_token: string;
  params: { page: number; status: string };
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/admins/posts`, {
      params,
      headers: { cookie: `access_token=${access_token};` },
    });
    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const DASHBOARD_USERS_SERVER_REQ = async ({
  access_token,
  params,
}: {
  access_token: string;
  params: { type: string; gender: string; minAge: number };
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/admins/users`, {
      params,
      headers: { cookie: `access_token=${access_token};` },
    });

    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const DASHBOARD_ONE_USER_SERVER_REQ = async ({
  access_token,
  body,
}: {
  access_token: string;
  body: { user_email: string };
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.post(
      `${BASE_URL}/admins/users/find-one`,
      {
        ...body,
      },
      { headers: { cookie: `access_token=${access_token}` } }
    );
    return response?.data.role
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const DASHBOARD_USER_TICKETS_SERVER_REQ = async ({
  access_token,
  data,
}: {
  access_token: string;
  data: { user_email: string; role: string };
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.post(
      `${BASE_URL}/admins/users/find-one/tickets/${data.role}`,
      {
        user_email: data.user_email,
      },
      { headers: { cookie: `access_token=${access_token}` } }
    );
    return response?.data.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const DASHBOARD_WORKER_POSTS_SERVER_REQ = async ({
  access_token,
  data,
}: {
  access_token: string;
  data: { email: string };
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.post(
      `${BASE_URL}/admins/users/find-one/worker-posts`,
      {
        email: data.email,
      },
      { headers: { cookie: `access_token=${access_token}` } }
    );

    return response?.data.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const DASHBOARD_ORDERS_SERVER_REQ = async ({
  access_token,
  params,
}: {
  access_token: string;
  params: { page: number };
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/admins/orders`, {
      params,
      headers: { cookie: `access_token=${access_token};` },
    });
    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const DASHBOARD_ONE_POST_SERVER_REQ = async ({
  access_token,
  id,
}: {
  access_token: string;
  id: string;
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/admins/posts/${id}`, {
      headers: { cookie: `access_token=${access_token}` },
    });
    return response?.data.title
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
const DASHBOARD_USERS_TICKETS_SERVER_REQ = async ({
  access_token,
  role,
  params,
}: {
  access_token: string;
  role: "clients" | "workers";
  params: { page: number; status: string };
}): Promise<ProfileInterface> => {
  if (!params?.status) params.status = "pending";
  try {
    const response: any = await axios.get(`${BASE_URL}/admins/users/tickets/${role}`, {
      params: await params,
      headers: { cookie: `access_token=${access_token};` },
    });
    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
//* MAIN FUNCTION (USED FOR ALL REQUESTS THAT NEED ACCESS_TOKEN)
const SERVER_COLLECTOR_REQ = async (varFunction: any, dataBody?: any) => {
  let access_token = await getCookieServer("access_token");
  if (!access_token) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
    access_token = refreshResponse.access_token;
  }
  const response = await varFunction({ ...dataBody, access_token });
  if (!response.done && response.status === 401) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
    access_token = refreshResponse.access_token;
    const retryResponse = await varFunction({ ...dataBody, access_token });
    return retryResponse;
  }
  return response;
};
//* REFRESH_TOKEN_REQ
const REFRESH_TOKEN_REQ = async (): Promise<RefreshTokenInterface> => {
  const refresh_token = await getCookieServer(`refresh_token`);
  try {
    const response = await axios.get(`${BASE_URL}/refresh-token`, {
      headers: { cookie: `refresh_token=${refresh_token};` },
    });
    return response?.data?.done
      ? response?.data
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    return {
      done: false,
      message: error?.response?.data?.error?.message || unCountedMessage,
      status: error.status,
    };
  }
};
//* COOKIES HANDLER
const getCookieServer = async (keyName: string): Promise<string | undefined> => {
  return (await cookies()).get(keyName)?.value;
};
export {
  HOME_POSTS_SERVER_REQ,
  PROFILE_SERVER_REQ,
  SERVER_COLLECTOR_REQ,
  WORKERS_POSTS_SERVER_REQ,
  TICKETS_SERVER_REQ,
  DASHBOARD_POSTS_SERVER_REQ,
  USER_ROLE_SERVER_REQ,
  CLIENT_ORDERS_SERVER_REQ,
  WORKERS_SERVICES_SERVER_REQ,
  WORKERS_SERVICES_DETAILS_SERVER_REQ,
  GET_POST_SERVER_REQ,
  DASHBOARD_USERS_SERVER_REQ,
  DASHBOARD_ONE_USER_SERVER_REQ,
  DASHBOARD_USER_TICKETS_SERVER_REQ,
  DASHBOARD_WORKER_POSTS_SERVER_REQ,
  DASHBOARD_ORDERS_SERVER_REQ,
  DASHBOARD_ONE_POST_SERVER_REQ,
  DASHBOARD_USERS_TICKETS_SERVER_REQ,
};
