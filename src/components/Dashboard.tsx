import React from "react";
import { Line } from "react-chartjs-2";
import { Trade } from "../types";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { DollarSign, TrendingUp, LineChart } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface DashboardProps {
  trades: Trade[];
  darkMode: boolean;
}

export default function Dashboard({ trades, darkMode }: DashboardProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate win rate
  const winningTrades = trades.filter((trade) => trade.profit > 0).length;
  const winRate =
    trades.length > 0 ? ((winningTrades / trades.length) * 100).toFixed(2) : 0;

  // Calculate total P&L
  const totalPnL = trades.reduce((sum, trade) => sum + trade.profit, 0);

  // Calculate daily P&L for the month
  const dailyPnL = daysInMonth.map((day) => {
    const dayTrades = trades.filter(
      (trade) =>
        isSameMonth(new Date(trade.date), day) &&
        isSameDay(new Date(trade.date), day),
    );
    return dayTrades.reduce((sum, trade) => sum + trade.profit, 0);
  });

  // Line chart data
  const chartData = {
    labels: daysInMonth.map((day) => format(day, "MMM d")),
    datasets: [
      {
        label: "Daily P&L",
        data: dailyPnL,
        borderColor: darkMode
          ? "rgba(99, 102, 241, 1)"
          : "rgba(79, 70, 229, 1)",
        backgroundColor: darkMode
          ? "rgba(99, 102, 241, 0.2)"
          : "rgba(79, 70, 229, 0.2)",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        className={`rounded-xl shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Total P&L
            </p>
            <p
              className={`text-2xl font-semibold mt-1 ${
                totalPnL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${totalPnL.toFixed(2)}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${darkMode ? "bg-blue-900" : "bg-blue-50"}`}
          >
            <DollarSign
              className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
            />
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Win Rate
            </p>
            <p className="text-2xl font-semibold mt-1">{winRate}%</p>
          </div>
          <div
            className={`p-3 rounded-lg ${darkMode ? "bg-blue-900" : "bg-blue-50"}`}
          >
            <TrendingUp
              className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
            />
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl shadow-sm p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Monthly P&L Flow</h2>
          <LineChart
            className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          />
        </div>
        <div className="h-64">
          <Line
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
}
