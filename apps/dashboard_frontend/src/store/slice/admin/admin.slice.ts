import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import AxiosInstance from "@/api/axiosInstance";

export interface IPopulatedOrg {
  _id: string;
  name: string;
  email: string;
}

export interface IAdminEntity {
  _id: string;
  username: string;
  email: string;
  role: "admin";
  org_id?: IPopulatedOrg | string;
  profile_image?: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IAdminPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  org_id?: string;
}

export interface ICreateAdminPayload {
  username: string;
  email: string;
  password: string;
  org_id: string;
}

export interface IUpdateAdminPayload {
  id: string;
  data: {
    username?: string;
    email?: string;
    profile_image?: string;
    org_id?: string;
  };
}

export interface IResetAdminPasswordPayload {
  id: string;
  password: string;
}

export interface IAdminResponse {
  success: boolean;
  message: string;
  data: IAdminEntity;
}

export interface IAdminListResponse {
  success: boolean;
  message: string;
  data: IAdminEntity[];
  pagination: IPagination;
}

export interface IGenericMessageResponse {
  success: boolean;
  message: string;
}

export interface IAdminState {
  admins: IAdminEntity[];
  selectedAdmin: IAdminEntity | null;
  pagination: IPagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IAdminState = {
  admins: [],
  selectedAdmin: null,
  pagination: null,
  isLoading: false,
  error: null,
};

export const getAllAdmins = createAsyncThunk<
  IAdminListResponse,
  IAdminPaginationQuery | undefined
>("admin/getAll", async (query, { rejectWithValue }) => {
  try {
    const params: Record<string, any> = {};
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;
    if (query?.search) params.search = query.search;
    if (query?.org_id) params.org_id = query.org_id;

    const response = await AxiosInstance.get<IAdminListResponse>("/admins", {
      params,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch admins"
    );
  }
});

export const getAdminById = createAsyncThunk<IAdminResponse, string>(
  "admin/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get<IAdminResponse>(
        `/admins/${id}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch admin"
      );
    }
  }
);

export const createAdmin = createAsyncThunk<
  IGenericMessageResponse,
  ICreateAdminPayload
>("admin/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.post<IGenericMessageResponse>(
      "/auth/register",
      payload
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to create admin"
    );
  }
});

export const updateAdmin = createAsyncThunk<IAdminResponse, IUpdateAdminPayload>(
  "admin/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put<IAdminResponse>(
        `/admins/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to update admin"
      );
    }
  }
);

export const resetAdminPassword = createAsyncThunk<
  IGenericMessageResponse,
  IResetAdminPasswordPayload
>("admin/resetPassword", async ({ id, password }, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.post<IGenericMessageResponse>(
      `/admins/${id}/reset-password`,
      { password }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to reset password"
    );
  }
});

export const deleteAdmin = createAsyncThunk<
  IGenericMessageResponse & { id: string },
  string
>("admin/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.delete<IGenericMessageResponse>(
      `/admins/${id}`
    );
    return { ...response.data, id };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to delete admin"
    );
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearSelectedAdmin: (state) => {
      state.selectedAdmin = null;
    },
    setSelectedAdmin: (state, action: PayloadAction<IAdminEntity>) => {
      state.selectedAdmin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAdmins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllAdmins.fulfilled,
        (state, action: PayloadAction<IAdminListResponse>) => {
          state.isLoading = false;
          state.admins = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getAllAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getAdminById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAdminById.fulfilled,
        (state, action: PayloadAction<IAdminResponse>) => {
          state.isLoading = false;
          state.selectedAdmin = action.payload.data;
        }
      )
      .addCase(getAdminById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateAdmin.fulfilled,
        (state, action: PayloadAction<IAdminResponse>) => {
          state.isLoading = false;
          const updated = action.payload.data;
          const index = state.admins.findIndex((a) => a._id === updated._id);
          if (index !== -1) {
            state.admins[index] = updated;
          }
          if (state.selectedAdmin?._id === updated._id) {
            state.selectedAdmin = updated;
          }
        }
      )
      .addCase(updateAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(resetAdminPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetAdminPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetAdminPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteAdmin.fulfilled,
        (
          state,
          action: PayloadAction<IGenericMessageResponse & { id: string }>
        ) => {
          state.isLoading = false;
          state.admins = state.admins.filter(
            (a) => a._id !== action.payload.id
          );
          if (state.selectedAdmin?._id === action.payload.id) {
            state.selectedAdmin = null;
          }
        }
      )
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAdminError, clearSelectedAdmin, setSelectedAdmin } =
  adminSlice.actions;
export default adminSlice.reducer;
