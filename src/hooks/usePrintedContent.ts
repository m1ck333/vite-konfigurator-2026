import { useState, useCallback } from "react";
import { fetchWithAuth } from "../api/userAPI";

interface PrintedContent {
  id: number;
  user_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;
}

interface UsePrintedContentReturn {
  printedContents: PrintedContent[] | undefined;
  isLoading: boolean;
  isError: boolean;
  fetchPrintedContents: (
    type: "user" | "admin",
    startDate?: string,
    endDate?: string
  ) => Promise<void>;
  savePrintedContent: (contentData: Partial<PrintedContent>) => Promise<void>;
  setPrintedContents: (contents: PrintedContent[]) => void;
}

const usePrintedContent = (
  selectedUserId?: number
): UsePrintedContentReturn => {
  const [printedContents, setPrintedContents] = useState<PrintedContent[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchPrintedContents = useCallback(
    async (
      type: "user" | "admin",
      startDate?: string,
      endDate?: string
    ): Promise<void> => {
      setIsLoading(true);
      setIsError(false);

      let endpoint =
        type === "user"
          ? `${process.env.REACT_APP_API_URL}/api/user/printed-contents`
          : `${process.env.REACT_APP_API_URL}/api/admin/printed-contents`;

      const params = new URLSearchParams();

      if (selectedUserId) {
        params.append("user_id", selectedUserId.toString());
      }
      if (startDate) {
        params.append("start_date", startDate);
      }
      if (endDate) {
        params.append("end_date", endDate);
      }

      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      try {
        const data = await fetchWithAuth(endpoint);
        setPrintedContents(data.contents);
      } catch (error) {
        console.error(`Error fetching ${type} printed contents:`, error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedUserId]
  );

  const savePrintedContent = useCallback(
    async (contentData: Partial<PrintedContent>): Promise<void> => {
      try {
        await fetchWithAuth(
          `${process.env.REACT_APP_API_URL}/api/printed-contents`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(contentData),
          }
        );
      } catch (error) {
        console.error("Error saving printed content:", error);
        throw error;
      }
    },
    []
  );

  return {
    printedContents,
    isLoading,
    isError,
    fetchPrintedContents,
    savePrintedContent,
    setPrintedContents,
  };
};

export default usePrintedContent;
