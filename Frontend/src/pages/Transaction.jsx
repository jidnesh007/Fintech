import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSort,
  FaTrash,
  FaExclamationTriangle,
  FaFilter,
} from "react-icons/fa";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(transactions.filter((txn) => txn._id !== id));
    } catch (error) {
      console.error("Error deleting transaction", error);
      alert("Error deleting transaction: " + error.response?.data?.error);
    }
  };

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);

    const sorted = [...transactions].sort((a, b) => {
      if (field === "amount")
        return newSortOrder === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      if (field === "date")
        return newSortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      return 0;
    });
    setTransactions(sorted);
  };

  const filteredTransactions = filterCategory
    ? transactions.filter((txn) => txn.category === filterCategory)
    : transactions;

  // Function to assign distinct gradient colors to categories
  const getCategoryStyle = (category) => {
    switch (category) {
      case "Food":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "Transport":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "Housing":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "Entertainment":
        return "bg-gradient-to-r from-purple-500 to-purple-600";
      case "Others":
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-3 sm:p-5 md:p-8">
      {/* Header */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
        Transaction History
      </h2>

      {/* Filter Toggle Button (Mobile) */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg shadow"
        >
          <FaFilter /> {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filter Options */}
      <div
        className={`mb-4 sm:mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 max-w-md mx-auto ${
          isFilterOpen ? "block" : "hidden md:flex"
        }`}
      >
        <label className="text-purple-100 font-semibold whitespace-nowrap">
          Filter by Category:
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full border border-purple-500/50 p-2 sm:p-3 rounded-lg bg-gray-800 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Housing">Housing</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {/* Transactions Table (Desktop) */}
      <div className="hidden md:block bg-gradient-to-br from-gray-900 to-purple-950 rounded-2xl shadow-xl border border-purple-500/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white">
              <tr>
                <th
                  className="p-4 text-sm font-semibold uppercase tracking-wider cursor-pointer hover:bg-purple-600 transition-all duration-200"
                  onClick={() => handleSort("date")}
                >
                  Date <FaSort className="inline ml-1" />
                </th>
                <th className="p-4 text-sm font-semibold uppercase">
                  Description
                </th>
                <th className="p-4 text-sm font-semibold uppercase">
                  Category
                </th>
                <th className="p-4 text-sm font-semibold uppercase">
                  Bank Account
                </th>
                <th
                  className="p-4 text-sm font-semibold uppercase cursor-pointer hover:bg-purple-600 transition-all duration-200"
                  onClick={() => handleSort("amount")}
                >
                  Amount (₹) <FaSort className="inline ml-1" />
                </th>
                <th className="p-4 text-sm font-semibold uppercase">Status</th>
                <th className="p-4 text-sm font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/20">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-purple-200">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr
                    key={txn._id}
                    className="hover:bg-purple-900/50 transition-all duration-200"
                  >
                    <td className="p-4 text-purple-100">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-purple-100">{txn.description}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${getCategoryStyle(
                          txn.category
                        )}`}
                      >
                        {txn.category}
                      </span>
                    </td>
                    <td className="p-4 text-purple-100">
                      {txn.bankAccount?.name}
                    </td>
                    <td className="p-4 font-semibold text-purple-200">
                      ₹{txn.amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      {txn.isSuspicious ? (
                        <span className="text-red-400 flex items-center gap-1">
                          <FaExclamationTriangle /> Suspicious
                        </span>
                      ) : (
                        <span className="text-green-400">Normal</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteTransaction(txn._id)}
                        className="text-red-400 hover:text-red-500 transition-all duration-200 p-2 rounded-full hover:bg-red-900/30"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions Cards (Mobile) */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center text-purple-200 bg-gradient-to-br from-gray-900 to-purple-950 rounded-xl">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map((txn) => (
            <div
              key={txn._id}
              className="bg-gradient-to-br from-gray-900 to-purple-950 rounded-xl shadow-lg border border-purple-500/30 p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-purple-100">
                    {txn.description}
                  </p>
                  <p className="text-sm text-purple-200">
                    {new Date(txn.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-bold text-lg text-purple-200">
                  ₹{txn.amount.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 justify-between items-center">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getCategoryStyle(
                    txn.category
                  )}`}
                >
                  {txn.category}
                </span>

                {txn.bankAccount?.name && (
                  <span className="text-xs text-purple-200">
                    {txn.bankAccount.name}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-purple-500/20">
                <div>
                  {txn.isSuspicious ? (
                    <span className="text-red-400 flex items-center gap-1 text-sm">
                      <FaExclamationTriangle /> Suspicious
                    </span>
                  ) : (
                    <span className="text-green-400 text-sm">Normal</span>
                  )}
                </div>
                <button
                  onClick={() => deleteTransaction(txn._id)}
                  className="text-red-400 hover:text-red-500 transition-all duration-200 p-2 rounded-full hover:bg-red-900/30"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sort Controls (Mobile) */}
      {filteredTransactions.length > 0 && (
        <div className="mt-4 md:hidden flex justify-center gap-2">
          <button
            onClick={() => handleSort("date")}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
              sortField === "date"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-purple-200"
            }`}
          >
            Date <FaSort />
          </button>
          <button
            onClick={() => handleSort("amount")}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
              sortField === "amount"
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-purple-200"
            }`}
          >
            Amount <FaSort />
          </button>
        </div>
      )}

      {/* Summary Section */}
      {filteredTransactions.length > 0 && (
        <div className="mt-4 sm:mt-5 md:mt-6 p-4 sm:p-5 md:p-6 bg-gradient-to-br from-gray-900 to-purple-950 rounded-2xl shadow-xl border border-purple-500/30 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-base sm:text-lg text-purple-100">
            <span className="font-semibold text-purple-400">
              Total Transactions:
            </span>{" "}
            {filteredTransactions.length}
          </p>
          <p className="text-base sm:text-lg text-purple-100">
            <span className="font-semibold text-purple-400">Total Spent:</span>{" "}
            ₹
            {filteredTransactions
              .reduce((sum, txn) => sum + txn.amount, 0)
              .toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
