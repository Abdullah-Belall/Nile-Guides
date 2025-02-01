"use client";
import axios from "axios";
import {
  LoginInterface,
  PostInterface,
  ProfileInterface,
  ReqResInterface,
  SignUpInterface,
  TicketInterface,
  unCountedMessage,
  UpdateUserDataInterface,
  VerifyEmailInterface,
} from "../interfaces/main";
const BASE_URL = "https://nile-guides.vercel.app/api";
//? PUBLIC REQUESTS
const GET_POST_REQ = async (id: string): Promise<any> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/post/${id}`);
    return response?.data?.title
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
//? AUTH REQUESTS (NO NEED FOR ACCESS_TOKENS MEAN THAT WE WILL NOT USE CLIENT_COLLECTOR_REQ())
const SIGNUP_REQ = async (userPackage: SignUpInterface): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/signup`, userPackage);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const VERIFY_EMAIL_REQ = async (data: VerifyEmailInterface): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/verify-email`, data);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const LOGIN_REQ = async (data: LoginInterface): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/login`, data);
    if (response?.data?.done) {
      setCookie("access_token", response?.data?.access_token);
      return { done: true };
    } else {
      return { done: false, message: unCountedMessage, status: response.status };
    }
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const FORGOT_PASSWORD_REQ = async (data: { email: string }): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/forgot-password`, data);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const FORGOT_PASSWORD_CONFIRMATION_REQ = async (
  data: VerifyEmailInterface
): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/forgot-password-key`, data);
    setCookie("access_token", response?.data?.access_token);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
