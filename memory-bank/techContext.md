# Technical Context - NebulaX

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: TradingView Lightweight Charts v5
- **State Management**: React Query (TanStack Query) for server state
- **HTTP Client**: Native fetch API with React Query
- **Build Tool**: Vite with TypeScript support

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with modular route structure
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom wallet-based authentication
- **Market Data**: Hyperliquid API integration
- **WebSocket**: Real-time market data feeds

### Key Dependencies
- **TradingView Charts**: v5 for professional charting
- **React Query**: v5 for data fetching and caching
- **Tailwind CSS**: v3 for responsive styling
- **Express**: v4 for API server
- **Drizzle ORM**: For database operations
- **Hyperliquid SDK**: Custom integration for market data

## Architecture Patterns

### Component Architecture
- **Atomic Design**: Components organized by complexity (atoms, molecules, organisms)
- **Feature-Based Structure**: Components grouped by functionality (trading, markets, etc.)
- **Custom Hooks**: Reusable logic extracted into custom React hooks
- **Service Layer**: API calls abstracted into service functions

### Data Flow Patterns
- **React Query**: Centralized data fetching with automatic caching
- **Optimistic Updates**: UI updates before API confirmation for better UX
- **Error Boundaries**: Graceful error handling at component level
- **Loading States**: Consistent loading indicators across the platform

### State Management Strategy
- **Server State**: Managed by React Query with automatic synchronization
- **Client State**: Local React state for UI interactions
- **Global State**: Context providers for authentication and theme
- **Persistent State**: Local storage for user preferences

## API Integration Patterns

### Hyperliquid Integration
- **Real-time Data**: WebSocket connections for live price feeds
- **RESTful APIs**: HTTP endpoints for historical data and trading
- **Error Handling**: Retry logic with exponential backoff
- **Rate Limiting**: Respectful API usage with request throttling

### Data Transformation
- **Type Safety**: Strong typing for all API responses
- **Data Normalization**: Consistent data structures across components
- **Caching Strategy**: Intelligent caching based on data volatility
- **Fallback Handling**: Graceful degradation when APIs fail

## Security Considerations

### Authentication
- **Wallet-Based Auth**: Users connect via Web3 wallets
- **Session Management**: Secure token-based sessions
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation for all user inputs

### Data Protection
- **Environment Variables**: Sensitive data stored in .env files
- **HTTPS Enforcement**: All communications encrypted
- **Database Security**: Parameterized queries to prevent SQL injection
- **API Key Management**: Secure storage and rotation of API credentials

## Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Lazy loading for route-based components
- **Image Optimization**: WebP format with responsive sizing
- **Bundle Analysis**: Regular analysis and optimization
- **Caching Strategy**: Service worker for offline functionality

### Backend Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Response Compression**: Gzip compression for API responses
- **Caching Layers**: Redis for frequently accessed data

## Development Workflow

### Code Quality
- **TypeScript**: Strict typing throughout the codebase
- **ESLint**: Code linting with custom rules
- **Prettier**: Consistent code formatting
- **Pre-commit Hooks**: Automated quality checks

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Critical user flow testing
- **Performance Tests**: Load testing for high-traffic scenarios

### Deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Environment Management**: Development, staging, production configs
- **Database Migrations**: Version-controlled schema changes
- **Rollback Strategy**: Quick reversion for failed deployments
