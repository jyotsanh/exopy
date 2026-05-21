import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import AxiosInstance from "@/api/axiosInstance";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface IRegion {
  _id: string;
  name: string;
  email?: string;
  contact_number?: string;
  org_id: string;
  created_by: { _id: string; username: string; email: string } | string;
  updated_by?: { _id: string; username: string; email: string } | string;
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

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ICreateRegionPayload {
  orgId: string;
  data: {
    name: string;
    email?: string;
    contact_number?: string;
  };
}

export interface IUpdateRegionPayload {
  orgId: string;
  id: string;
  data: {
    name?: string;
    email?: string;
    contact_number?: string;
  };
}

export interface IDeleteRegionPayload {
  orgId: string;
  id: string;
}

export interface IFetchRegionsPayload extends IPaginationQuery {
  orgId: string;
}

// ─── Response Interfaces ─────────────────────────────────────────────────────

export interface IRegionResponse {
  success: boolean;
  message: string;
  data: IRegion;
}

export interface IRegionListResponse {
  success: boolean;
  message: string;
  data: IRegion[];
  pagination: IPagination;
}

export interface IDeleteRegionResponse {
  success: boolean;
  message: string;
}

// ─── State ───────────────────────────────────────────────────────────────────

export interface IRegionState {
  regions: IRegion[];
  selectedRegion: IRegion | null;
  pagination: IPagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IRegionState = {
  regions: [],
  selectedRegion: null,
  pagination: null,
  isLoading: false,
  error: null,
};

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const createRegion = createAsyncThunk<
  IRegionResponse,
  ICreateRegionPayload
>("region/create", async ({ orgId, data }, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.post<IRegionResponse>(
      `/organizations/${orgId}/regions`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to create region"
    );
  }
});

export const getAllRegions = createAsyncThunk<
  IRegionListResponse,
  IFetchRegionsPayload
>("region/getAll", async ({ orgId, ...query }, { rejectWithValue }) => {
  try {
    const params: Record<string, any> = {};
    if (query?.page) params.page = query.page;
    if (query?.limit) params.limit = query.limit;
    if (query?.search) params.search = query.search;

    const response = await AxiosInstance.get<IRegionListResponse>(
      `/organizations/${orgId}/regions`,
      { params }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch regions"
    );
  }
});

export const getRegionById = createAsyncThunk<
  IRegionResponse,
  { orgId: string; id: string }
>("region/getById", async ({ orgId, id }, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.get<IRegionResponse>(
      `/organizations/${orgId}/regions/${id}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch region"
    );
  }
});

export const updateRegion = createAsyncThunk<
  IRegionResponse,
  IUpdateRegionPayload
>("region/update", async ({ orgId, id, data }, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.put<IRegionResponse>(
      `/organizations/${orgId}/regions/${id}`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to update region"
    );
  }
});

export const deleteRegion = createAsyncThunk<
  IDeleteRegionResponse & { id: string },
  IDeleteRegionPayload
>("region/delete", async ({ orgId, id }, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.delete<IDeleteRegionResponse>(
      `/organizations/${orgId}/regions/${id}`
    );
    return { ...response.data, id };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to delete region"
    );
  }
});

// ─── Slice ───────────────────────────────────────────────────────────────────

const regionSlice = createSlice({
  name: "region",
  initialState,
  reducers: {
    clearRegionError: (state) => {
      state.error = null;
    },
    clearSelectedRegion: (state) => {
      state.selectedRegion = null;
    },
    setSelectedRegion: (state, action: PayloadAction<IRegion>) => {
      state.selectedRegion = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRegion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createRegion.fulfilled,
        (state, action: PayloadAction<IRegionResponse>) => {
          state.isLoading = false;
          state.regions.unshift(action.payload.data);
        }
      )
      .addCase(createRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getAllRegions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllRegions.fulfilled,
        (state, action: PayloadAction<IRegionListResponse>) => {
          state.isLoading = false;
          state.regions = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getAllRegions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getRegionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getRegionById.fulfilled,
        (state, action: PayloadAction<IRegionResponse>) => {
          state.isLoading = false;
          state.selectedRegion = action.payload.data;
        }
      )
      .addCase(getRegionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateRegion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateRegion.fulfilled,
        (state, action: PayloadAction<IRegionResponse>) => {
          state.isLoading = false;
          const updated = action.payload.data;
          const index = state.regions.findIndex((r) => r._id === updated._id);
          if (index !== -1) {
            state.regions[index] = updated;
          }
          if (state.selectedRegion?._id === updated._id) {
            state.selectedRegion = updated;
          }
        }
      )
      .addCase(updateRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteRegion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteRegion.fulfilled,
        (
          state,
          action: PayloadAction<IDeleteRegionResponse & { id: string }>
        ) => {
          state.isLoading = false;
          state.regions = state.regions.filter(
            (r) => r._id !== action.payload.id
          );
          if (state.selectedRegion?._id === action.payload.id) {
            state.selectedRegion = null;
          }
        }
      )
      .addCase(deleteRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRegionError, clearSelectedRegion, setSelectedRegion } =
  regionSlice.actions;

export default regionSlice.reducer;
