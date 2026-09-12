import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CategoriesTable from "../../components/tables/BasicTables/CategoriesTable";

export default function Categories() {
  return (
    <>
      <PageMeta
        title="Categories | My Portfolio"
        description="Product category management"
      />
      <PageBreadcrumb pageTitle="Categories" />
      <div className="space-y-6">
        <ComponentCard title="Category List">
          <CategoriesTable />
        </ComponentCard>
      </div>
    </>
  );
}