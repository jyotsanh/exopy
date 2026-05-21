import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import type { RootState } from "@/store/store";
import {
  createRegion,
  getAllRegions,
  deleteRegion,
} from "@/store/slice/region/region.slice";
import { SEARCH_DEBOUNCE_MS } from "../constants/region.constants";
import type { RegionForm } from "../types/region.types";

export const useRegion = (orgId: string) => {
  const dispatch = useAppDispatch();

  const { regions, pagination, isLoading } = useAppSelector(
    (state: RootState) => state.region
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = pagination?.totalPages ?? 1;

  const fetchRegions = useCallback(() => {
    if (!orgId) return;
    dispatch(
      getAllRegions({
        orgId,
        page: currentPage,
        limit: perPage,
        search: search || undefined,
      })
    );
  }, [dispatch, orgId, currentPage, perPage, search]);

  useEffect(() => {
    const delay = search ? SEARCH_DEBOUNCE_MS : 0;
    const debounce = setTimeout(fetchRegions, delay);
    return () => clearTimeout(debounce);
  }, [fetchRegions, search]);

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
      await dispatch(deleteRegion({ orgId, id }));
      setDeletingId(null);
    },
    [dispatch, orgId]
  );

  const handleAddRegion = useCallback(
    async (data: RegionForm) => {
      setIsSubmitting(true);

      const result = await dispatch(
        createRegion({
          orgId,
          data: {
            name: data.name,
            email: data.email || undefined,
            contact_number: data.contact_number || undefined,
          },
        })
      );

      setIsSubmitting(false);

      if (createRegion.fulfilled.match(result)) {
        setSheetOpen(false);
      }
    },
    [dispatch, orgId]
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
    regions,
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
    handleAddRegion,
    handleCancel,
    goToPage,
  };
};
