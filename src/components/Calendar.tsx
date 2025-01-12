import React from "react";
import { Trade } from "../types";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
} from "date-fns";

interface CalendarProps {
  trades: Trade[];
  onDayClick: (date: Date) => void;
  selectedDate: Date | null;
  darkMode: boolean;
}

export default function Calendar({
  trades,
  onDayClick,
  selectedDate,
  darkMode,
}: CalendarProps) {
  const today = new Date();
  const start = startOfWeek(startOfMonth(today));
  const end = endOfMonth(today);
  const days = [];
  let day = start;

  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getDayTrades = (date: Date) => {
    return trades.filter((trade) => isSameDay(new Date(trade.date), date));
  };

  const getDayPnL = (date: Date) => {
    const dayTrades = getDayTrades(date);
    return dayTrades.reduce((sum, trade) => sum + trade.profit, 0);
  };

  return (
    <div
      className={`rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div
        className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <h2 className="text-lg font-semibold">{format(today, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <span
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Monthly total:
          </span>
          <span
            className={`font-semibold ${
              trades.reduce((sum, trade) => sum + trade.profit, 0) >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            ${trades.reduce((sum, trade) => sum + trade.profit, 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className={`p-2 text-center text-sm font-medium ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-50 text-gray-500"}`}
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayPnL = getDayPnL(day);
          const dayTrades = getDayTrades(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={day.toString()}
              onClick={() => onDayClick(day)}
              className={`
                min-h-[100px] p-2 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700
                ${!isSameMonth(day, today) ? (darkMode ? "bg-gray-700" : "bg-gray-50") : darkMode ? "bg-gray-800" : "bg-white"}
                ${isSelected ? "ring-2 ring-blue-500" : ""}
              `}
            >
              <span
                className={`text-sm ${!isSameMonth(day, today) ? (darkMode ? "text-gray-500" : "text-gray-400") : darkMode ? "text-gray-300" : "text-gray-900"}`}
              >
                {format(day, "d")}
              </span>

              {dayTrades.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div
                    className={`text-sm font-medium ${
                      dayPnL >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${dayPnL.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {dayTrades.length} trade{dayTrades.length !== 1 ? "s" : ""}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
