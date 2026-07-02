import { getAuthToken, setAuthToken } from "./auth";
import { RegisterFormData, User } from "../types";
import { CustomError } from "../utils";

const API_URL = process.env.REACT_APP_API_URL;

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  let token = getAuthToken();

  const headers: HeadersInit = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    throw new CustomError("Token expired and refresh failed", 401);
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError(
      errorData.message || "Unknown error",
      response.status
    );
  }

  return response.json();
};

export const fetchUserDataAPI = async (): Promise<any> => {
  if (!getAuthToken()) return null;
  return fetchWithAuth(`${API_URL}/api/me`, { method: "POST" });
};

export const loginUserAPI = async (
  username: string,
  password: string
): Promise<any> => {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new CustomError(
      data.messageTranslated || data.message || "Failed to login",
      response.status
    );
  }

  setAuthToken(data.access_token);
  return data;
};

export const logoutUserAPI = async (): Promise<void> => {
  const token = getAuthToken();
  if (!token) return;

  const response = await fetch(`${API_URL}/api/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new CustomError("Failed to logout", response.status);
  }

  // No need to call removeAuthToken here, it will be handled in the Redux slice
};

export const registerUserAPI = async (
  newValues: RegisterFormData
): Promise<any> => {
  return fetchWithAuth(`${API_URL}/api/register`, {
    method: "POST",
    body: JSON.stringify(newValues),
  });
};

export const editUserAPI = async (
  userId: number,
  updatedData: Partial<User>
): Promise<any> => {
  return fetchWithAuth(`${API_URL}/api/user/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updatedData),
  });
};

export const deleteUserAPI = async (userId: number): Promise<any> => {
  return fetchWithAuth(`${API_URL}/api/user/${userId}`, {
    method: "DELETE",
  });
};
