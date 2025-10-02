# Trello Clone 🗂️📝

A modern, feature-rich project management application inspired by Trello, built to help teams organize tasks, collaborate in real-time, and streamline workflows. This app offers a clean UI, real-time notifications, and robust project and task management features.

![Homepage Screenshot](./frontend/public/screenshots/home-1.png)

## Table of Contents
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Clone Repo](#clone-repo)
- [Environment Setup](#environment-setup)
- [Installation](#installation)


## Features
- **Project Management**: Create, update, and delete projects with customizable boards.
- **Task Management**: Add, assign, and track tasks with statuses, priorities, and due dates.
- **Real-Time Notifications**: Receive instant updates via WebSocket for task assignments, comments, and project changes.
- **User Profiles**: Manage personal account details and view project involvement.
- **Authentication**: Secure signup and sign-in with JWT-based authentication.
- **Responsive Design**: Fully responsive UI for seamless use on desktop and mobile.
- **Custom Themes**: Choose from 6 different themes to personalize the app’s look and feel.
- **SEO-Friendly**: Metadata for each page to optimize discoverability.

## Screenshots

| **Sign Up** | **Sign In** |
|-------------|-------------|
| ![Sign Up Screenshot](./frontend/public/screenshots/signup.png) | ![Sign In Screenshot](./frontend/public/screenshots/login.png) |

| **Profile** | **Modal** |
|-------------|-------------|
| ![Profile Screenshot](./frontend/public/screenshots/profile.png) | ![Modal Screenshot](./frontend/public/screenshots/modal.png) |

| **Home page** | **Home Page** |
|--------------------|--------------------|
| ![Home Page Screenshot](./frontend/public/screenshots/home.png) | ![Home Page Screenshot](./frontend/public/screenshots/home-1.png) |

| **Projects page** | **Projects Page** |
|--------------------|--------------------|
| ![Project Page Screenshot](./frontend/public/screenshots/projects.png) | ![Project Page Screenshot](./frontend/public/screenshots/projects-1.png) |

| **Project Details Page** | **Project Details Page** |
|-------------------|-----------------------|
| ![Project Detail Page](./frontend/public/screenshots/main-project.png) | ![Project Detail Page](./frontend/public/screenshots/main-project1.png) |

## Tech Stack

### Frontend
<img src="https://skillicons.dev/icons?i=nextjs" alt="NextJs" height="40" />
<img src="https://skillicons.dev/icons?i=react" alt="React" height="40" />
<img src="https://skillicons.dev/icons?i=ts" alt="Ts" height="40" />
<img src="https://skillicons.dev/icons?i=tailwind" alt="Tailwind" height="40" />
<img src="./frontend/public/techs/daisyui.png" alt="DaisyUi" height="40" />
<img src="./frontend/public/techs/framer-motion.svg" alt="Framer Motion" height="40" />
<img src="./frontend/public/techs/react-query.png" alt="React Query" height="40" />
<img src="./frontend/public/techs/zustand.svg" alt="Zustand" height="40" />
<img src="./frontend/public/techs/socket.io.svg" alt="Socket.io" height="40" />

### Backend
<img src="https://skillicons.dev/icons?i=nestjs" alt="NestJs" height="40" />
<img src="https://skillicons.dev/icons?i=nodejs" alt="NodeJs" height="40" />
<img src="https://skillicons.dev/icons?i=prisma" alt="Prisma" height="40" />
<img src="./frontend/public/techs/socket.io.svg" alt="Socket.io" height="40" />

### Database
<img src="https://skillicons.dev/icons?i=postgres" alt="Postgres" height="40" />

## Clone Repo

```
git clone https://github.com/amirrajj-dev/trello-clone.git
cd trello-clone
```

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the `backend` directory with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/trello_clone"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-here"
SALT=12

# Application
NODE_ENV="development"
ALLOWED_EMAIL_DOMAINS="*" # or specific domains like "company.com,gmail.com"

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# CORS
FRONTEND_URL="http://localhost:3000"
```
### Frontend Environment Variables
Create a `.env` file in the `backend` directory with:

```env
# API Configuration
NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-here-minimum-32-characters"

# Application
NODE_ENV="development"
```

## Installation

### Backend Installation

```
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run start:dev
```

### Frontend Installation

```
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Built with ❤️ and lots of ☕ by Amirhosein Rajaei**