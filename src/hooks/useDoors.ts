import useSWR from "swr";
import { Door } from "../types";
import { useEffect, useState } from "react";

interface UseDoorsReturn {
  doors: Door[] | undefined;
  isLoading: boolean;
  isError: boolean;
  revalidate: () => Promise<boolean>;
  deleteDoor: (id: number) => Promise<void>;
  addOrUpdateDoor: (
    id: number | null,
    doorData: Partial<Door>
  ) => Promise<boolean>;
}

interface ApiResponse {
  success: boolean;
  doors: Door[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useDoors = (filter: string): UseDoorsReturn => {
  const [filteredDoors, setFilteredDoors] = useState<Door[]>([]);

  const { data, error, mutate } = useSWR<ApiResponse>(
    `${process.env.REACT_APP_API_URL}/api/doors`,
    fetcher
  );

  const doors = data?.doors;

  useEffect(() => {
    if (doors) {
      const processedDoors = doors.map((door) => ({
        ...door,
        thumbnail:
          typeof door.thumbnail === "string" &&
          door.thumbnail.startsWith("storage/")
            ? door.thumbnail
            : typeof door.thumbnail === "string"
              ? `storage/${door.thumbnail}`
              : door.thumbnail, // Keep File objects unchanged
      }));

      const filtered = processedDoors.filter((door) => {
        switch (filter) {
          case "with-glass":
            return door.has_glass;
          case "without-glass":
            return !door.has_glass;
          case "all":
          default:
            return true;
        }
      });

      setFilteredDoors(filtered);
    }
  }, [doors, filter]);

  const revalidate = async (): Promise<boolean> => {
    await mutate();
    return !error;
  };

  const deleteDoor = async (id: number): Promise<void> => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/doors/${id}`, {
      method: "DELETE",
    });
    await mutate();
  };

  const addOrUpdateDoor = async (
    id: number | null,
    doorData: Partial<Door>
  ): Promise<boolean> => {
    const url = id
      ? `${process.env.REACT_APP_API_URL}/api/doors/${id}`
      : `${process.env.REACT_APP_API_URL}/api/doors`;

    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(doorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating/adding door:", errorData);
        return false;
      }

      await mutate();
      return true;
    } catch (error) {
      console.error("Network error:", error);
      return false;
    }
  };

  return {
    doors: filteredDoors,
    isLoading: !error && !data,
    isError: !!error,
    revalidate,
    deleteDoor,
    addOrUpdateDoor,
  };
};
