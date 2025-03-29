import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate, Routes, Route } from "react-router-dom";
import {
  FaBell,
  FaSyncAlt,
  FaChartLine,
  FaUniversity,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaCalculator,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Chat from "./Chat";
import Investments from "./Investments";
import Goals from "./Goals";
import BankAccounts from "./BankAccounts";
import Expenditure from "./Expenditure";
import Transactions from "./Transaction";
import Land from "./Land";
import MutualFunds from "./MutualFunds";
import FixedDeposits from "./FixedDeposits";
import StocksInvest from "./Stockinvest";
import TaxFiling from "./TaxFiling";
import Notifications from "./Notifications";
import FinancialInsights from "./FinancialInsights";
import Calculator from "./Calculator";
import Dashboard from "./Dashboard";
import DebtTracker from "./DebtTracker";

const MainHome = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to Homepage after logout
  };

  const handleRefresh = () => {
    window.location.reload(); // Refresh the current page
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNavMenu = () => {
    setNavMenuOpen(!navMenuOpen);
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading...</div>;
  }

  const sidebarLinks = [
    { to: "/home/dashboard", label: "Port-Folio", icon: <FaChartLine /> },
    { to: "/home/bank-accounts", label: "Accounts", icon: <FaUniversity /> },
    {
      to: "/home/expenditure",
      label: "Expenditure",
      icon: <FaMoneyBillWave />,
    },
    {
      to: "/home/transactions",
      label: "Transactions",
      icon: <FaExchangeAlt />,
    },
    { to: "/home/calculator", label: "Tax Calculator", icon: <FaCalculator /> },
  ];

  const navLinks = [
    { to: "/home/investments", label: "Investments" },
    { to: "/home/goals", label: "Goals" },
    { to: "/home/insights", label: "Financial Insights" },
    { to: "/home/tax-filing", label: "Taxes Invoice" },
    { to: "/home/debt-tracker", label: "Debt Tracker" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex flex-col font-sans">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-md"
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-900 shadow-lg flex flex-col justify-between fixed h-full top-0 left-0 z-40 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-64 w-64`}
      >
        <div>
          <div className="p-4">
            <h2 className="text-xl font-bold text-purple-300">
              {user?.name || "User"}
            </h2>
          </div>
          <nav className="mt-4">
            {sidebarLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-3 px-4 text-gray-300 hover:bg-purple-800 hover:text-white transition duration-200 flex items-center"
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition duration-200 flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        } lg:ml-64`}
      >
        {/* Navbar */}
        <nav className="bg-gray-900 shadow-lg relative z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16 items-center">
              {/* Navbar Toggle Button - only visible on small screens */}
              <div className="md:hidden">
                <button
                  onClick={toggleNavMenu}
                  className="text-gray-300 hover:text-white p-2"
                  aria-label="Toggle navigation menu"
                >
                  {navMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
              </div>

              {/* Nav Links - Hidden on small screens, visible on medium and up */}
              <div className="hidden md:flex md:items-center md:space-x-2 lg:space-x-4 overflow-x-auto">
                {user &&
                  navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-gray-300 hover:bg-purple-800 hover:text-white px-2 lg:px-3 py-2 rounded-md transition duration-200 whitespace-nowrap text-sm lg:text-base"
                    >
                      {link.label}
                    </Link>
                  ))}
              </div>

              {/* Notification Bell and Refresh Button */}
              {user && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleRefresh}
                    className="text-gray-300 hover:text-purple-300 transition duration-200 flex items-center"
                    title="Refresh"
                  >
                    <FaSyncAlt className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                  <Link
                    to="/home/notifications"
                    className="text-gray-300 hover:text-purple-300 transition duration-200 flex items-center"
                  >
                    <FaBell className="w-5 h-5 lg:w-6 lg:h-6" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Nav Menu - Collapsible */}
          {navMenuOpen && (
            <div className="md:hidden bg-gray-800 shadow-lg absolute left-0 right-0 z-20">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {user &&
                  navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block text-gray-300 hover:bg-purple-800 hover:text-white px-3 py-2 rounded-md transition duration-200"
                      onClick={() => setNavMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </nav>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center w-full">
          <div className="w-full max-w-7xl mx-auto px-4 py-6 flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-lg text-center text-white">
                    <p className="mb-4">
                      Welcome back, {user?.name}! Manage your finances
                      efficiently with AI-powered insights.
                    </p>
                  </div>
                }
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/bank-accounts" element={<BankAccounts />} />
              <Route path="/expenditure" element={<Expenditure />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/land" element={<Land />} />
              <Route path="/mutual-funds" element={<MutualFunds />} />
              <Route path="/fixed-deposits" element={<FixedDeposits />} />
              <Route path="/stocksinvest" element={<StocksInvest />} />
              <Route path="/tax-filing" element={<TaxFiling />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/insights" element={<FinancialInsights />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/debt-tracker" element={<DebtTracker />} />
            </Routes>
          </div>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default MainHome;
