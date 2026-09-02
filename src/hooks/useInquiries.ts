import { useSelector } from "react-redux";
import useSWR, { mutate } from "swr";
import { selectUserToken } from "../features/user/userSlice";

export interface Inquiry {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  postal_code?: string | null;
  street?: string | null;
  message?: string | null;
  config?: string | null; // JSON string of the configuration sections
  created_at?: string | null;
  locked_by?: string | null; // username of the admin who locked (claimed) it
  locked_at?: string | null;
  lock_note?: string | null;
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

  const api = (id: number, path = "") =>
    `${process.env.REACT_APP_API_URL}/api/admin/inquiries/${id}${path}`;

  // Delete one or many inquiries (D1 row + stored door images), then refresh the list.
  // Locked inquiries are rejected server-side (409) — they never reach here from the UI.
  const deleteInquiries = async (ids: number[]) => {
    if (!token || !ids.length) return;
    await Promise.all(
      ids.map((id) =>
        fetch(api(id), { method: "DELETE", headers: { Authorization: `Bearer ${token}` } })
      )
    );
    await refetch();
  };

  // Lock (claim) an inquiry with an optional note; then refresh.
  const lockInquiry = async (id: number, note: string) => {
    if (!token) return;
    await fetch(api(id, "/lock"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ note }),
    });
    await refetch();
  };

  // Unlock an inquiry (server enforces: only the locker or a superadmin).
  const unlockInquiry = async (id: number): Promise<boolean> => {
    if (!token) return false;
    const r = await fetch(api(id, "/unlock"), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    await refetch();
    return r.ok;
  };

  const inquiries: Inquiry[] = Array.isArray(data) ? data : data?.inquiries ?? [];

  return {
    inquiries,
    isLoading: !error && !data,
    isError: error,
    refetch,
    deleteInquiries,
    lockInquiry,
    unlockInquiry,
  };
};
