import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { useState as useReactState } from "react";
import { API_URL } from "../../config/api";

interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
}

function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("-");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthIndex = parseInt(month, 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
}

export default function MonthlySalesChart() {
  const [categories, setCategories] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        const token = localStorage.getItem("token");
        const now = new Date();
        const startDate = `${now.getFullYear()}-01-01`;
        const endDate = `${now.getFullYear()}-12-31`;

        const response = await fetch(
          `${API_URL}/api/reports/sales?groupBy=month&startDate=${startDate}&endDate=${endDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load the sales report");
        }

        const data: SalesReport[] = await response.json();
        setCategories(data.map((item) => formatPeriodLabel(item.period)));
        setSalesData(data.map((item) => item.totalSales));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, []);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val} sales`,
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: salesData,
    },
  ];

  const [isOpen, setIsOpen] = useReactState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          {loading ? (
            <p className="p-5 text-gray-500 dark:text-gray-400">Loading...</p>
          ) : (
            <Chart options={options} series={series} type="bar" height={180} />
          )}
        </div>
      </div>
    </div>
  );
}