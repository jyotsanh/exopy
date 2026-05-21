import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import AxiosInstance from "@/api/axiosInstance";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface IBranch {
  _id: string;
  name: string;
  address?: string;
  email?: string;
  contact_number?: string;
  reg_id: string;
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

export interface IBranchScope {
  orgId: string;
  regionId: string;
}

export interface ICreateBranchPayload extends IBranchScope {
  data: {
    name: string;
    address?: string;
    email?: string;
    contact_number?: string;
  };
}

export interface IUpdateBranchPayload extends IBranchScope {
  id: string;
  data: {
    name?: string;
    address?: string;
    email?: string;
    contact_number?: string;
  };
}

export interface IDeleteBranchPayload extends IBranchScope {
  id: string;
}

export interface IFetchBranchesPayload extends IBranchScope, IPaginationQuery {}

// ─── Response Interfaces ─────────────────────────────────────────────────────

export interface IBranchResponse {
  success: boolean;
  message: string;
  data: IBranch;
}

export interface IBranchListResponse {
  success: boolean;
  message: string;
  data: IBranch[];
  pagination: IPagination;
}

export interface IDeleteBranchResponse {
  success: boolean;
  message: string;
}

// ─── State ───────────────────────────────────────────────────────────────────

export interface IBranchState {
  branches: IBranch[];
  selectedBranch: IBranch | null;
  pagination: IPagination | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IBranchState = {
  branches: [],
  selectedBranch: null,
  pagination: null,
  isLoading: false,
  error: null,
};

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const createBranch = createAsyncThunk<
  IBranchResponse,
  ICreateBranchPayload
>("branch/create", async ({ orgId, regionId, data }, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.post<IBranchResponse>(
      `/organizations/${orgId}/regions/${regionId}/branches`,
      data
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to create branch"
    );
  }
});

export const getAllBranches = createAsyncThunk<
  IBranchListResponse,
  IFetchBranchesPayload
>(
  "branch/getAll",
  async ({ orgId, regionId, ...query }, { rejectWithValue }) => {
    try {
      const params: Record<string, any> = {};
      if (query?.page) params.page = query.page;
      if (query?.limit) params.limit = query.limit;
      if (query?.search) params.search = query.search;

      const response = await AxiosInstance.get<IBranchListResponse>(
        `/organizations/${orgId}/regions/${regionId}/branches`,
        { params }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch branches"
      );
    }
  }
);

export const getBranchById = createAsyncThunk<
  IBranchResponse,
  IBranchScope & { id: string }
>(
  "branch/getById",
  async ({ orgId, regionId, id }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get<IBranchResponse>(
        `/organizations/${orgId}/regions/${regionId}/branches/${id}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch branch"
      );
    }
  }
);

export const updateBranch = createAsyncThunk<
  IBranchResponse,
  IUpdateBranchPayload
>(
  "branch/update",
  async ({ orgId, regionId, id, data }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put<IBranchResponse>(
        `/organizations/${orgId}/regions/${regionId}/branches/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? "Failed to update branch"
      );
    }
  }
);

export const deleteBranch = createAsyncThunk<
  IDeleteBranchResponse & { id: string },
  IDeleteBranchPayload
>("branch/delete", async ({ orgId, regionId, id }, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.delete<IDeleteBranchResponse>(
      `/organizations/${orgId}/regions/${regionId}/branches/${id}`
    );
    return { ...response.data, id };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to delete branch"
    );
  }
});

// ─── Slice ───────────────────────────────────────────────────────────────────

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    clearBranchError: (state) => {
      state.error = null;
    },
    clearSelectedBranch: (state) => {
      state.selectedBranch = null;
    },
    setSelectedBranch: (state, action: PayloadAction<IBranch>) => {
      state.selectedBranch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createBranch.fulfilled,
        (state, action: PayloadAction<IBranchResponse>) => {
          state.isLoading = false;
          state.branches.unshift(action.payload.data);
        }
      )
      .addCase(createBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getAllBranches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllBranches.fulfilled,
        (state, action: PayloadAction<IBranchListResponse>) => {
          state.isLoading = false;
          state.branches = action.payload.data;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(getAllBranches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(getBranchById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getBranchById.fulfilled,
        (state, action: PayloadAction<IBranchResponse>) => {
          state.isLoading = false;
          state.selectedBranch = action.payload.data;
        }
      )
      .addCase(getBranchById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateBranch.fulfilled,
        (state, action: PayloadAction<IBranchResponse>) => {
          state.isLoading = false;
          const updated = action.payload.data;
          const index = state.branches.findIndex((b) => b._id === updated._id);
          if (index !== -1) {
            state.branches[index] = updated;
          }
          if (state.selectedBranch?._id === updated._id) {
            state.selectedBranch = updated;
          }
        }
      )
      .addCase(updateBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteBranch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deleteBranch.fulfilled,
        (
          state,
          action: PayloadAction<IDeleteBranchResponse & { id: string }>
        ) => {
          state.isLoading = false;
          state.branches = state.branches.filter(
            (b) => b._id !== action.payload.id
          );
          if (state.selectedBranch?._id === action.payload.id) {
            state.selectedBranch = null;
          }
        }
      )
      .addCase(deleteBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearBranchError, clearSelectedBranch, setSelectedBranch } =
  branchSlice.actions;

export default branchSlice.reducer;
