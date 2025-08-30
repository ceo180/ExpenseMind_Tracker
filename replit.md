# ExpenseTracker Application

## Overview

ExpenseTracker is a comprehensive personal finance management web application built with a modern full-stack architecture. The application allows users to track expenses, manage budgets, categorize spending, and generate financial insights through interactive dashboards and reports. It features a React-based frontend with shadcn/ui components, an Express.js backend, and PostgreSQL database integration with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing without React Router complexity
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API development
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **Authentication**: Replit Auth integration with session-based authentication using express-session
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **API Structure**: RESTful endpoints organized by resource (expenses, categories, budgets, income)

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless connection pooling
- **Schema Management**: Drizzle migrations with schema-first approach
- **Core Tables**:
  - Users table for authentication and profile data
  - Categories for expense/income categorization with icons and colors
  - Expenses table with foreign key relationships to users and categories
  - Income table for tracking revenue streams
  - Budgets table for financial planning and monitoring
  - Sessions table for authentication state management

### Project Structure
- **Monorepo Layout**: Client, server, and shared code in separate directories
- **Shared Schema**: Common TypeScript types and Zod schemas in `/shared` directory
- **Path Aliases**: TypeScript path mapping for clean imports (@/, @shared/, @assets/)
- **Asset Management**: Dedicated attached_assets directory for file storage

### Development Workflow
- **Development Server**: Concurrent client (Vite) and server (tsx) processes
- **Build Process**: Client builds to dist/public, server bundles with esbuild
- **Type Checking**: Shared TypeScript configuration across client and server
- **Database Operations**: Drizzle Kit for schema management and migrations

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM and migration tools
- **express** and **express-session**: Web framework and session management
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form** and **@hookform/resolvers**: Form handling and validation
- **zod**: Runtime type validation and schema definition

### UI and Styling Dependencies
- **@radix-ui/**: Complete suite of accessible UI primitives (dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **lucide-react**: Modern icon library
- **date-fns**: Date manipulation and formatting

### Authentication Integration
- **Replit Auth**: OAuth-based authentication system
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware for Node.js
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling