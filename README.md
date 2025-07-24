# Quote-App

A modern API service for managing inspirational quotes that supports both REST and GraphQL endpoints. Features include user authentication, likes, moods, tags, and flexible querying capabilities.

The REST API provides traditional endpoints for common operations, while the GraphQL API supports advanced querying with cursor-based pagination for efficient navigation of large datasets.

**REST API:** Standard HTTP endpoints with JSON requests and responses. Supports authentication, quote retrieval, liking, catalog item management, and filtering with pagination parameters.

**GraphQL API:** Exposes a flexible schema allowing clients to request precisely the data they need. Implements cursor-based pagination using the Relay spec to efficiently handle large lists of quotes, moods, and tags.

---

## GraphQL Cursor-Based Pagination

- Uses opaque cursors instead of offset/limit to paginate through results.
- Returns connection objects containing edges (nodes + cursors) and pageInfo (hasNextPage, hasPreviousPage, startCursor, endCursor).
- Allows fetching subsequent pages by providing the `after` or `before` cursor.
- More performant and reliable than offset pagination, especially with frequently changing data.

---

## Table of Contents

- [Business Overview](#business-overview)
- [Technology Stack](#technology-stack)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

---

## Business Overview

Quote-App provides an API backend for serving motivational and inspirational quotes to users. It supports:

- Fetching random or paginated quotes with filters
- User registration and login with JWT-based authentication
- Like/unlike quotes functionality per user
- Mood and tag management for personalized quote recommendations
- Administrative management of tags and catalog items

The system is designed to offer flexible querying, robust error handling, and maintainable code using clean architecture principles.

Quotable.io service is closed to the public, so I used the DummyJSON service instead. However, since it doesn’t provide tags, I add random tags. Although some tags may not logically fit, I included them to keep the functionality working.

---

## Technology Stack

- **Backend Framework:** Fastify (Node.js)
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod schemas
- **Dependency Injection:** Typedi
- **Testing:** Jest
- **HTTP Client:** Axios
- **Version Control:** Git

---

## Architecture & Design Patterns

- **Layered Architecture:** Separation of concerns between controllers, services, and repositories
- **Dependency Injection:** Using `typedi` for managing class dependencies
- **DTOs & Validation:** Request and response validation using Zod schemas
- **Transaction Management:** Explicit DB transactions with TypeORM's QueryRunner
- **Error Handling:** Custom error classes with centralized error handler helper
- **Repository Pattern:** Encapsulated DB access via TypeORM repositories
- **Unit Testing:** Comprehensive Jest tests mocking DB and external calls

---

## API Endpoints

### Authentication Routes

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| POST   | `/api/v1/auth/signup` | Register a new user     |
| POST   | `/api/v1/auth/signin` | Login and get JWT token |

---

### Quotes Routes

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| GET    | `/api/v1/quotes/random`   | Get a random quote            |
| POST   | `/api/v1/quotes/:id/like` | Toggle like/unlike on a quote |

---

### Catalog Items Routes (Tags, Moods)

| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/api/v1/catalog-items`     | Create a new catalog item |
| PUT    | `/api/v1/catalog-items/:id` | Update catalog item       |
| DELETE | `/api/v1/catalog-items/:id` | Delete catalog item       |

### Users Routes

| Method | Endpoint                    | Description        |
| ------ | --------------------------- | ------------------ |
| PUT    | `/api/v1/users/mood/select` | Select daily mood. |

---

## GraphQL Sandbox Playground

Access the interactive GraphQL playground at:

[https://app-quoteapp-development.azurewebsites.net/graphql](https://app-quoteapp-development.azurewebsites.net/graphql)

You can use this interface to explore the schema, run queries and test cursor-based pagination.

---

## Deployment

Quote-App is designed for deployment on Microsoft Azure using Terraform and Azure services.
Before the first deployment, the Azure setup script (azure-setup.sh) must be run to provision all necessary Azure resources.
After the initial setup, any changes merged into the main branch will automatically trigger the CI/CD pipeline to deploy the updated application.
Application URL: [https://app-quoteapp-development.azurewebsites.net](https://app-quoteapp-development.azurewebsites.net)

### Key Azure Resources

- Azure App Service for hosting the API
- Azure PostgreSQL for database
- Azure Storage Account for Terraform state
- Azure Service Principal for automation and permissions
