# DOC_AI Frontend Architecture Guide

This file explains how the frontend app is organized and how user requests move through the application.

## 1. What the frontend does

The frontend is the React-based client for the DOCKY product. It handles:

- authentication and protected routes
- document upload and document browsing
- the document detail page with compliance analysis
- dashboard and notification screens

It talks to the backend through a single API layer and uses TanStack Query to cache and refresh data.

## 2. Main runtime flow

1. The app starts in [src/main.tsx](src/main.tsx).
2. [src/App.tsx](src/App.tsx) wires up the global providers:
   - TanStack Query
   - auth context
   - router
3. [src/routes/router.tsx](src/routes/router.tsx) defines routes and guards protected pages.
4. Pages call hooks from [src/hooks](src/hooks).
5. Hooks use endpoint helpers in [src/lib/endpoints.ts](src/lib/endpoints.ts).
6. The endpoint helpers call the backend via [src/lib/api.ts](src/lib/api.ts).
7. The returned data is rendered by the route components and their subcomponents.

## 3. Important frontend files and their roles

### App shell

- [src/main.tsx](src/main.tsx)
  - Mounts the React application into the DOM.

- [src/App.tsx](src/App.tsx)
  - Installs the global providers used across the app.

### Routing

- [src/routes/router.tsx](src/routes/router.tsx)
  - Defines the route tree.
  - Applies auth checks before loading protected pages.
  - Registers pages for dashboard, upload, documents, settings, and notifications.

### Hooks

- [src/hooks/useAuth.tsx](src/hooks/useAuth.tsx)
  - Handles auth state and session-related operations.

- [src/hooks/useDocuments.ts](src/hooks/useDocuments.ts)
  - Fetches documents, a single document, and document analysis data from the backend.

- [src/hooks/useCompliance.ts](src/hooks/useCompliance.ts)
  - Handles compliance-related queries and document analysis mutations.

- [src/hooks/useNotifications.ts](src/hooks/useNotifications.ts)
  - Provides notification data access.

- [src/hooks/useProfilePreferences.ts](src/hooks/useProfilePreferences.ts)
  - Manages profile preferences.

### API and data layer

- [src/lib/api.ts](src/lib/api.ts)
  - Creates the Axios client.
  - Sends cookies for authenticated requests.
  - Handles 401 responses globally.

- [src/lib/endpoints.ts](src/lib/endpoints.ts)
  - Central API wrapper for backend requests.
  - Normalizes backend payloads into frontend-friendly structures.

- [src/lib/schemas.ts](src/lib/schemas.ts)
  - Defines Zod schemas and TypeScript types for the API data.

### Pages and routes

- [src/routes/dashboard](src/routes/dashboard)
  - Shows the dashboard summary and key KPIs.

- [src/routes/upload](src/routes/upload)
  - Uploads a document to the backend.

- [src/routes/documents/index.tsx](src/routes/documents/index.tsx)
  - Lists all documents available to the current user.

- [src/routes/documents/$documentId.tsx](src/routes/documents/$documentId.tsx)
  - Shows a single document and its compliance analysis results.

- [src/routes/settings](src/routes/settings)
  - User settings and preferences.

- [src/routes/notifications](src/routes/notifications)
  - Notification inbox and preferences.

### Document detail components

- [src/routes/documents/components/document-header.tsx](src/routes/documents/components/document-header.tsx)
  - Displays the filename, upload date, and uploader.

- [src/routes/documents/components/stats-grid.tsx](src/routes/documents/components/stats-grid.tsx)
  - Shows compliance score and counts of risks and clauses.

- [src/routes/documents/components/contract-analysis-tabs.tsx](src/routes/documents/components/contract-analysis-tabs.tsx)
  - Displays contract analysis breakdown sections.

- [src/routes/documents/components/compliance-progress-card.tsx](src/routes/documents/components/compliance-progress-card.tsx)
  - Shows the compliance health overview.

- [src/routes/documents/components/risk-analysis-card.tsx](src/routes/documents/components/risk-analysis-card.tsx)
  - Renders risk findings grouped by severity.

- [src/routes/documents/components/missing-clauses-card.tsx](src/routes/documents/components/missing-clauses-card.tsx)
  - Lists missing clauses highlighted by analysis.

- [src/routes/documents/components/recommendations-accordion.tsx](src/routes/documents/components/recommendations-accordion.tsx)
  - Displays AI recommendations in an accordion.

- [src/routes/documents/components/important-dates-timeline.tsx](src/routes/documents/components/important-dates-timeline.tsx)
  - Renders dates and timelines from the analysis payload.

## 4. How the document detail flow works

1. The user navigates to the document detail route.
2. The route extracts the `documentId` from the URL.
3. The page uses TanStack Query hooks to request:
   - the document metadata
   - the analysis payload for that document
4. The endpoint layer calls the backend.
5. The frontend normalizes the response and sends it to the UI components.
6. The page renders the executive summary, risks, recommendations, compliance score, and contract sections.

## 5. Frontend development conventions

- Hooks are the main abstraction for data fetching.
- Route-level pages compose smaller presentational components.
- The API layer is centralized so pages do not call Axios directly.
- React Query handles loading, caching, and refresh behavior.

## 6. Useful commands

```bash
npm install
npm run dev
npm run build
npm run typecheck
```
