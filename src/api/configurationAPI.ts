import { DefaultItemsResponse } from "../features/configuration/configurationSlice";

const API_URL = process.env.REACT_APP_API_URL;

export const fetchDefaultItemsAPI = async (): Promise<DefaultItemsResponse> => {
  const response = await fetch(`${API_URL}/api/default-items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch default items");
  }

  return response.json();
};
