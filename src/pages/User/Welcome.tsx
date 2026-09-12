import PageMeta from "../../components/common/PageMeta";

export default function Welcome() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageMeta
        title="Home | GestionaPro"
        description="Welcome to the system"
      />

      <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
        Welcome to GestionaPro
        
      </h1>
      <h2 className="mb-6 text-lg font-medium text-gray-600 dark:text-gray-300">
        Sales and Product Management System
      </h2>

      <p className="mb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        GestionaPro is a solution designed to make it easier to manage and
        control a business's operations from a centralized, modern, and
        easy-to-use platform.
      </p>

      <p className="mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
        The system lets you manage products, categories, users, and sales in
        an organized way, while also providing relevant information through a
        dashboard and reports, helping you get a clear view of the current
        state of the business.
      </p>

      <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
        What can you do with GestionaPro?
      </h3>

      <ul className="mb-8 space-y-3 text-gray-600 dark:text-gray-400">
        <li>
          <span className="font-medium text-gray-800 dark:text-white/90">
            📦 Manage products:
          </span>{" "}
          register, update, look up, and track available stock.
        </li>
        <li>
          <span className="font-medium text-gray-800 dark:text-white/90">
            🗂️ Manage categories:
          </span>{" "}
          organize and classify products with ease.
        </li>
        <li>
          <span className="font-medium text-gray-800 dark:text-white/90">
            🛒 Manage sales:
          </span>{" "}
          record sales and manage their details, subtotals, and amounts.
        </li>
        <li>
          <span className="font-medium text-gray-800 dark:text-white/90">
            📊 Control inventory:
          </span>{" "}
          check stock levels and spot products running low.
        </li>
        <li>
          <span className="font-medium text-gray-800 dark:text-white/90">
            👥 Manage users:
          </span>{" "}
          manage users and control their roles and access permissions.
        </li>
        <li>
          <span className="font-medium text-gray-800 dark:text-white/90">
            📈 View the dashboard:
          </span>{" "}
          check key indicators and statistics about the business's
          operations.
        </li>
        <li>
          <span className="font-medium text-gray-800 dark:text-white/90">
            🔎 Search and filter information:
          </span>{" "}
          search and filter to make analyzing sales and records easier.
        </li>
        <li>
          <span className="font-medium text-gray-800 dark:text-white/90">
            🔐 Security and access control:
          </span>{" "}
          protect system resources through role-based authentication and
          authorization.
        </li>
      </ul>

      <h3 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">
        More organized management
      </h3>
      <p className="mb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
        GestionaPro centralizes a business's core operations in a single
        system, keeping information organized and making it easier to track
        products, inventory, users, and sales.
      </p>

      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        <span className="font-medium text-gray-800 dark:text-white/90">
          GestionaPro — Simplify your management, take control of your
          business.
        </span>
      </p>
    </div>
  );
}