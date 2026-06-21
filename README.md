# 💸 RemitCompare

RemitCompare is a full-stack remittance comparison platform that helps users compare exchange rates, fees, and payout amounts across multiple money transfer providers.

Built to explore practical fintech applications, the platform integrates live exchange rate data and calculates fee-adjusted payouts to help users identify the best transfer option.

---

## 🚀 Features

- Compare multiple remittance providers
- Fetch live exchange rates using the Wise API
- Fee-aware payout calculations
- Rank providers by recipient amount received
- Responsive React frontend
- REST API backend built with Express.js
- Deployed application for real-world usage

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- CSS

### Backend
- Node.js
- Express.js
- Axios

### Deployment
- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure

```
RemitCompare
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── routes
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## ⚡ How It Works

1. Users enter:
   - Source currency
   - Target currency
   - Transfer amount

2. The backend retrieves live exchange rates from the Wise API.

3. Rates and fees from different providers are compared.

4. The platform calculates:
   - Exchange rate
   - Transfer fee
   - Amount received

5. Providers are ranked based on the highest payout.

---


### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Future Improvements

- Support for additional remittance providers
- Historical exchange rate charts
- Rate alerts and notifications
- User authentication
- Provider reviews and ratings
- Multi-country support

---

## 📖 Motivation

RemitCompare was built to explore real-world fintech applications and provide a transparent way to compare remittance options.

The project focuses on:

- API integration
- Full-stack development
- Fee analysis
- Backend deployment
- Practical fintech use cases

  ## 🌐 Live Demo

🔗 https://remit-compare-psi.vercel.app/

---

Built with ❤️ using React, Node.js, and Express.js.
