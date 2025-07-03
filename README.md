# Product Management Dashboard

A modern Angular application for managing products with a responsive dashboard, CRUD operations, and statistical visualizations.

## Features

- 📊 Real-time dashboard with product statistics
- 📝 Complete CRUD operations for products
- 📱 Responsive Material Design UI
- 📈 Visual data representation using ApexCharts
- 🔍 Advanced filtering and sorting capabilities
- 🔄 Automatic API request logging
- 🎯 Standalone components architecture

## Technology Stack

- Angular 17+
- Angular Material
- RxJS
- ApexCharts
- Angular In-Memory Web API (for demo purposes)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd dashboard-crud
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## Development

### Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── interceptors/
│   │   └── services/
│   ├── features/
│   │   └── products/
│   │       ├── dashboard/
│   │       ├── product-form/
│   │       └── product-list/
│   ├── models/
│   └── shared/
├── assets/
└── environments/
```

### Key Commands

- `npm start` - Start development server
- `npm run build` - Build production version
- `npm test` - Run unit tests
- `npm run e2e` - Run end-to-end tests
- `npm run lint` - Run linting checks

### Development Notes

- Uses standalone components for better tree-shaking
- Implements lazy loading for feature modules
- Uses Angular Signals for state management
- Implements automatic unsubscribe pattern using DestroyRef
- Uses typed forms for better type safety

## Docker Deployment

1. Build the Docker image:
```bash
docker-compose build
```

2. Run the container:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:80`

## Testing

### Unit Tests

Run unit tests with:
```bash
npm test
```

Key test files:
- `product.service.spec.ts` - Service tests
- `product-list.component.spec.ts` - Component tests

### E2E Tests

Run end-to-end tests with:
```bash
npm run e2e
```

## Code Style

This project follows Angular style guide and enforces:
- ESLint rules for consistency
- Prettier for code formatting
- Commitlint for commit message format

## Environment Configuration

Two environment configurations are provided:
- `environment.ts` - Development
- `environment.prod.ts` - Production

Update API URLs and other environment-specific variables in these files.

## Contributing

1. Branch naming convention:
   - feature/[feature-name]
   - bugfix/[bug-name]
   - hotfix/[hotfix-name]

2. Commit message format:
   - feat: Add new feature
   - fix: Fix bug
   - docs: Update documentation
   - style: Format code
   - refactor: Refactor code
   - test: Add tests

3. Submit pull requests with:
   - Clear description
   - Screenshots (if UI changes)
   - Test coverage report

## License

This project is licensed under the MIT License.
