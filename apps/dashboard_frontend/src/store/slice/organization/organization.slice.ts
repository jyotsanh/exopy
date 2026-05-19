import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import AxiosInstance from "@/api/axiosInstance";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface IOrganization {
  _id: string;
  name: string;
  email: string;
  address: string;
  contact_number: string;
  created_by: { _id: string; username: string; email: string } | string;
  updated_by?: { _id: string; username: string; email: string } | string;
  is_deleted: boolean;
  is_active: boolean;
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

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ICreateOrganizationPayload {
  name: string;
  email: string;
  address?: string;
  contact_number?: string;
}

export interface IUpdateOrganizationPayload {
  id: string;
  data: {
    name?: string;
    email?: string;
    address?: string;
    contact_number?: string;
  };
}

// ─── Response Interfaces ─────────────────────────────────────────────────────

export interface IOrganizationResponse {
  success: boolean;
  message: string;
  data: IOrganization;
}

export interface IOrganizationListResponse {
  success: boolean;
  message: string;
  data: IOrganization[];
  pagination: IPagination;
}

export interface IDeleteOrganizationResponse {
  success: boolean;
  message: string;
}

// ─── State ───────────────────────────────────────────────────────────────────

export interface IOrganizationState {
  organizations: IOrganization[];
  selectedOrganization: IOrganization | null;
  pagination: IPagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IOrganizationState = {
  organizations: [],
  selectedOrganization: null,
  pagination: null,
  isLoading: false,
  error: null,
};

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const createOrganization = createAsyncThunk<
  IOrganizationResponse,
  ICreateOrganizationPayload
>("organization/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.post<IOrganizationResponse>(
      "/organizations",
      payload
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to create organization"
    );
  }
});

export const getAllOrganizations = createAsyncThunk<
  IOrganizationListResponse,
  IPaginationQuery | undefined
>("organization/getAll", async (query, { rejectWithValue }) => {
  try {
    const params: Record<string, any> = {};
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;
    if (query?.search) params.search = query.search;

    const response = await AxiosInstance.get<IOrganizationListResponse>(
      "/organizations",
      { params }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch organizations"
    );
  }
});

export const getOrganizationById = createAsyncThunk<
  IOrganizationResponse,
  string
>("organization/getById", async (id, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.get<IOrganizationResponse>(
      `/organizations/${id}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch organization"
    );
  }
});

export const updateOrganization = createAsyncThunk<
  IOrganizationResponse,
  IUpdateOrganizationPayload
>("organization/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.put<IOrganizationResponse>(
      `/organizations/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to update organization"
    );
  }
});

export const deleteOrganization = createAsyncThunk<
  IDeleteOrganizationResponse & { id: string },
  string
>("organization/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.delete<IDeleteOrganizationResponse>(
      `/organizations/${id}`
    );
    return { ...response.data, id };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to delete organization"
    );
  }
});

// ─── Slice ───────────────────────────────────────────────────────────────────

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    clearOrganizationError: (state) => { 
      state.error = null;
    },
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null; 
    },
    setSelectedOrganization: (
      state,
      action: PayloadAction<IOrganization>
    ) => {
      state.selectedOrganization = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      // ── Create ──────────────────────────────────────────────────────────
      .addCase(createOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createOrganization.fulfilled,
        (state, action: PayloadAction<IOrganizationResponse>) => {
          state.isLoading = false;
          state.organizations.unshift(action.payload.data);
        }
      )
      .addCase(createOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── Get All ─────────────────────────────────────────────────────────
      .addCase(getAllOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllOrganizations.fulfilled,
        (state, action: PayloadAction<IOrganizationListResponse>) => {
          state.isLoading = false;
          state.organizations = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getAllOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── Get By Id ───────────────────────────────────────────────────────
      .addCase(getOrganizationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrganizationById.fulfilled,
        (state, action: PayloadAction<IOrganizationResponse>) => {
          state.isLoading = false;
          state.selectedOrganization = action.payload.data;
        }
      )
      .addCase(getOrganizationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── Update ──────────────────────────────────────────────────────────
      .addCase(updateOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateOrganization.fulfilled,
        (state, action: PayloadAction<IOrganizationResponse>) => {
          state.isLoading = false;
          const updated = action.payload.data;
          const index = state.organizations.findIndex(
            (org) => org._id === updated._id
          );
          if (index !== -1) {
            state.organizations[index] = updated;
          }
          if (state.selectedOrganization?._id === updated._id) {
            state.selectedOrganization = updated;
          }
        }
      )
      .addCase(updateOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── Delete ──────────────────────────────────────────────────────────
      .addCase(deleteOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteOrganization.fulfilled,
        (
          state,
          action: PayloadAction<IDeleteOrganizationResponse & { id: string }>
        ) => {
          state.isLoading = false;
          state.organizations = state.organizations.filter(
            (org) => org._id !== action.payload.id
          );
          if (state.selectedOrganization?._id === action.payload.id) {
            state.selectedOrganization = null;
          }
        }
      )
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearOrganizationError,
  clearSelectedOrganization,
  setSelectedOrganization,
} = organizationSlice.actions;

export default organizationSlice.reducer;