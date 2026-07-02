import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { fetchUserData } from "../features/user/userSlice";
import { fetchDefaultItems } from "../features/configuration/configurationSlice";

export const useAppInitialization = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const redirected = location.state?.redirected;

  const initialize = useCallback(() => {
    if (!redirected) {
      // Fetch default items regardless of authentication status
      dispatch(fetchDefaultItems())
        .unwrap()
        .catch((error) => {
          console.error("Error fetching default items:", error);
          // Continue with the app even if default items fetch fails
        });

      // First fetch user data
      dispatch(fetchUserData())
        .unwrap()
        .catch((error) => {
          console.error("Error during user authentication:", error);
        });
    }
  }, [dispatch, redirected]);

  return { initialize };
};
