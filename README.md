# InstaApp (React, Node, Express, Prisma, PostgreSQL)

**Description:**
Inspired by Instagram, **InstaApp** is a full-stack social media application built with **React** for the frontend, **Node.js** + **Express** for the backend, **Prisma ORM**, and **PostgreSQL** as the database. It implements features such as **user authentication**, **posts**, **stories**, **friends**, **chats**, and **real-time updates** with Socket.io. Users can interact with posts, comments, likes, send friend requests, chat with friends, and share stories.

---

## Features

* User registration and login (email/password & Google OAuth)
* Email verification and profile completion workflow
* CRUD operations for posts, comments, likes
* Create and view stories with image uploads via Cloudinary
* Send, accept, reject, cancel friend requests
* Real-time chats with friends using Socket.io
* Display unread message notifications
* Optimistic UI updates for better user experience
* Redux state management for authentication, posts, friends, chats, and stories
* Secure authentication with JWT tokens stored in HTTP-only cookies

---

## Tech Stack

* **Frontend:** React, Redux, Axios, react-hot-toast, @react-oauth/google
* **Backend:** Node.js, Express, Prisma ORM
* **Database:** PostgreSQL
* **Real-time:** Socket.io
* **File Uploads:** Cloudinary + Multer
* **Authentication:** JWT, Google OAuth
* **Email:** Nodemailer

---

## Environment Setup

### Backend `.env` (create .env in backend and set your own values)

```env
PORT=5000
JWT_SECRET_KEY=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
DATABASE_URL="postgresql://postgres:your_db_password@localhost:5432/your_database_name"
```

### Frontend `.env` (create .env in frontend and set your own values)

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev   # runs Node.js + Express server with nodemon
```

* Server runs on `http://localhost:5000`
* APIs include authentication, posts, stories, friends, chats, comments

---

## Database Setup

1. Install PostgreSQL and create the database with `your_database_name`.
2. Run in Backend these commands:

   ```bash
   npx prisma generate
   ```
3. Run migrations to setup tables:

   ```bash
   npx prisma migrate dev --name init
   ```
4. Prisma handles all models including users, posts, comments, likes, stories, friends, chats, messages, and join tables.

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev   # runs Vite development server
```

* React handles UI for posts, stories, friends, chats, and profile
* Uses Redux + Thunks for state management
* Axios for API calls to backend
* Google OAuth login integrated

---

## Folder Structure

```text
backend/
 ├─ controllers/
 ├─ middlewares/
 ├─ config/
 ├─ models/
 ├─ services/
 ├─ routes/
 ├─ utils/
 ├─ prisma/
     ├─ migrations/

frontend/
 ├─ src/
     ├─ components/
     ├─ features/
     ├─ services/
     ├─ routes/
     ├─ store/ ##Redux Store
     ├─ postgres/
         ├─ postgresFunctions.js/ ##Network call to backend
     
```

---

## Notes

* All media files (posts, stories) are stored on **Cloudinary**.
* Socket.io enables **real-time chat updates** and pending friend requests count.
* Redux ensures **state persistence** across all features.
* JWT authentication is stored in **HTTP-only cookies** for security.

---


## Database Design

---
![ERD Diagram](frontend/public/erd.png)

---