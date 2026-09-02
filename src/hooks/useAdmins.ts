import { useSelector } from "react-redux";
import useSWR, { mutate } from "swr";
import { selectUserToken } from "../features/user/userSlice";

export interface AdminAccount {
  id: number;
  username: string;
  role: string; // "admin" | "superadmin"
  city?: string | null;
  email?: string | null;
}

export interface AdminPayload {
  username?: string;
  password?: string;
  role?: string;
  city?: string | null;
}

const API = process.env.REACT_APP_API_URL;
const key = `${API}/api/users`;

// Staff (admin/superadmin) account management. Reads the shared /api/users list but exposes only
// the staff rows; all mutations are superadmin-gated on the server (a plain admin gets 403).
export const useAdmins = (shouldFetch = true) => {
  const token = useSelector(selectUserToken);

  const { data, error } = useSWR(
    shouldFetch && token ? [key, token] : null,
    ([url, token]) => fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const refetch = async () => {
    if (token) await mutate([key, token]);
  };

  const auth = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` });

  const createAdmin = async (payload: AdminPayload): Promise<Response> => {
    const res = await fetch(`${API}/api/register`, { method: "POST", headers: auth(), body: JSON.stringify(payload) });
    await refetch();
    return res;
  };
  const updateAdmin = async (id: number, payload: AdminPayload): Promise<Response> => {
    const res = await fetch(`${API}/api/user/${id}`, { method: "PUT", headers: auth(), body: JSON.stringify(payload) });
    await refetch();
    return res;
  };
  const deleteAdmin = async (id: number): Promise<Response> => {
    const res = await fetch(`${API}/api/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await refetch();
    return res;
  };

  const all = Array.isArray(data) ? data : data?.users ?? [];
  const admins: AdminAccount[] = all.filter(
    (u: AdminAccount) => u.role === "admin" || u.role === "superadmin"
  );

  return { admins, isLoading: !error && !data, isError: error, refetch, createAdmin, updateAdmin, deleteAdmin };
};
