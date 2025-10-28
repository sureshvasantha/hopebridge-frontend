# HopeBridge - Online Donation Platform Frontend

Angular 18+ frontend application for the HopeBridge donation platform.

## Features

- **Donor Features**
  - Browse and search campaigns
  - View campaign details with images
  - Make donations via Stripe integration
  - Track donation history
  - View impact stories

- **Admin Features**
  - Create and manage campaigns
  - Upload campaign images
  - Post impact stories
  - View donation analytics
  - Manage campaign status

## Tech Stack

- **Angular 18+** with standalone components
- **Tailwind CSS v4** for styling
- **TypeScript** with strict mode
- **Signals** for state management
- **Reactive Forms** for form handling
- **Lazy Loading** for optimal performance

## Project Structure

```
src/
├── app/
│   ├── core/              # Core services, models, guards
│   ├── features/          # Feature modules (campaigns, donations, admin, auth)
│   ├── shared/            # Shared components, pipes, directives
│   ├── app.component.ts   # Root component
│   ├── app.config.ts      # App configuration
│   └── app.routes.ts      # Routing configuration
├── assets/                # Static assets
├── styles.css             # Global styles with Tailwind
└── main.ts                # Application bootstrap
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Angular CLI 18+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open browser to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## API Configuration

Update the backend URL in `src/app/core/services/api.service.ts`:

```typescript
private baseUrl = 'http://localhost:8080/api'; // Your Spring Boot backend URL
```

## Environment Variables

For production deployments, configure:
- Backend API URL
- Stripe publishable key
- Other environment-specific settings

## Key Components

### Models
- Campaign, Donation, Impact Story, User models auto-generated from OpenAPI spec

### Services
- API Service for HTTP communication
- Campaign, Donation, Impact Story services
- Auth Service with JWT token handling
- Toast Service for notifications

### Guards
- Auth Guard for protected routes
- Role Guards (Admin, Donor) for role-based access

### Interceptors
- Auth Interceptor for adding JWT tokens to requests

## Best Practices Implemented

- Standalone components (no NgModules)
- Signals for reactive state management
- Computed properties for derived state
- Lazy loading for feature routes
- TypeScript strict mode
- Reactive forms with validation
- Proper error handling
- Toast notifications for user feedback

## Contributing

This project was generated following Angular 18+ best practices with Tailwind CSS v4.

## License

MIT
