import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  DollarSign,
  Users,
  Clock,
  Check,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  ExternalLink,
  X as XIcon,
  CreditCard,
  Calendar,
  User,
  Hash,
} from "lucide-react";
import { get } from "../../utils/api";

export default function TransactionDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await get("/api/getAllTransactions");
        console.log(response);
        setTransactions(response);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);

  // Sample transaction data
  const transaction = [
    {
      id: "8902",
      customer: "Alex Johnson",
      email: "alex.johnson@example.com",
      amount: 1250.0,
      status: "Success",
      date: "2025-04-26",
      time: "09:34 AM",
      paymentMethod: "Credit Card (**** 4321)",
      reference: "REF-TXN-8902-AJ",
      notes: "Monthly subscription payment",
    },
    {
      id: "8901",
      customer: "Sarah Williams",
      email: "sarah.w@example.com",
      amount: 890.5,
      status: "pending",
      date: "2025-04-25",
      time: "02:15 PM",
      paymentMethod: "Bank Transfer (**** 7890)",
      reference: "REF-TXN-8901-SW",
      notes: "Awaiting bank confirmation",
    },
    {
      id: "8900",
      customer: "Michael Chen",
      email: "m.chen@example.com",
      amount: 3450.75,
      status: "Success",
      date: "2025-04-25",
      time: "11:42 AM",
      paymentMethod: "Credit Card (**** 6543)",
      reference: "REF-TXN-8900-MC",
      notes: "Premium plan upgrade",
    },
    {
      id: "8899",
      customer: "Emma Davis",
      email: "emma.d@example.com",
      amount: 220.25,
      status: "failed",
      date: "2025-04-24",
      time: "04:18 PM",
      paymentMethod: "Credit Card (**** 1234)",
      reference: "REF-TXN-8899-ED",
      notes: "Declined due to insufficient funds",
    },
    {
      id: "8898",
      customer: "James Wilson",
      email: "j.wilson@example.com",
      amount: 1875.3,
      status: "Success",
      date: "2025-04-24",
      time: "10:05 AM",
      paymentMethod: "PayPal (james.w@example.com)",
      reference: "REF-TXN-8898-JW",
      notes: "Annual subscription payment",
    },
  ];

  // Filter transactions based on active tab and search term
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.includes(searchTerm);

    if (activeTab === "all") return matchesSearch;
    return transaction.status === activeTab && matchesSearch;
  });

  // Function to open transaction details modal
  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  // Stats cards data
  const stats = [
    {
      title: "Total Revenue",
      value: "$28,426.00",
      icon: <DollarSign size={20} />,
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: "1,240",
      icon: <Users size={20} />,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: "18",
      icon: <Clock size={20} />,
      color: "bg-yellow-500",
    },
    {
      title: "Success",
      value: "842",
      icon: <Check size={20} />,
      color: "bg-purple-500",
    },
  ];

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Success: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <Check size={14} className="text-green-600" />,
      },
      Pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <Clock size={14} className="text-yellow-600" />,
      },
      failed: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <X size={14} className="text-red-600" />,
      },
      // Add a default configuration for unknown statuses
      default: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: <Hash size={14} className="text-gray-600" />,
      },
    };

    // Use the status config or default if status is not recognized
    const config = statusConfig[status] || statusConfig.default;

    return (
      <span
        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.icon}
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </span>
    );
  };

  // Transaction Details Modal
  const TransactionDetailsModal = () => {
    if (!selectedTransaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">Transaction Details</h3>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XIcon size={20} />
            </button>
          </div>

          <div className="p-6">
            {/* Transaction Status */}
            <div className="mb-6 flex justify-center">
              <StatusBadge status={selectedTransaction.status} />
            </div>

            {/* Transaction Amount */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-3xl font-bold">
                Rs.{selectedTransaction.amount.toFixed(2)}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Hash size={18} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium">#{selectedTransaction.id}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User size={18} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedTransaction.user_name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedTransaction.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    <span className="text-xs text-gray-500 mt-1">
                      {new Date(
                        selectedTransaction?.payment_date
                      ).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard size={18} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">ESEWA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash size={18} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-medium">{selectedTransaction.reference}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Transactions Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold flex items-center">
            <ArrowUpDown className="mr-2 text-gray-600" size={18} />
            Transactions
          </h2>

          {/* Search and filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-grow max-w-sm">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-9 pr-3 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
            </div>

            <button className="flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </button>

            <button className="flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Transaction Tabs */}
        <div className="flex border-b">
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Transactions
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "Success"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("Success")}
          >
            Success
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "pending"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "failed"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("failed")}
          >
            Failed
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      #{transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      Rs.{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction?.payment_date).toLocaleString(
                        "en-GB",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        }
                      )}{" "}
                      <span className="text-xs text-gray-400">
                        {transaction.time}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        onClick={() => openTransactionDetails(transaction)}
                      >
                        <ExternalLink size={14} />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No transactions found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center justify-between border-t">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">5</span> of{" "}
            <span className="font-medium">50</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-2 py-1 border rounded hover:bg-gray-50 text-gray-600">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600 border-blue-200">
              1
            </button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-2 py-1 border rounded hover:bg-gray-50 text-gray-600">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && <TransactionDetailsModal />}
    </div>
  );
}
