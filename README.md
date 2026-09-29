# 🎓 UniConnect — University Social Media Platform

> A full-stack MERN social media platform built for university students, clubs, and organizations to collaborate, share events, find jobs, and connect in real-time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based login for Students and Organizations/Clubs |
| 📰 **Feed** | Post text & images, like, comment, follow others |
| 📅 **Events** | Create events, book tickets, get QR code passes |
| 💼 **Micro Jobs** | Post small jobs with rewards; students apply & earn |
| 💬 **Real-time Chat** | 1-to-1 and group chat powered by Socket.IO |
| 🔍 **Lost & Donation** | Report lost/found items and run donation campaigns |
| 🔔 **Notifications** | Real-time in-app notifications |
| 👤 **Profile** | Posts tab + Events/Tickets tab on your profile |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite, React Router v6, TailwindCSS, Axios, Socket.IO-client |
| **Backend** | Node.js, Express.js (MVC), Socket.IO |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (Bearer token) + bcryptjs |
| **File Uploads** | Multer (local `uploads/` folder) |
| **Real-time** | Socket.IO (chat + notifications) |

---

## 📁 Project Structure

```
full-stack-project/
├── backend/                    # Express MVC API
│   ├── db/
│   │   ├── connection.js       # MongoDB connection
│   │   └── models/             # 12 Mongoose models
│   ├── controllers/            # 10 controllers
│   ├── routes/                 # 10 route files
│   ├── middleware/             # auth, role, upload, error
│   ├── utils/                  # generateToken, socketManager
│   ├── uploads/                # uploaded files (gitignored)
│   ├── app.js                  # Express app
│   └── server.js               # HTTP + Socket.IO entry point
│
└── frontend/                   # React + Vite SPA
    └── src/
        ├── api/                # Axios API service layer
        ├── context/            # AuthContext, SocketContext
        ├── hooks/              # useAuth, useSocket
        ├── components/
        │   ├── layout/         # Navbar, Sidebar, Layout
        │   ├── cards/          # PostCard, EventCard, etc.
        │   ├── common/         # Modal, Avatar, Badge, etc.
        │   └── forms/          # Create forms for all features
        └── pages/              # Feed, Events, Chat, etc.
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally on port `27017` (or use MongoDB Atlas)

---

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd full-stack-project
```

---

### 2. Setup the Backend

```bash
cd backend

# Copy environment file and fill in your values
cp .env.example .env
```

Edit `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/uniconnect
JWT_SECRET=your_super_secret_key_here_make_it_long
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

```bash
# Install dependencies (already done, but run if needed)
npm install

# Start backend in development mode
npm run dev
```

Backend will run at: **http://localhost:5000**

---

### 3. Setup the Frontend

```bash
cd ../frontend

# Install dependencies (already done, but run if needed)
npm install

# Start frontend dev server
npm run dev
```

Frontend will run at: **http://localhost:3000**

---

### 4. Open the App

Navigate to **http://localhost:3000** in your browser.

- Click **Register** → choose **Student** or **Organization**
- Fill in your details and create an account
- Explore Feed, Events, Micro Jobs, Chat, and more!

---

## 🗄️ Database Models

| Model | Purpose |
|---|---|
| `User` | Student accounts |
| `Organization` | Club/society accounts |
| `Post` | Feed posts with comments & likes |
| `Event` | University events |
| `Ticket` | Event bookings with QR codes |
| `MicroJob` | Small jobs with rewards |
| `JobApplication` | Applications for micro jobs |
| `Conversation` | Chat conversations (1-to-1 and group) |
| `Message` | Individual chat messages |
| `LostItem` | Lost & found reports |
| `Donation` | Donation campaigns |
| `Notification` | In-app notifications |

---

## 🔌 API Endpoints

| Resource | Base Path |
|---|---|
| Auth | `POST /api/auth/register/user` · `POST /api/auth/register/org` · `POST /api/auth/login` |
| Users | `GET /api/users/:id` · `PUT /api/users/:id` · `POST /api/users/:id/follow` |
| Organizations | `GET /api/organizations/:id` · `PUT /api/organizations/:id` |
| Posts | `GET /api/posts` · `POST /api/posts` · `POST /api/posts/:id/like` |
| Events | `GET /api/events` · `POST /api/events` · `GET /api/events/:id` |
| Tickets | `POST /api/tickets/book` · `GET /api/tickets/my` |
| Micro Jobs | `GET /api/microjobs` · `POST /api/microjobs` · `POST /api/microjobs/:id/apply` |
| Chat | `GET /api/chat/conversations` · `POST /api/chat/conversations/:id/messages` |
| Lost & Donation | `GET /api/lost-donation/lost` · `POST /api/lost-donation/donations/:id/donate` |
| Notifications | `GET /api/notifications` · `PUT /api/notifications/read-all` |

---

## 🔄 Real-time Socket Events

| Event | Direction | Description |
|---|---|---|
| `user:online` | Client → Server | Register user as online |
| `users:online` | Server → All | Broadcast online users list |
| `join:conversation` | Client → Server | Join a chat room |
| `message:send` | Client → Server | Send a chat message |
| `message:receive` | Server → Room | Deliver message to room |
| `typing:start` / `typing:stop` | Client ↔ Server | Typing indicators |
| `notification:new` | Server → Client | Push a notification |

---

## 📝 Notes

- **Payments** are simulated — ticket booking and donations record in the DB without a real payment gateway. You can integrate **Stripe** later by adding a payment step before creating a `Ticket`.
- **File uploads** are stored in `backend/uploads/`. For production, migrate to **Cloudinary** or **AWS S3**.
- **Email verification** is not implemented. You can add **Nodemailer + OTP** to the `authController.registerUser` flow.
- The `lecturer` role uses regular `user` accounts — a lecturer can post micro jobs just like any student.

---

## 📄 License

MIT