// features/organization/Organization.tsx

import { useOrganization } from "./hooks/useOrganization";
import OrganizationHeader from "./components/OrganizationHeader";
import OrganizationToolbar from "./components/OrganizationToolbar";
import OrganizationTable from "./components/OrganizationTable";
import OrganizationSheet from "./components/OrganizationSheet";
import OrganizationPagination from "./components/OrganizationPagination";

const Organization = () => {
  const {
    organizations,
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
    handleAddOrganization,
    handleCancel,
    goToPage,
  } = useOrganization();

  return (
    <div className="relative overflow-hidden bg-muted rounded-3xl py-10 px-5 md:px-10">
      <div className="relative z-10 max-w-8xl mx-auto">
        <OrganizationHeader />

        <OrganizationToolbar
          search={search}
          onSearchChange={handleSearchChange}
          onAddClick={() => setSheetOpen(true)}
        />

        <OrganizationTable
          organizations={organizations}
          isLoading={isLoading}
          currentPage={currentPage}
          perPage={perPage}
          deletingId={deletingId}
          onDelete={handleDelete}
          onAdd={() => setSheetOpen(true)}
        />

        <OrganizationPagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={goToPage}
          onPerPageChange={handlePerPageChange}
        />

        {/* Sheet now owns its own form state via RHF */}
        <OrganizationSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          isSubmitting={isSubmitting}
          onSubmit={handleAddOrganization}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default Organization;