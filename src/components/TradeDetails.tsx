import React, { useState } from "react";
import { Trade } from "../types";
import { format, isSameDay } from "date-fns";

interface TradeDetailsProps {
  trades: Trade[];
  selectedDate: Date | null;
  onClose: () => void;
  onUpdateTrade: (updatedTrade: Trade) => void;
  onDeleteTrade: (tradeId: string) => void;
  darkMode: boolean;
}

export default function TradeDetails({
  trades,
  selectedDate,
  onClose,
  onUpdateTrade,
  onDeleteTrade,
  darkMode,
}: TradeDetailsProps) {
  const [editingTradeId, setEditingTradeId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState("");

  if (!selectedDate) {
    return null;
  }

  const dayTrades = trades.filter((trade) =>
    isSameDay(new Date(trade.date), selectedDate),
  );

  const totalPnL = dayTrades.reduce((sum, trade) => sum + trade.profit, 0);

  const handleEditNotes = (trade: Trade) => {
    setEditingTradeId(trade.id);
    setEditingNotes(trade.notes);
  };

  const handleSaveNotes = (trade: Trade) => {
    onUpdateTrade({
      ...trade,
      notes: editingNotes,
    });
    setEditingTradeId(null);
  };

  return (
    <div
      className={`rounded-lg shadow ${darkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div
        className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div
          className={`mt-2 font-semibold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          ${totalPnL.toFixed(2)}
        </div>
      </div>

      <div className="p-4">
        {dayTrades.length === 0 ? (
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            No trades on this day
          </p>
        ) : (
          <div className="space-y-4">
            {dayTrades.map((trade) => (
              <div
                key={trade.id}
                className={`border rounded-lg p-3 ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{trade.symbol}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.side === "LONG"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {trade.side}
                  </span>
                </div>
                <div className="mb-2">
                  <span
                    className={`font-medium ${
                      trade.profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${trade.profit.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2">
                  {editingTradeId === trade.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          darkMode ? "bg-gray-700 text-white" : "bg-white"
                        }`}
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingTradeId(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNotes(trade)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {trade.notes || "No notes"}
                      </p>
                      <button
                        onClick={() => handleEditNotes(trade)}
                        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => onDeleteTrade(trade.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Delete Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
