import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { RegisterFormData, User } from "../../types";
import {
  deleteUserAPI,
  editUserAPI,
  fetchUserDataAPI,
  loginUserAPI,
  logoutUserAPI,
  registerUserAPI,
} from "../../api/userAPI";
import { handle401Error } from "../../utils";
import { removeAuthToken } from "../../api/auth";

interface UserPayload {
  user: User;
  access_token: string;
}

export interface UserState {
  userData: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: (() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        return null;
      }
    }
    return null;
  })(),
  token: localStorage.getItem("authToken") || null,
  isLoggedIn: !!localStorage.getItem("authToken"),
  isLoading: false,
  error: null,
};

export const fetchUserData = createAsyncThunk<
  User,
  void,
  { rejectValue: { message: string; status: number } }
>("user/fetchUserData", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchUserDataAPI();
    if (!data) {
      return rejectWithValue({
        message: "Failed to fetch user data",
        status: 401,
      });
    }
    localStorage.setItem("userData", JSON.stringify(data));
    return data;
  } catch (error: any) {
    return rejectWithValue(error.toJSON ? error.toJSON() : error);
  }
});

export const loginUser = createAsyncThunk<
  UserPayload,
  { username: string; password: string },
  { rejectValue: { message: string; status: number } }
>("user/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const data = await loginUserAPI(username, password);
    localStorage.setItem("authToken", data.access_token);
    localStorage.setItem("userData", JSON.stringify(data.user));
    return data;
  } catch (error: any) {
    return rejectWithValue(error.toJSON ? error.toJSON() : error);
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: { message: string; status: number } }
>("user/logout", async (_, { rejectWithValue }) => {
  try {
    await logoutUserAPI();
    return;
  } catch (error: any) {
    return rejectWithValue(error.toJSON ? error.toJSON() : error);
  }
});

export const registerUser = createAsyncThunk<
  User,
  RegisterFormData,
  { rejectValue: { message: string; status: number } }
>("user/register", async (newValues: RegisterFormData, { rejectWithValue }) => {
  try {
    const data = await registerUserAPI(newValues);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.toJSON ? error.toJSON() : error);
  }
});

export const editUser = createAsyncThunk<
  User,
  { userId: number; updatedData: Partial<User> },
  { rejectValue: { message: string; status: number } }
>("user/editUser", async ({ userId, updatedData }, { rejectWithValue }) => {
  try {
    const data = await editUserAPI(userId, updatedData);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.toJSON ? error.toJSON() : error);
  }
});

export const deleteUser = createAsyncThunk<
  void,
  number,
  { rejectValue: { message: string; status: number } }
>("user/deleteUser", async (userId, { rejectWithValue }) => {
  try {
    const response = await deleteUserAPI(userId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.toJSON ? error.toJSON() : error);
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.userData = action.payload;
          state.isLoggedIn = true;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(
        fetchUserData.rejected,
        (
          state,
          action: PayloadAction<{ message: string; status: number } | undefined>
        ) => {
          handle401Error(state, action);
        }
      )
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<UserPayload>) => {
          state.userData = action.payload.user;
          state.token = action.payload.access_token;
          state.isLoggedIn = true;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addCase(
        loginUser.rejected,
        (
          state,
          action: PayloadAction<{ message: string; status: number } | undefined>
        ) => {
          handle401Error(state, action);
        }
      )
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userData = null;
        state.isLoggedIn = false;
        state.isLoading = false;
        state.error = null;
        removeAuthToken();
      })
      .addCase(
        logoutUser.rejected,
        (
          state,
          action: PayloadAction<{ message: string; status: number } | undefined>
        ) => {
          handle401Error(state, action);
        }
      )
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(
        registerUser.rejected,
        (
          state,
          action: PayloadAction<{ message: string; status: number } | undefined>
        ) => {
          handle401Error(state, action);
        }
      )
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(
        deleteUser.rejected,
        (
          state,
          action: PayloadAction<{ message: string; status: number } | undefined>
        ) => {
          handle401Error(state, action);
        }
      );
  },
});

export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserData = (state: RootState) => state.user.userData;
export const selectUserToken = (state: RootState) => state.user.token;

export default userSlice.reducer;
