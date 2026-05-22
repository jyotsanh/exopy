import { useAdmins } from "./hooks/useAdmins";
import AdminHeader from "./components/AdminHeader";
import AdminToolbar from "./components/AdminToolbar";
import AdminTable from "./components/AdminTable";
import AdminPagination from "./components/AdminPagination";
import AdminCreateSheet from "./components/AdminCreateSheet";
import AdminEditSheet from "./components/AdminEditSheet";
import AdminResetPasswordSheet from "./components/AdminResetPasswordSheet";

const Admins = () => {
  const {
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
  } = useAdmins();

  return (
    <div className="relative overflow-hidden bg-muted rounded-3xl py-10 px-5 md:px-10">
      <div className="relative z-10 max-w-8xl mx-auto">
        <AdminHeader />

        <AdminToolbar
          search={search}
          onSearchChange={handleSearchChange}
          onAddClick={() => setCreateOpen(true)}
        />

        <AdminTable
          admins={admins}
          isLoading={isLoading}
          currentPage={currentPage}
          perPage={perPage}
          deletingId={deletingId}
          onEdit={handleEdit}
          onResetPassword={handleResetPasswordClick}
          onDelete={handleDelete}
        />

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={goToPage}
          onPerPageChange={handlePerPageChange}
        />

        <AdminCreateSheet
          open={createOpen}
          onOpenChange={setCreateOpen}
          organizations={organizations}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateAdmin}
        />

        <AdminEditSheet
          admin={editingAdmin}
          organizations={organizations}
          isSubmitting={isSubmitting}
          onSubmit={handleUpdateAdmin}
          onCancel={handleEditCancel}
        />

        <AdminResetPasswordSheet
          admin={resetAdmin}
          isSubmitting={isSubmitting}
          onSubmit={handleResetPasswordSubmit}
          onCancel={handleResetPasswordCancel}
        />
      </div>
    </div>
  );
};

export default Admins;
