import { useParams } from "react-router-dom";
import { useBranch } from "./hooks/useBranch";
import BranchHeader from "./components/BranchHeader";
import BranchToolbar from "./components/BranchToolbar";
import BranchTable from "./components/BranchTable";
import BranchSheet from "./components/BranchSheet";
import BranchPagination from "./components/BranchPagination";

const Branch = () => {
  const { orgId = "", regionId = "" } = useParams<{
    orgId: string;
    regionId: string;
  }>();

  const {
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
  } = useBranch(orgId, regionId);

  return (
    <div className="relative overflow-hidden bg-muted rounded-3xl py-10 px-5 md:px-10">
      <div className="relative z-10 max-w-8xl mx-auto">
        <BranchHeader />

        <BranchToolbar
          search={search}
          onSearchChange={handleSearchChange}
          onAddClick={() => setSheetOpen(true)}
        />

        <BranchTable
          branches={branches}
          isLoading={isLoading}
          currentPage={currentPage}
          perPage={perPage}
          deletingId={deletingId}
          onDelete={handleDelete}
        />

        <BranchPagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={goToPage}
          onPerPageChange={handlePerPageChange}
        />

        <BranchSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          isSubmitting={isSubmitting}
          onSubmit={handleAddBranch}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default Branch;
