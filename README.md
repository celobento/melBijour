# MelBijour

A modern e-commerce platform for **MelBijour**, a boutique bijouterie (jewelry) store. This full-stack application provides a beautiful shopping experience with a powerful admin backend.

## 🏪 About MelBijour

MelBijour is a bijouterie store offering elegant and stylish jewelry pieces. This application enables customers to browse, explore, and purchase jewelry items through an intuitive web interface, while providing store administrators with tools to manage inventory, orders, and customer relationships.

## 🏗️ Architecture

This project follows a **monorepo** structure with separate frontend and backend applications:

```
mel-bijour/
├── frontend/          # Next.js
├── backend/           # NestJS
└── README.md          # This file
```

## 🚀 Tech Stack

### Frontend (`frontend/`)
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **TanStack Query** - Server state management and data fetching
- **shadcn/ui** - High-quality, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth** - Authentication and session management
- **Axios** - HTTP client for API requests
- **Recharts** - Beautiful data visualization components

### Backend (`backend/`)
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe backend development
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **class-validator** - Validation decorators
- **class-transformer** - Object transformation
- **bcrypt** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **Git**

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mel-bijour
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .example.env .env

# Edit .env and configure:
# - DATABASE_URL: PostgreSQL connection string
# - PORT: Backend server port (default: 3001)

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start the development server
npm run start:dev
```

The backend API will be available at `http://localhost:3001`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env and configure:
# - NEXTAUTH_URL: Frontend URL (default: http://localhost:3000)
# - NEXTAUTH_SECRET: Random secret string for NextAuth
# - NEXT_PUBLIC_API_URL: Backend API URL (default: http://localhost:3001/api)

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:3000`


## 🔧 Development Scripts

### Backend Scripts
```bash
cd backend

npm run start:dev      # Start development server with watch mode
npm run build          # Build for production
npm run start:prod     # Start production server
```

### Frontend Scripts
```bash
cd frontend

npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
```

## 🗄️ Database Management

### Prisma Commands
```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npx prisma studio
```

## 🔐 Environment Variables

### Backend (`.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mel_bijour?schema=public"
PORT=3001
```

### Frontend (`.env`)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🌐 API Documentation

Once the backend is running, API documentation is available at:
- **Swagger UI**: `http://localhost:3001/api`

## 🎨 Features

### Frontend Features
- ✅ Responsive design with Tailwind CSS
- ✅ Modern UI with shadcn/ui components
- ✅ Authentication with NextAuth
- ✅ Data fetching with TanStack Query
- ✅ Beautiful charts with Recharts
- ✅ Pink/Purple theme design

### Backend Features
- ✅ RESTful API with NestJS
- ✅ Database ORM with Prisma
- ✅ Input validation with class-validator
- ✅ Password hashing with bcrypt
- ✅ Swagger API documentation
- ✅ CORS enabled

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project for MelBijour store. For questions or support, please contact the development team.

---

**Built with ❤️ for MelBijour**
