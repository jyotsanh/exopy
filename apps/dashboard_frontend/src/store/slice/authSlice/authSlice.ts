import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import AxiosInstance from "@/api/axiosInstance";

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
  org_id?: string;
  profile_image?: string;
}
export interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}
export interface ILoginData {
  accessToken: string;
  user: IUser;
}
export interface ILoginResponse {
  success: boolean;
  message: string;
  data: ILoginData;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};
export const loginUser = createAsyncThunk<
  ILoginResponse,
  { email: string; password: string; rememberMe?: boolean }
>("auth/loginUser", async ({ email, password, rememberMe }, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.post<ILoginResponse>("/auth/login", { email, password });
    if (rememberMe) {
      sessionStorage.removeItem("rememberMe");
    } else {
      sessionStorage.setItem("rememberMe", "false");
    }
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Login failed"
    );
  }
});
export const logout = createAsyncThunk('auth/logout', async () => {
  await AxiosInstance.post('/auth/logout');
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearCredentials: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },
    setUser: (state, action: PayloadAction<ILoginData>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<ILoginResponse>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.data.user;
          state.accessToken = action.payload.data.accessToken;
        //   localStorage.setItem("accessToken", action.payload.data.accessToken);
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      }).addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        // localStorage.removeItem("accessToken");
      });
  },
});

export const { clearCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