//? LOGGED USERS REQUESTS (NEED FOR ACCESS_TOKENS MEAN THAT WE WILL ALWAYES USE CLIENT_COLLECTOR_REQ())
const PROFILE_REQ = async (): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/profile`);
    return response?.data?.email
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const EDIT_USER_DATA_REQ = async (data: UpdateUserDataInterface): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.patch(`${BASE_URL}/update-user-data`, data);

    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const UPLOAD_IMAGE_REQ = async ({
  formData,
  type,
}: {
  formData: string;
  type: "save" | "temporary-save";
}): Promise<any> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/upload-image/${type}`, formData);

    return response?.data?.filename
      ? { done: true, filename: response?.data?.filename }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const DELETE_IMAGE_REQ = async ({
  fileName,
  type,
}: {
  fileName: string;
  type: "delete" | "temporary-delete";
}): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.delete(`${BASE_URL}/image/${fileName}/${type}`);

    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const LOGOUT_REQ = async (): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/logout`);

    if (response?.data?.done) setCookie("access_token", "LOGGED OUT");
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const MAKE_TICKET_REQ = async ({
  type,
  data,
}: {
  type: "clients" | "workers";
  data: TicketInterface;
}): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/make-ticket/${type}`, data);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
//? CLIENTS REQUESTS
const CLIENT_ORDERS_REQ = async (params?: { page?: string }): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/clients/orders`, { params });
    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const BOOK_REQ = async ({
  id,
  data,
}: {
  id?: string;
  data: { from: string; to: string; day: string };
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/clients/book/${id}`, data);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const CANCEL_BOOK_REQ = async ({ id }: { id?: string }): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.patch(`${BASE_URL}/clients/cancel-book/${id}`);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const CONFIRM_BOOK_REQ = async ({
  id,
  data,
}: {
  id?: string;
  data: { paid: number };
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.patch(`${BASE_URL}/clients/book/pay/${id}`, data);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const STRIPE_CLIENT_SECRET_REQ = async (data: { amount: number }): Promise<any> => {
  const data_ = { ...data, currency: "usd" };
  try {
    const response: any = await axios.post(`${BASE_URL}/clients/client-secret`, data_);
    return response?.data?.clientSecret
      ? { done: true, clientSecret: response?.data?.clientSecret }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};

//? WORKERS REQUESTS
const WORKERS_SERVICES_REQ = async (params?: { page?: string }): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/workers/services`, { params });
    return response?.data?.data
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const WORKER_POST_REQ = async ({ id }: { id: string }): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.get(`${BASE_URL}/workers/posts/${id}`);
    return response?.data?.id
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const NEW_POST_REQ = async ({ data }: { data: PostInterface }): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/workers/new-post`, data);

    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const UPDATE_POST_REQ = async ({
  data,
  id,
}: {
  data: PostInterface;
  id: string;
}): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.patch(`${BASE_URL}/workers/update-post/${id}`, data);
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const BOOK_ACTIONS_REQ = async ({
  data,
  id,
}: {
  data: PostInterface;
  id: string;
}): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.patch(`${BASE_URL}/workers/book-actions/${id}`, data);

    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
//! ADMINS REQUESTS
const DASHBOARD_POST_ACTIONS_REQ = async ({
  data,
  id,
}: {
  data: { changeTo: string; message: string };
  id: string;
}): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.patch(`${BASE_URL}/admins/posts/action/${id}`, data);

    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const DASHBOARD_ONE_USER_REQ = async ({
  body,
}: {
  body: { user_email: string };
}): Promise<ProfileInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/admins/users/find-one`, body);
    return response?.data.role
      ? { done: true, data: { ...response?.data } }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const DASHBOARD_CHANGE_ROLE_REQ = async ({
  body,
}: {
  body: {
    user_email: string;
    change_role_to: "client" | "worker" | "admin" | "superadmin";
    state: string;
  };
}): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/admins/users/find-one/change-role`, body);

    return response?.data.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const DASHBOARD_TICKET_ACTIONS_REQ = async ({
  data,
}: {
  data: { ticket_id: string; type: string; status: string };
}): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.patch(`${BASE_URL}/admins/users/tickets/actions`, data);

    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const DASHBOARD_BAND_USER_REQ = async ({
  body,
}: {
  body: {
    user_email: string;
    reason: string;
  };
}): Promise<ReqResInterface> => {
  try {
    const response: any = await axios.post(`${BASE_URL}/admins/users/find-one/band`, body);

    return response?.data.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
//* MAIN FUNCTION (USED FOR ALL REQUESTS THAT NEED ACCESS_TOKEN)
//~ This function receives two variables, the function that executes the request
//~ and the Body parameters, and verifies the presence of the access_token in the cookies.
//~ If it is not present, it will send a request to the server
//~ to renew it and save it automatically through the katsu function.
//~ Then it takes the function that is required to be executed and executes it.
//~ If it returns an error with status code 401, it will make a request to renew
//~ the access_token and re-execute the main request through the function and return the response,
//~ whatever it is.
const CLIENT_COLLECTOR_REQ = async (varFunction: any, dataBody?: any) => {
  const access_token = getCookie("access_token");
  if (!access_token) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
  }
  const response = await varFunction(dataBody);
  if (!response.done && response.status === 401) {
    const refreshResponse = await REFRESH_TOKEN_REQ();
    if (!refreshResponse.done) return { done: false, message: "Unauthorized.", status: 401 };
    const retryResponse = await varFunction(dataBody);
    return retryResponse;
  }
  return response;
};
//* REFRESH_TOKEN_REQ
const REFRESH_TOKEN_REQ = async (): Promise<ReqResInterface> => {
  try {
    const response = await axios.get(`${BASE_URL}/refresh-token`);
    if (response?.data?.access_token) {
      setCookie("access_token", response?.data?.access_token);
    }
    return response?.data?.done
      ? { done: true }
      : { done: false, message: unCountedMessage, status: response.status };
  } catch (error: any) {
    let message = unCountedMessage;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
//* COOKIES HANDLERS
const setCookie = (keyName: string, value: string) => {
  document.cookie = `${keyName}=${value}; path=/; max-age=${15 * 60}; SameSite=Strict`;
};
const getCookie = (keyName: string): string | null => {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${keyName}=`));
  return cookie ? cookie.split("=")[1] : null;
};

export {
  //? AUTH ========
  SIGNUP_REQ,
  VERIFY_EMAIL_REQ,
  FORGOT_PASSWORD_REQ,
  FORGOT_PASSWORD_CONFIRMATION_REQ,
  LOGIN_REQ,
  LOGOUT_REQ,
  //? MAIN FUNCTION ========
  CLIENT_COLLECTOR_REQ,
  //? PUBLIC REQUESTS ========
  GET_POST_REQ,
  //? LOGGED USERS ========
  PROFILE_REQ,
  EDIT_USER_DATA_REQ,
  UPLOAD_IMAGE_REQ,
  DELETE_IMAGE_REQ,
  MAKE_TICKET_REQ,
  //? CLIENTS ========
  CLIENT_ORDERS_REQ,
  BOOK_REQ,
  CANCEL_BOOK_REQ,
  STRIPE_CLIENT_SECRET_REQ,
  //? WORKERS ========
  NEW_POST_REQ,
  UPDATE_POST_REQ,
  WORKERS_SERVICES_REQ,
  BOOK_ACTIONS_REQ,
  CONFIRM_BOOK_REQ,
  WORKER_POST_REQ,
  //! ADMINS ========
  DASHBOARD_POST_ACTIONS_REQ,
  DASHBOARD_ONE_USER_REQ,
  DASHBOARD_CHANGE_ROLE_REQ,
  DASHBOARD_TICKET_ACTIONS_REQ,
  DASHBOARD_BAND_USER_REQ,
};
