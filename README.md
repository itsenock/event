Event Management System
A fullstack event management platform built with React + Tailwind CSS on the frontend and Express + Drizzle ORM on the backend. It supports event creation, editing, deletion, attendance tracking, and analytics.

Features
Create, update, delete events

Mark attendance per user

Filter events by date and creator

View live attendance and analytics

Responsive dashboard with mobile drawer

Role-based access (admin, lead, attendee)

Plug-and-play backend integration

Tech Stack
Frontend: React, Tailwind CSS, Framer Motion Backend: Express, Drizzle ORM, Zod Database: PostgreSQL Auth: Bearer token middleware API Calls: Axios

Project Structure
event-management/ ├── backend/ │ ├── controllers/ │ ├── services/ │ ├── validators/ │ ├── drizzle/ │ └── routes/ ├── frontend/ │ ├── components/ │ ├── pages/ │ ├── hooks/ │ ├── api/ │ └── types/

Backend Setup
Install dependencies cd backend && npm install

Configure database Update your Drizzle config and .env with PostgreSQL credentials

Run the server npm run dev

API Endpoints

Method	Endpoint	Description	Auth
POST	/events	Create new event	Admin/Lead
GET	/events?date=&createdBy=	Fetch events	Any
PUT	/events/:id	Update event	Admin
DELETE	/events/:id	Delete event	Admin
POST	/:eventId/attendance	Mark attendance	Any
Frontend Setup
Install dependencies cd frontend && npm install

Configure backend URL In api.ts, set your backend base URL: const BASE_URL = "https://your-backend-url.com"

Run the frontend npm run dev

Authentication
Role-based bearer token middleware:

adminAuth → full access

adminOrLeadAuth → create events

anyAuth → view events and mark attendance

Analytics
Per-event attendance breakdown

Overall attendance summary

Live updates via polling or socket (optional)

Environment Variables
Backend .env
Code
DATABASE_URL=postgres://user:pass@localhost:5432/dbname  
PORT=4000  
JWT_SECRET=your-secret  
Frontend .env
Code
VITE_API_BASE_URL=https://your-backend-url.com  
Validation
All inputs are validated using Zod:

createEventValidator

updateEventSchema

attendanceValidator

Code Quality
ESLint + Prettier configured

Modular architecture

Reusable components and hooks.

Clean API abstraction.

Deployment
You can deploy using:

Frontend: Vercel, Netlify, Render

Backend: Railway, Fly.io, Heroku, Render

Credits
Built by Its with ❤️ 