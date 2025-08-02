# Comprehensive Veterinary Laboratory Report Generator Application

## Overview

This is a comprehensive multi-module web application for generating professional veterinary laboratory diagnostic reports. The application supports multiple types of veterinary examinations including biochemistry analysis, blood smears, wet films, skin scrapings, impression smears, ear swabs, faecal samples, and progesterone testing. The system allows veterinarians to collect standardized patient information, input examination-specific test results, upload and annotate images, and generate professional PDF reports with automated validation and species-specific reference ranges.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based development
- **Routing**: Wouter for lightweight client-side routing with multi-module report type selection
- **State Management**: React Hook Form for form state management with Zod validation schemas
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessibility and customization
- **Styling**: Tailwind CSS with custom medical-themed color palette and CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds
- **Multi-Module Design**: Dynamic report type selector with 8 different laboratory examination modules

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Database Integration**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Data Storage**: Currently using in-memory storage (MemStorage) with interface for future database implementation
- **API Design**: RESTful endpoints for CRUD operations on veterinary reports
- **Multi-Report Support**: Single schema supporting multiple report types with union types for test results

### Form Management & Validation
- **Schema Validation**: Zod schemas for runtime type checking and form validation
- **Form Logic**: Custom hooks (useVetForm) for complex form state management including auto-calculations
- **Progress Tracking**: Real-time form completion progress with visual indicators
- **Reference Ranges**: Species-specific laboratory value ranges with automated flagging of abnormal results

### PDF Generation & Reporting
- **PDF Library**: jsPDF for client-side PDF generation with custom medical report templates
- **Clinical Interpretation**: Automated clinical interpretation engine that analyzes test results and provides diagnostic insights
- **Species Support**: Multiple animal species (dog, cat, horse, cattle, etc.) with tailored reference ranges

### Data Schema Design
- **Patient Information**: Comprehensive patient demographics including species, breed, age, weight
- **Laboratory Panels**: Organized test results into clinical panels (hepatic, renal, pancreatic, etc.)
- **Flexible Test Storage**: JSON-based test results storage allowing for easy extension of new test parameters
- **Audit Trail**: Report creation timestamps and metadata tracking

### UI/UX Architecture
- **Responsive Design**: Mobile-first approach with progressive enhancement for desktop
- **Accessibility**: Full keyboard navigation and screen reader support via Radix UI
- **Real-time Feedback**: Immediate validation feedback and abnormal value highlighting
- **Progress Visualization**: Multi-step form with completion tracking and abnormal value alerts

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, React Hook Form, React Query for server state management
- **UI Component Library**: Radix UI primitives for accessible, unstyled components
- **Validation**: Zod for schema validation and type inference

### Database & ORM
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with drizzle-kit for migrations and schema management
- **Connection**: @neondatabase/serverless for serverless database connections

### Development Tools
- **Build System**: Vite with TypeScript support and React plugin
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Code Quality**: ESBuild for production bundling

### PDF & Document Generation
- **PDF Generation**: jsPDF for client-side PDF creation
- **Date Handling**: date-fns for date manipulation and formatting

### Deployment & Runtime
- **Development Server**: Express.js with Vite middleware integration
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **Environment**: Replit-optimized with development banner and error overlay plugins