# VlaamsCore

A robust, modular Discord bot specifically tailored for moderation, server management, and roleplay utilities in a Dutch/Vlaanderen RP server context.

## Requirements

* Node.js v16.9.0 or newer
* CockroachDB (or any PostgreSQL compatible database)
* Discord Bot Token and Client ID

## Setup Instructions

1. **Clone the repository.**
2. **Install dependencies:** `npm install`
3. **Database Setup:**
   * Create a CockroachDB cluster or use a local instance.
   * Get your connection string (e.g. `postgresql://user:password@host:26257/defaultdb?sslmode=verify-full`).
4. **Environment Variables:**
   * Rename `.env.example` to `.env`.
   * Fill in `DISCORD_TOKEN`, `CLIENT_ID`, `DATABASE_URL`.
5. **Database Migration:**
   * Run `npx prisma db push` to synchronize the schema with your database.
6. **Start the Bot:**
   * Run `npm start`.

## Deployment to Render

1. Add your repository to Render as a "Web Service".
2. **Build Command:** `npm install && npx prisma db push`
3. **Start Command:** `npm start`
4. Make sure to add your Environment Variables (`DISCORD_TOKEN`, `CLIENT_ID`, `DATABASE_URL`) in the Render dashboard.

## Features

- **Mega Command:** `/cmd` acts as the control panel for all actions.
- **Port Binding:** It has an Express app bundled that bounds to `$PORT` required by Render.
- **Prisma Integration:** Scalable ORM tailored for CockroachDB.
