import useSWR from "swr";
import { EquipmentLock } from "../types";

interface UseLocksReturn {
  locks: EquipmentLock[] | undefined;
  isLoading: boolean;
  isError: boolean;
  revalidate: () => Promise<boolean>;
  deleteLock: (id: number) => Promise<void>;
  addOrUpdateLock: (
    id: number | null,
    lockData: Partial<EquipmentLock>
  ) => Promise<void>;
}

interface ApiResponse {
  success: boolean;
  equipment_locks: EquipmentLock[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useLocks = (): UseLocksReturn => {
  const { data, error, mutate } = useSWR<ApiResponse>(
    `${process.env.REACT_APP_API_URL}/api/equipment-locks`,
    fetcher
  );

  const locks = data?.equipment_locks;

  const revalidate = async (): Promise<boolean> => {
    await mutate();
    return !error;
  };

  const deleteLock = async (id: number): Promise<void> => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/equipment-locks/${id}`, {
      method: "DELETE",
    });
    await mutate();
  };

  const addOrUpdateLock = async (
    id: number | null,
    lockData: Partial<EquipmentLock>
  ): Promise<void> => {
    const url = id
      ? `${process.env.REACT_APP_API_URL}/api/equipment-locks/${id}`
      : `${process.env.REACT_APP_API_URL}/api/equipment-locks`;

    const method = id ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lockData),
    });

    await mutate();
  };

  return {
    locks,
    isLoading: !error && !data,
    isError: !!error,
    revalidate,
    deleteLock,
    addOrUpdateLock,
  };
};
