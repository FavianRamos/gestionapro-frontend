import EcommerceMetrics from "../../components/dashboard/EcommerceMetrics";
import MonthlySalesChart from "../../components/dashboard/MonthlySalesChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import DemographicCard from "../../components/dashboard/DemographicCard";
import LowStockAlert from "../../components/dashboard/LowStockAlert";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard | My Portfolio"
        description="Product and sales management dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <LowStockAlert />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}