# AI Nomads - Intelligent Agent Marketplace

## Overview

AI Nomads is a modern web application that serves as a marketplace for AI agents. Users can discover, explore, and deploy various AI agents designed to automate different aspects of digital workflows, from email classification to cloud resource management. The application features a sleek, futuristic design with a dark theme and gradient effects.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend components:

- **Frontend**: React-based single-page application built with Vite
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: TailwindCSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **TailwindCSS** for utility-first styling with custom CSS variables for theming
- **shadcn/ui** component library for consistent UI components
- **Wouter** for lightweight client-side routing
- **TanStack Query** for efficient server state management and caching

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with clear endpoint structure
- **Middleware-based request logging** for debugging and monitoring
- **Error handling** with centralized error middleware
- **Development/Production environment** configuration

### Database Layer
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations and migrations
- **Neon Database** serverless PostgreSQL hosting
- **Schema validation** using Zod for runtime type checking

### UI/UX Design
- **Dark theme** with cyberpunk/futuristic aesthetics
- **Gradient effects** and glass morphism design elements
- **Responsive design** with mobile-first approach
- **Accessibility features** through Radix UI primitives

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **API Processing**: Express server processes requests and validates data
3. **Database Operations**: Drizzle ORM handles database interactions with PostgreSQL
4. **Response Handling**: Data flows back through the API to the frontend
5. **State Management**: TanStack Query caches and manages server state
6. **UI Updates**: React components re-render based on state changes

### Database Schema
- **Users Table**: Stores user authentication data (id, username, password)
- **Agents Table**: Contains AI agent information (id, name, description, category, price, features, styling)

### API Endpoints
- `GET /api/agents` - Retrieve all agents
- `GET /api/agents/category/:category` - Filter agents by category
- `GET /api/agents/featured` - Get featured agents
- `GET /api/agents/:id` - Get specific agent details

## External Dependencies

### Core Framework Dependencies
- **React & React DOM**: UI library
- **Express**: Web server framework
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe ORM
- **drizzle-kit**: Database migrations and schema management

### UI & Styling
- **TailwindCSS**: Utility-first CSS framework
- **@radix-ui/***: Headless UI components for accessibility
- **Lucide React**: Icon library
- **class-variance-authority**: Utility for managing component variants

### State Management & HTTP
- **@tanstack/react-query**: Server state management
- **Wouter**: Client-side routing

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Replit**: Cloud-based development environment
- **Hot Module Replacement**: Vite provides fast development experience
- **Database**: Neon serverless PostgreSQL for development and production

### Production Build Process
1. **Frontend Build**: Vite compiles React app to static assets
2. **Backend Build**: esbuild bundles server code with external dependencies
3. **Asset Serving**: Express serves static files in production
4. **Database Migrations**: Drizzle handles schema changes

### Environment Configuration
- **NODE_ENV**: Distinguishes between development and production
- **DATABASE_URL**: PostgreSQL connection string
- **Port Configuration**: Flexible port assignment for deployment

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Deployment**: Autoscale deployment target
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## Changelog

```
Changelog:
- June 17, 2025. Initial setup with dark cyberpunk theme
- June 17, 2025. Complete redesign with Alo Yoga-inspired aesthetic
- June 18, 2025. Major transformation to Dark Forest Green Cyberpunk aesthetic
- June 18, 2025. Final transformation to Dark Forest Green + Matte Black Alo-inspired design
  * Implemented sophisticated dark color palette: matte black, dark forest green, emerald accents
  * Refined to elegant, minimalist aesthetic with premium feel
  * Updated typography to light, refined fonts with subtle tracking
  * Restored mindful agent categories (Productivity, Communication, Business, etc.)
  * Enhanced cards with premium styling, subtle shadows, and forest green gradients
  * Updated hero section with "Work Less. Live Smart." in elegant, light typography
  * Modified navigation with clean, minimalist design and smooth transitions
  * Applied smooth animations inspired by high-end design references
  * Added breathing glow effects and magnetic hover interactions
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Design aesthetic: Dark Forest Green + Matte Black Alo-inspired - elegant, minimalist, premium
Animation style: Smooth, refined transitions with breathing and magnetic effects
Target audience: Mindful professionals seeking elegant automation tools
Color scheme: Matte black, dark forest green, emerald accents, subtle shadows
Reference inspiration: ori-new-version.webflow.io transition style
```