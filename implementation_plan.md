# Implementation Plan

Implement a robust backend API with user authentication and PostgreSQL database integration for the Biasbuster application to enable user management, secure access, and data persistence.

The Biasbuster application is currently a frontend-only React/TypeScript app using Vite, with AI-powered bias detection via Google Gemini API. This backend implementation will add user registration, login, session management, and database storage for user data, analysis history, and feedback. The backend will use Python with FastAPI for high-performance async API endpoints, SQLAlchemy for ORM, and PostgreSQL for reliable data storage. Authentication will use JWT tokens for stateless sessions. This fits into the existing system by providing secure user accounts and persistent data storage, replacing local storage with server-side management.

[Types]
Define new data structures for user management, authentication, and database entities.

User model: id (UUID), email (string, unique), password_hash (string), created_at (datetime), updated_at (datetime), is_active (boolean), role (enum: user, admin).

AuthRequest: email (string), password (string).

AuthResponse: access_token (string), token_type (string), expires_in (integer), user (User).

TokenData: email (string), exp (datetime), iat (datetime).

AnalysisRecord: id (UUID), user_id (UUID, foreign key), source_text (text), result (JSON), sources (JSON), created_at (datetime), feedback (JSON).

FeedbackRecord: id (UUID), analysis_id (UUID, foreign key), user_id (UUID), vote (enum: up, down), created_at (datetime).

Validation rules: Email must be valid format, password minimum 8 characters with complexity. Tokens expire in 30 minutes.

[Files]
Create new backend directory structure and modify existing files for API integration.

New files to be created:
- backend/app/__init__.py: FastAPI app initialization
- backend/app/main.py: Main application entry point with CORS and routing
- backend/app/config.py: Database and app configuration settings
- backend/app/database.py: SQLAlchemy engine and session management
- backend/app/models/__init__.py: Models package
- backend/app/models/user.py: User SQLAlchemy model
- backend/app/models/analysis.py: Analysis and feedback models
- backend/app/schemas/__init__.py: Pydantic schemas package
- backend/app/schemas/user.py: User request/response schemas
- backend/app/schemas/analysis.py: Analysis schemas
- backend/app/routers/__init__.py: Routers package
- backend/app/routers/auth.py: Authentication endpoints (register, login, logout)
- backend/app/routers/users.py: User management endpoints
- backend/app/routers/analysis.py: Analysis history and feedback endpoints
- backend/app/dependencies.py: Dependency injection for auth and database
- backend/app/utils/__init__.py: Utils package
- backend/app/utils/auth.py: JWT token creation and verification
- backend/app/utils/security.py: Password hashing utilities
- backend/requirements.txt: Python dependencies
- backend/.env.example: Environment variables template
- backend/alembic.ini: Database migration configuration
- backend/alembic/versions/: Migration files directory

Existing files to be modified:
- package.json: Add proxy configuration for development
- vite.config.ts: Add proxy for API calls in development
- types.ts: Add new TypeScript interfaces for API responses
- services/geminiService.ts: No changes needed, remains client-side
- components/BiasAnalyser.tsx: Update to send analysis data to backend
- components/Dashboard.tsx: Fetch user analysis history from backend

Configuration file updates:
- .gitignore: Add backend virtual environment and .env files

[Functions]
Implement authentication, user management, and data persistence functions.

New functions:
- create_user(email: str, password: str) -> User: Hash password and create user record
- authenticate_user(email: str, password: str) -> User | None: Verify credentials
- create_access_token(data: dict) -> str: Generate JWT token
- verify_token(token: str) -> TokenData: Decode and validate JWT
- get_current_user(token: str) -> User: Dependency for protected routes
- save_analysis(user_id: UUID, source_text: str, result: dict, sources: list) -> AnalysisRecord: Store analysis
- get_user_analyses(user_id: UUID, limit: int, offset: int) -> list[AnalysisRecord]: Retrieve paginated history
- submit_feedback(analysis_id: UUID, user_id: UUID, vote: str) -> FeedbackRecord: Record user feedback

Modified functions:
- None, as existing functions are client-side only

Removed functions:
- None

[Classes]
Define database models and API schemas.

New classes:
- User (SQLAlchemy model): Database table for users with relationships
- Analysis (SQLAlchemy model): Database table for bias analyses
- Feedback (SQLAlchemy model): Database table for user feedback on analyses
- UserCreate (Pydantic schema): Request schema for user registration
- UserResponse (Pydantic schema): Response schema for user data
- Token (Pydantic schema): Response schema for authentication tokens
- AnalysisCreate (Pydantic schema): Request schema for saving analysis
- AnalysisResponse (Pydantic schema): Response schema for analysis data

Modified classes:
- None

Removed classes:
- None

[Dependencies]
Add Python backend dependencies and update frontend for API integration.

New packages:
- fastapi==0.104.1: Web framework for API
- uvicorn==0.24.0: ASGI server
- sqlalchemy==2.0.23: ORM for database operations
- psycopg2-binary==2.9.9: PostgreSQL driver
- python-jose[cryptography]==3.3.0: JWT token handling
- passlib[bcrypt]==1.7.4: Password hashing
- python-multipart==0.0.6: Form data handling
- alembic==1.12.1: Database migrations
- python-dotenv==1.0.0: Environment variables

Version changes:
- None for existing packages

Integration requirements:
- PostgreSQL 15+ database server
- Python 3.11+ runtime
- Frontend proxy configuration for development API calls

[Testing]
Implement comprehensive testing for backend functionality.

Test file requirements:
- backend/tests/__init__.py: Test package
- backend/tests/test_auth.py: Authentication endpoint tests
- backend/tests/test_users.py: User management tests
- backend/tests/test_analysis.py: Analysis CRUD tests
- backend/tests/conftest.py: Test fixtures and database setup

Existing test modifications:
- src/__tests__/BiasAnalyser.test.tsx: Update to mock API calls instead of direct Gemini service

Validation strategies:
- Unit tests for all utility functions (auth, security)
- Integration tests for API endpoints with test database
- End-to-end tests for critical user flows (registration, analysis save)
- 80%+ code coverage target

[Implementation Order]
Logical sequence to minimize conflicts and ensure successful integration.

1. Set up backend project structure and dependencies
2. Configure database models and schemas
3. Implement authentication utilities (JWT, password hashing)
4. Create authentication endpoints (register, login)
5. Implement user management endpoints
6. Add analysis storage and retrieval endpoints
7. Configure CORS and middleware
8. Set up database migrations
9. Update frontend to use backend APIs
10. Add comprehensive testing
11. Configure production deployment
12. Update documentation
