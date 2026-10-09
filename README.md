# 💼 HireHub — Full-Stack Job Portal

<p align="center">
  <img src="https://img.shields.io/badge/Project-HireHub-2563EB?style=for-the-badge" alt="HireHub" />
  <img src="https://img.shields.io/badge/Stack-MERN-10B981?style=for-the-badge" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/Status-In%20Development-F59E0B?style=for-the-badge" alt="In Development" />
</p>

<p align="center">
  <b>A modern job portal connecting candidates, recruiters, and administrators through one platform.</b>
</p>

<p align="center">
  <a href="https://github.com/Sacchu-1206/HireHub">Explore Repository</a>
  &nbsp; • &nbsp;
  <a href="https://github.com/Sacchu-1206">Developer Profile</a>
  &nbsp; • &nbsp;
  <a href="https://www.linkedin.com/in/sachin-yadav-549931284/">LinkedIn</a>
</p>

---

## ✨ About the Project

**HireHub** is a full-stack job portal built with the MERN stack. It provides dedicated workflows for candidates searching for jobs, recruiters managing vacancies, and administrators overseeing platform activity.

The project focuses on practical full-stack development, REST API integration, authentication, role-based authorization, and database operations.

## 🚀 Key Features

| Feature | Description |
|---|---|
| 🔐 Authentication | User registration, login, and JWT-based authentication |
| 👤 Candidate Portal | Manage profile, browse jobs, and track applications |
| 💼 Job Listings | Search and filter opportunities by relevant criteria |
| 📌 Saved Jobs | Save interesting jobs and revisit them later |
| 🏢 Recruiter Dashboard | Create and manage job listings and review applicants |
| 📋 Application Tracking | Manage application statuses |
| 🛡️ Admin Dashboard | Manage users, jobs, and applications |
| 🔒 Role-Based Access | Separate permissions for candidates, recruiters, and admins |

## 🧰 Technology Stack

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=222222" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-111111?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

**Frontend:** React.js, React Router, JavaScript, HTML5, CSS3, Vite

**Backend:** Node.js, Express.js, REST APIs, JWT

**Database:** MongoDB, Mongoose

**Development Tools:** Git, GitHub, Postman, npm

## 🏗️ Application Architecture

```text
HireHub/
│
├── client/
│   └── React frontend
│       ├── Components
│       ├── Pages
│       └── API integration
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database or MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Sacchu-1206/HireHub.git
cd HireHub
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the environment variables expected by the backend.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
```

> Use the exact variable names defined in your backend code. Never commit real credentials or secret keys.

Start the backend using the script configured in `server/package.json`.

### 3. Set up the frontend

Open a second terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Open the local development URL displayed by Vite.

## 🖼️ Screenshots

Screenshots will be added here to showcase the application interface.

> Add genuine screenshots of the home page, job listings, candidate profile, recruiter dashboard, and admin dashboard when available.

## 🔮 Future Enhancements

- Deploy the application and publish a live demo
- Add automated tests
- Improve UI responsiveness and accessibility
- Expand project documentation with API examples

## 👨‍💻 About the Developer

**Sachin Yadav**  
Full Stack Developer | MERN Stack

- GitHub: [@Sacchu-1206](https://github.com/Sacchu-1206)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/sachin-yadav-549931284/)

---

<p align="center">
  <b>Built with 💙 by Sachin Yadav</b>
</p>
