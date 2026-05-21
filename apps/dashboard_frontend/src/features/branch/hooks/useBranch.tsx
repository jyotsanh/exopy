import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import type { RootState } from "@/store/store";
import {
  createBranch,
  getAllBranches,
  deleteBranch,
} from "@/store/slice/branch/branch.slice";
import { SEARCH_DEBOUNCE_MS } from "../constants/branch.constants";
import type { BranchForm } from "../types/branch.types";

export const useBranch = (orgId: string, regionId: string) => {
  const dispatch = useAppDispatch();

  const { branches, pagination, isLoading } = useAppSelector(
    (state: RootState) => state.branch
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = pagination?.totalPages ?? 1;

  const fetchBranches = useCallback(() => {
    if (!orgId || !regionId) return;
    dispatch(
      getAllBranches({
        orgId,
        regionId,
        page: currentPage,
        limit: perPage,
        search: search || undefined,
      })
    );
  }, [dispatch, orgId, regionId, currentPage, perPage, search]);

  useEffect(() => {
    const delay = search ? SEARCH_DEBOUNCE_MS : 0;
    const debounce = setTimeout(fetchBranches, delay);
    return () => clearTimeout(debounce);
  }, [fetchBranches, search]);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handlePerPageChange = useCallback((value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      await dispatch(deleteBranch({ orgId, regionId, id }));
      setDeletingId(null);
    },
    [dispatch, orgId, regionId]
  );

  const handleAddBranch = useCallback(
    async (data: BranchForm) => {
      setIsSubmitting(true);

      const result = await dispatch(
        createBranch({
          orgId,
          regionId,
          data: {
            name: data.name,
            email: data.email || undefined,
            address: data.address || undefined,
            contact_number: data.contact_number || undefined,
          },
        })
      );

      setIsSubmitting(false);

      if (createBranch.fulfilled.match(result)) {
        setSheetOpen(false);
      }
    },
    [dispatch, orgId, regionId]
  );

  const handleCancel = useCallback(() => {
    setSheetOpen(false);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(totalPages, page)));
    },
    [totalPages]
  );

  return {
    branches,
    isLoading,
    search,
    currentPage,
    perPage,
    totalPages,
    sheetOpen,
    deletingId,
    isSubmitting,

    setSheetOpen,

    handleSearchChange,
    handlePerPageChange,
    handleDelete,
    handleAddBranch,
    handleCancel,
    goToPage,
  };
};
