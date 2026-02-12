# ExpenseMind 💰

A comprehensive personal expense tracking web application that helps users monitor spending habits, categorize expenses, set budgets, and generate insightful financial reports.

## Features

- **Expense Management** - Track daily expenses with categories, payment methods, and descriptions
- **Income Tracking** - Record multiple income sources (salary, freelance, investments)
- **Budget Planning** - Set monthly/weekly budgets by category with progress tracking
- **Custom Categories** - Create personalized expense categories with icons and colors
- **Interactive Dashboard** - Visualize spending with charts, trends, and key metrics
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible UI components built on Radix UI
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing
- **React Hook Form** + Zod - Form handling and validation

### Backend
- **Node.js** with Express.js
- **TypeScript** - Type-safe development
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** (Neon serverless) - Primary database

### Authentication
- Session-based authentication with express-session
- PostgreSQL session storage

## Project Structure

```
├── client/                 # React frontend
│   └── src/
│       ├── components/     # UI components
│       │   ├── dashboard/  # Dashboard widgets
│       │   ├── forms/      # Form components
│       │   ├── layout/     # Navbar, Sidebar
│       │   └── ui/         # shadcn/ui components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utilities
│       └── pages/          # Route pages
├── server/                 # Express backend
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   └── db.ts               # Database connection
└── shared/                 # Shared code
    └── schema.ts           # Database schema & types
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ExpenseMind.git
   cd ExpenseMind
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   # Create .env file with:
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. Push database schema
   ```bash
   npm run db:push
   ```

5. Start development server
   ```bash
   npm run dev
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push schema to database |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/user` | Get current user |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |
| GET | `/api/expenses` | List expenses |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/income` | List income records |
| POST | `/api/income` | Create income |
| GET | `/api/budgets` | List budgets |
| POST | `/api/budgets` | Create budget |
| GET | `/api/dashboard/stats` | Dashboard statistics |

## Database Schema

- **users** - User accounts and profiles
- **categories** - Expense categories with icons/colors
- **expenses** - Transaction records
- **income** - Income sources
- **budgets** - Budget goals per category
- **sessions** - Authentication sessions

## License

MIT

## Author

Emmanuel Oshike
