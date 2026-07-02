import { useSelector, useDispatch } from "react-redux";
import { useState, useCallback } from "react";
import { RootState } from "../app/store";
import { fetchWithAuth } from "../api/userAPI";
import { selectIsLoggedIn } from "../features/user/userSlice";
import { setPriceDetails } from "../features/price/priceSlice";

interface UseDoorPriceReturn {
  isLoading: boolean;
  isError: boolean;
  fetchPrice: (
    vat: number,
    discount: number,
    markupLabel: number
  ) => Promise<void>;
}

const useDoorPrice = (): UseDoorPriceReturn => {
  const dispatch = useDispatch();

  const selectedConfiguration = useSelector(
    (state: RootState) => state.configuration
  );
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchPrice = useCallback(
    async (vat: number, discount: number, markupLabel: number) => {
      if (!selectedConfiguration || !isLoggedIn)
        return Promise.reject("Configuration or login status missing");

      setIsLoading(true);

      try {
        const apiUrl = process.env.REACT_APP_API_URL || "default-api-url";
        const response = await fetchWithAuth(`${apiUrl}/api/calculate-price`, {
          method: "POST",
          body: JSON.stringify({
            ...selectedConfiguration,
            vat,
            discount,
            markupLabel,
          }),
        });

        if (response && response.data) {
          dispatch(setPriceDetails(response.data));
          setIsError(false);
          return Promise.resolve();
        } else {
          throw new Error("Failed to fetch price.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setIsError(true);
        return Promise.reject(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, selectedConfiguration, isLoggedIn]
  );

  return {
    isLoading,
    isError,
    fetchPrice,
  };
};

export default useDoorPrice;
