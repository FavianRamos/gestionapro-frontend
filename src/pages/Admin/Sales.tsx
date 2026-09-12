import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import SalesTable from "../../components/tables/BasicTables/SalesTable";

export default function Sales() {
  return (
    <>
      <PageMeta
        title="Sales | My Portfolio"
        description="Sales list connected to the Spring Boot API"
      />
      <PageBreadcrumb pageTitle="Sales" />
      <div className="space-y-6">
        <ComponentCard title="Sales History">
          <SalesTable />
        </ComponentCard>
      </div>
    </>
  );
}