import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import TradeForm from "./components/TradeForm";
import TradeDetails from "./components/TradeDetails";
import Dashboard from "./components/Dashboard";
import { Trade } from "./types";
import { startOfWeek, endOfWeek, isSameWeek } from "date-fns";

export default function App() {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const savedTrades = localStorage.getItem("trades");
    return savedTrades ? JSON.parse(savedTrades) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  const handleTradeSubmit = (tradeData: Omit<Trade, "id">) => {
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString(),
    };
    setTrades([newTrade, ...trades]);
    setIsFormOpen(false);
  };

  const handleUpdateTrade = (updatedTrade: Trade) => {
    setTrades(
      trades.map((trade) =>
        trade.id === updatedTrade.id ? updatedTrade : trade,
      ),
    );
  };

  const handleDeleteTrade = (tradeId: string) => {
    setTrades(trades.filter((trade) => trade.id !== tradeId));
  };

  const getWeeklyPnL = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
    return trades
      .filter((trade) =>
        isSameWeek(new Date(trade.date), date, { weekStartsOn: 0 }),
      )
      .reduce((sum, trade) => sum + trade.profit, 0);
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <nav className={`shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Trading Calendar</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Log Trade
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Dashboard trades={trades} darkMode={darkMode} />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            <div className="lg:col-span-3">
              <Calendar
                trades={trades}
                onDayClick={setSelectedDate}
                selectedDate={selectedDate}
                darkMode={darkMode}
              />
            </div>
            <div className="space-y-6">
              <div
                className={`rounded-lg shadow p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <h2 className="text-lg font-semibold mb-2">Weekly P&L</h2>
                {selectedDate && (
                  <div
                    className={`text-2xl font-bold ${
                      getWeeklyPnL(selectedDate) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${getWeeklyPnL(selectedDate).toFixed(2)}
                  </div>
                )}
              </div>
              <TradeDetails
                trades={trades}
                selectedDate={selectedDate}
                onClose={() => setSelectedDate(null)}
                onUpdateTrade={handleUpdateTrade}
                onDeleteTrade={handleDeleteTrade}
                darkMode={darkMode}
              />
            </div>
          </div>

          {isFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div
                className={`rounded-lg w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-semibold">Log Trade</h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <TradeForm onSubmit={handleTradeSubmit} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
