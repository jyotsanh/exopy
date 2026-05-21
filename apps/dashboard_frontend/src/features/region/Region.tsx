import { useParams } from "react-router-dom";
import { useRegion } from "./hooks/useRegion";
import RegionHeader from "./components/RegionHeader";
import RegionToolbar from "./components/RegionToolbar";
import RegionTable from "./components/RegionTable";
import RegionSheet from "./components/RegionSheet";
import RegionPagination from "./components/RegionPagination";

const Region = () => {
  const { orgId = "" } = useParams<{ orgId: string }>();

  const {
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
  } = useRegion(orgId);

  return (
    <div className="relative overflow-hidden bg-muted rounded-3xl py-10 px-5 md:px-10">
      <div className="relative z-10 max-w-8xl mx-auto">
        <RegionHeader />

        <RegionToolbar
          search={search}
          onSearchChange={handleSearchChange}
          onAddClick={() => setSheetOpen(true)}
        />

        <RegionTable
          regions={regions}
          isLoading={isLoading}
          currentPage={currentPage}
          perPage={perPage}
          orgId={orgId}
          deletingId={deletingId}
          onDelete={handleDelete}
        />

        <RegionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={goToPage}
          onPerPageChange={handlePerPageChange}
        />

        <RegionSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          isSubmitting={isSubmitting}
          onSubmit={handleAddRegion}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default Region;
