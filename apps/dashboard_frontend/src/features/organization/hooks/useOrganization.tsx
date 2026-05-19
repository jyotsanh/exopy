// features/organization/hooks/useOrganization.ts

import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import type { RootState } from "@/store/store";
import {
  createOrganization,
  getAllOrganizations,
  deleteOrganization,
} from "@/store/slice/organization/organization.slice";
import { SEARCH_DEBOUNCE_MS } from "../constants/organization.constants";
import type { OrganizationForm } from "../types/organization.types";

export const useOrganization = () => {
  const dispatch = useAppDispatch();

  // ── Redux State ──────────────────────────────────────────────
  const { organizations, pagination, isLoading } = useAppSelector(
    (state: RootState) => state.organization
  );

  // ── Local State (no form state needed — RHF handles it) ─────
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Derived State ────────────────────────────────────────────
  const totalPages = pagination?.totalPages ?? 1;

  // ── Data Fetching ────────────────────────────────────────────
  const fetchOrganizations = useCallback(() => {
    dispatch(
      getAllOrganizations({
        page: currentPage,
        limit: perPage,
        search: search || undefined,
      })
    );
  }, [dispatch, currentPage, perPage, search]);

  useEffect(() => {
    const delay = search ? SEARCH_DEBOUNCE_MS : 0;
    const debounce = setTimeout(fetchOrganizations, delay);
    return () => clearTimeout(debounce);
  }, [fetchOrganizations, search]);

  // ── Handlers ─────────────────────────────────────────────────
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
      await dispatch(deleteOrganization(id));
      setDeletingId(null);
    },
    [dispatch]
  );

  // Receives validated data directly from RHF — no manual checks needed
  const handleAddOrganization = useCallback(
    async (data: OrganizationForm) => {
      setIsSubmitting(true);

      const result = await dispatch(
        createOrganization({
          name: data.name,
          email: data.email,
          address: data.address || undefined,
          contact_number: data.contact_number || undefined,
        })
      );

      setIsSubmitting(false);

      if (createOrganization.fulfilled.match(result)) {
        setSheetOpen(false);
      }
    },
    [dispatch]
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

  // ── Return ───────────────────────────────────────────────────
  return {
    // State
    organizations,
    isLoading,
    search,
    currentPage,
    perPage,
    totalPages,
    sheetOpen,
    deletingId,
    isSubmitting,

    // Setters
    setSheetOpen,

    // Handlers
    handleSearchChange,
    handlePerPageChange,
    handleDelete,
    handleAddOrganization,
    handleCancel,
    goToPage,
  };
};