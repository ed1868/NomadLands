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
- June 18, 2025. Final transformation to Bright Modern aesthetic inspired by agencepersee.com
  * Implemented pure black hero with bright white agent section for maximum contrast
  * Added vibrant animations: bounce-in, slide-up, elastic-hover, pulse-bright, floating
  * Updated typography to bold, impactful fonts with heavy weights (font-black)
  * Transformed color palette: black backgrounds, white cards, matte forest green accents
  * Enhanced cards with modern white styling, green gradients, and rotation effects
  * Updated hero section with "WORK LESS. LIVE SMART." in bold, glowing typography
  * Modified navigation with bright, modern design and elastic animations
  * Applied dynamic animations inspired by agencepersee.com reference site
  * Added vibrant glow effects, bright borders, and pulse animations throughout
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
Design aesthetic: Bright Modern - black hero, white cards, matte forest green accents, high contrast
Animation style: Vibrant, elastic animations with bounce, slide, and pulse effects
Target audience: Modern professionals seeking powerful automation tools
Color scheme: Pure black, bright white, matte forest green, vibrant contrasts
Reference inspiration: agencepersee.com bright styling and dynamic animations
```