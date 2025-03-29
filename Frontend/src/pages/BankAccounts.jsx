import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCreditCard,
  FaWallet,
  FaBuilding,
  FaPlus,
  FaTrash,
  FaBars,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "Bank Account",
    balance: "",
    income: "",
  });
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/bank-accounts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    fetchAccounts();
  }, []);

  const handleAddAccount = async (e) => {
    e.preventDefault();
    const balance = parseFloat(newAccount.balance);
    if (!newAccount.name || isNaN(balance)) {
      alert("Please fill in all required fields with valid data.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/bank-accounts/add",
        newAccount,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAccounts([...accounts, data]);
      setShowAddModal(false);
      setNewAccount({
        name: "",
        type: "Bank Account",
        balance: "",
        income: "",
      });
    } catch (error) {
      alert("Error adding account: " + error.response?.data?.error);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    const amount = parseFloat(addMoneyAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/bank-accounts/add-money",
        { bankAccountId: selectedAccountId, amount },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setAccounts(
        accounts.map((account) =>
          account._id === selectedAccountId
            ? { ...account, balance: data.updatedAccount.balance }
            : account
        )
      );
      setShowAddMoneyModal(false);
      setAddMoneyAmount("");
      setSelectedAccountId(null);
      alert("Money added successfully!");
    } catch (error) {
      alert("Error adding money: " + error.response?.data?.error);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this account? This will also delete all associated transactions."
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/bank-accounts/${accountId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setAccounts(accounts.filter((account) => account._id !== accountId));
      alert("Account deleted successfully!");
    } catch (error) {
      alert("Error deleting account: " + error.response?.data?.error);
    }
  };

  const openAddMoneyModal = (accountId) => {
    setSelectedAccountId(accountId);
    setShowAddMoneyModal(true);
  };

  const getIcon = (type) => {
    switch (type) {
      case "Bank Account":
        return (
          <FaBuilding className="text-purple-400 text-2xl md:text-3xl transition-transform duration-200 hover:scale-110" />
        );
      case "Credit Card":
        return (
          <FaCreditCard className="text-purple-500 text-2xl md:text-3xl transition-transform duration-200 hover:scale-110" />
        );
      case "Investment":
        return (
          <FaBuilding className="text-indigo-400 text-2xl md:text-3xl transition-transform duration-200 hover:scale-110" />
        );
      case "Digital Wallet":
        return (
          <FaWallet className="text-purple-300 text-2xl md:text-3xl transition-transform duration-200 hover:scale-110" />
        );
      default:
        return (
          <FaBuilding className="text-gray-500 text-2xl md:text-3xl transition-transform duration-200 hover:scale-110" />
        );
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-2 sm:p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
            Connected Accounts
          </h2>
          <p className="text-purple-200 mt-2 text-base md:text-lg max-w-md">
            Seamlessly manage your linked financial accounts with ease.
          </p>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex gap-4">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-5 py-2 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50">
            <span className="text-xl">⟳</span> Sync All
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-5 py-2 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            <span className="text-xl">+</span> Add Account
          </button>
          <Link
            to="/home/expenditure"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-5 py-2 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            Track Expenditure
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden self-end">
          <button
            onClick={toggleMobileMenu}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white p-3 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-3 mb-6 p-4 bg-gray-900/80 rounded-xl border border-purple-500/30 animate-fadeIn">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 w-full justify-center">
            <span className="text-lg">⟳</span> Sync All
          </button>
          <button
            onClick={() => {
              setShowAddModal(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 w-full justify-center"
          >
            <span className="text-lg">+</span> Add Account
          </button>
          <Link
            to="/home/expenditure"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 w-full justify-center"
          >
            Track Expenditure
          </Link>
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        {accounts.map((account) => (
          <div
            key={account._id}
            className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-br from-gray-900 to-purple-950 p-4 md:p-6 rounded-2xl shadow-xl border border-purple-500/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-2xl -z-10"></div>
            <div className="flex items-center gap-3 md:gap-5 mb-4 sm:mb-0">
              {getIcon(account.type)}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white bg-gradient-to-r from-purple-300 to-indigo-400 bg-clip-text text-transparent">
                  {account.name}
                </h3>
                <p className="text-xs md:text-sm text-purple-200">
                  {account.type}
                </p>
                <p className="text-xs md:text-sm text-purple-300">
                  Last synced: {account.lastSynced}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 w-full sm:w-auto">
              <p className="text-base md:text-lg font-medium text-purple-100 bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                ₹{account.balance.toFixed(2)}
              </p>
              <span
                className={`text-xs md:text-sm ${
                  account.status === "Connected"
                    ? "text-green-400"
                    : "text-red-400"
                } flex items-center gap-1`}
              >
                {account.status === "Connected" ? "✔" : "✖"} {account.status}
              </span>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => openAddMoneyModal(account._id)}
                  className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-green-500/50"
                >
                  <FaPlus /> Add Money
                </button>
                <button
                  onClick={() => handleDeleteAccount(account._id)}
                  className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-red-500/50"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-purple-950 p-4 md:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/40 transform transition-all duration-300 scale-105 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 text-center bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Add New Account
            </h3>
            <form onSubmit={handleAddAccount}>
              <div className="mb-4 md:mb-5">
                <label className="block text-purple-100 font-medium mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, name: e.target.value })
                  }
                  className="w-full border border-purple-500/50 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 transition-all duration-200 hover:border-purple-400"
                  placeholder="e.g., HDFC Bank"
                  required
                />
              </div>
              <div className="mb-4 md:mb-5">
                <label className="block text-purple-100 font-medium mb-2">
                  Account Type
                </label>
                <select
                  value={newAccount.type}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, type: e.target.value })
                  }
                  className="w-full border border-purple-500/50 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 hover:border-purple-400"
                >
                  <option value="Bank Account">Bank Account</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Investment">Investment</option>
                  <option value="Digital Wallet">Digital Wallet</option>
                </select>
              </div>
              <div className="mb-4 md:mb-5">
                <label className="block text-purple-100 font-medium mb-2">
                  Current Balance (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newAccount.balance}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, balance: e.target.value })
                  }
                  className="w-full border border-purple-500/50 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 transition-all duration-200 hover:border-purple-400"
                  placeholder="e.g., 10000"
                  required
                />
              </div>
              <div className="mb-4 md:mb-5">
                <label className="block text-purple-100 font-medium mb-2">
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newAccount.income}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, income: e.target.value })
                  }
                  className="w-full border border-purple-500/50 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 transition-all duration-200 hover:border-purple-400"
                  placeholder="e.g., 50000"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 order-2 sm:order-1"
                >
                  Add Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all duration-300 shadow-md order-1 sm:order-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-purple-950 p-4 md:p-8 rounded-2xl shadow-2xl max-w-md w-full border border-purple-500/40 transform transition-all duration-300 scale-105">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 text-center bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Add Money to Account
            </h3>
            <form onSubmit={handleAddMoney}>
              <div className="mb-4 md:mb-5">
                <label className="block text-purple-100 font-medium mb-2">
                  Amount to Add (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  className="w-full border border-purple-500/50 p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 transition-all duration-200 hover:border-purple-400"
                  placeholder="e.g., 5000"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 order-2 sm:order-1"
                >
                  Add Money
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMoneyModal(false);
                    setAddMoneyAmount("");
                    setSelectedAccountId(null);
                  }}
                  className="bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all duration-300 shadow-md order-1 sm:order-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty state for when there are no accounts */}
      {accounts.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900/60 rounded-2xl border border-purple-500/30 text-center space-y-4">
          <div className="text-5xl text-purple-400">💰</div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            No Accounts Connected
          </h3>
          <p className="text-purple-200 max-w-md">
            You haven't added any accounts yet. Click the "Add Account" button
            to get started.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
          >
            <span className="text-xl">+</span> Add Your First Account
          </button>
        </div>
      )}
    </div>
  );
};

export default BankAccounts;
