import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/User";
import authService from "@/services/auth";
import { RootState } from "../store";

export interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: true,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCurrentUserAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getCurrentUserAsync.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(getCurrentUserAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred.";
    });
    builder.addCase(logoutAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(logoutAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred.";
    });
  },
});

export const selectUserData = (state: RootState) => state.user;

export const getCurrentUserAsync = createAsyncThunk(
  "user/getCurrentUser",
  async (): Promise<User> => {
    const response = await authService.getCurrentUser();
    return response.data.user;
  }
);
export const logoutAsync = createAsyncThunk("user/logout", async () => {
  const response = await authService.logout();
  return response.data.message;
});

export default userSlice.reducer;
