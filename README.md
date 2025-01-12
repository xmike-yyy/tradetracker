# Trade Tracker

A personal trading tracker application built to help traders log and analyze their trades. This app provides a calendar view of trades, tracks key statistics like **P&L**, **Win Rate**, and **Monthly P&L Flow**, and allows users to edit or delete trades.

---

## **Tech Stack**

- **Frontend**:
  - React (with TypeScript)
  - Tailwind CSS (for styling and dark mode)
  - Chart.js (for visualizing P&L flow)
  - date-fns (for date manipulation)

- **State Management**:
  - React's built-in `useState` and `useEffect`

- **Local Storage**:
  - Trades are stored in the browser's local storage for persistence.

---

## **Features**

1. **Log Trades**:
   - Log trades with details like symbol, side (long/short), profit/loss, date, and notes.
   
2. **Calendar View**:
   - View trades on a calendar with daily P&L and the number of trades.

3. **Dashboard**:
   - Track key stats:
     - **Total P&L**
     - **Win Rate**
     - **Monthly P&L Flow** (visualized with a line chart)

4. **Edit and Delete Trades**:
   - Edit trade notes or delete trades directly from the calendar.

5. **Dark Mode**:
   - Toggle between light and dark mode for better usability.

---

## **Future Outlook**

- **Advanced Analytics**:
  - Add more detailed charts and analytics, such as trade duration, risk-reward ratios, and sector performance.

- **Export Data**:
  - Allow users to export their trade data to CSV or Excel for further analysis.

- **Backend Integration**:
  - Integrate with a backend service (e.g., Firebase or a custom API) to store trades in a database.

- **Mobile App**:
  - Convert this into a mobile app using React Native for on-the-go tracking.

- **Broker Integration**:
  - Automatically import trades from popular brokers like Robinhood, TD Ameritrade, or Interactive Brokers.

---

## **Screenshots**

![Calendar View](./screenshots/calendar.png)
![Dashboard](./screenshots/dashboard.png)

---

## **Contributing**

Contributions are welcome! If you'd like to contribute, please open an issue or submit a pull request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
