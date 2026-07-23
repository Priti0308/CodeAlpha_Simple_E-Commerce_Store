# Simple E-Commerce Store

A responsive, premium-designed e-commerce web application with a Node.js Express backend and a Vanilla JS/CSS frontend.

## Project Structure

```text
simple-ecommerce-store/
├── frontend/             # Frontend Static Website
│   ├── css/              # Styling sheets (vanilla CSS, responsive design)
│   ├── js/               # Client-side routing, logic, and state management
│   ├── assets/           # UI images, icons, and logos
│   ├── components/       # Reusable layout fragments (navbar, footer)
│   └── *.html            # E-commerce store pages (index, products, cart, profile, etc.)
└── backend/              # Node.js REST API
    ├── config/           # Database configurations
    ├── controllers/      # Route controllers (Auth, Products, Cart, Orders)
    ├── middleware/       # Route shields and error handlers
    ├── models/           # Mongoose schemas (User, Product, Cart, Order)
    ├── routes/           # Router groups mapped to paths
    ├── uploads/          # Static folders for product pictures
    ├── .env              # Environment configurations
    ├── package.json      # Dependencies and scripts
    └── server.js         # Backend entrypoint
```

## Features

- **Authentication**: JWT-based sign up, login, and secure user profiles.
- **Product Catalog**: Beautiful grid layouts showing products, search/filter functionalities, and detailed view with images.
- **Shopping Cart**: Client-side localStorage persistence with optional backend synchronization.
- **Checkout Flow**: Interactive delivery details, secure order simulation, and receipt verification.
- **Responsive Layout**: Fluid layouts styled specifically for mobile, tablet, and desktop views.

## Setup Instructions

### Prerequisites
- Node.js installed locally.
- MongoDB database connection (local or remote like MongoDB Atlas).

### Backend Setup
1. Open a terminal, go to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in `.env`.
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Simply serve the `frontend/` directory using any local development server (e.g., Live Server in VS Code, or python server):
   ```bash
   python -m http.server 8000
   ```
2. Open your browser and navigate to `http://localhost:8000`.
