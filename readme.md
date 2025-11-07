# 📄 Invoice Reader App (React Native + Node.js + Gemini AI)

A cross-platform **React Native app** with a **Node.js backend** that allows users to securely upload and analyze invoices, PDFs, and images.  
It uses **Google Gemini AI** to extract and structure data into JSON format and displays it in a clean, dynamic table.

---

## 🚀 Features

### 📱 Frontend (React Native)
- User **Authentication (Login/Register)** with JWT token.
- Upload **PDFs, images, or Excel files** from your device.
- Display extracted invoice data in a **structured table view**.
- Fetch and show only the **logged-in user’s uploaded invoices**.
- Secure API requests using authentication tokens.

### 🧠 Backend (Node.js + Express)
- File upload using **Multer**.
- Smart text extraction using:
  - **PDF parsing** via `pdf-parse`
  - **Image OCR** using `tesseract.js`
  - **Excel reading** using `xlsx`
  - **Word document reading** using `mammoth`
- AI-based structured data extraction using **Google Gemini API**.
- Data stored securely in **MySQL** with user-based segregation.
- Token-based authentication (JWT).
- Fully CORS-enabled for mobile access.

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React Native (Expo) |
| **Backend** | Node.js + Express |
| **AI** | Google Gemini 2.5 Pro |
| **Database** | MySQL |
| **Auth** | JWT (JSON Web Token) |
| **File Uploads** | Multer |
| **OCR / Parsing** | pdf-parse, tesseract.js, mammoth, xlsx |

---

## 📦 Folder Structure

invoice-reader/
├── client/ # React Native app
│ ├── App.js
│ ├── screens/
│ │ ├── AuthScreen.js
│ │ ├── HomeScreen.js
│ │ └── InvoiceList.js
│ └── components/
│ └── TableView.js
│
├── server/ # Node.js backend
│ ├── index.js
│ ├── uploads/ # Temporary uploaded files
│ ├── data/ # Stored processed data (if any)
│ └── .env
│
└── README.md