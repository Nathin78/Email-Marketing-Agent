# Nexora - AI Email Marketing Platform

## Overview
Nexora is a full-stack AI-powered email marketing platform built with React 19 + Vite on the frontend and Java 17 + Spring Boot 3 on the backend. It enables customer management, campaign creation, AI-generated personalized emails using Groq AI, analytics, history, and role-based authentication.

## Architecture
- Frontend: React 19, Vite, Material UI, React Router, React Hook Form, React Toastify
- Backend: Java 17, Spring Boot 3, Spring Security, Spring Data JPA, MySQL, JWT
- AI: Google Gemini API
- Pattern: Clean Architecture with controllers, services, repositories, DTOs, mappers, and entities

## Project Structure
- frontend/src with pages, services, context, layouts, and routes
- backend/src/main/java/com/emailagent with config, controller, dto, entity, repository, service, security, exception, mapper, ai

## Prerequisites
- Java 17+
- Maven 3.9+
- Node.js 20+
- MySQL 8+

## Backend Setup
1. Create MySQL database: `create database email_agent_db;`
2. Update [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties)
3. Run:
   - `cd backend`
   - `mvn clean install`
   - `mvn spring-boot:run`

## Frontend Setup
1. Install dependencies:
   - `cd frontend`
   - `npm install`
2. Start development server:
   - `npm run dev`

## Gemini API Setup
1. Create a Gemini API key from Google AI Studio.
2. Add it to [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties) in `ai.gemini.api-key`.

## Database Schema
See [sql/schema.sql](sql/schema.sql).

## Sample Data
See [sql/sample-data.sql](sql/sample-data.sql).

## Screenshots
Placeholder for screenshots.

## Future Enhancements
- Email scheduling
- Bulk upload of customers
- Advanced analytics and dashboards
- A/B testing
- Multi-tenant support
"# Email-Marketing-Agent" 
