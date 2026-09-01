import { useSelector } from "react-redux";
import useSWR, { mutate } from "swr";
import { selectUserToken } from "../features/user/userSlice";

export interface Inquiry {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  config?: string | null; // JSON string of the configuration sections
  created_at?: string | null;
}

const createFetcher = (token: string) => (url: string) =>
  fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json());

export const useInquiries = (shouldFetch = true) => {
  const token = useSelector(selectUserToken);
  const key = `${process.env.REACT_APP_API_URL}/api/admin/inquiries`;

  const { data, error } = useSWR(
    shouldFetch && token ? [key, token] : null,
    ([url, token]) => createFetcher(token)(url),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const refetch = async () => {
    if (token) await mutate([key, token]);
  };

  // Delete one or many inquiries (D1 row + stored door images), then refresh the list.
  const deleteInquiries = async (ids: number[]) => {
    if (!token || !ids.length) return;
    await Promise.all(
      ids.map((id) =>
        fetch(`${process.env.REACT_APP_API_URL}/api/admin/inquiries/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );
    await refetch();
  };

  const inquiries: Inquiry[] = Array.isArray(data) ? data : data?.inquiries ?? [];

  return { inquiries, isLoading: !error && !data, isError: error, refetch, deleteInquiries };
};
