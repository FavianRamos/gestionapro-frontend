import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ProductsTable from "../../components/tables/BasicTables/ProductsTable";

export default function Products() {
  return (
    <>
      <PageMeta
        title="Products | My Portfolio"
        description="Product list connected to the Spring Boot API"
      />
      <PageBreadcrumb pageTitle="Products" />
      <div className="space-y-6">
        <ComponentCard title="Product List">
          <ProductsTable />
        </ComponentCard>
      </div>
    </>
  );
}