# Evinza - Local Events Platform

Evinza is a comprehensive platform for discovering, creating, and managing local events and groups. It connects people with shared interests through both online and in-person experiences.

## Features

### 🚀 Core Features

- **Authentication**: Secure Signup/Login with Email/Phone & OTP verification.
- **User Profiles**: Manage personal details, interests, and certifications.
- **Event Management**: Create, edit, delete, and RSVP to events.
- **Group Management**: Create and join groups based on interests.

### ✨ Engagement

- **Real-time Updates**: Live attendee counts and status updates (powered by Socket.io).
- **Group Chat**: Real-time messaging within groups.
- **Advanced Search**: Filter events by date, price, location, and type.

### 💼 Scale & Monetization

- **Payments**: Integrated flow for paid events (Mock Gateway).
- **Admin Dashboard**: View platform statistics and manage users/events.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Sequelize ORM)
- **Real-time**: Socket.io

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Create a `.env` file in `backend/` (see `.env.example` if available, or use provided credentials).
    - Ensure `DB_USERNAME` and `DB_PASSWORD` match your local PostgreSQL setup.
4.  Run Database Migrations (if applicable) or ensure DB is running.
5.  Start the server:
    ```bash
    npm run dev
    ```
    Server runs on `http://localhost:4000`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Serve the files using a simple HTTP server (e.g., Live Server in VS Code or `http-server`):
    ```bash
    npx http-server . -p 5500
    ```
3.  Open `http://localhost:5500` in your browser.

## Admin Access

To access the Admin Dashboard:

1.  Register a new user.
2.  Run the promotion script in the backend:
    ```bash
    node promote-admin.js <user_email>
    ```
3.  Log in and navigate to `/admin-dashboard.html`.

## Payment Testing

- Select any paid event.
- Proceed to payment.
- The system uses a mock gateway; no real card details are required.
