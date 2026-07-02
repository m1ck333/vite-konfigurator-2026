import { useSelector } from "react-redux";
import useSWR, { mutate } from "swr";
import { selectUserToken } from "../features/user/userSlice";

const createFetcher = (token: string) => (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

export const useUsers = (shouldFetch = true) => {
  const token = useSelector(selectUserToken);

  const { data, error } = useSWR(
    shouldFetch && token
      ? [`${process.env.REACT_APP_API_URL}/api/users`, token]
      : null,
    ([url, token]) => createFetcher(token)(url),
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const refetch = async () => {
    if (token) {
      await mutate([`${process.env.REACT_APP_API_URL}/api/users`, token]);
    }
  };

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
    refetch,
  };
};
