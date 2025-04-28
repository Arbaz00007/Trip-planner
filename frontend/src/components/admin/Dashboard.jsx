import React, { useContext, useEffect, useState } from "react";
import {
  LuUsers,
  LuPackage,
  LuUser,
  LuShoppingBag,
  LuTrendingUp,
  LuCalendar,
} from "react-icons/lu";
import { HiOutlineCash, HiOutlineChartBar } from "react-icons/hi";
import {
  FiCalendar,
  FiMail,
  FiPhone,
  FiBarChart2,
  FiGrid,
} from "react-icons/fi";
import { BsGraphUp, BsBarChartSteps } from "react-icons/bs";
import { RiRadarLine } from "react-icons/ri";
import { get } from "../../utils/api";
import {
  ComposedChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  Treemap,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AuthContext } from "../../context/authContext";

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [userCount, setUserCount] = useState(0);
  const [packageCount, setPackageCount] = useState(0);
  const [guiderCount, setGuiderCount] = useState(0);
  const [myData, setMyData] = useState([]);
  const [total, setTotal] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await get("/api/getAllUsers");
      setUserCount(res.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    loadData();
    loadMyPost();
    loadBooking();
    loadAmount();
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await get("/api/getAllTransactions");
      console.log(res);

      setTransactions(res);
    } catch (error) {
      console.error("Error while fetching transactions:", error);
    }
  };

  const loadData = async () => {
    try {
      const response = await get(`http://localhost:5050/api/getPosts`);
      setPackageCount(response.length);
    } catch (error) {
      console.error("Error while fetching packages:", error);
    }
  };

  const loadMyPost = async () => {
    try {
      const response = await get(`http://localhost:5050/api/getAllGuider`);
      setGuiderCount(response.length);
    } catch (error) {
      console.error("Error while fetching guiders:", error);
    }
  };

  const loadBooking = async () => {
    try {
      const res = await get("/api/getAllBookingDetails");
      setMyData(res);
    } catch (error) {
      console.error("Error while fetching bookings:", error);
    }
  };
  const loadAmount = async () => {
    try {
      const res = await get("/api/totalAmount");
      //   console.log(res, "totalAmount");
      setTotal(res);
    } catch (error) {
      console.error("Error while fetching total amount:", error);
    }
  };

  // Sample transaction data
  const transaction = [
    { id: "09823", name: "Alex Johnson", date: "2022-02-28", amount: 20000 },
    { id: "09824", name: "Sarah Williams", date: "2022-02-27", amount: 15000 },
    { id: "09825", name: "Michael Chen", date: "2022-02-26", amount: 22500 },
    { id: "09826", name: "Emma Davis", date: "2022-02-25", amount: 18000 },
  ];

  // Sample radar chart data
  const radarData = [
    { subject: "Adventure", A: 120, B: 110, fullMark: 150 },
    { subject: "Cultural", A: 98, B: 130, fullMark: 150 },
    { subject: "Relaxation", A: 86, B: 130, fullMark: 150 },
    { subject: "Family", A: 99, B: 100, fullMark: 150 },
    { subject: "Eco", A: 85, B: 90, fullMark: 150 },
    { subject: "Business", A: 65, B: 85, fullMark: 150 },
  ];

  // Sample radial bar chart data
  const radialData = [
    { name: "Premium", uv: 31.47, pv: 2400, fill: "#8884d8" },
    { name: "Standard", uv: 26.69, pv: 4567, fill: "#83a6ed" },
    { name: "Economy", uv: 15.69, pv: 1398, fill: "#8dd1e1" },
    { name: "Group", uv: 8.22, pv: 9800, fill: "#82ca9d" },
    { name: "Custom", uv: 8.63, pv: 3908, fill: "#a4de6c" },
  ];

  // Sample bar chart data
  const monthlyData = [
    { name: "Jan", bookings: 65, revenue: 125000 },
    { name: "Feb", bookings: 59, revenue: 165000 },
    { name: "Mar", bookings: 80, revenue: 145000 },
    { name: "Apr", bookings: 81, revenue: 190000 },
    { name: "May", bookings: 56, revenue: 220000 },
    { name: "Jun", bookings: 55, revenue: 200000 },
    { name: "Jul", bookings: 40, revenue: 230000 },
  ];

  // Sample scatter chart data
  const scatterData = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ];

  // Sample treemap data
  const treemapData = [
    { name: "Adventure", size: 1200, color: "#8889DD" },
    { name: "Cultural", size: 1000, color: "#9597E4" },
    { name: "Relaxation", size: 800, color: "#8DC77B" },
    { name: "Family", size: 600, color: "#A5D297" },
    { name: "Eco", size: 400, color: "#E2CF45" },
    { name: "Business", size: 300, color: "#F8C12D" },
  ];

  const StatCard = ({ icon: Icon, count, title, color, trend }) => (
    <div className="w-1/4 rounded-xl shadow-md bg-white p-6 flex flex-col justify-between gap-3 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div
          className={`rounded-full w-12 h-12 ${color} grid place-items-center text-white text-[1.2rem]`}
        >
          <Icon />
        </div>
        {trend && (
          <div className="flex items-center text-green-500 text-sm font-medium">
            <LuTrendingUp className="mr-1" /> {trend}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-gray-800">
          {isLoading ? "..." : count}
        </span>
        <span className="text-gray-500 font-medium">{title}</span>
      </div>
    </div>
  );

  return (
    <div className="p-8 flex flex-col bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <FiCalendar className="text-gray-500" />
          <select className="bg-transparent border-none outline-none text-gray-600 font-medium">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6 justify-center">
        <StatCard
          icon={LuUser}
          count={userCount}
          title="Total Users"
          color="bg-blue-500"
          trend="12% ↑"
        />
        <StatCard
          icon={LuPackage}
          count={packageCount}
          title="Total Packages"
          color="bg-green-500"
          trend="5% ↑"
        />
        {currentUser?.role_id === 1 && (
          <StatCard
            icon={LuUsers}
            count={guiderCount}
            title="Total Guides"
            color="bg-purple-500"
            trend="8% ↑"
          />
        )}
        <StatCard
          icon={HiOutlineCash}
          count={`Rs. ${total.total_amount}`}
          title="Total Revenue"
          color="bg-amber-500"
          trend="15% ↑"
        />
      </div>

      {/* Charts Row - Alternative Visualizations */}
      <div className="flex mt-6 gap-6">
        <div className="w-1/2 bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <HiOutlineChartBar className="text-blue-500" />
              Monthly Performance
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af" }}
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="bookings"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/2 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <RiRadarLine className="text-purple-500" />
            Package Comparison
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart outerRadius={90} data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 150]}
                tick={{ fill: "#6b7280" }}
              />
              <Radar
                name="This Year"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.5}
              />
              <Radar
                name="Last Year"
                dataKey="B"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.5}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex mt-6 gap-6">
        <div className="w-1/3 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BsBarChartSteps className="text-amber-500" />
            Package Distribution
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <Treemap
              data={treemapData}
              dataKey="size"
              ratio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
              content={({
                root,
                depth,
                x,
                y,
                width,
                height,
                index,
                payload,
                colors,
                rank,
                name,
              }) => {
                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      style={{
                        fill: treemapData[index % treemapData.length].color,
                        stroke: "#fff",
                        strokeWidth: 2 / (depth + 1e-10),
                        strokeOpacity: 1 / (depth + 1e-10),
                      }}
                    />
                    {width > 30 && height > 30 && (
                      <text
                        x={x + width / 2}
                        y={y + height / 2 + 7}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={12}
                      >
                        {name}
                      </text>
                    )}
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </div>

        <div className="w-1/3 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-green-500" />
            Package Categories
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <RadialBarChart
              innerRadius="15%"
              outerRadius="80%"
              data={radialData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                minAngle={15}
                label={{ fill: "#666", position: "insideStart" }}
                background
                clockWise={true}
                dataKey="uv"
              />
              <Legend
                iconSize={10}
                width={120}
                height={140}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-1/3 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BsGraphUp className="text-blue-500" />
            Cost vs Duration Analysis
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="price" unit="$" />
              <YAxis type="number" dataKey="y" name="duration" unit="days" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Packages" data={scatterData} fill="#8884d8">
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex mt-6 gap-6">
        <div className="flex flex-col w-2/3 bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <LuShoppingBag className="text-green-500" />
              Recent Bookings
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <LuCalendar />
              <span>Last 30 days</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <LuShoppingBag className="text-gray-400" />
                      Package
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <LuUser className="text-gray-400" />
                      Customer
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-400" />
                      Email
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      Contact
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myData.length > 0 ? (
                  myData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                        {item.pname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {item.phone}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col w-1/3 bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <HiOutlineCash className="text-amber-500" />
              Recent Transactions
            </h2>
            <div className="text-blue-500 text-sm font-medium cursor-pointer hover:underline">
              View All
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2 text-blue-500">
                    <HiOutlineCash className="text-lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {transaction.user_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {transaction.id}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="py-1 px-3 bg-green-100 text-green-700 font-medium rounded-full text-sm">
                    Rs.{transaction.amount.toLocaleString()}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {
                      new Date(transaction.payment_date)
                        .toISOString()
                        .split("T")[0]
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
