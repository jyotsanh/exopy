import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook/hook";
import type { RootState } from "@/store/store";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  resetAdminPassword,
} from "@/store/slice/admin/admin.slice";
import { getAllOrganizations } from "@/store/slice/organization/organization.slice";
import { SEARCH_DEBOUNCE_MS } from "../constants/admin.constants";
import type {
  CreateAdminForm,
  UpdateAdminForm,
  ResetAdminPasswordForm,
  AdminEntity,
} from "../types/admin.types";

export const useAdmins = () => {
  const dispatch = useAppDispatch();

  const { admins, pagination, isLoading } = useAppSelector(
    (state: RootState) => state.admin
  );
  const { organizations } = useAppSelector(
    (state: RootState) => state.organization
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminEntity | null>(null);
  const [resetAdmin, setResetAdmin] = useState<AdminEntity | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPages = pagination?.totalPages ?? 1;

  const fetchAdmins = useCallback(() => {
    dispatch(
      getAllAdmins({
        page: currentPage,
        limit: perPage,
        search: search || undefined,
      })
    );
  }, [dispatch, currentPage, perPage, search]);

  useEffect(() => {
    const delay = search ? SEARCH_DEBOUNCE_MS : 0;
    const debounce = setTimeout(fetchAdmins, delay);
    return () => clearTimeout(debounce);
  }, [fetchAdmins, search]);

  useEffect(() => {
    dispatch(getAllOrganizations({ page: 1, limit: 100 }));
  }, [dispatch]);

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
      await dispatch(deleteAdmin(id));
      setDeletingId(null);
    },
    [dispatch]
  );

  const handleEdit = useCallback((admin: AdminEntity) => {
    setEditingAdmin(admin);
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditingAdmin(null);
  }, []);

  const handleCreateAdmin = useCallback(
    async (data: CreateAdminForm) => {
      setIsSubmitting(true);
      const result = await dispatch(createAdmin(data));
      setIsSubmitting(false);
      if (createAdmin.fulfilled.match(result)) {
        setCreateOpen(false);
        fetchAdmins();
      }
    },
    [dispatch, fetchAdmins]
  );

  const handleUpdateAdmin = useCallback(
    async (data: UpdateAdminForm) => {
      if (!editingAdmin) return;
      setIsSubmitting(true);
      const result = await dispatch(
        updateAdmin({
          id: editingAdmin._id,
          data,
        })
      );
      setIsSubmitting(false);
      if (updateAdmin.fulfilled.match(result)) {
        setEditingAdmin(null);
      }
    },
    [dispatch, editingAdmin]
  );

  const handleResetPasswordClick = useCallback((admin: AdminEntity) => {
    setResetAdmin(admin);
  }, []);

  const handleResetPasswordCancel = useCallback(() => {
    setResetAdmin(null);
  }, []);

  const handleResetPasswordSubmit = useCallback(
    async (data: ResetAdminPasswordForm) => {
      if (!resetAdmin) return;
      setIsSubmitting(true);
      const result = await dispatch(
        resetAdminPassword({ id: resetAdmin._id, password: data.password })
      );
      setIsSubmitting(false);
      if (resetAdminPassword.fulfilled.match(result)) {
        setResetAdmin(null);
      }
    },
    [dispatch, resetAdmin]
  );

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(totalPages, page)));
    },
    [totalPages]
  );

  return {
    admins,
    organizations,
    isLoading,
    search,
    currentPage,
    perPage,
    totalPages,
    createOpen,
    editingAdmin,
    resetAdmin,
    deletingId,
    isSubmitting,

    setCreateOpen,

    handleSearchChange,
    handlePerPageChange,
    handleDelete,
    handleCreateAdmin,
    handleEdit,
    handleEditCancel,
    handleUpdateAdmin,
    handleResetPasswordClick,
    handleResetPasswordCancel,
    handleResetPasswordSubmit,
    goToPage,
  };
};
